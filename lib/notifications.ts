import { Resend } from "resend";
import { SUPPORT_EMAIL, SITE_URL } from "@/lib/constants";

const ADMIN_TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SUPPORT_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

// --- SMS (Twilio) ---
// All SMS is env-gated: nothing sends until both creds AND a sender are set.
// US delivery requires an APPROVED A2P 10DLC campaign on the sender — until then
// leave the *_SMS_* sender vars unset so these no-op safely.
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
// Prefer an API Key (SK SID + secret) over the account Auth Token — revocable + scoped.
const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID || "";
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET || "";
// Basic-auth pair: API Key if present, else Account SID + Auth Token. The REST URL always uses the AC… account SID.
const TWILIO_AUTH_USER = TWILIO_API_KEY_SID || TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_PASS = TWILIO_API_KEY_SID ? TWILIO_API_KEY_SECRET : TWILIO_AUTH_TOKEN;
// Sender: prefer a Messaging Service SID (handles sender pool + A2P), fall back to a raw From number.
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || "";
const TWILIO_SMS_FROM = process.env.TWILIO_SMS_FROM || process.env.TWILIO_PHONE_NUMBER || "";
// Comma-separated E.164 numbers for owner alerts (Eugene, Inna).
const ADMIN_SMS_RECIPIENTS = (process.env.ADMIN_SMS_RECIPIENTS || "")
  .split(",")
  .map((n) => n.trim())
  .filter(Boolean);
// Master switch for customer-facing SMS (keep off until A2P campaign approved).
const CLIENT_SMS_ENABLED = process.env.CLIENT_SMS_ENABLED === "true";

function smsConfigured() {
  return Boolean(
    TWILIO_ACCOUNT_SID &&
      TWILIO_AUTH_USER &&
      TWILIO_AUTH_PASS &&
      (TWILIO_MESSAGING_SERVICE_SID || TWILIO_SMS_FROM)
  );
}

/** Send one SMS via Twilio REST. No-ops (warns) if unconfigured. Never throws. */
async function sendSms(to: string, body: string) {
  if (!smsConfigured()) {
    console.warn("[notify] SMS skipped: Twilio not configured");
    return;
  }
  if (!to) return;
  try {
    const params = new URLSearchParams();
    params.set("To", to);
    params.set("Body", body);
    if (TWILIO_MESSAGING_SERVICE_SID) {
      params.set("MessagingServiceSid", TWILIO_MESSAGING_SERVICE_SID);
    } else {
      params.set("From", TWILIO_SMS_FROM);
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
        body: params.toString(),
      }
    );
    if (!res.ok) {
      console.error("[notify] Twilio SMS error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[notify] Twilio SMS exception:", err);
  }
}

type BookingNotification = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  bedrooms: number | string;
  bathrooms: number | string;
  sqft_range?: string | null;
  condition?: string | null;
  address: string;
  city?: string;
  zip?: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  estimated_min: number;
  estimated_max: number;
  /** Regular only: per-visit price from visit two (regular table). estimated_* is the first visit (deep table). */
  recurring_min?: number | null;
  recurring_max?: number | null;
  special_requests?: string | null;
  addons?: string[];
};

type ApplicationNotification = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  hours_per_week: string;
  available_days: string[];
  service_areas: string[];
  has_experience?: boolean;
  years_experience?: number | null;
};

function fmtPrice(cents: number) {
  return `$${Math.round(cents / 100)}`;
}

async function sendTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !ADMIN_TELEGRAM_CHAT_ID) {
    console.warn("[notify] Telegram skipped: missing TELEGRAM_BOT_TOKEN or ADMIN_TELEGRAM_CHAT_ID");
    return;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[notify] Telegram error:", res.status, body);
    }
  } catch (err) {
    console.error("[notify] Telegram exception:", err);
  }
}

async function sendAdminEmail(subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("[notify] Resend skipped: missing RESEND_API_KEY");
    return;
  }
  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "CLEENLY Leads <noreply@cleenly.app>",
      to: ADMIN_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error("[notify] Resend exception:", err);
  }
}

