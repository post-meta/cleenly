/**
 * Availability resolver.
 *
 *     offerable = working pattern
 *               − busy blocks (Inna's calendar, apartment work, manual)
 *               − visits already booked
 *
 * Two rules shape everything here:
 *
 * 1. Capacity is measured in HOURS, not slots. A studio recurring visit and a
 *    five-bedroom move-out are not the same commitment, and the same engine
 *    that prices them (lib/pricing.ts) says how long they take.
 *
 * 2. It fails CLOSED. Busy time arrives from calendars we do not own, so a
 *    sync that breaks must never read as "nothing is busy". A stale feed does
 *    not widen availability — it withdraws auto-confirmation and puts the
 *    booking back in front of a human.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { estimateCleanerHours, estimateRecurringCleanerHours } from "@/lib/pricing";
import { NOON, clipTo, fits, formatMinute, type Interval } from "./intervals";
import { TIMEZONE, addDays, daysBetween, nowInSeattle, weekdayOf } from "./dates";
import type {
  ServiceType,
  BedroomCount,
  BathroomCount,
  HomeCondition,
  SqftRange,
} from "@/types";

// Re-exported so existing importers keep working; defined in ./dates so the
// iCal parser can share them without importing this database-backed module.
export { TIMEZONE, addDays, nowInSeattle };

export type SlotId = "morning" | "afternoon" | "full_day";

export interface SlotOffer {
  id: SlotId;
  label: string;
  /** "8 AM – 12 PM", derived from the day's real working window. */
  window: string;
  available: boolean;
}

export interface DayOffer {
  date: string; // YYYY-MM-DD
  available: boolean;
  slots: SlotOffer[];
  /** Cleaners free that day. 1 means the visit takes twice the wall-clock. */
  crewSize: number;
}

export interface AvailabilityResult {
  days: DayOffer[];
  /** Cleaner-hours the requested job needs. */
  cleanerHours: number;
  /**
   * Whether a matching request may be confirmed without a human. False when a
   * feed is stale or the owner has the switch off — the booking still goes
   * through, it just stays a request.
   */
  autoConfirm: boolean;
  /** Feeds that are enabled but have not synced inside the freshness window. */
  staleFeeds: string[];
}

export interface JobShape {
  serviceType: ServiceType;
  bedrooms: BedroomCount;
  bathrooms: BathroomCount;
  condition?: HomeCondition;
  sqftRange?: SqftRange;
  /** Visit 2+ of a recurring plan is lighter than a first clean. */
  recurring?: boolean;
}

// A crew that travels together does one job per half-day: drive out, clean,
// drive back. Squeezing a second visit into the remainder of a slot is not
// something a two-person shop can honour, so a booked slot is a full slot.
// If the crew ever grows, this is the assumption to revisit.
const ONE_JOB_PER_SLOT = true;

// ---------------------------------------------------------------------------
// Dates. Everything is Seattle local; UTC noon anchors the arithmetic so that
// adding a day across a DST boundary cannot slide the date.
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Job sizing
// ---------------------------------------------------------------------------

export function cleanerHoursFor(job: JobShape): number {
  return job.recurring
    ? estimateRecurringCleanerHours(job.bedrooms)
    : estimateCleanerHours(
        job.serviceType,
        job.bedrooms,
        job.bathrooms,
        job.condition ?? "average",
        job.sqftRange
      );
}

