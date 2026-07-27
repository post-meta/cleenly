/**
 * Promotional SMS to existing customers.
 *
 * Consent model, per the registered A2P campaign:
 *   - marketing needs its own opt-in, separate from the booking-notification one
 *   - no more than 2 promotional messages per phone per calendar month
 *   - every message carries the opt-out line
 *
 * Audience is existing customers only: a phone qualifies through a booking it
 * left behind, never through a bare form fill.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import {
  marketingSentThisMonth,
  normalizePhone,
  sendCustomerSms,
} from "./client";
import { countSegments, OPT_OUT_SUFFIX } from "./templates";

/** Campaign-registered ceiling. Raising this needs the campaign updated first. */
export const MARKETING_MONTHLY_CAP = 2;

export type AudienceMember = {
  phone: string;
  name: string | null;
  lastBookingAt: string | null;
  sentThisMonth: number;
};

/**
 * Everyone eligible for a promo right now.
 *
 * Consent comes from two places on purpose: bookings.marketing_sms_opt_in is the
 * queryable flag going forward, consent_log holds the rows written before that
 * column existed. Dropping the log would silently shrink the audience to
 * post-migration customers only.
 */
export async function getMarketingAudience(): Promise<AudienceMember[]> {
  const supabase = createAdminClient();

  const [bookingsRes, consentRes, optOutRes] = await Promise.all([
    supabase
      .from("bookings")
      .select("phone, name, created_at, marketing_sms_opt_in")
      .order("created_at", { ascending: false }),
    supabase
      .from("consent_log")
      .select("phone")
      .eq("consent_type", "marketing_sms"),
    supabase.from("sms_opt_outs").select("phone"),
  ]);

  const optedOut = new Set(
    (optOutRes.data ?? [])
      .map((row) => normalizePhone(row.phone as string))
      .filter((p): p is string => Boolean(p))
  );

  const consentedPhones = new Set(
    (consentRes.data ?? [])
      .map((row) => normalizePhone(row.phone as string))
      .filter((p): p is string => Boolean(p))
  );

  const byPhone = new Map<string, AudienceMember>();

  for (const row of bookingsRes.data ?? []) {
    const phone = normalizePhone(row.phone as string | null);
    if (!phone || optedOut.has(phone)) continue;

    const consented =
      (row as { marketing_sms_opt_in?: boolean }).marketing_sms_opt_in === true ||
      consentedPhones.has(phone);
    if (!consented) continue;

    // Bookings arrive newest-first, so the first row wins as "latest".
    if (!byPhone.has(phone)) {
      byPhone.set(phone, {
        phone,
        name: (row.name as string | null) ?? null,
        lastBookingAt: (row.created_at as string | null) ?? null,
        sentThisMonth: 0,
      });
    }
  }

  const audience = [...byPhone.values()];

  // Per-phone monthly usage, so the UI can show who is already capped.
  await Promise.all(
    audience.map(async (member) => {
      member.sentThisMonth = await marketingSentThisMonth(member.phone);
    })
  );

  return audience.sort((a, b) =>
    (b.lastBookingAt ?? "").localeCompare(a.lastBookingAt ?? "")
  );
}

export type BlastResult = {
  attempted: number;
  sent: number;
  skippedCapped: number;
  failed: number;
  segments: number;
  errors: { phone: string; reason: string }[];
};

/** Appends the opt-out line unless the author already wrote one. */
export function withOptOut(body: string): string {
  const trimmed = body.trim();
  return /reply\s+stop/i.test(trimmed)
    ? trimmed
    : `${trimmed} ${OPT_OUT_SUFFIX}`;
}

/**
 * Send one promo to the whole eligible audience.
 * Sequential on purpose: a few dozen recipients, and one shared Twilio queue.
 */
export async function sendMarketingBlast(rawBody: string): Promise<BlastResult> {
  const body = withOptOut(rawBody);
  const segments = countSegments(body);
  const audience = await getMarketingAudience();

  const result: BlastResult = {
    attempted: audience.length,
    sent: 0,
    skippedCapped: 0,
    failed: 0,
    segments,
    errors: [],
  };

  for (const member of audience) {
    if (member.sentThisMonth >= MARKETING_MONTHLY_CAP) {
      result.skippedCapped += 1;
      continue;
    }

    const outcome = await sendCustomerSms({
      to: member.phone,
      body,
      kind: "marketing",
    });

    if (outcome.sent) {
      result.sent += 1;
    } else {
      result.failed += 1;
      result.errors.push({
        phone: member.phone,
        reason: outcome.errorCode
          ? `${outcome.reason} (${outcome.errorCode})`
          : outcome.reason,
      });
    }
  }

  return result;
}

/** Recent promo sends, newest first, for the admin history panel. */
export async function getMarketingHistory(limit = 20) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("sms_log")
    .select("id, phone, body, status, error_code, segments, created_at")
    .eq("kind", "marketing")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
