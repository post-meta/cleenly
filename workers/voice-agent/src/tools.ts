import type { Env, ToolDefinition } from "./types";
import { sendTelegram } from "./telegram";
import { checkAvailability, createBooking } from "./booking";
import { readCallerText } from "./inbound";

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "lookup_booking",
    description:
      "Look up the caller's most recent Cleenly booking by phone number. " +
      "Call this when the caller asks about their booking status, scheduled date, or price estimate. " +
      "Use the caller's own phone number from the call context unless they explicitly give a different one.",
    input_schema: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description: "Phone number to look up, any format (digits are normalized).",
        },
      },
      required: ["phone"],
    },
  },
  {
    name: "escalate",
    description:
      "Notify Eugene, the owner, that this call needs a human follow-up. " +
      "Call this for refunds, payment disputes, complaints, upset callers, anything you cannot answer, " +
      "or when the caller asks for a human. After calling it, tell the caller that Eugene will call them back shortly.",
    input_schema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "One or two sentences: who is calling and what they need.",
        },
        callback_number: {
          type: "string",
          description: "Number Eugene should call back — usually the caller's number from the call context.",
        },
      },
      required: ["summary", "callback_number"],
    },
  },
  // Booking-link delivery is DORMANT — the agent reads the URL aloud to new
  // callers (product decision: wait for SMS). SMS (send_booking_link) is
  // blocked by A2P 10DLC vetting (error 30034); email (email_booking_link)
  // works but spoken emails transcribe poorly. Both implementations + their
  // runTool cases stay below; re-enable SMS as the primary once A2P verifies.
  {
    name: "check_availability",
    description:
      "Find out which days and time slots the crew can actually take for this job. " +
      "Call this as soon as you know the service, bedrooms and bathrooms — before you promise any date. " +
      "Never guess availability and never invent a date; this tool is the only source. " +
      "Pass wanted_date only when the caller named a specific day.",
    input_schema: {
      type: "object",
      properties: {
        service_type: { type: "string", description: "One of: regular, deep, move_out, move_in." },
        bedrooms: { type: "string", description: "One of: studio, 1, 2, 3, 4, 5+." },
        bathrooms: { type: "string", description: "One of: 1, 1.5, 2, 2.5, 3, 3.5+." },
        condition: { type: "string", description: "One of: clean, average, needs_work. Default average." },
        sqft_range: { type: "string", description: "One of: under_800, 800_1200, 1200_1800, 1800_2500, 2500_3500, over_3500, not_sure." },
        wanted_date: { type: "string", description: "YYYY-MM-DD, only if the caller asked for a specific day." },
      },
      required: ["service_type", "bedrooms", "bathrooms"],
    },
  },
  {
    name: "create_booking",
    description:
      "Place the booking. Only call this after check_availability returned the day you are booking, " +
      "and after you have read the address and the email back to the caller and they confirmed both. " +
      "Everything here is written to the real calendar and emails the customer, so never call it with a guess.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Caller's full name." },
        phone: { type: "string", description: "Callback number — use the one from the call context unless they give another." },
        email: { type: "string", description: "Email, confirmed by reading it back letter by letter." },
        address: { type: "string", description: "Street address including unit, confirmed by reading it back." },
        city: { type: "string", description: "City name, e.g. Tacoma." },
        service_type: { type: "string", description: "One of: regular, deep, move_out, move_in." },
        bedrooms: { type: "string", description: "One of: studio, 1, 2, 3, 4, 5+." },
        bathrooms: { type: "string", description: "One of: 1, 1.5, 2, 2.5, 3, 3.5+." },
        condition: { type: "string", description: "One of: clean, average, needs_work." },
        sqft_range: { type: "string", description: "One of: under_800, 800_1200, 1200_1800, 1800_2500, 2500_3500, over_3500, not_sure." },
        date: { type: "string", description: "YYYY-MM-DD, taken from check_availability." },
        time_slot: { type: "string", description: "One of: morning, afternoon, full_day — taken from check_availability." },
        notes: { type: "string", description: "Anything the caller asked for: pets, parking, entry instructions." },
      },
      required: ["name", "phone", "email", "address", "city", "service_type", "bedrooms", "bathrooms", "date", "time_slot"],
    },
  },
  {
    name: "read_caller_text",
    description:
      "Read a text the caller just sent to this same number. Use it whenever a detail is hard to catch — " +
      "the street name, the email, an unusual surname. Ask them to text it, wait for them to say they have sent it, " +
      "then call this. What it returns is more reliable than anything you heard, so prefer it over your own transcription.",
    input_schema: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description: "The caller's number from the call context.",
        },
      },
      required: ["phone"],
    },
  },
  {
    name: "end_call",
    description:
      "Hang up the phone call. Use this when: the caller is abusive, threatening, or trolling; " +
      "the caller stays off-topic after you have redirected them once; the call is an obvious " +
      "robocall, spam, or dead air with no real request; or the conversation is genuinely finished " +
      "(the caller said goodbye or 'that's all'). Say one short closing line BEFORE calling this. " +
      "Never use it while the caller still has a real cleaning question.",
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Short reason, one of: done, off_topic, abuse, spam.",
        },
      },
      required: ["reason"],
    },
  },
];

