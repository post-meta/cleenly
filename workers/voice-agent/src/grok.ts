/**
 * Grok speech-to-speech bridge.
 *
 * The existing path is Twilio ConversationRelay + Haiku: transcribe, think,
 * synthesise. Three stages, and the seam between them is what makes a phone
 * agent sound like a phone agent. This replaces the three with one — Twilio
 * streams raw call audio in, Grok streams speech back, and this worker only
 * moves bytes between the two sockets.
 *
 * No transcoding happens here, and that is the whole reason it fits in a
 * Worker: Twilio sends μ-law 8 kHz and xAI accepts "audio/pcmu" at 8000, so
 * both directions are a base64 payload moved from one frame to another.
 *
 * It lives alongside ConversationRelay rather than replacing it. The Twilio
 * number decides which one answers, so going back is one field in a console,
 * not a deploy.
 */

import type { Env } from "./types";
import { TOOL_DEFINITIONS, runTool } from "./tools";
import { VOICE_SYSTEM_PROMPT, callerContext } from "./prompt";

// https, not wss: a Worker opens an outbound socket through fetch(), and
// fetch() only speaks http(s). The Upgrade header is what makes it a
// WebSocket; a wss:// URL here is simply rejected before it leaves.
const GROK_WS = "https://api.x.ai/v1/realtime?model=grok-voice-think-fast-2.0";

/** Said before the model gets a turn, so the caller never hears dead air. */
const GREETING = "Cleenly, this is the front desk. How can I help?";

interface TwilioStart {
  streamSid: string;
  callSid?: string;
  customParameters?: Record<string, string>;
}

/** Our tool definitions carry Anthropic's `input_schema`; xAI wants `parameters`. */
function toolsForGrok() {
  return TOOL_DEFINITIONS.map((t) => ({
    type: "function",
    name: t.name,
    description: t.description,
    parameters: t.input_schema,
  }));
}

function sessionUpdate(env: Env, from: string | undefined) {
  return {
    type: "session.update",
    session: {
      instructions: VOICE_SYSTEM_PROMPT + callerContext(from),
      voice: "eve",
      // Off by default in this API — without it the model never learns that the
      // caller has stopped talking and simply waits.
      turn_detection: {
        type: "server_vad",
        threshold: 0.5,
        silence_duration_ms: 600,
        prefix_padding_ms: 300,
      },
      audio: {
        input: { format: { type: "audio/pcmu", rate: 8000 }, transport: "json" },
        output: { format: { type: "audio/pcmu", rate: 8000 }, transport: "json" },
      },
      tools: toolsForGrok(),
    },
  };
}

/**
 * Wire one phone call to one Grok session.
 *
 * Returns the client half of the WebSocket pair for Twilio to hold.
 */
export function bridgeCall(env: Env, request: Request): Response {
  const pair = new WebSocketPair();
  const twilio = pair[1];
  twilio.accept();

  let grok: WebSocket | null = null;
  let streamSid = "";
  let from: string | undefined;
  // Queued because Twilio's first media frames can beat the Grok handshake.
  const pending: string[] = [];
  let grokReady = false;

  const toGrok = (msg: unknown) => {
    const text = JSON.stringify(msg);
    if (grokReady && grok) grok.send(text);
    else pending.push(text);
  };

  const openGrok = async () => {
    const res = await fetch(GROK_WS, {
      headers: {
        Upgrade: "websocket",
        Authorization: `Bearer ${env.XAI_API_KEY}`,
      },
    });
    const ws = res.webSocket;
    if (!ws) {
      console.error(
        "grok upgrade failed",
        res.status,
        JSON.stringify(Object.fromEntries(res.headers)),
        (await res.text().catch(() => "")).slice(0, 300)
      );
      twilio.close(1011, "upstream");
      return;
    }
    console.log("grok upgraded", res.status);
    ws.accept();
    grok = ws;

    ws.addEventListener("message", (ev) => {
      let e: Record<string, unknown>;
      try {
        e = JSON.parse(typeof ev.data === "string" ? ev.data : "");
      } catch {
        return;
      }
      const type = e.type as string;

      switch (type) {
        case "session.created":
          // Configure, then speak first. force_message is a scripted turn: it
          // is synthesised without asking the model for a response, so the
          // greeting cannot drift or be re-generated on every call.
          grokReady = true;
          ws.send(JSON.stringify(sessionUpdate(env, from)));
          for (const q of pending.splice(0)) ws.send(q);
          ws.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "force_message",
                role: "assistant",
                interruptible: true,
                content: [{ type: "output_text", text: GREETING }],
              },
            })
          );
          break;

        case "response.output_audio.delta":
          if (streamSid && typeof e.delta === "string") {
            twilio.send(
              JSON.stringify({ event: "media", streamSid, media: { payload: e.delta } })
            );
          }
          break;

        // The caller started talking over the agent. Twilio has already been
        // handed audio it has not played yet; without clearing it the agent
        // keeps talking for seconds after being interrupted.
        case "input_audio_buffer.speech_started":
        case "input_audio_buffer.committed":
          if (type === "input_audio_buffer.speech_started" && streamSid) {
            twilio.send(JSON.stringify({ event: "clear", streamSid }));
          }
          break;

        case "response.function_call_arguments.done": {
          const name = String(e.name ?? "");
          const callId = String(e.call_id ?? "");
          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(String(e.arguments ?? "{}"));
          } catch {
            /* a malformed argument blob is handled by the tool's own checks */
          }
          // Hanging up is the session's business, not a tool's.
          if (name === "end_call") {
            setTimeout(() => twilio.close(1000, "agent ended call"), 3000);
            return;
          }
          runTool(env, name, args)
            .then(({ result }) => {
              ws.send(
                JSON.stringify({
                  type: "conversation.item.create",
                  item: { type: "function_call_output", call_id: callId, output: result },
                })
              );
              ws.send(JSON.stringify({ type: "response.create" }));
            })
            .catch((err) => {
              console.error("tool failed", name, err);
              ws.send(
                JSON.stringify({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: callId,
                    output: "Tool failed. Apologise briefly and offer to escalate to Eugene.",
                  },
                })
              );
              ws.send(JSON.stringify({ type: "response.create" }));
            });
          break;
        }

        case "error":
          console.error("grok error", JSON.stringify(e.error).slice(0, 300));
          break;
      }
    });

    ws.addEventListener("close", () => twilio.close(1000, "upstream closed"));
    ws.addEventListener("error", (err) => {
      console.error("grok socket error", err);
      twilio.close(1011, "upstream error");
    });
  };

  twilio.addEventListener("message", (ev) => {
    let m: Record<string, unknown>;
    try {
      m = JSON.parse(typeof ev.data === "string" ? ev.data : "");
    } catch {
      return;
    }

    switch (m.event) {
      case "start": {
        const s = m.start as TwilioStart;
        streamSid = s.streamSid;
        from = s.customParameters?.from;
        console.log("twilio start", streamSid, from ?? "(no from)");
        openGrok().catch((err) => {
          console.error("grok open failed", String(err));
          twilio.close(1011, "upstream");
        });
        break;
      }
      case "media": {
        const payload = (m.media as { payload?: string } | undefined)?.payload;
        if (payload) toGrok({ type: "input_audio_buffer.append", audio: payload });
        break;
      }
      case "stop":
        grok?.close(1000, "call ended");
        break;
    }
  });

  twilio.addEventListener("close", () => grok?.close(1000, "twilio closed"));

  return new Response(null, { status: 101, webSocket: pair[0] });
}
