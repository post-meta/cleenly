/**
 * iCal reader (RFC 5545). No dependencies — the whole parser is here.
 *
 * It answers one question: which minutes of which Seattle days does this
 * calendar consume? Attendees, alarms, categories, geo, free/busy transparency
 * — all ignored on purpose.
 *
 * Two habits run through it:
 *
 * 1. It fails CLOSED. A shape we cannot read with confidence becomes MORE busy
 *    time, never less. A recurrence we cannot expand keeps its first
 *    occurrence and is flagged `complex` so the caller can log it. Nothing is
 *    dropped in silence.
 *
 * 2. It is privacy-aware. `summary` is returned so the caller can decide, and
 *    the sync throws it away: none of Inna's task titles belong in our
 *    database. Warnings carry UIDs and rule text, never titles.
 */

import { TIMEZONE, addDays } from "./dates";

export interface IcsBlock {
  /** Stable id from the origin calendar. Becomes half of `source_ref`. */
  uid: string;
  /** YYYY-MM-DD, Seattle local. */
  date: string;
  /** Minutes from midnight. null on both ends means the whole day. */
  startMinute: number | null;
  endMinute: number | null;
  /** Returned for the caller's judgement. The sync discards it. */
  summary: string | null;
  /** The rule was richer than we can expand; this is occurrence one only. */
  complex?: boolean;
}

export interface ParseIcsOptions {
  horizonDays: number;
  /** YYYY-MM-DD, Seattle local. Days before this are dropped. */
  fromDate: string;
}

export interface ParseIcsResult {
  events: IcsBlock[];
  warnings: string[];
}

type Warn = (message: string) => void;

/** An entry with a start time and no end still costs the crew something. */
const ASSUMED_MINUTES = 60;
const MAX_WARNINGS = 40;
const MAX_DAYS_PER_EVENT = 400;
const MAX_OCCURRENCES = 500;
/** Day-by-day scan bound for BYDAY rules with an old DTSTART and a COUNT. */
const MAX_SCAN_DAYS = 4000;

const WEEKDAYS: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

// ---------------------------------------------------------------------------
// Lines and properties
// ---------------------------------------------------------------------------

/** RFC 5545 folding: a line break followed by a space or tab continues. */
function unfold(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split(/\r\n|\n|\r/)) {
    if (out.length > 0 && (line.startsWith(" ") || line.startsWith("\t"))) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

interface Prop {
  name: string;
  params: Record<string, string>;
  value: string;
}

function splitOutsideQuotes(input: string, separator: string): string[] {
  const out: string[] = [];
  let current = "";
  let quoted = false;

  for (const ch of input) {
    if (ch === '"') {
      quoted = !quoted;
      current += ch;
    } else if (ch === separator && !quoted) {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  out.push(current);
  return out;
}

/** `DTSTART;TZID="America/New York":20260801T090000` -> name, params, value. */
function parseProp(line: string): Prop | null {
  let colon = -1;
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') quoted = !quoted;
    else if (ch === ":" && !quoted) {
      colon = i;
      break;
    }
  }

  if (colon <= 0) return null;

  const segments = splitOutsideQuotes(line.slice(0, colon), ";");
  const params: Record<string, string> = {};

  for (const segment of segments.slice(1)) {
    const eq = segment.indexOf("=");
    if (eq <= 0) continue;
    params[segment.slice(0, eq).toUpperCase()] = segment.slice(eq + 1).replace(/^"|"$/g, "");
  }

  return { name: segments[0].trim().toUpperCase(), params, value: line.slice(colon + 1) };
}

function unescapeText(value: string): string {
  return value.replace(/\\([\\;,nN])/g, (_, ch: string) => (ch === "n" || ch === "N" ? "\n" : ch));
}

// ---------------------------------------------------------------------------
// Clocks. Everything leaves this section as Seattle local date + minute.
// ---------------------------------------------------------------------------

function clockIn(timeZone: string, ms: number): { date: string; minute: number; asUtcMs: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(ms))
      .map((p) => [p.type, p.value])
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minute: Number(parts.hour) * 60 + Number(parts.minute),
    asUtcMs: Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second)
    ),
  };
}

function utcToSeattle(ms: number): { date: string; minute: number } {
  const clock = clockIn(TIMEZONE, ms);
  return { date: clock.date, minute: clock.minute };
}