/** Cleaner-hours -> wall-clock minutes for a crew of `crew`. */
function wallClockMinutes(cleanerHours: number, crew: number): number {
  if (crew <= 0) return Number.POSITIVE_INFINITY;
  return Math.ceil((cleanerHours / crew) * 60);
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

interface RuleRow {
  weekday: number;
  works: boolean;
  start_minute: number;
  end_minute: number;
  crew_size: number;
}

interface BusyRow {
  block_date: string;
  who: "eugene" | "inna" | "both";
  start_minute: number | null;
  end_minute: number | null;
}

interface BookingRow {
  scheduled_date: string | null;
  preferred_date: string | null;
  scheduled_time: string | null;
  preferred_time: string | null;
  service_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  condition: string | null;
  sqft_range: string | null;
}

/** Statuses that hold a place in the calendar. */
const BLOCKING_STATUSES = ["confirmed", "scheduled", "in_progress"];

/**
 * Which slot an existing visit consumes.
 *
 * Two writers reach these columns. The wizard stores a slot id ("morning",
 * "full_day"). The admin booking form stores a clock time from an
 * <input type="time"> ("10:00"), which app/actions/bookings.ts writes straight
 * through to scheduled_time. Comparing that against slot ids matched nothing,
 * so an admin-scheduled visit consumed no slot and this resolver happily
 * re-offered that morning to the next customer.
 *
 * Anything it cannot read takes the whole day, including a missing time and
 * the legacy "evening" value: over-blocking costs a phone call, double-booking
 * costs a visit.
 *
 * Known gap: a clock time says when a visit starts, not how long it runs, so a
 * late-morning admin booking that overruns into the afternoon is not seen here.
 * The owner covers that with a manual busy block on /admin/availability.
 */
function bookedSlot(value: string | null): "morning" | "afternoon" | "full_day" {
  if (!value) return "full_day";
  const v = value.trim().toLowerCase();
  if (v === "morning" || v === "afternoon" || v === "full_day") return v;

  // Anchored on purpose. <input type="time"> posts 24-hour "HH:MM"; a value in
  // any other shape ("1:00 PM") would parse to the wrong half, so it takes the
  // whole day instead of quietly freeing an afternoon.
  const clock = /^(\d{1,2}):(\d{2})(:\d{2})?$/.exec(v);
  if (clock) {
    const minute = Number(clock[1]) * 60 + Number(clock[2]);
    if (minute <= 1440) return minute < NOON ? "morning" : "afternoon";
  }
  return "full_day";
}

export async function resolveAvailability(job: JobShape): Promise<AvailabilityResult> {
  const supabase = createAdminClient();
  const cleanerHours = cleanerHoursFor(job);
  const now = nowInSeattle();

  const [settingsRes, rulesRes, syncRes] = await Promise.all([
    supabase.from("availability_settings").select("*").eq("id", true).maybeSingle(),
    supabase.from("availability_rules").select("*"),
    supabase.from("availability_sync_state").select("*").eq("enabled", true),
  ]);

  const settings = settingsRes.data ?? {
    auto_confirm_enabled: false,
    max_stale_minutes: 180,
    lead_time_hours: 24,
    horizon_days: 14,
  };

  const rules = new Map<number, RuleRow>(
    ((rulesRes.data ?? []) as RuleRow[]).map((r) => [r.weekday, r])
  );

  // A feed that has never succeeded is as stale as one that stopped.
  const staleCutoff = Date.now() - settings.max_stale_minutes * 60_000;
  const staleFeeds = (syncRes.data ?? [])
    .filter((f: { last_success_at: string | null }) => {
      if (!f.last_success_at) return true;
      return new Date(f.last_success_at).getTime() < staleCutoff;
    })
    .map((f: { feed_key: string }) => f.feed_key);

  const firstDate = addDays(now.date, 0);
  const lastDate = addDays(now.date, settings.horizon_days);

  const [busyRes, bookingsRes] = await Promise.all([
    supabase
      .from("busy_blocks")
      .select("block_date, who, start_minute, end_minute")
      .gte("block_date", firstDate)
      .lte("block_date", lastDate),
    supabase
      .from("bookings")
      .select(
        "scheduled_date, preferred_date, scheduled_time, preferred_time, service_type, bedrooms, bathrooms, condition, sqft_range"
      )
      .in("status", BLOCKING_STATUSES),
  ]);

  const busyByDate = new Map<string, BusyRow[]>();
  for (const b of (busyRes.data ?? []) as BusyRow[]) {
    const list = busyByDate.get(b.block_date) ?? [];
    list.push(b);
    busyByDate.set(b.block_date, list);
  }

  // Existing visits consume their slot on the day they are scheduled for.
  const bookedByDate = new Map<string, Set<string>>();
  for (const bk of (bookingsRes.data ?? []) as BookingRow[]) {
    const date = bk.scheduled_date ?? bk.preferred_date;
    if (!date) continue;
    const slot = bookedSlot(bk.scheduled_time ?? bk.preferred_time);
    const set = bookedByDate.get(date) ?? new Set<string>();
    set.add(slot);
    bookedByDate.set(date, set);
  }

  // Lead time is measured in whole days, not as a rolling clock.
  //
  // A literal 24-hour horizon looked correct and read as broken: at 2:53pm it
  // offered tomorrow as "2:53 PM - 6 PM", and the window crawled across the
  // clock as the day went on. Notice periods are understood in days — "we need
  // a day's notice" means tomorrow, all of it — so round up to whole days and
  // offer the earliest eligible day in full.
  //
  // Today is the exception: when lead time is zero, today is bookable and the
  // current clock legitimately cuts into it, because hours already gone cannot
  // be sold.
  const leadDays = Math.ceil(settings.lead_time_hours / 24);
  const earliestDate = addDays(now.date, leadDays);

  const days: DayOffer[] = [];

  for (let i = 0; i <= settings.horizon_days; i++) {
    const date = addDays(now.date, i);
    if (daysBetween(date, earliestDate) > 0) continue; // earlier than lead time

    const rule = rules.get(weekdayOf(date));
    if (!rule || !rule.works) continue;

    const dayBusy = busyByDate.get(date) ?? [];

    // All-day blocks: on both -> day is gone; on one person -> crew halves.
    let crew = rule.crew_size;
    let dayClosed = false;
    const timedBusy: Interval[] = [];

    for (const b of dayBusy) {
      const allDay = b.start_minute === null || b.end_minute === null;
      if (b.who === "both") {
        if (allDay) dayClosed = true;
        else timedBusy.push({ start: b.start_minute!, end: b.end_minute! });
        continue;
      }
      // One person is out. Whether the block is timed or all-day, treat the
      // whole day as short-handed: a solo cleaner cannot be scheduled around a
      // fixed appointment and still promise an arrival window.
      crew -= 1;
      if (!allDay) timedBusy.push({ start: b.start_minute!, end: b.end_minute! });
    }

    if (dayClosed || crew <= 0) continue;

    const dayWindow: Interval = { start: rule.start_minute, end: rule.end_minute };
    const needed = wallClockMinutes(cleanerHours, crew);

    // Only the current day is clipped by the clock; future days open in full.
    const floor = date === now.date ? now.minute : 0;
    const openWindow = clipTo(dayWindow, { start: floor, end: 1440 });
    if (!openWindow) continue;

    const booked = bookedByDate.get(date) ?? new Set<string>();
    const slotBusy = [...timedBusy];
    if (ONE_JOB_PER_SLOT) {
      if (booked.has("morning")) slotBusy.push({ start: 0, end: NOON });
      if (booked.has("afternoon")) slotBusy.push({ start: NOON, end: 1440 });
      if (booked.has("full_day")) slotBusy.push({ start: 0, end: 1440 });
    }

    const morning = clipTo(openWindow, { start: 0, end: NOON });
    const afternoon = clipTo(openWindow, { start: NOON, end: 1440 });

    const morningOk = morning ? fits(morning, slotBusy, needed) : false;
    const afternoonOk = afternoon ? fits(afternoon, slotBusy, needed) : false;
    // A long visit fits neither half but still fits the day. Offering it as a
    // half-day slot would be a promise the crew cannot keep.
    const fullDayOk = !morningOk && !afternoonOk && fits(openWindow, slotBusy, needed);

    const slots: SlotOffer[] = [];
    if (morningOk && morning) {
      slots.push({
        id: "morning",
        label: "Morning",
        window: `${formatMinute(morning.start)} – ${formatMinute(morning.end)}`,
        available: true,
      });
    }
    if (afternoonOk && afternoon) {
      slots.push({
        id: "afternoon",
        label: "Afternoon",
        window: `${formatMinute(afternoon.start)} – ${formatMinute(afternoon.end)}`,
        available: true,
      });
    }
    if (fullDayOk) {
      slots.push({
        id: "full_day",
        label: "Full day",
        window: `${formatMinute(openWindow.start)} – ${formatMinute(openWindow.end)}`,
        available: true,
      });
    }

    if (slots.length === 0) continue;

    days.push({ date, available: true, slots, crewSize: crew });
  }

  return {
    days,
    cleanerHours,
    autoConfirm: Boolean(settings.auto_confirm_enabled) && staleFeeds.length === 0,
    staleFeeds,
  };
}

/**
 * Re-check one specific date/slot at submit time.
 *
 * The wizard's list can be minutes old, and two people can pick the same
 * morning. Auto-confirmation must be decided from a fresh read, not from what
 * the browser was shown.
 */
export async function canAutoConfirm(
  job: JobShape,
  date: string,
  slot: string
): Promise<{ ok: boolean; reason?: string }> {
  const result = await resolveAvailability(job);

  if (!result.autoConfirm) {
    return {
      ok: false,
      reason: result.staleFeeds.length
        ? `stale_feeds:${result.staleFeeds.join(",")}`
        : "auto_confirm_disabled",
    };
  }

  const day = result.days.find((d) => d.date === date);
  if (!day) return { ok: false, reason: "date_unavailable" };
  if (!day.slots.some((s) => s.id === slot && s.available)) {
    return { ok: false, reason: "slot_unavailable" };
  }
  return { ok: true };
}