/** Keep only digits, then take the last 10 (US numbers). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.slice(-10);
}

interface BookingRow {
  phone: string | null;
  name: string | null;
  service_type: string;
  city: string;
  preferred_date: string | null;
  preferred_time: string | null;
  estimated_min: number;
  estimated_max: number;
  status: string;
  created_at: string;
}

/**
 * Query the latest booking for a phone number via Supabase REST.
 * Stored phone formats vary, so we pre-filter on the last 4 digits with
 * `like`, then verify the full last-10-digit match in the Worker.
 */
async function lookupBooking(env: Env, phoneRaw: string): Promise<string> {
  const last10 = normalizePhone(phoneRaw);
  if (last10.length < 10) {
    return "Invalid phone number — ask the caller to repeat it digit by digit.";
  }
  const last4 = last10.slice(-4);

  const url =
    `${env.SUPABASE_URL}/rest/v1/bookings` +
    `?select=phone,name,service_type,city,preferred_date,preferred_time,estimated_min,estimated_max,status,created_at` +
    `&phone=like.*${last4}` +
    `&order=created_at.desc&limit=25`;

  const res = await fetch(url, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) {
    console.error("Supabase lookup failed:", res.status, await res.text().catch(() => ""));
    return "Booking lookup is unavailable right now. Offer to escalate to Eugene instead.";
  }

  const rows = (await res.json()) as BookingRow[];
  const match = rows.find((r) => r.phone && normalizePhone(r.phone) === last10);
  if (!match) {
    return "No booking found for that phone number. The caller may have booked with a different number or email — offer to escalate to Eugene.";
  }

  return JSON.stringify({
    name: match.name,
    service: match.service_type,
    city: match.city,
    scheduled_date: match.preferred_date ?? "not set yet",
    time_slot: match.preferred_time ?? "not set yet",
    estimate_range: `$${Math.round(match.estimated_min / 100)}-$${Math.round(match.estimated_max / 100)}`,
    status: match.status,
    booked_on: match.created_at,
  });
}

const BOOKING_URL = "https://cleenly.app/book";
const BOOKING_SMS_BODY =
  `CLEENLY: Here's your link to see your cleaning estimate and pick a time — ${BOOKING_URL}. ` +
  `Questions? Just reply. Reply STOP to opt out.`;

