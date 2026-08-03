import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  notifyCustomerBookingReceived,
  notifyNewBooking,
} from "@/lib/notifications";
import { sendBookingSms } from "@/lib/sms/bookings";
import { calculateFirstVisitPrice } from "@/lib/pricing";
import { canAutoConfirm } from "@/lib/availability/resolver";
import {
  MARKETING_SMS_CONSENT_TEXT,
  TRANSACTIONAL_SMS_CONSENT_TEXT,
} from "@/lib/consent";
import { readAttribution } from "@/lib/attribution";
import type {
  Addon,
  BathroomCount,
  BedroomCount,
  BookingFormData,
  HomeCondition,
  ServiceType,
  SqftRange,
  TimeSlot,
} from "@/types";

const VALID_SERVICE_TYPES: ServiceType[] = ["regular", "deep", "move_out"];
const VALID_BEDROOMS: BedroomCount[] = ["studio", "1", "2", "3", "4", "5+"];
const VALID_BATHROOMS: BathroomCount[] = ["1", "1.5", "2", "2.5", "3", "3.5+"];
const VALID_CONDITIONS: HomeCondition[] = ["clean", "average", "needs_work"];
const VALID_SQFT_RANGES: SqftRange[] = [
  "under_800",
  "800_1200",
  "1200_1800",
  "1800_2500",
  "2500_3500",
  "over_3500",
  "not_sure",
];
const VALID_ADDONS: Addon[] = ["fridge", "oven", "cabinets", "laundry"];
// "evening" removed 2026-06-10 — slot no longer offered (can't reliably staff 4pm+).
// "full_day" is what the resolver offers when a visit fits neither half of the
// day; the wizard can send it, so rejecting it here would 400 a real booking.
const VALID_TIME_SLOTS: TimeSlot[] = ["morning", "afternoon", "full_day"];