/**
 * A wall clock in `timeZone` -> the UTC instant it names.
 *
 * Two passes: the zone offset at the guessed instant can differ from the
 * offset at the real one when the guess lands the wrong side of a DST edge.
 * Throws if Intl does not know the zone.
 */
function wallClockToUtcMs(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  s: number,
  timeZone: string
): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi, s);
  let utc = guess - (clockIn(timeZone, guess).asUtcMs - guess);
  utc = guess - (clockIn(timeZone, utc).asUtcMs - utc);
  return utc;
}

function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
}

/** Whole days between two YYYY-MM-DD dates. Noon anchors it against DST. */
function dayDiff(from: string, to: string): number {
  const at = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d, 12);
  };
  return Math.round((at(to) - at(from)) / 86_400_000);
}

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

/** A parsed DTSTART/DTEND. `minute === null` is the DATE form: a whole day. */
interface Stamp {
  date: string;
  minute: number | null;
}

const DATE_FORM = /^(\d{4})(\d{2})(\d{2})$/;
const DATE_TIME_FORM = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/;

function parseStamp(prop: Prop, uid: string, warn: Warn): Stamp | null {
  const raw = prop.value.trim();

  const dateOnly = DATE_FORM.exec(raw);
  if (dateOnly) return { date: `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`, minute: null };

  const dateTime = DATE_TIME_FORM.exec(raw);
  if (!dateTime) {
    warn(`unreadable ${prop.name} "${raw}" (uid=${uid})`);
    return null;
  }

  const [, ys, mos, ds, hs, mis, ss, zulu] = dateTime;
  const y = Number(ys);
  const mo = Number(mos);
  const d = Number(ds);
  const h = Number(hs);
  const mi = Number(mis);
  const s = Number(ss);

  if (zulu) return utcToSeattle(Date.UTC(y, mo - 1, d, h, mi, s));

  const tzid = prop.params.TZID;
  if (tzid && tzid !== TIMEZONE) {
    try {
      return utcToSeattle(wallClockToUtcMs(y, mo, d, h, mi, s, tzid));
    } catch {
      // Outlook writes Windows zone names ("Pacific Standard Time") that Intl
      // rejects. Reading the clock as Seattle local is the closest guess.
      warn(`unknown TZID "${tzid}", read as Seattle local (uid=${uid})`);
    }
  }

  // Floating time, Seattle's own zone, or a zone we could not resolve.
  return { date: `${ys}-${mos}-${ds}`, minute: h * 60 + mi };
}

const DURATION_FORM = /^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

function parseDurationMinutes(value: string): number | null {
  const m = DURATION_FORM.exec(value.trim().toUpperCase());
  if (!m) return null;

  const [, sign, weeks, days, hours, minutes, seconds] = m;
  const total =
    Number(weeks ?? 0) * 10_080 +
    Number(days ?? 0) * 1440 +
    Number(hours ?? 0) * 60 +
    Number(minutes ?? 0) +
    Math.ceil(Number(seconds ?? 0) / 60);

  return sign === "-" ? -total : total;
}

// ---------------------------------------------------------------------------
// Spans: one occurrence, as a start instant and an exclusive end instant.
// ---------------------------------------------------------------------------

interface Span {
  allDay: boolean;
  startDate: string;
  /** Ignored when allDay. */
  startMinute: number;
  /** Exclusive. For allDay this is the first day NOT covered. */
  endDate: string;
  endMinute: number;
}

function shiftClock(date: string, minute: number, delta: number): { date: string; minute: number } {
  let total = minute + delta;
  let d = date;

  while (total >= 1440) {
    total -= 1440;
    d = addDays(d, 1);
  }
  while (total < 0) {
    total += 1440;
    d = addDays(d, -1);
  }

  return { date: d, minute: total };
}

function atOrBefore(aDate: string, aMinute: number, bDate: string, bMinute: number): boolean {
  return aDate < bDate || (aDate === bDate && aMinute <= bMinute);
}

