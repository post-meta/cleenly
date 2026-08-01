/**
 * Interval arithmetic for the availability resolver.
 *
 * Pure functions, no I/O, no clock — everything here is minutes from midnight
 * in Seattle local time. Kept separate from the resolver so the scheduling
 * maths can be reasoned about (and tested) without a database.
 */

export interface Interval {
  /** Minutes from midnight, inclusive. */
  start: number;
  /** Minutes from midnight, exclusive. */
  end: number;
}

export const NOON = 12 * 60;

/** Minutes -> "8:00 AM". Used for customer-facing slot labels. */
export function formatMinute(minute: number): string {
  const h24 = Math.floor(minute / 60);
  const m = minute % 60;
  const suffix = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Do two intervals share any minute? Touching endpoints do not overlap. */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/** The part of `window` that also lies inside `clip`, or null if disjoint. */
export function clipTo(window: Interval, clip: Interval): Interval | null {
  const start = Math.max(window.start, clip.start);
  const end = Math.min(window.end, clip.end);
  return end > start ? { start, end } : null;
}

/**
 * Remove `busy` from `window`, returning the gaps left over.
 *
 * Busy intervals may overlap each other and may run past the window on either
 * side; both are normal (an all-day appointment, two jobs back to back).
 */
export function subtract(window: Interval, busy: Interval[]): Interval[] {
  const clipped = busy
    .map((b) => clipTo(window, b))
    .filter((b): b is Interval => b !== null)
    .sort((a, b) => a.start - b.start);

  const free: Interval[] = [];
  let cursor = window.start;

  for (const block of clipped) {
    if (block.start > cursor) free.push({ start: cursor, end: block.start });
    cursor = Math.max(cursor, block.end);
    if (cursor >= window.end) break;
  }

  if (cursor < window.end) free.push({ start: cursor, end: window.end });
  return free;
}

/** Longest single uninterrupted stretch, in minutes. Zero when there is none. */
export function longestGap(free: Interval[]): number {
  return free.reduce((best, i) => Math.max(best, i.end - i.start), 0);
}

/**
 * Does a job of `minutesNeeded` fit somewhere in `window` given `busy`?
 *
 * Deliberately requires ONE contiguous stretch. A four-hour clean cannot be
 * done as two two-hour halves either side of another appointment.
 */
export function fits(window: Interval, busy: Interval[], minutesNeeded: number): boolean {
  if (minutesNeeded <= 0) return true;
  return longestGap(subtract(window, busy)) >= minutesNeeded;
}
