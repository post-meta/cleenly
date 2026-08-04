/**
 * SMS agent — the text twin of the voice agent.
 *
 * An SMS webhook is a stateless HTTP request, so the conversation lives in
 * Supabase (`sms_agent_threads`), one row per customer number, storing the
 * Anthropic-format history verbatim — tool_use/tool_result blocks included, so
 * context like "which dates were offered" survives between messages.
 *
 * The webhook itself returns empty TwiML immediately; this module runs inside
 * ctx.waitUntil and replies through the Messaging Service REST API instead of
 * inline TwiML. That frees the agent loop (Claude turns + availability HTTP
 * round-trips) from Twilio's 15-second webhook timeout.
 *
 * Escalation flips the thread to 'human': from then on the agent stays silent
 * and inbound texts only land in Telegram — the AI must never talk over Eugene
 * mid-conversation. A thread quiet for 48h resets to a fresh agent conversation.
 */
import { streamClaude } from "./anthropic";
import { SMS_SYSTEM_PROMPT, smsContext } from "./prompt-sms";
import { sendTelegram } from "./telegram";
import { TOOL_DEFINITIONS, normalizePhone, runTool } from "./tools";
import { sendSms } from "./twilio";
import type {
  AssistantContentBlock,
  Env,
  MessageParam,
  ToolUseBlock,
  UserContentBlock,
} from "./types";

const MAX_TOOL_ITERATIONS = 4;
/** Quiet gap after which the thread resets to a fresh conversation. */
const WINDOW_MS = 48 * 60 * 60 * 1000;
/** Agent replies per window per number — a runaway texter gets a human, not a bill. */
const MAX_TURNS_PER_WINDOW = 40;
/** History cap; trimmed from the front without orphaning tool_result blocks. */
const MAX_HISTORY = 60;
/** Hard cap on one outbound SMS (≈4 segments). The prompt asks for ≤300. */
const MAX_REPLY_CHARS = 640;

const FALLBACK_REPLY =
  "Thanks for your message! We'll get back to you shortly. — Cleenly";

// The text channel drops the voice-only tools: read_caller_text is meaningless
// (the customer is already typing into this conversation) and end_call has no
// line to hang up — the agent simply stops replying.
const SMS_TOOLS = TOOL_DEFINITIONS.filter(
  (t) => t.name !== "read_caller_text" && t.name !== "end_call",
);

interface ThreadRow {
  id: string;
  phone: string;
  messages: MessageParam[];
  status: "agent" | "human";
  escalated_at: string | null;
  seen_sids: string[];
  turn_count: number;
  updated_at: string;
}

function supaHeaders(env: Env): Record<string, string> {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "content-type": "application/json",
  };
}