function buildSpan(
  start: Stamp,
  end: Stamp | null,
  durationMinutes: number | null,
  uid: string,
  warn: Warn
): Span {
  if (start.minute === null) {
    // All-day. DTEND is EXCLUSIVE per spec: 20260801 -> 20260802 is ONE day.
    let endDate: string;
    if (end && end.minute === null) endDate = end.date;
    else if (end) endDate = addDays(end.date, 1); // timed end on an all-day start
    else if (durationMinutes !== null) {
      endDate = addDays(start.date, Math.max(1, Math.ceil(durationMinutes / 1440)));
    } else endDate = addDays(start.date, 1);

    if (endDate <= start.date) endDate = addDays(start.date, 1);
    return { allDay: true, startDate: start.date, startMinute: 0, endDate, endMinute: 0 };
  }

  let endDate: string;
  let endMinute: number;

  if (end) {
    // A DATE-form end on a timed event: midnight opening that day, exclusive.
    endDate = end.date;
    endMinute = end.minute ?? 0;
  } else if (durationMinutes !== null && durationMinutes > 0) {
    const shifted = shiftClock(start.date, start.minute, durationMinutes);
    endDate = shifted.date;
    endMinute = shifted.minute;
  } else {
    // No end and no duration. RFC calls that zero-length; a personal calendar
    // means "I am out". Zero minutes would widen availability, so assume an
    // hour and say so.
    warn(`no DTEND or DURATION, assumed ${ASSUMED_MINUTES} minutes (uid=${uid})`);
    const shifted = shiftClock(start.date, start.minute, ASSUMED_MINUTES);
    endDate = shifted.date;
    endMinute = shifted.minute;
  }

  if (atOrBefore(endDate, endMinute, start.date, start.minute)) {
    warn(`end at or before start, assumed ${ASSUMED_MINUTES} minutes (uid=${uid})`);
    const shifted = shiftClock(start.date, start.minute, ASSUMED_MINUTES);
    endDate = shifted.date;
    endMinute = shifted.minute;
  }

  return { allDay: false, startDate: start.date, startMinute: start.minute, endDate, endMinute };
}

function shiftSpan(span: Span, days: number): Span {
  return {
    ...span,
    startDate: addDays(span.startDate, days),
    endDate: addDays(span.endDate, days),
  };
}

interface DayBlock {
  date: string;
  startMinute: number | null;
  endMinute: number | null;
}

