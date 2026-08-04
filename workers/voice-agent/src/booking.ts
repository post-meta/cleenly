/**
 * Availability and booking for the phone agent.
 *
 * Both tools call the site's own API rather than reaching into Supabase. The
 * booking route already recomputes the price server-side, decides whether the
 * slot can be auto-confirmed, writes consent, and fires the owner and customer
 * notifications. Re-implementing any of that here would give the phone a second
 * source of truth, and the two would drift the first time pricing changed.
 *
 * Everything returned from here is read aloud by text-to-speech, so it is
 * written to be spoken: no lists, no URLs, no currency symbols mid-sentence.
 */

import type { Env } from "./types";

const SITE = "https://cleenly.app";
const TIMEOUT_MS = 12_000;

/** How many days to offer out loud. A phone call cannot absorb twelve. */
const SPOKEN_DAYS = 3;

interface SlotOffer {
  id: "morning" | "afternoon" | "full_day";
  label: string;
  window: string;
}
interface DayOffer {
  date: string;
  slots: SlotOffer[];
}
interface AvailabilityResponse {
  days?: DayOffer[];
  degraded?: boolean;
}

function post(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

/** "2026-08-07" -> "Thursday the 7th", which is how a person says a date. */
function speakDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(dt);
  const n = d % 100;
  const suffix =
    n >= 11 && n <= 13 ? "th" : d % 10 === 1 ? "st" : d % 10 === 2 ? "nd" : d % 10 === 3 ? "rd" : "th";
  return `${weekday} the ${d}${suffix}`;
}

function speakSlots(slots: SlotOffer[]): string {
  const words = slots.map((s) =>
    s.id === "full_day" ? "the whole day" : s.id === "morning" ? "morning" : "afternoon"
  );
  if (words.length === 1) return words[0];
  return `${words.slice(0, -1).join(", ")} or ${words[words.length - 1]}`;
}

export interface JobArgs {
  service_type: string;
  bedrooms: string;
  bathrooms: string;
  condition?: string;
  sqft_range?: string;
}

/**
 * What the crew can actually take, phrased for speech.
 *
 * An empty answer is not "we are closed" — it means the job is too big for the
 * days on offer, or a calendar feed is stale. Either way the caller gets a
 * human, not a dead end.
 */
export async function checkAvailability(
  _env: Env,
  job: JobArgs,
  wantedDate?: string
): Promise<string> {
  let data: AvailabilityResponse;
  try {
    const res = await post(`${SITE}/api/availability`, {
      serviceType: job.service_type,
      bedrooms: job.bedrooms,
      bathrooms: job.bathrooms,
      condition: job.condition,
      sqftRange: job.sqft_range,
    });
    if (!res.ok) {
      console.error("availability http", res.status, await res.text().catch(() => ""));
      return "The calendar is not responding. Take the caller's preferred day, tell them we will confirm it shortly, and escalate to Eugene.";
    }
    data = (await res.json()) as AvailabilityResponse;
  } catch (err) {
    console.error("availability failed:", err);
    return "The calendar is not responding. Take the caller's preferred day, tell them we will confirm it shortly, and escalate to Eugene.";
  }

  const days = data.days ?? [];
  if (data.degraded || days.length === 0) {
    return "No open days came back for that job. Ask which day the caller would prefer, say we will confirm it with them, and escalate to Eugene.";
  }

  if (wantedDate) {
    const hit = days.find((d) => d.date === wantedDate);
    if (hit) {
      return `${speakDate(hit.date)} [date=${hit.date}] is open: ${speakSlots(hit.slots)}. Say the day out loud, pass the bracketed date to create_booking.`;
    }
    const alt = days.slice(0, 2).map((d) => `${speakDate(d.date)} [date=${d.date}] (${speakSlots(d.slots)})`);
    return `${speakDate(wantedDate)} is taken. The nearest open days are ${alt.join(" and ")}. Offer those.`;
  }

  const spoken = days
    .slice(0, SPOKEN_DAYS)
    .map((d) => `${speakDate(d.date)} [date=${d.date}]: ${speakSlots(d.slots)}`);
  const more = days.length > SPOKEN_DAYS ? ` There are ${days.length} open days in total if none of those work.` : "";
  return (
    `Open soonest — ${spoken.join("; ")}.${more} Offer the first two out loud and let the caller choose. ` +
    `Never read the bracketed date aloud — it exists so you can pass the exact value to create_booking. ` +
    `Never build a date yourself.`
  );
}

