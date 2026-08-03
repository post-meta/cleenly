/**
 * Inbound texts as working memory for a live call.
 *
 * A phone line mangles exactly the fields that matter most — a street name, an
 * email. The first real booking went to "Fayetteville" instead of "Fairwood"
 * and nobody caught it, because reading a mishearing back confirms nothing.
 * Letting the caller type it removes the transcription step altogether.
 *
 * The voice session is a WebSocket and an inbound text is a separate HTTP
 * request, so they meet in Supabase rather than in memory.
 */

import type { Env } from "./types";
import { normalizePhone } from "./tools";

/** How long a text stays usable. Long enough to arrive, short enough that a
 *  previous call's address can never be picked up by the next one. */
const FRESH_MINUTES = 15;

export async function storeInboundSms(
  env: Env,
  rawFrom: string,
  body: string,
  messageSid?: string,
): Promise<void> {
  try {
    // on_conflict names the target so a webhook retry is ignored silently
    // rather than coming back 409 and logging an error every time.
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/inbound_sms?on_conflict=message_sid`, {
      method: "POST",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
        // A webhook retry must not create a second row.
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        from_phone: normalizePhone(rawFrom),
        raw_from: rawFrom,
        body: body.slice(0, 2000),
        message_sid: messageSid ?? null,
      }),
    });
    if (!res.ok) {
      console.error("inbound_sms insert failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("inbound_sms insert error:", err);
  }
}

interface InboundRow {
  id: string;
  body: string;
  received_at: string;
}

/**
 * Hand the agent the newest unread text from this caller.
 *
 * Marked consumed on read: the same message must not be reused later in the
 * call, and a text from an earlier call must never resurface in a new one.
 */
export async function readCallerText(env: Env, phoneRaw: string): Promise<string> {
  const last10 = normalizePhone(phoneRaw);
  if (last10.length < 10) {
    return "No usable caller number, so there is nothing to read. Ask the caller to say it instead.";
  }
  const since = new Date(Date.now() - FRESH_MINUTES * 60_000).toISOString();

  const url =
    `${env.SUPABASE_URL}/rest/v1/inbound_sms` +
    `?select=id,body,received_at&from_phone=eq.${last10}` +
    `&consumed_at=is.null&received_at=gte.${since}` +
    `&order=received_at.desc&limit=1`;

  let rows: InboundRow[];
  try {
    const res = await fetch(url, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (!res.ok) {
      console.error("inbound_sms read failed:", res.status);
      return "Could not check for a text just now. Ask the caller to say it out loud instead.";
    }
    rows = (await res.json()) as InboundRow[];
  } catch (err) {
    console.error("inbound_sms read error:", err);
    return "Could not check for a text just now. Ask the caller to say it out loud instead.";
  }

  if (rows.length === 0) {
    return "Nothing has arrived yet. Tell the caller you don't see it, ask them to send it to this same number, and wait for them to say it's sent before checking again.";
  }

  // Consume it so a second call to this tool does not return the same text.
  const row = rows[0];
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/inbound_sms?id=eq.${row.id}`, {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "content-type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ consumed_at: new Date().toISOString() }),
    });
  } catch {
    // Not fatal — worst case the same text is offered twice in one call.
  }

  return `The caller texted: "${row.body}". Read the parts you needed back to them to confirm, then carry on. Trust this over anything you thought you heard.`;
}