function isOneOf<T extends string>(value: unknown, allowed: T[]): value is T {
  return typeof value === "string" && (allowed as string[]).includes(value);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingFormData;

    // Basic validation
    if (
      !body.email ||
      !body.service_type ||
      !body.bedrooms ||
      !body.bathrooms ||
      !body.name ||
      !body.phone ||
      !body.address
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Enum validation — reject garbage instead of writing it.
    if (!isOneOf(body.service_type, VALID_SERVICE_TYPES)) {
      return NextResponse.json({ error: "Invalid service type" }, { status: 400 });
    }
    if (!isOneOf(body.bedrooms, VALID_BEDROOMS)) {
      return NextResponse.json({ error: "Invalid bedrooms value" }, { status: 400 });
    }
    if (!isOneOf(body.bathrooms, VALID_BATHROOMS)) {
      return NextResponse.json({ error: "Invalid bathrooms value" }, { status: 400 });
    }
    if (body.condition !== undefined && !isOneOf(body.condition, VALID_CONDITIONS)) {
      return NextResponse.json({ error: "Invalid condition value" }, { status: 400 });
    }
    if (body.sqft_range !== undefined && body.sqft_range !== null && !isOneOf(body.sqft_range, VALID_SQFT_RANGES)) {
      return NextResponse.json({ error: "Invalid sqft range" }, { status: 400 });
    }
    if (body.addons !== undefined) {
      if (
        !Array.isArray(body.addons) ||
        body.addons.some((a) => !isOneOf(a, VALID_ADDONS))
      ) {
        return NextResponse.json({ error: "Invalid addons" }, { status: 400 });
      }
    }
    if (body.preferred_time !== undefined && body.preferred_time !== null && !isOneOf(body.preferred_time, VALID_TIME_SLOTS)) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    const condition: HomeCondition = body.condition || "average";
    const addons: Addon[] = body.addons || [];
    const sqftRange: SqftRange | undefined = body.sqft_range || undefined;

    // Server-side price recalculation from raw parameters.
    // Client-sent estimated_min/estimated_max are ignored — never trust the client.
    // For regular, the stored estimate is the first-visit price (deep table):
    // that is what the customer actually pays.
    const { firstVisit, recurring, firstVisitIsDeep } = calculateFirstVisitPrice(
      body.service_type,
      body.bedrooms,
      body.bathrooms,
      condition,
      addons,
      sqftRange
    );

    const estimatedMin = firstVisit.min + firstVisit.addonsTotal;
    const estimatedMax = firstVisit.max + firstVisit.addonsTotal;

    const supabase = createAdminClient();

    // Link to an account when possible: an active session, otherwise an existing
    // user with this email. Stays null for true guests — reconciled later on
    // sign-up / sign-in by linkGuestBookingsToUser.
    let userId: string | null = null;
    try {
      const session = await auth();
      if (session?.user?.id) userId = session.user.id as string;
    } catch {
      /* not logged in — fine */
    }
    if (!userId) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", body.email)
        .maybeSingle();
      if (existingUser) userId = existingUser.id;
    }

    // A2P 10DLC consent flags (migration 20260501100000 applied 2026-06-10).
    const smsOptIn = !!body.sms_opt_in;
    const marketingSmsOptIn = !!body.marketing_sms_opt_in;

    // Auto-confirmation, decided here rather than in the browser.
    //
    // canAutoConfirm re-reads availability at submit time on purpose. The list
    // the wizard rendered can be minutes old, and two people can pick the same
    // morning — whoever posts second must not be told the slot is theirs. The
    // only read that can decide that is the one taken now, server-side.
    //
    // It is also allowed to fail. Auto-confirm is an accelerator, not a gate:
    // any error here logs and leaves the booking as a request for a human.
    // A booking that cannot be auto-confirmed is still a booking.
    let autoConfirmed = false;
    if (body.preferred_date && body.preferred_time) {
      try {
        const { ok, reason } = await canAutoConfirm(
          {
            serviceType: body.service_type,
            bedrooms: body.bedrooms,
            bathrooms: body.bathrooms,
            condition,
            sqftRange,
          },
          body.preferred_date,
          body.preferred_time
        );
        autoConfirmed = ok;
        if (!ok) {
          console.log("[bookings] not auto-confirmed:", reason);
        }
      } catch (e) {
        console.warn("[bookings] availability check failed, staying a request:", e);
      }
    }

    const bookingRow = {
      email: body.email,
      phone: body.phone,
      name: body.name,
      service_type: body.service_type,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      sqft_range: body.sqft_range || null,
      condition,
      special_requests: body.special_requests || null,
      addons,
      address: body.address,
      city: body.city || "Seattle",
      zip: body.zip || null,
      access_instructions: body.access_instructions || null,
      preferred_date: body.preferred_date || null,
      preferred_time: body.preferred_time || null,
      estimated_min: estimatedMin,
      estimated_max: estimatedMax,
      status: autoConfirmed ? "confirmed" : "new",
      user_id: userId,
      // Only an auto-confirmed visit gets a place in the calendar and a trail
      // of how it got there. Everything else inserts exactly as before.
      ...(autoConfirmed
        ? {
            confirmed_at: new Date().toISOString(),
            confirmation_mode: "auto",
            scheduled_date: body.preferred_date,
            scheduled_time: body.preferred_time,
          }
        : {}),
    };

    // First-touch campaign attribution from the cleenly_attr cookie. Empty for
    // direct and organic bookings, which is most of them.
    //
    // A phone booking has no cookie — the voice agent posts here server to
    // server — so it names its own source in the body. The cookie still wins
    // when both are present. This is forgeable, and that is fine for the same
    // reason the cookie is: these columns only ever label a marketing report.
    const cookieAttribution = readAttribution(request);
    const attribution =
      Object.keys(cookieAttribution).length > 0
        ? cookieAttribution
        : {
            ...(typeof body.utm_source === "string" && body.utm_source
              ? { utm_source: body.utm_source.slice(0, 200) }
              : {}),
            ...(typeof body.utm_medium === "string" && body.utm_medium
              ? { utm_medium: body.utm_medium.slice(0, 200) }
              : {}),
          };

    let { data, error } = await supabase
      .from("bookings")
      .insert({
        ...bookingRow,
        ...attribution,
        sms_opt_in: smsOptIn,
        sms_opt_in_at: smsOptIn ? new Date().toISOString() : null,
        marketing_sms_opt_in: marketingSmsOptIn,
        marketing_sms_opt_in_at: marketingSmsOptIn
          ? new Date().toISOString()
          : null,
      })
      .select()
      .single();

    // Graceful fallback: if the sms_opt_in or utm columns are missing in this
    // environment (e.g. preview DB without the migration), retry without them.
    // The booking must never fail because of consent or marketing bookkeeping.
    if (error && error.code === "PGRST204") {
      console.warn(
        "bookings.sms_opt_in / utm columns missing, retrying insert without them:",
        error.message
      );
      ({ data, error } = await supabase
        .from("bookings")
        .insert(bookingRow)
        .select()
        .single());
    }

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // A2P 10DLC consent log — one row per ticked checkbox, exact on-screen text.
    // Wrapped so a missing table / any failure never breaks the booking.
    if (smsOptIn || marketingSmsOptIn) {
      try {
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
        const userAgent = request.headers.get("user-agent") || null;

        const consentRows = [];
        if (smsOptIn) {
          consentRows.push({
            phone: body.phone,
            email: body.email,
            consent_type: "transactional_sms",
            consent_text: TRANSACTIONAL_SMS_CONSENT_TEXT,
            ip,
            user_agent: userAgent,
            booking_id: data.id,
          });
        }
        if (marketingSmsOptIn) {
          consentRows.push({
            phone: body.phone,
            email: body.email,
            consent_type: "marketing_sms",
            consent_text: MARKETING_SMS_CONSENT_TEXT,
            ip,
            user_agent: userAgent,
            booking_id: data.id,
          });
        }

        const { error: consentError } = await supabase
          .from("consent_log")
          .insert(consentRows);
        if (consentError) {
          console.warn("consent_log insert failed:", consentError.message);
        }
      } catch (e) {
        console.warn("consent_log insert threw:", e);
      }
    }

    // Read the confirmation back off the stored row rather than trusting the
    // intent: if the fallback insert above had to drop columns, the booking is
    // a plain request again and the customer must be told the same thing.
    const confirmed = data.status === "confirmed";

    const notificationPayload = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      service_type: data.service_type,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      sqft_range: data.sqft_range,
      condition: data.condition,
      address: data.address,
      city: data.city,
      zip: data.zip,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      estimated_min: data.estimated_min,
      estimated_max: data.estimated_max,
      recurring_min: firstVisitIsDeep ? recurring.min + recurring.addonsTotal : null,
      recurring_max: firstVisitIsDeep ? recurring.max + recurring.addonsTotal : null,
      special_requests: data.special_requests,
      addons: data.addons,
      auto_confirmed: confirmed,
    };
    // Await both notifications before responding. On Vercel serverless the
    // function is frozen once the response is sent, so fire-and-forget sends
    // (especially the slower Resend emails) get cut off mid-flight and never
    // arrive. allSettled never rejects — a failing channel is logged inside
    // each notifier and must not fail the booking.
    await Promise.allSettled([
      notifyNewBooking(notificationPayload),
      notifyCustomerBookingReceived(notificationPayload),
      // Customer SMS: only when the isolated consent checkbox was ticked.
      // Exactly one lifecycle message per booking — the confirmation replaces
      // the receipt, it does not follow it.
      sendBookingSms(
        {
          id: data.id,
          phone: data.phone,
          sms_opt_in: smsOptIn,
          scheduled_date: data.scheduled_date,
          scheduled_time: data.scheduled_time,
          preferred_date: data.preferred_date,
          preferred_time: data.preferred_time,
        },
        confirmed ? "booking_confirmed" : "booking_received"
      ),
    ]);

    return NextResponse.json({ success: true, booking: data, confirmed });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