/** Text the caller the booking link via the Twilio Messaging Service. */
async function sendBookingLink(env: Env, phoneRaw: string): Promise<string> {
  const last10 = normalizePhone(phoneRaw);
  if (last10.length < 10) {
    return "That number looks incomplete — ask the caller to confirm the number to text.";
  }
  const to = `+1${last10}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: to,
      MessagingServiceSid: env.TWILIO_MESSAGING_SERVICE_SID,
      Body: BOOKING_SMS_BODY,
    }),
  });

  if (!res.ok) {
    console.error("Booking-link SMS failed:", res.status, await res.text().catch(() => ""));
    return "Could not send the text right now. Offer to escalate to Eugene, or tell the caller they can also book at cleenly dot app slash book.";
  }
  return `Booking link texted to ${to}. Tell the caller: I just texted you the link — tap it to see your estimate and pick a time.`;
}

const BOOKING_EMAIL_SUBJECT = "Your Cleenly booking link";

function bookingEmailHtml(): string {
  return `<div style="font-family:-apple-system,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#2D2826;padding:24px;">
    <p style="font-size:16px;margin:0 0 16px;">Thanks for calling Cleenly!</p>
    <p style="font-size:15px;margin:0 0 20px;">Here's your link to see your cleaning estimate and pick a time:</p>
    <p style="margin:0 0 24px;"><a href="${BOOKING_URL}" style="background:#D97757;color:#FAFAF8;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:15px;display:inline-block;">See my estimate &amp; book</a></p>
    <p style="font-size:14px;color:#8C8073;margin:0;">Or open ${BOOKING_URL}. Questions? Reply here, or call or text (206) 641-4739.</p>
  </div>`;
}

/** Email the caller the booking link via Resend. No A2P gate (unlike SMS). */
async function sendBookingLinkEmail(env: Env, emailRaw: string): Promise<string> {
  const email = emailRaw.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "That email doesn't look complete — ask the caller to spell it out again, letter by letter.";
  }
  if (!env.RESEND_API_KEY) {
    return "Email isn't configured right now. Read the booking address aloud instead: cleenly dot app slash book.";
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: "CLEENLY <noreply@cleenly.app>",
      to: [email],
      reply_to: "hello@cleenly.app",
      subject: BOOKING_EMAIL_SUBJECT,
      html: bookingEmailHtml(),
    }),
  });
  if (!res.ok) {
    console.error("Booking-link email failed:", res.status, await res.text().catch(() => ""));
    return "Could not send the email right now. Read the booking address aloud instead — cleenly dot app slash book — or offer to escalate to Eugene.";
  }
  return `Booking link emailed to ${email}. Tell the caller: I just emailed you the link — check your inbox, and your spam folder, for a message from Cleenly.`;
}

async function escalate(
  env: Env,
  summary: string,
  callbackNumber: string,
  channel: "voice" | "sms",
): Promise<string> {
  const header =
    channel === "sms"
      ? `💬 Эскалация из SMS-переписки: ${summary}\nОтветить: ${callbackNumber}`
      : `📞 Эскалация со звонка: ${summary}\nПерезвонить: ${callbackNumber}`;
  const ok = await sendTelegram(env, header);
  if (!ok) {
    return "Could not reach Eugene automatically. Tell the customer to email hello@cleenly.app and someone will respond shortly.";
  }
  return "Eugene has been notified. Tell the customer Eugene will follow up shortly (adjust for working hours per the context).";
}

/** Execute a tool call; always returns a string for the tool_result block. */
export async function runTool(
  env: Env,
  name: string,
  input: Record<string, unknown>,
  /** Dates check_availability already offered on this call, if any. */
  offeredDates?: Set<string>,
  /** Which channel is talking — bookings and escalations are tagged with it. */
  channel: "voice" | "sms" = "voice",
): Promise<{ result: string; isError: boolean }> {
  try {
    switch (name) {
      case "lookup_booking": {
        const phone = typeof input.phone === "string" ? input.phone : "";
        return { result: await lookupBooking(env, phone), isError: false };
      }
      case "send_booking_link": {
        const phone = typeof input.phone === "string" ? input.phone : "";
        return { result: await sendBookingLink(env, phone), isError: false };
      }
      case "email_booking_link": {
        const email = typeof input.email === "string" ? input.email : "";
        return { result: await sendBookingLinkEmail(env, email), isError: false };
      }
      case "check_availability": {
        const job = {
          service_type: String(input.service_type ?? ""),
          bedrooms: String(input.bedrooms ?? ""),
          bathrooms: String(input.bathrooms ?? ""),
          condition: input.condition ? String(input.condition) : undefined,
          sqft_range: input.sqft_range ? String(input.sqft_range) : undefined,
        };
        const wanted = typeof input.wanted_date === "string" ? input.wanted_date : undefined;
        return { result: await checkAvailability(env, job, wanted), isError: false };
      }
      case "create_booking": {
        const req = ["name", "phone", "email", "address", "city", "service_type", "bedrooms", "bathrooms", "date", "time_slot"];
        const missing = req.filter((k) => !input[k] || String(input[k]).trim() === "");
        if (missing.length) {
          return {
            result: `Still missing: ${missing.join(", ")}. Ask the caller for those before booking.`,
            isError: true,
          };
        }
        return {
          result: await createBooking(env, {
            name: String(input.name), phone: String(input.phone), email: String(input.email),
            address: String(input.address), city: String(input.city),
            service_type: String(input.service_type), bedrooms: String(input.bedrooms),
            bathrooms: String(input.bathrooms),
            condition: input.condition ? String(input.condition) : undefined,
            sqft_range: input.sqft_range ? String(input.sqft_range) : undefined,
            date: String(input.date), time_slot: String(input.time_slot),
            notes: input.notes ? String(input.notes) : undefined,
          }, offeredDates?.has(String(input.date)) ?? false, channel),
          isError: false,
        };
      }
      case "read_caller_text": {
        const phone = typeof input.phone === "string" ? input.phone : "";
        return { result: await readCallerText(env, phone), isError: false };
      }
      case "escalate": {
        const summary = typeof input.summary === "string" ? input.summary : "(no summary)";
        const callback =
          typeof input.callback_number === "string" ? input.callback_number : "(unknown)";
        return { result: await escalate(env, summary, callback, channel), isError: false };
      }
      case "end_call":
        // Handled by the relay session (it hangs up); this is a defensive
        // fallback so a stray call never surfaces as an "unknown tool".
        return { result: "Ending the call.", isError: false };
      default:
        return { result: `Unknown tool: ${name}`, isError: true };
    }
  } catch (err) {
    console.error(`Tool ${name} failed:`, err);
    return {
      result: "Tool failed. Apologize briefly and offer to escalate to Eugene.",
      isError: true,
    };
  }
}
