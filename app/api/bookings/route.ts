import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  notifyCustomerBookingReceived,
  notifyNewBooking,
} from "@/lib/notifications";
import { calculateFirstVisitPrice } from "@/lib/pricing";
import {
  MARKETING_SMS_CONSENT_TEXT,
  TRANSACTIONAL_SMS_CONSENT_TEXT,
} from "@/lib/consent";
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
const VALID_ADDONS: Addon[] = [
  "fridge",
  "oven",
  "cabinets",
  "laundry",
  "pollen_purge",
  "damp_season_reset",
];
// "evening" removed 2026-06-10 — slot no longer offered (can't reliably staff 4pm+).
const VALID_TIME_SLOTS: TimeSlot[] = ["morning", "afternoon"];

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
      status: "new",
      user_id: userId,
    };

    let { data, error } = await supabase
      .from("bookings")
      .insert({
        ...bookingRow,
        sms_opt_in: smsOptIn,
        sms_opt_in_at: smsOptIn ? new Date().toISOString() : null,
      })
      .select()
      .single();

    // Graceful fallback: if the sms_opt_in columns are missing in this environment
    // (e.g. preview DB without the migration), retry without them.
    // The booking must never fail because of consent bookkeeping.
    if (error && error.code === "PGRST204") {
      console.warn(
        "bookings.sms_opt_in columns missing, retrying insert without them:",
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
    };
    notifyNewBooking(notificationPayload).catch((e) =>
      console.error("notifyNewBooking failed:", e)
    );
    notifyCustomerBookingReceived(notificationPayload).catch((e) =>
      console.error("notifyCustomerBookingReceived failed:", e)
    );

    return NextResponse.json({ success: true, booking: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