export async function notifyNewBooking(b: BookingNotification) {
  const priceRange = `${fmtPrice(b.estimated_min)}-${fmtPrice(b.estimated_max)}`;
  const hasRecurring = b.recurring_min != null && b.recurring_max != null;
  const recurringRange = hasRecurring
    ? `${fmtPrice(b.recurring_min!)}-${fmtPrice(b.recurring_max!)}`
    : null;
  const schedule = b.preferred_date
    ? `${b.preferred_date}${b.preferred_time ? ` (${b.preferred_time})` : ""}`
    : "Not specified";
  const addons = b.addons && b.addons.length ? b.addons.join(", ") : "—";
  const home = `${b.bedrooms} bd / ${b.bathrooms} ba${b.sqft_range ? ` / ${b.sqft_range} sqft` : ""}${b.condition ? ` / ${b.condition}` : ""}`;

  const tg = [
    `<b>New booking — ${priceRange}</b>`,
    ``,
    `<b>${b.name}</b>`,
    `📞 ${b.phone}`,
    `✉️ ${b.email}`,
    ``,
    `<b>Service:</b> ${b.service_type}`,
    hasRecurring ? `<b>First visit (deep):</b> ${priceRange}` : "",
    hasRecurring ? `<b>From visit two:</b> ${recurringRange} per visit` : "",
    `<b>Home:</b> ${home}`,
    `<b>Address:</b> ${b.address}${b.city ? `, ${b.city}` : ""}${b.zip ? ` ${b.zip}` : ""}`,
    `<b>When:</b> ${schedule}`,
    `<b>Add-ons:</b> ${addons}`,
    b.special_requests ? `<b>Notes:</b> ${b.special_requests}` : "",
    ``,
    `<a href="${SITE_URL}/admin/bookings/${b.id}">Open in admin →</a>`,
  ]
    .filter(Boolean)
    .join("\n");

  const emailHtml = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px;">
      <h2 style="margin: 0 0 16px;">New booking — ${priceRange}</h2>
      <p style="margin: 0 0 8px;"><strong>${b.name}</strong></p>
      <p style="margin: 0 0 4px;">📞 <a href="tel:${b.phone}">${b.phone}</a></p>
      <p style="margin: 0 0 16px;">✉️ <a href="mailto:${b.email}">${b.email}</a></p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Service</td><td style="padding: 4px 0;">${b.service_type}</td></tr>
        ${hasRecurring ? `<tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">First visit (deep)</td><td style="padding: 4px 0;">${priceRange}</td></tr>` : ""}
        ${hasRecurring ? `<tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">From visit two</td><td style="padding: 4px 0;">${recurringRange} per visit</td></tr>` : ""}
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Home</td><td style="padding: 4px 0;">${home}</td></tr>
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Address</td><td style="padding: 4px 0;">${b.address}${b.city ? `, ${b.city}` : ""}${b.zip ? ` ${b.zip}` : ""}</td></tr>
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">When</td><td style="padding: 4px 0;">${schedule}</td></tr>
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Add-ons</td><td style="padding: 4px 0;">${addons}</td></tr>
        ${b.special_requests ? `<tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Notes</td><td style="padding: 4px 0;">${b.special_requests}</td></tr>` : ""}
      </table>
      <p style="margin: 24px 0 0;">
        <a href="${SITE_URL}/admin/bookings/${b.id}" style="background: #0a0a0a; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 4px;">Open in admin</a>
      </p>
    </div>
  `;

  // Owner SMS alert (Eugene + Inna) — short, links to admin. Env-gated.
  const smsLine = `New booking ${priceRange} — ${b.name}, ${b.bedrooms}bd/${b.bathrooms}ba, ${schedule}. ${b.phone}`;
  const adminSms = ADMIN_SMS_RECIPIENTS.map((to) => sendSms(to, smsLine));

  await Promise.allSettled([
    sendTelegram(tg),
    sendAdminEmail(`New booking: ${b.name} — ${priceRange}`, emailHtml),
    ...adminSms,
  ]);
}

/**
 * Customer-facing "request received" email. Honest request-flow language:
 * the booking is NOT confirmed yet — we confirm by email after review.
 */
export async function notifyCustomerBookingReceived(b: BookingNotification) {
  if (!RESEND_API_KEY) {
    console.warn("[notify] customer email skipped: missing RESEND_API_KEY");
    return;
  }
  const priceRange = `${fmtPrice(b.estimated_min)}–${fmtPrice(b.estimated_max)}`;
  const hasRecurring = b.recurring_min != null && b.recurring_max != null;
  const recurringRange = hasRecurring
    ? `${fmtPrice(b.recurring_min!)}–${fmtPrice(b.recurring_max!)}`
    : null;
  const firstName = b.name.trim().split(/\s+/)[0] || "there";
  const schedule = b.preferred_date
    ? `${b.preferred_date}${b.preferred_time ? `, ${b.preferred_time}` : ""}`
    : "—";
  const home = `${b.bedrooms} bd / ${b.bathrooms} ba`;

  const row = (label: string, value: string) =>
    `<tr><td style="padding: 6px 12px 6px 0; color: #8C8073; vertical-align: top;">${label}</td><td style="padding: 6px 0; color: #2D2826;">${value}</td></tr>`;

  const html = `
    <div style="font-family: -apple-system, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #2D2826; background: #FAFAF8; padding: 32px 24px;">
      <p style="margin: 0 0 16px; font-size: 16px;">Hi ${firstName},</p>
      <p style="margin: 0 0 16px; font-size: 16px;">We got your request. Here's what you sent us:</p>
      <table style="border-collapse: collapse; width: 100%; font-size: 15px; margin: 0 0 16px;">
        ${row("Service", b.service_type.replace(/_/g, "-"))}
        ${row("Home", home)}
        ${row("Address", `${b.address}${b.city ? `, ${b.city}` : ""}`)}
        ${row("Preferred time", schedule)}
        ${hasRecurring ? row("First visit (deep standard)", priceRange) : row("Estimate", priceRange)}
        ${hasRecurring && recurringRange ? row("From visit two", `${recurringRange} per visit`) : ""}
      </table>
      <p style="margin: 0 0 16px; font-size: 15px;">This is an estimate, not a final price. Your final price won't go above the top of this range without your OK — if your home needs more than described, we call before we start.</p>
      <p style="margin: 0 0 16px; font-size: 15px;">We'll confirm your time by email, usually within a couple of hours.</p>
      <p style="margin: 0 0 4px; font-size: 15px;">Questions? Just reply to this email, or call or text <a href="tel:+12066414739" style="color: #2D2826;">(206) 641-4739</a>.</p>
      <p style="margin: 24px 0 0; font-size: 15px;">— The CLEENLY team</p>
    </div>
  `;

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "CLEENLY <noreply@cleenly.app>",
      replyTo: SUPPORT_EMAIL,
      to: b.email,
      subject: "We got your cleaning request",
      html,
    });
  } catch (err) {
    console.error("[notify] customer email exception:", err);
  }
}

type CancellationNotification = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service_type: string;
  scheduled_date?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
};

export async function notifyBookingCancelled(b: CancellationNotification) {
  const when =
    b.scheduled_date || b.preferred_date
      ? `${b.scheduled_date || b.preferred_date}${b.preferred_time ? ` (${b.preferred_time})` : ""}`
      : "Not scheduled";

  const tg = [
    `<b>❌ Booking cancelled by customer</b>`,
    ``,
    `<b>${b.name}</b>`,
    b.phone ? `📞 ${b.phone}` : "",
    `✉️ ${b.email}`,
    ``,
    `<b>Service:</b> ${b.service_type}`,
    `<b>When:</b> ${when}`,
    ``,
    `<a href="${SITE_URL}/admin/bookings/${b.id}">Open in admin →</a>`,
  ]
    .filter(Boolean)
    .join("\n");

  const emailHtml = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px;">
      <h2 style="margin: 0 0 16px;">Booking cancelled by customer</h2>
      <p style="margin: 0 0 8px;"><strong>${b.name}</strong> — ${b.email}</p>
      <p style="margin: 0 0 4px;">Service: ${b.service_type}</p>
      <p style="margin: 0 0 16px;">When: ${when}</p>
      <p style="margin: 24px 0 0;">
        <a href="${SITE_URL}/admin/bookings/${b.id}" style="background: #0a0a0a; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 4px;">Open in admin</a>
      </p>
    </div>
  `;

  const smsLine = `Cancelled: ${b.name}, ${b.service_type}, ${when}`;
  const adminSms = ADMIN_SMS_RECIPIENTS.map((to) => sendSms(to, smsLine));

  await Promise.allSettled([
    sendTelegram(tg),
    sendAdminEmail(`Booking cancelled: ${b.name}`, emailHtml),
    ...adminSms,
  ]);
}

