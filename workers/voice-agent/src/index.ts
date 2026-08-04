/**
 * CLEENLY voice agent — Cloudflare Worker.
 *
 * Routes:
 *   POST /voice         Twilio incoming-call webhook → TwiML <Connect><ConversationRelay>
 *                       (?fallback=1 → spoken apology; bind as the number's Voice fallback URL)
 *   GET  /relay         ConversationRelay WebSocket (one socket per call)
 *   POST /connect-done  <Connect action> callback when the relay session ends
 *   POST /sms           Inbound SMS webhook → forward to Eugene in Telegram
 *   GET  /ringback.wav  Ringback tone played by <Play> before the greeting
 *   GET  /health        Plain 200 for monitoring
 */
import { handleRelayUpgrade } from "./relay";
import { sendTelegram } from "./telegram";
import { storeInboundSms } from "./inbound";
import { bridgeCall } from "./grok";
import {
  connectRelayTwiml,
  fallbackTwiml,
  readFormParams,
  ringbackResponse,
  twimlResponse,
  validateTwilioSignature,
  escapeXml,
} from "./twilio";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case "/voice":
        return handleVoice(request, env, ctx, url);
      case "/relay":
        return handleRelayUpgrade(request, env, ctx);
      // Grok speech-to-speech, running alongside ConversationRelay. Which one
      // answers is decided by the Voice URL on the Twilio number, so switching
      // back is a field in a console rather than a deploy.
      case "/voice-grok":
        return handleVoiceGrok(request, env, url);
      case "/stream-grok":
        return handleStreamGrok(request, env);
      case "/connect-done":
        return handleConnectDone(request, env, ctx, url);
      case "/sms":
        return handleSms(request, env, ctx, url);
      case "/health":
        return new Response("ok");
      case "/ringback.wav":
        return ringbackResponse();
      default:
        return new Response("Not found", { status: 404 });
    }
  },
} satisfies ExportedHandler<Env>;

/** Validate X-Twilio-Signature; returns parsed form params or null (→ 403). */
async function verifiedParams(
  request: Request,
  env: Env,
  url: URL,
): Promise<Record<string, string> | null> {
  if (request.method !== "POST") return null;
  const params = await readFormParams(request);
  const ok = await validateTwilioSignature(
    env.TWILIO_AUTH_TOKEN,
    url.toString(),
    params,
    request.headers.get("X-Twilio-Signature"),
  );
  return ok ? params : null;
}

async function handleVoice(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL,
): Promise<Response> {
  const params = await verifiedParams(request, env, url);
  if (!params) return new Response("Forbidden", { status: 403 });

  // Voice *fallback* URL (Twilio calls it when the primary handler errored)
  // → spoken apology + heads-up to Eugene.
  if (url.searchParams.get("fallback") === "1") {
    ctx.waitUntil(
      sendTelegram(
        env,
        `⚠️ Voice agent fallback сработал: звонок от ${params.From ?? "unknown"} получил автоответ-извинение (основной обработчик упал).`,
      ),
    );
    return fallbackTwiml();
  }

  return connectRelayTwiml(url.host);
}

async function handleConnectDone(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL,
): Promise<Response> {
  const params = await verifiedParams(request, env, url);
  if (!params) return new Response("Forbidden", { status: 403 });

  // ConversationRelay reports how the session ended. On failure the call is
  // still live, so speak the apology instead of silently hanging up.
  // (Full transcript is sent from the WebSocket close handler.)
  const status = params.SessionStatus ?? "";
  if (status && status !== "completed") {
    ctx.waitUntil(
      sendTelegram(
        env,
        `⚠️ Voice agent: relay-сессия завершилась со статусом "${status}" (звонок от ${params.From ?? "unknown"}). Caller получил fallback-сообщение.`,
      ),
    );
    return fallbackTwiml();
  }

  return twimlResponse("<Hangup/>");
}

async function handleSms(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL,
): Promise<Response> {
  const params = await verifiedParams(request, env, url);
  if (!params) return new Response("Forbidden", { status: 403 });

  // STOP/HELP etc. are handled by Twilio Advanced Opt-Out before reaching us —
  // anything that lands here is a real message: forward it to Eugene.
  const from = params.From ?? "unknown";
  const body = (params.Body ?? "").trim();
  ctx.waitUntil(sendTelegram(env, `💬 SMS на номер Cleenly\nОт: ${from}\n———\n${body || "(пусто)"}`));

  // Also stash it, so a caller who is mid-conversation can type the thing the
  // line keeps mangling — a street name, an email — and the agent can read it
  // back correctly instead of guessing at a spelling.
  if (body) {
    ctx.waitUntil(storeInboundSms(env, from, body, params.MessageSid ?? params.SmsSid));
  }

  // Empty TwiML — no auto-reply; Eugene answers from his phone if needed.
  return twimlResponse("");
}

/** TwiML that hands the raw call audio to the Grok bridge. */
async function handleVoiceGrok(request: Request, env: Env, url: URL): Promise<Response> {
  const params = await verifiedParams(request, env, url);
  if (!params) return new Response("Forbidden", { status: 403 });

  const wsUrl = `wss://${url.host}/stream-grok`;
  // The caller's number is passed as a Stream parameter — a media stream
  // carries audio and nothing else, so anything the agent needs to know about
  // who is calling has to be declared here.
  const from = params.From ?? "";
  return twimlResponse(
    `<Connect>` +
      `<Stream url="${escapeXml(wsUrl)}">` +
      `<Parameter name="from" value="${escapeXml(from)}" />` +
      `</Stream>` +
      `</Connect>`,
  );
}

/** Twilio opens the media stream here. */
function handleStreamGrok(request: Request, env: Env): Response {
  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("Expected websocket", { status: 426 });
  }
  if (!env.XAI_API_KEY) {
    console.error("/stream-grok: XAI_API_KEY is not set");
    return new Response("Not configured", { status: 503 });
  }
  return bridgeCall(env, request);
}
