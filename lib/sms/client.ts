/**
 * Customer-facing SMS delivery.
 *
 * Everything customer-facing goes through sendCustomerSms so that consent,
 * opt-out and logging happen in exactly one place. Owner alerts stay in
 * lib/notifications.ts and deliberately skip these checks: they go to us.
 *
 * Delivery is gated by CLIENT_SMS_ENABLED. The A2P 10DLC campaign was approved
 * 2026-07-27 (CBBQJO6), so US delivery works; the flag stays as the kill switch.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { countSegments } from "./templates";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID || "";
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_AUTH_USER = TWILIO_API_KEY_SID || TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_PASS = TWILIO_API_KEY_SID
  ? TWILIO_API_KEY_SECRET
  : TWILIO_AUTH_TOKEN;
const TWILIO_MESSAGING_SERVICE_SID =
  process.env.TWILIO_MESSAGING_SERVICE_SID || "";
const TWILIO_SMS_FROM =
  process.env.TWILIO_SMS_FROM || process.env.TWILIO_PHONE_NUMBER || "";

/** Kill switch. Set CLIENT_SMS_ENABLED=true in the environment to send. */
export const clientSmsEnabled = () => process.env.CLIENT_SMS_ENABLED === "true";

export type SmsKind =
  | "booking_received"
  | "booking_confirmed"
  | "booking_rescheduled"
  | "booking_cancelled"
  | "marketing";

export type SmsResult =
  | { sent: true; sid: string; segments: number }
  | { sent: false; reason: string; errorCode?: string };

/** Twilio rejects a send to a number that replied STOP with this code. */
const UNSUBSCRIBED_ERROR = "21610";

function smsConfigured() {
  return Boolean(
    TWILIO_ACCOUNT_SID &&
      TWILIO_AUTH_USER &&
      TWILIO_AUTH_PASS &&
      (TWILIO_MESSAGING_SERVICE_SID || TWILIO_SMS_FROM)
  );
}

/**
 * US numbers to E.164. Stored phones come from a free-text field, so they look
 * like "(206) 641-4739", "206-641-4739" or "+12066414739" in the same column.
 * Returns null when the input cannot be trusted as a US mobile number.
 */
export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (/^\+1\d{10}$/.test(trimmed)) return trimmed;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  // Other country codes: pass through only if the caller already wrote E.164.
  if (/^\+\d{8,15}$/.test(trimmed)) return trimmed;
  return null;
}

async function isOptedOut(phone: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("sms_opt_outs")
      .select("phone")
      .eq("phone", phone)
      .maybeSingle();
    return Boolean(data);
  } catch (err) {
    // A lookup failure must not block a transactional message the customer
    // asked for. Twilio still refuses the send if they are unsubscribed.
    console.warn("[sms] opt-out lookup failed:", err);
    return false;
  }
}

async function recordOptOut(phone: string) {
  try {
    const supabase = createAdminClient();
    await supabase
      .from("sms_opt_outs")
      .upsert({ phone, source: "twilio_21610" }, { onConflict: "phone" });
  } catch (err) {
    console.warn("[sms] opt-out write failed:", err);
  }
}

async function logSms(row: {
  phone: string;
  kind: SmsKind;
  body: string;
  segments: number;
  bookingId?: string | null;
  twilioSid?: string | null;
  status?: string | null;
  errorCode?: string | null;
}) {
  try {
    const supabase = createAdminClient();
    await supabase.from("sms_log").insert({
      phone: row.phone,
      kind: row.kind,
      body: row.body,
      segments: row.segments,
      booking_id: row.bookingId ?? null,
      twilio_sid: row.twilioSid ?? null,
      status: row.status ?? null,
      error_code: row.errorCode ?? null,
    });
  } catch (err) {
    console.warn("[sms] log write failed:", err);
  }
}

/**
 * Send one customer-facing SMS. Never throws: a failed text must not fail the
 * booking that triggered it. Consent is the caller's responsibility for
 * transactional sends (see sendBookingSms) and enforced here for marketing.
 */
export async function sendCustomerSms(params: {
  to: string | null | undefined;
  body: string;
  kind: SmsKind;
  bookingId?: string | null;
}): Promise<SmsResult> {
  const { body, kind, bookingId } = params;

  if (!clientSmsEnabled()) {
    return { sent: false, reason: "client_sms_disabled" };
  }
  if (!smsConfigured()) {
    console.warn("[sms] skipped: Twilio not configured");
    return { sent: false, reason: "not_configured" };
  }

  const to = normalizePhone(params.to);
  if (!to) {
    return { sent: false, reason: "invalid_phone" };
  }
  if (await isOptedOut(to)) {
    return { sent: false, reason: "opted_out" };
  }

  const segments = countSegments(body);

  try {
    const form = new URLSearchParams();
    form.set("To", to);
    form.set("Body", body);
    if (TWILIO_MESSAGING_SERVICE_SID) {
      form.set("MessagingServiceSid", TWILIO_MESSAGING_SERVICE_SID);
    } else {
      form.set("From", TWILIO_SMS_FROM);
    }

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${TWILIO_AUTH_USER}:${TWILIO_AUTH_PASS}`).toString(
              "base64"
            ),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      }
    );

    const payload = (await res.json().catch(() => ({}))) as {
      sid?: string;
      status?: string;
      code?: number;
      message?: string;
    };

    if (!res.ok) {
      const errorCode = payload.code ? String(payload.code) : String(res.status);
      console.error("[sms] Twilio rejected:", errorCode, payload.message);
      if (errorCode === UNSUBSCRIBED_ERROR) await recordOptOut(to);
      await logSms({
        phone: to,
        kind,
        body,
        segments,
        bookingId,
        status: "failed",
        errorCode,
      });
      return { sent: false, reason: "twilio_error", errorCode };
    }

    await logSms({
      phone: to,
      kind,
      body,
      segments,
      bookingId,
      twilioSid: payload.sid,
      status: payload.status ?? "accepted",
    });

    return { sent: true, sid: payload.sid ?? "", segments };
  } catch (err) {
    console.error("[sms] send exception:", err);
    await logSms({
      phone: to,
      kind,
      body,
      segments,
      bookingId,
      status: "exception",
    });
    return { sent: false, reason: "exception" };
  }
}

/** Marketing messages this phone already received in the current calendar month. */
export async function marketingSentThisMonth(phone: string): Promise<number> {
  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("sms_log")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .eq("kind", "marketing")
      .gte("created_at", monthStart);
    return count ?? 0;
  } catch (err) {
    // Fail closed: if we cannot prove we are under the cap, do not send.
    console.warn("[sms] marketing cap lookup failed:", err);
    return Number.MAX_SAFE_INTEGER;
  }
}