export async function notifyNewApplication(a: ApplicationNotification) {
  const tg = [
    `<b>New cleaner application</b>`,
    ``,
    `<b>${a.first_name} ${a.last_name}</b>`,
    `📞 ${a.phone}`,
    `✉️ ${a.email}`,
    ``,
    `<b>City:</b> ${a.city}`,
    `<b>Hours/wk:</b> ${a.hours_per_week}`,
    `<b>Days:</b> ${a.available_days.join(", ")}`,
    `<b>Areas:</b> ${a.service_areas.join(", ")}`,
    a.has_experience ? `<b>Experience:</b> ${a.years_experience ?? "yes"} yr` : `<b>Experience:</b> none`,
    ``,
    `<a href="${SITE_URL}/admin/applications/${a.id}">Open in admin →</a>`,
  ]
    .filter(Boolean)
    .join("\n");

  const emailHtml = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px;">
      <h2 style="margin: 0 0 16px;">New cleaner application</h2>
      <p style="margin: 0 0 8px;"><strong>${a.first_name} ${a.last_name}</strong></p>
      <p style="margin: 0 0 4px;">📞 <a href="tel:${a.phone}">${a.phone}</a></p>
      <p style="margin: 0 0 16px;">✉️ <a href="mailto:${a.email}">${a.email}</a></p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">City</td><td style="padding: 4px 0;">${a.city}</td></tr>
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Hours/wk</td><td style="padding: 4px 0;">${a.hours_per_week}</td></tr>
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Days</td><td style="padding: 4px 0;">${a.available_days.join(", ")}</td></tr>
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Areas</td><td style="padding: 4px 0;">${a.service_areas.join(", ")}</td></tr>
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Experience</td><td style="padding: 4px 0;">${a.has_experience ? `${a.years_experience ?? "yes"} yr` : "none"}</td></tr>
      </table>
      <p style="margin: 24px 0 0;">
        <a href="${SITE_URL}/admin/applications/${a.id}" style="background: #0a0a0a; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 4px;">Open in admin</a>
      </p>
    </div>
  `;

  await Promise.allSettled([
    sendTelegram(tg),
    sendAdminEmail(`New cleaner application: ${a.first_name} ${a.last_name}`, emailHtml),
  ]);
}