async function loadThread(env: Env, phone: string): Promise<ThreadRow | null> {
  const url =
    `${env.SUPABASE_URL}/rest/v1/sms_agent_threads` +
    `?select=id,phone,messages,status,escalated_at,seen_sids,turn_count,updated_at` +
    `&phone=eq.${phone}&limit=1`;
  const res = await fetch(url, { headers: supaHeaders(env) });
  if (!res.ok) {
    console.error("sms thread load failed:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const rows = (await res.json()) as ThreadRow[];
  return rows[0] ?? null;
}

async function saveThread(
  env: Env,
  phone: string,
  patch: Partial<ThreadRow> & { messages: MessageParam[] },
): Promise<void> {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/sms_agent_threads?on_conflict=phone`,
    {
      method: "POST",
      headers: {
        ...supaHeaders(env),
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        phone,
        ...patch,
        updated_at: new Date().toISOString(),
      }),
    },
  );
  if (!res.ok) {
    console.error("sms thread save failed:", res.status, await res.text().catch(() => ""));
  }
}

/**
 * Trim history from the front, then drop any leading entries that would leave
 * a tool_result without its tool_use (the API rejects an orphaned pair).
 */
function trimHistory(messages: MessageParam[]): MessageParam[] {
  const out = messages.slice(Math.max(0, messages.length - MAX_HISTORY));
  while (out.length > 0) {
    const first = out[0];
    if (first.role === "user" && typeof first.content === "string") break;
    out.shift();
  }
  return out;
}

/** One inbound SMS → agent turn → outbound SMS. Runs inside ctx.waitUntil. */
export async function runSmsAgent(
  env: Env,
  rawFrom: string,
  body: string,
  messageSid: string | undefined,
): Promise<void> {
  const phone = normalizePhone(rawFrom);
  if (phone.length < 10) return;

  try {
    const row = await loadThread(env, phone);

    // Webhook retry — this exact message is already in the thread.
    if (messageSid && row?.seen_sids?.includes(messageSid)) return;

    const fresh = !row || Date.now() - Date.parse(row.updated_at) > WINDOW_MS;
    let messages: MessageParam[] = fresh ? [] : row?.messages ?? [];
    let status: "agent" | "human" = fresh ? "agent" : row?.status ?? "agent";
    let turnCount = fresh ? 0 : row?.turn_count ?? 0;
    const seenSids = (fresh ? [] : row?.seen_sids ?? []).slice(-49);
    if (messageSid) seenSids.push(messageSid);

    messages.push({ role: "user", content: body });

    // Escalated thread: Eugene owns it. Keep the transcript, stay silent.
    if (status === "human") {
      await saveThread(env, phone, {
        messages: trimHistory(messages),
        seen_sids: seenSids,
        status,
        turn_count: turnCount,
      });
      return;
    }

    // Runaway conversation: hand it to a human once, then stay silent.
    if (turnCount >= MAX_TURNS_PER_WINDOW) {
      await saveThread(env, phone, {
        messages: trimHistory(messages),
        seen_sids: seenSids,
        status: "human",
        escalated_at: new Date().toISOString(),
        turn_count: turnCount,
      });
      await sendTelegram(
        env,
        `⚠️ SMS-агент: переписка с ${rawFrom} превысила ${MAX_TURNS_PER_WINDOW} ходов и переведена на человека.`,
      );
      return;
    }

    const system = SMS_SYSTEM_PROMPT + smsContext(rawFrom);
    const abort = new AbortController();
    const texts: string[] = [];
    let escalated = false;

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const { content, stopReason } = await streamClaude(
        env,
        system,
        messages,
        SMS_TOOLS,
        abort.signal,
        () => {}, // SMS has no token stream — the reply ships whole
      );

      messages.push({ role: "assistant", content });

      for (const block of content) {
        if (block.type === "text" && block.text.trim()) texts.push(block.text.trim());
      }

      if (stopReason !== "tool_use") break;
      const toolUses = content.filter((b): b is ToolUseBlock => b.type === "tool_use");
      if (toolUses.length === 0) break;

      const results: UserContentBlock[] = [];
      for (const tu of toolUses) {
        const { result, isError } = await runTool(env, tu.name, tu.input, undefined, "sms");
        if (tu.name === "escalate" && !isError) escalated = true;
        results.push({ type: "tool_result", tool_use_id: tu.id, content: result, is_error: isError });
      }
      messages.push({ role: "user", content: results });
    }

    // The prompt tells the model to answer spam with an empty message — an
    // empty reply is intentional silence, not a failure.
    const reply = texts.join(" ").trim().slice(0, MAX_REPLY_CHARS);
    let delivered = false;
    if (reply) delivered = await sendSms(env, rawFrom, reply);

    await saveThread(env, phone, {
      messages: trimHistory(messages),
      seen_sids: seenSids,
      status: escalated ? "human" : "agent",
      ...(escalated ? { escalated_at: new Date().toISOString() } : {}),
      turn_count: turnCount + 1,
    });

    if (reply) {
      await sendTelegram(
        env,
        `🤖 SMS-агент → ${rawFrom}${delivered ? "" : " (ОТПРАВКА НЕ ПРОШЛА)"}${escalated ? " [эскалировано]" : ""}\n———\n${reply}`,
      );
    } else {
      await sendTelegram(env, `🤖 SMS-агент промолчал на сообщение от ${rawFrom} (расценил как спам/автотекст).`);
    }
  } catch (err) {
    console.error("sms agent turn failed:", err);
    await sendSms(env, rawFrom, FALLBACK_REPLY);
    await sendTelegram(
      env,
      `⚠️ SMS-агент упал на сообщении от ${rawFrom} — клиенту ушёл фолбэк «ответим вскоре».\n${String(err).slice(0, 400)}`,
    );
  }
}

/**
 * True when this number is on a live phone call with us right now — the caller
 * is mid-conversation with the voice agent and may be texting a street name or
 * an email for read_caller_text. The SMS agent must not butt in.
 */
export async function hasActiveCall(env: Env, from: string): Promise<boolean> {
  try {
    const url =
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Calls.json` +
      `?From=${encodeURIComponent(from)}&Status=in-progress&PageSize=1`;
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) return false; // fail open: a missed guard beats a mute agent
    const data = (await res.json()) as { calls?: unknown[] };
    return (data.calls?.length ?? 0) > 0;
  } catch {
    return false;
  }
}