/** One span -> one row per calendar day it touches. */
function spanToDays(span: Span, uid: string, warn: Warn): DayBlock[] {
  const out: DayBlock[] = [];
  let cursor = span.startDate;
  let guard = 0;

  if (span.allDay) {
    while (cursor < span.endDate && guard++ < MAX_DAYS_PER_EVENT) {
      out.push({ date: cursor, startMinute: null, endMinute: null });
      cursor = addDays(cursor, 1);
    }
  } else if (span.startDate === span.endDate) {
    out.push({ date: span.startDate, startMinute: span.startMinute, endMinute: span.endMinute });
  } else {
    while (cursor <= span.endDate && guard++ < MAX_DAYS_PER_EVENT) {
      if (cursor === span.startDate) {
        out.push({ date: cursor, startMinute: span.startMinute, endMinute: 1440 });
      } else if (cursor === span.endDate) {
        // An end at midnight belongs to the day before, not to this one.
        if (span.endMinute > 0) out.push({ date: cursor, startMinute: 0, endMinute: span.endMinute });
      } else {
        out.push({ date: cursor, startMinute: null, endMinute: null });
      }
      cursor = addDays(cursor, 1);
    }
  }

  if (guard >= MAX_DAYS_PER_EVENT) {
    warn(`event longer than ${MAX_DAYS_PER_EVENT} days, truncated (uid=${uid})`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Recurrence. Simple DAILY/WEEKLY only; anything else keeps occurrence one.
// ---------------------------------------------------------------------------

interface Recurrence {
  freq: "DAILY" | "WEEKLY";
  interval: number;
  count: number | null;
  untilDate: string | null;
  byday: number[] | null;
}

const SIMPLE_RRULE_PARTS = new Set(["FREQ", "INTERVAL", "COUNT", "UNTIL", "WKST", "BYDAY"]);

function parseRrule(value: string, uid: string, warn: Warn): Recurrence | null {
  const parts = new Map<string, string>();
  for (const chunk of value.split(";")) {
    const eq = chunk.indexOf("=");
    if (eq <= 0) continue;
    parts.set(chunk.slice(0, eq).trim().toUpperCase(), chunk.slice(eq + 1).trim());
  }

  for (const key of parts.keys()) if (!SIMPLE_RRULE_PARTS.has(key)) return null;

  const freq = (parts.get("FREQ") ?? "").toUpperCase();
  if (freq !== "DAILY" && freq !== "WEEKLY") return null;

  const interval = Math.max(1, Math.floor(Number(parts.get("INTERVAL") ?? 1)) || 1);

  let byday: number[] | null = null;
  const bydayRaw = parts.get("BYDAY");
  if (bydayRaw) {
    // WKST decides which days fall in which week, and we ignore WKST — so a
    // BYDAY rule that skips weeks is beyond us.
    if (freq !== "WEEKLY" || interval !== 1) return null;
    byday = [];
    for (const token of bydayRaw.split(",")) {
      const day = WEEKDAYS[token.trim().toUpperCase()];
      if (day === undefined) return null; // ordinal forms like 2MO
      byday.push(day);
    }
    if (byday.length === 0) byday = null;
  }

  const countRaw = parts.get("COUNT");
  const count = countRaw ? Math.max(1, Math.floor(Number(countRaw)) || 1) : null;

  let untilDate: string | null = null;
  const untilRaw = parts.get("UNTIL");
  if (untilRaw) {
    const stamp = parseStamp({ name: "UNTIL", params: {}, value: untilRaw }, uid, warn);
    if (!stamp) return null;
    // Compared by date, so the last day is included. Erring long, not short.
    untilDate = stamp.date;
  }

  return { freq, interval, count, untilDate, byday };
}

/** Occurrence start dates that can touch [windowFrom, windowTo]. */
function occurrenceStarts(
  rule: Recurrence,
  dtstart: string,
  windowFrom: string,
  windowTo: string,
  uid: string,
  warn: Warn
): string[] {
  const out: string[] = [];
  const limit = rule.count ?? Number.POSITIVE_INFINITY;

  if (!rule.byday) {
    const step = rule.freq === "DAILY" ? rule.interval : rule.interval * 7;
    const gap = dayDiff(dtstart, windowFrom);
    let index = gap > 0 ? Math.ceil(gap / step) : 0;

    for (; index < limit; index++) {
      const date = addDays(dtstart, index * step);
      if (date > windowTo) break;
      if (rule.untilDate && date > rule.untilDate) break;
      out.push(date);
      if (out.length >= MAX_OCCURRENCES) {
        warn(`recurrence capped at ${MAX_OCCURRENCES} occurrences (uid=${uid})`);
        break;
      }
    }
    return out;
  }

  // Weekly on named days, interval 1: walk the calendar. COUNT is measured
  // from DTSTART, so we may only skip ahead when there is no COUNT.
  let cursor = rule.count === null && dtstart < windowFrom ? windowFrom : dtstart;
  let emitted = 0;
  let scanned = 0;

  while (scanned++ < MAX_SCAN_DAYS) {
    if (cursor > windowTo) break;
    if (rule.untilDate && cursor > rule.untilDate) break;
    if (emitted >= limit) break;

    if (rule.byday.includes(weekdayOf(cursor))) {
      emitted++;
      if (cursor >= windowFrom) out.push(cursor);
      if (out.length >= MAX_OCCURRENCES) {
        warn(`recurrence capped at ${MAX_OCCURRENCES} occurrences (uid=${uid})`);
        break;
      }
    }
    cursor = addDays(cursor, 1);
  }

  return out;
}

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

interface RawEvent {
  uid: string | null;
  summary: string | null;
  start: Prop | null;
  end: Prop | null;
  duration: string | null;
  rrule: string | null;
  exdates: string[];
}

function emptyEvent(): RawEvent {
  return { uid: null, summary: null, start: null, end: null, duration: null, rrule: null, exdates: [] };
}

/**
 * The same UID can land on the same day twice: a recurrence override, a
 * duplicated export, an overlapping pair. One row per (uid, date) is what the
 * sync can key on, so merge to the WIDER block. Never the narrower.
 */
function mergeBlock(into: Map<string, IcsBlock>, block: IcsBlock): void {
  const key = `${block.uid}:${block.date}`;
  const existing = into.get(key);

  if (!existing) {
    into.set(key, block);
    return;
  }

  const complex = existing.complex || block.complex;

  if (existing.startMinute === null || block.startMinute === null) {
    into.set(key, { ...existing, startMinute: null, endMinute: null, complex });
    return;
  }

  into.set(key, {
    ...existing,
    startMinute: Math.min(existing.startMinute, block.startMinute),
    endMinute: Math.max(existing.endMinute ?? 0, block.endMinute ?? 0),
    complex,
  });
}

export function parseIcs(text: string, opts: ParseIcsOptions): ParseIcsResult {
  const warnings: string[] = [];
  let suppressed = 0;
  const warn: Warn = (message) => {
    if (warnings.length < MAX_WARNINGS) warnings.push(message);
    else suppressed++;
  };

  const horizonDays = Number.isFinite(opts.horizonDays) ? Math.max(0, Math.floor(opts.horizonDays)) : 14;
  const windowFrom = opts.fromDate;
  const windowTo = addDays(opts.fromDate, horizonDays);

  const blocks = new Map<string, IcsBlock>();
  const stack: string[] = [];
  let current: RawEvent | null = null;

  const finish = (event: RawEvent): void => {
    if (!event.start) {
      warn(`event without DTSTART skipped (uid=${event.uid ?? "none"})`);
      return;
    }

    // No UID: key on the start value so the ref stays stable across syncs
    // instead of churning a new row every 15 minutes.
    const uid = event.uid ?? `no-uid:${event.start.value.trim()}`;
    if (!event.uid) warn(`event without UID, keyed by start value (${event.start.value.trim()})`);

    const start = parseStamp(event.start, uid, warn);
    if (!start) return;

    const end = event.end ? parseStamp(event.end, uid, warn) : null;
    const durationMinutes = event.duration ? parseDurationMinutes(event.duration) : null;
    const span = buildSpan(start, end, durationMinutes, uid, warn);

    let rule: Recurrence | null = null;
    let complex = false;
    if (event.rrule) {
      rule = parseRrule(event.rrule, uid, warn);
      if (!rule) {
        complex = true;
        warn(`RRULE beyond simple expansion, kept first occurrence (uid=${uid}): ${event.rrule}`);
      }
    }

    // A span that started before the window can still reach into it.
    const lengthDays = Math.min(
      MAX_DAYS_PER_EVENT,
      Math.max(1, dayDiff(span.startDate, span.endDate) + (span.allDay ? 0 : 1))
    );
    const reachFrom = addDays(windowFrom, -(lengthDays - 1));

    const starts = rule
      ? occurrenceStarts(rule, span.startDate, reachFrom, windowTo, uid, warn)
      : [span.startDate];

    const excluded = new Set(event.exdates);

    for (const occurrence of starts) {
      if (excluded.has(occurrence)) continue;

      const offset = dayDiff(span.startDate, occurrence);
      const moved = offset === 0 ? span : shiftSpan(span, offset);

      for (const day of spanToDays(moved, uid, warn)) {
        if (day.date < windowFrom || day.date > windowTo) continue;
        mergeBlock(blocks, {
          uid,
          date: day.date,
          startMinute: day.startMinute,
          endMinute: day.endMinute,
          summary: event.summary,
          ...(complex ? { complex: true } : {}),
        });
      }
    }
  };

  for (const line of unfold(text.replace(/^\uFEFF/, ""))) {
    if (!line) continue;
    const prop = parseProp(line);
    if (!prop) continue;

    if (prop.name === "BEGIN") {
      const component = prop.value.trim().toUpperCase();
      stack.push(component);
      if (component === "VEVENT" && current === null) current = emptyEvent();
      continue;
    }

    if (prop.name === "END") {
      const component = prop.value.trim().toUpperCase();
      stack.pop();
      if (component === "VEVENT" && current) {
        finish(current);
        current = null;
      }
      continue;
    }

    // Only properties sitting directly inside VEVENT. A VALARM has its own
    // SUMMARY and TRIGGER, and a VTIMEZONE has its own DTSTART.
    if (!current || stack[stack.length - 1] !== "VEVENT") continue;

    switch (prop.name) {
      case "UID":
        current.uid = prop.value.trim() || null;
        break;
      case "SUMMARY":
        current.summary = unescapeText(prop.value).trim() || null;
        break;
      case "DTSTART":
        current.start = prop;
        break;
      case "DTEND":
        current.end = prop;
        break;
      case "DURATION":
        current.duration = prop.value;
        break;
      case "RRULE":
        current.rrule = prop.value.trim();
        break;
      case "EXDATE":
        for (const raw of prop.value.split(",")) {
          const stamp = parseStamp({ ...prop, value: raw }, current.uid ?? "none", warn);
          if (stamp) current.exdates.push(stamp.date);
        }
        break;
      default:
        break;
    }
  }

  if (suppressed > 0) warnings.push(`${suppressed} more warnings suppressed`);

  const events = [...blocks.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || (a.startMinute ?? -1) - (b.startMinute ?? -1)
  );

  return { events, warnings };
}
