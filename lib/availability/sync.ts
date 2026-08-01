/**
 * iCal feed sync.
 *
 * Pulls each configured calendar and normalises it into `busy_blocks`. The
 * resolver never learns where a block came from — it only reads dates and
 * minutes.
 *
 * Two rules govern this file:
 *
 * 1. FAIL CLOSED. Only a fetch that succeeded AND parsed may delete anything.
 *    A timeout, a 500, a login page served instead of a calendar — all of them
 *    leave yesterday's blocks exactly where they are and record the error. The
 *    feed then ages out of the freshness window and auto-confirm switches
 *    itself off. Availability never widens because a sync broke.
 *
 * 2. PRIVACY. Third-party calendars carry other people's business. We store
 *    dates and times. `note` is written NULL on purpose — event titles from
 *    Inna's TickTick have no place in our database.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { nowInSeattle, addDays } from "./dates";
import { parseIcs } from "./ical";

export type FeedWho = "eugene" | "inna" | "both";

export interface FeedSyncResult {
  feedKey: string;
  ok: boolean;
  blocks: number;
  error?: string;
}

interface FeedConfig {
  key: string;
  url: string;
  who: FeedWho;
}

const FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_HORIZON_DAYS = 14;
const INSERT_CHUNK = 200;
const DELETE_CHUNK = 100;
/** Reported against a malformed ICAL_FEEDS rather than thrown. */
const ENV_FEED_KEY = "ical_feeds_env";

const WHO_VALUES: FeedWho[] = ["eugene", "inna", "both"];

// ---------------------------------------------------------------------------
// Configuration. Read at call time, never at import time: a malformed env must
// break one cron run, not the whole build.
// ---------------------------------------------------------------------------

