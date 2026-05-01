import { Resend } from "resend";
import { SUPPORT_EMAIL, SITE_URL } from "@/lib/constants";

const ADMIN_TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SUPPORT_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

type BookingNotification = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  bedrooms: number | string;
  bathrooms: number | string;
  address: string;
  city?: string;
  zip?: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  estimated_min: number;
  estimated_max: number;
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
  const schedule = b.preferred_date
    ? `${b.preferred_date}${b.preferred_time ? ` (${b.preferred_time})` : ""}`
    : "Not specified";
  const addons = b.addons && b.addons.length ? b.addons.join(", ") : "—";

  const tg = [
    `<b>New booking — ${priceRange}</b>`,
    ``,
    `<b>${b.name}</b>`,
    `📞 ${b.phone}`,
    `✉️ ${b.email}`,
    ``,
    `<b>Service:</b> ${b.service_type}`,
    `<b>Home:</b> ${b.bedrooms} bd / ${b.bathrooms} ba`,
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
        <tr><td style="padding: 4px 8px 4px 0; color: #6b7280;">Home</td><td style="padding: 4px 0;">${b.bedrooms} bd / ${b.bathrooms} ba</td></tr>
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

  await Promise.allSettled([
    sendTelegram(tg),
    sendAdminEmail(`New booking: ${b.name} — ${priceRange}`, emailHtml),
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