export interface BookingArgs extends JobArgs {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  date: string;
  time_slot: string;
  notes?: string;
}

/**
 * Create the booking through the site's own endpoint.
 *
 * sms_opt_in is deliberately false. Transactional texts are gated on the
 * isolated checkbox in the web form, which is what the A2P campaign was
 * registered against; a verbal yes on a phone call is not that same evidence.
 * The customer still gets the confirmation email. Revisit only with the owner.
 */
export async function createBooking(
  _env: Env,
  a: BookingArgs,
  /** True when check_availability already offered this date earlier in the call. */
  dateAlreadyOffered = false,
  /** Which channel the booking came through — becomes utm_source on the row. */
  channel: "voice" | "sms" = "voice"
): Promise<string> {
  // Re-check the date against the calendar before writing.
  //
  // A model that has been handed a spoken date ("Monday the 4th") will happily
  // invent an ISO string to go with it — the first phone booking landed on
  // 2025-01-03, nineteen months in the past. The tool that owns the write is
  // the right place to refuse, because it is the only one that cannot be
  // talked out of it.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date)) {
    return "That date is not in YYYY-MM-DD form. Call check_availability again and use the bracketed value it returns.";
  }
  // Skipped when the caller picked a date this tool already offered. The guard
  // is a full HTTP round trip, and on a phone call it was 1.8 seconds of the
  // 3.6 the caller spent listening to nothing.
  if (!dateAlreadyOffered) try {
    const res = await post(`${SITE}/api/availability`, {
      serviceType: a.service_type,
      bedrooms: a.bedrooms,
      bathrooms: a.bathrooms,
      condition: a.condition,
      sqftRange: a.sqft_range,
    });
    if (res.ok) {
      const av = (await res.json()) as AvailabilityResponse;
      const days = av.days ?? [];
      if (days.length > 0 && !days.some((d) => d.date === a.date)) {
        const near = days.slice(0, 2).map((d) => `${speakDate(d.date)} [date=${d.date}]`).join(" or ");
        return `${a.date} is not an open day, so nothing was booked. Offer ${near} instead and call create_booking again with one of those.`;
      }
    }
  } catch {
    // Calendar unreachable — fall through and let the booking route decide.
  }

  const payload = {
    name: a.name,
    phone: a.phone,
    email: a.email,
    address: a.address,
    city: a.city,
    service_type: a.service_type,
    bedrooms: a.bedrooms,
    bathrooms: a.bathrooms,
    condition: a.condition ?? "average",
    sqft_range: a.sqft_range ?? "not_sure",
    preferred_date: a.date,
    preferred_time: a.time_slot,
    special_requests: a.notes ?? (channel === "sms" ? "Booked over text." : "Booked over the phone."),
    sms_opt_in: false,
    marketing_sms_opt_in: false,
    // Marks the channel as the origin so phone/text bookings can be told apart
    // in the booking_attribution view. No cookie on a server-to-server call.
    utm_source: channel,
    utm_medium: "phone",
  };

  let res: Response;
  try {
    res = await post(`${SITE}/api/bookings`, payload);
  } catch (err) {
    console.error("booking request failed:", err);
    return "The booking did not go through. Apologize, tell the caller you are passing it to Eugene right now, and call escalate with everything they gave you.";
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("booking http", res.status, detail);
    if (res.status === 400) {
      return "One of the details was rejected — most often the email or the date. Ask the caller to repeat the email slowly, then try once more. If it fails again, escalate to Eugene.";
    }
    return "The booking did not go through. Apologize, tell the caller you are passing it to Eugene right now, and call escalate with everything they gave you.";
  }

  const out = (await res.json().catch(() => ({}))) as {
    confirmed?: boolean;
    booking?: { estimated_min?: number; estimated_max?: number };
  };
  const min = out.booking?.estimated_min;
  const max = out.booking?.estimated_max;
  const money =
    typeof min === "number" && typeof max === "number"
      ? ` The estimate is ${Math.round(min / 100)} to ${Math.round(max / 100)} dollars, and the final price never goes above the top of that.`
      : "";

  if (out.confirmed) {
    return `Booked and confirmed for ${speakDate(a.date)}.${money} Tell the caller it is on the calendar and the confirmation is on its way to their email.`;
  }
  return `Booking request received for ${speakDate(a.date)}.${money} Tell the caller we will confirm the time with them shortly, and that the details are on their way to their email.`;
}