function readFeedConfig(): { feeds: FeedConfig[]; errors: string[] } {
  const raw = process.env.ICAL_FEEDS;
  if (!raw || !raw.trim()) return { feeds: [], errors: [] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { feeds: [], errors: ["ICAL_FEEDS is not valid JSON"] };
  }

  if (!Array.isArray(parsed)) return { feeds: [], errors: ["ICAL_FEEDS must be a JSON array"] };

  const feeds: FeedConfig[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  parsed.forEach((entry, index) => {
    const item = entry as Partial<Record<"key" | "url" | "who", unknown>> | null;
    const key = typeof item?.key === "string" ? item.key.trim() : "";
    const url = typeof item?.url === "string" ? item.url.trim() : "";
    const who = typeof item?.who === "string" ? item.who.trim() : "";

    if (!key) {
      errors.push(`ICAL_FEEDS[${index}] has no key`);
      return;
    }
    if (seen.has(key)) {
      errors.push(`ICAL_FEEDS[${index}] repeats key "${key}"`);
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      errors.push(`ICAL_FEEDS[${index}] ("${key}") needs an http(s) url`);
      return;
    }

    seen.add(key);
    // An unreadable `who` becomes 'both': blocking the pair is the cautious
    // reading, and a wrong 'inna' would quietly hand out Eugene's day.
    feeds.push({
      key,
      url,
      who: (WHO_VALUES as string[]).includes(who) ? (who as FeedWho) : "both",
    });
  });

  return { feeds, errors };
}

// ---------------------------------------------------------------------------
// Sync state
// ---------------------------------------------------------------------------

interface StatePatch {
  attemptedAt: string;
  ok: boolean;
  blocks: number;
  error?: string;
}

/**
 * Record the attempt. Updates first so an owner who disabled a feed keeps it
 * disabled; only a genuinely missing row gets inserted, with enabled = true.
 */
async function recordAttempt(
  supabase: ReturnType<typeof createAdminClient>,
  feedKey: string,
  patch: StatePatch
): Promise<void> {
  const now = new Date().toISOString();
  const fields = {
    last_attempt_at: patch.attemptedAt,
    last_error: patch.ok ? null : (patch.error ?? "unknown error"),
    updated_at: now,
    ...(patch.ok ? { last_success_at: now, blocks_synced: patch.blocks } : {}),
  };

  const { data, error } = await supabase
    .from("availability_sync_state")
    .update(fields)
    .eq("feed_key", feedKey)
    .select("feed_key");

  if (error) {
    console.error(`availability sync: could not record state for ${feedKey}`, error);
    return;
  }
  if (data && data.length > 0) return;

  const { error: insertError } = await supabase
    .from("availability_sync_state")
    .insert({ feed_key: feedKey, enabled: true, blocks_synced: 0, ...fields });

  if (insertError) {
    console.error(`availability sync: could not create state for ${feedKey}`, insertError);
  }
}

// ---------------------------------------------------------------------------
// One feed
// ---------------------------------------------------------------------------

interface DesiredRow {
  source: "ical";
  feed_key: string;
  source_ref: string;
  who: FeedWho;
  block_date: string;
  start_minute: number | null;
  end_minute: number | null;
  /** Always null. See the privacy note at the top of this file. */
  note: null;
}

interface ExistingRow {
  id: string;
  source_ref: string | null;
  who: FeedWho;
  block_date: string;
  start_minute: number | null;
  end_minute: number | null;
}

export async function syncIcalFeed(
  feedKey: string,
  url: string,
  who: FeedWho
): Promise<{ ok: boolean; blocks: number; error?: string }> {
  const supabase = createAdminClient();
  const attemptedAt = new Date().toISOString();

  const fail = async (error: string): Promise<{ ok: boolean; blocks: number; error: string }> => {
    await recordAttempt(supabase, feedKey, { attemptedAt, ok: false, blocks: 0, error });
    return { ok: false, blocks: 0, error };
  };

  const { data: settings } = await supabase
    .from("availability_settings")
    .select("horizon_days")
    .eq("id", true)
    .maybeSingle();

  const horizonDays = Number(settings?.horizon_days) || DEFAULT_HORIZON_DAYS;
  const fromDate = nowInSeattle().date;
  const toDate = addDays(fromDate, horizonDays);

  // --- fetch -------------------------------------------------------------
  let body: string;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
      cache: "no-store",
      headers: { accept: "text/calendar, text/plain;q=0.9, */*;q=0.8" },
    });

    if (!response.ok) return await fail(`HTTP ${response.status}`);

    body = await response.text();
    if (!body.trim()) return await fail("empty response body");
    // An expired share link answers with an HTML sign-in page. Parsing that
    // yields zero events, which would read as "the calendar is empty" and
    // delete every block. Refuse anything that is not a calendar.
    if (!body.includes("BEGIN:VCALENDAR")) return await fail("response is not an iCalendar document");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return await fail(`fetch failed: ${message}`);
  }

  // --- parse -------------------------------------------------------------
  let desired: Map<string, DesiredRow>;
  try {
    const { events, warnings } = parseIcs(body, { horizonDays, fromDate });

    for (const warning of warnings) console.warn(`availability sync [${feedKey}]: ${warning}`);
    for (const event of events) {
      if (event.complex) {
        console.warn(`availability sync [${feedKey}]: complex recurrence, first occurrence only (uid=${event.uid})`);
      }
    }

    desired = new Map(
      events.map((event) => {
        // A multi-day event yields one row per day, so the day belongs in the
        // ref. Map keying also collapses any duplicate the feed produced.
        const ref = `${event.uid}:${event.date}`;
        return [
          ref,
          {
            source: "ical" as const,
            feed_key: feedKey,
            source_ref: ref,
            who,
            block_date: event.date,
            start_minute: event.startMinute,
            end_minute: event.endMinute,
            note: null,
          },
        ];
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return await fail(`parse failed: ${message}`);
  }

  // --- diff against what is already stored --------------------------------
  //
  // Read, diff, write — not `.upsert({ onConflict })`. The unique index on
  // (feed_key, source_ref) is PARTIAL (`where source_ref is not null`), and
  // Postgres only infers a partial index as the ON CONFLICT arbiter when the
  // statement repeats the index predicate, which PostgREST cannot send. The
  // diff is needed anyway to know what to delete.
  const { data: storedData, error: readError } = await supabase
    .from("busy_blocks")
    .select("id, source_ref, who, block_date, start_minute, end_minute")
    .eq("feed_key", feedKey)
    .not("source_ref", "is", null)
    .gte("block_date", fromDate)
    .lte("block_date", toDate);

  if (readError) return await fail(`read failed: ${readError.message}`);

  const stored = new Map<string, ExistingRow>();
  for (const row of (storedData ?? []) as ExistingRow[]) {
    if (row.source_ref) stored.set(row.source_ref, row);
  }

  const toInsert: DesiredRow[] = [];
  const toUpdate: Array<{ id: string; row: DesiredRow }> = [];

  for (const [ref, row] of desired) {
    const previous = stored.get(ref);
    if (!previous) {
      toInsert.push(row);
    } else if (
      previous.block_date !== row.block_date ||
      previous.start_minute !== row.start_minute ||
      previous.end_minute !== row.end_minute ||
      previous.who !== row.who
    ) {
      toUpdate.push({ id: previous.id, row });
    }
  }

  // Delete by id, not by ref: a UID can carry characters PostgREST treats as
  // filter syntax, and ids keep the request short.
  const stale = [...stored.entries()].filter(([ref]) => !desired.has(ref)).map(([, row]) => row.id);

  // Writes before deletes. If this run dies halfway the calendar holds too
  // much busy time, never too little.
  for (let i = 0; i < toInsert.length; i += INSERT_CHUNK) {
    const { error } = await supabase.from("busy_blocks").insert(toInsert.slice(i, i + INSERT_CHUNK));
    if (error) return await fail(`insert failed: ${error.message}`);
  }

  const updatedAt = new Date().toISOString();
  for (const { id, row } of toUpdate) {
    const { error } = await supabase
      .from("busy_blocks")
      .update({
        who: row.who,
        block_date: row.block_date,
        start_minute: row.start_minute,
        end_minute: row.end_minute,
        note: null,
        updated_at: updatedAt,
      })
      .eq("id", id);

    if (error) return await fail(`update failed: ${error.message}`);
  }

  // Deletions are bounded by the synced window on both ends. Past visits stay
  // as history whatever the calendar says today.
  for (let i = 0; i < stale.length; i += DELETE_CHUNK) {
    const { error } = await supabase
      .from("busy_blocks")
      .delete()
      .eq("feed_key", feedKey)
      .in("id", stale.slice(i, i + DELETE_CHUNK))
      .gte("block_date", fromDate)
      .lte("block_date", toDate);

    if (error) return await fail(`delete failed: ${error.message}`);
  }

  await recordAttempt(supabase, feedKey, { attemptedAt, ok: true, blocks: desired.size });
  return { ok: true, blocks: desired.size };
}

// ---------------------------------------------------------------------------
// Every feed
// ---------------------------------------------------------------------------

export async function syncAllFeeds(): Promise<FeedSyncResult[]> {
  const { feeds, errors } = readFeedConfig();

  const results: FeedSyncResult[] = errors.map((error) => ({
    feedKey: ENV_FEED_KEY,
    ok: false,
    blocks: 0,
    error,
  }));

  // Sequential: two calendars, and a serial run keeps one feed's failure from
  // colouring another's.
  for (const feed of feeds) {
    try {
      const result = await syncIcalFeed(feed.key, feed.url, feed.who);
      results.push({ feedKey: feed.key, ...result });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`availability sync [${feed.key}] threw`, error);
      results.push({ feedKey: feed.key, ok: false, blocks: 0, error: message });
    }
  }

  return results;
}
