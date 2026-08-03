import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { syncAllFeeds } from "@/lib/availability/sync";
import { createAdminClient } from "@/lib/supabase/admin";

// Vercel Cron hits this every 15 minutes (see vercel.json). Nothing about the
// response may be cached — a cached "ok" would hide a feed that stopped.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function authorized(header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  // No secret means no way to tell Vercel Cron from anyone else. Refuse to run
  // rather than expose the sync unauthenticated.
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not set" }, { status: 503 });
  }

  if (!authorized(request.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Past this point the answer is always 200 with a per-feed verdict: a broken
  // feed is a fact to read, not an error to retry blindly.
  try {
    const feeds = await syncAllFeeds()

  // Inbound texts are working memory for a call in progress — they hold the
  // addresses and emails customers typed instead of spelling. Keeping them is
  // a liability with no upside, so they live for a day and then go.
  try {
    const supabase = createAdminClient();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from("inbound_sms").delete().lt("received_at", cutoff);
    if (error) console.warn("[cron] inbound_sms prune failed:", error.message);
  } catch (err) {
    console.warn("[cron] inbound_sms prune error:", err);
  };
    return NextResponse.json({
      ok: feeds.every((f) => f.ok),
      feeds,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("sync-availability cron failed", error);
    return NextResponse.json({
      ok: false,
      feeds: [],
      error: message,
      syncedAt: new Date().toISOString(),
    });
  }
}
