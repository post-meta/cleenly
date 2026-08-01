/**
 * Seattle-local date arithmetic.
 *
 * Its own module so the iCal parser can use it without importing the resolver,
 * which reaches the database. A pure parser that drags in a Supabase client
 * cannot be exercised on its own, and this is the one piece of the scheduler
 * where an off-by-one day is both easy to write and expensive to ship.
 */

export const TIMEZONE = "America/Los_Angeles";

/** Today's date and clock position in Seattle, not on the server. */
export function nowInSeattle(): { date: string; minute: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minute: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/**
 * Shift a YYYY-MM-DD date by whole days.
 *
 * Anchored at UTC noon on purpose: adding a day to a date anchored at midnight
 * lands on 23:00 the previous day when the clocks change, which silently slides
 * every date in the horizon by one on two mornings a year.
 */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Day of week for a YYYY-MM-DD date, 0 = Sunday. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
}

/** Whole days from `from` to `to`. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const p = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d, 12);
  };
  return Math.round((p(to) - p(from)) / 86_400_000);
}

/**
 * A UTC instant expressed as a Seattle-local date plus minutes from midnight.
 *
 * Used by the iCal parser: a calendar feed states times in UTC (or with a
 * TZID), and a 3 AM UTC appointment belongs to the previous Seattle evening.
 */
export function utcToSeattle(instant: Date): { date: string; minute: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(instant)
      .map((p) => [p.type, p.value])
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minute: Number(parts.hour) * 60 + Number(parts.minute),
  };
}
