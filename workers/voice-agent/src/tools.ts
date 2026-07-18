import type { Env, ToolDefinition } from "./types";
import { sendTelegram } from "./telegram";

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
  // send_booking_link is DISABLED until the A2P 10DLC campaign is approved —
  // outbound SMS is carrier-filtered (error 30034) before then, so the agent
  // would promise a text that never arrives. The tool implementation and its
  // runTool case remain below; re-add this definition + the prompt lines once
  // A2P is live. Until then the agent reads the booking URL aloud instead.
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
    estimate_range: `$${match.estimated_min}-$${match.estimated_max}`,
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

async function escalate(env: Env, summary: string, callbackNumber: string): Promise<string> {
  const ok = await sendTelegram(
    env,
    `📞 Эскалация со звонка: ${summary}\nПерезвонить: ${callbackNumber}`,
  );
  if (!ok) {
    return "Could not reach Eugene automatically. Tell the caller to text this number or email hello@cleenly.app and someone will respond shortly.";
  }
  return "Eugene has been notified. Tell the caller: Eugene will call you back shortly.";
}

/** Execute a tool call; always returns a string for the tool_result block. */
export async function runTool(
  env: Env,
  name: string,
  input: Record<string, unknown>,
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
      case "escalate": {
        const summary = typeof input.summary === "string" ? input.summary : "(no summary)";
        const callback =
          typeof input.callback_number === "string" ? input.callback_number : "(unknown)";
        return { result: await escalate(env, summary, callback), isError: false };
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
