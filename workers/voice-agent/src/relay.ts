/**
 * Twilio ConversationRelay WebSocket session.
 *
 * Inbound (from Twilio):  setup / prompt / interrupt / dtmf / error
 * Outbound (to Twilio):   {"type":"text","token":"...","last":false|true}
 *                         — tokens are spoken by Twilio TTS as they arrive.
 *
 * One WebSocket = one phone call. Conversation history and transcript live
 * in this closure for the duration of the call. On close, the full transcript
 * goes to Eugene in Telegram.
 */
import { streamClaude } from "./anthropic";
import { VOICE_SYSTEM_PROMPT, callerContext } from "./prompt";
import { sendTelegram } from "./telegram";
import { TOOL_DEFINITIONS, runTool } from "./tools";
import type {
  Env,
  MessageParam,
  RelayInboundMessage,
  ToolUseBlock,
  TranscriptEntry,
  UserContentBlock,
} from "./types";

const MAX_TOOL_ITERATIONS = 4;
const MAX_TURNS = 60; // hard cap on history growth for very long calls

const SPOKEN_ERROR =
  "Sorry, I'm having trouble right now. Please text us at this number or email hello at cleenly dot app, and we'll get back to you shortly.";

export function handleRelayUpgrade(request: Request, env: Env, ctx: ExecutionContext): Response {
  if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket upgrade", { status: 426 });
  }

  const pair = new WebSocketPair();
  const client = pair[0];
  const server = pair[1];
  server.accept();

  new RelaySession(server, env, ctx);

  return new Response(null, { status: 101, webSocket: client });
}

class RelaySession {
  private readonly messages: MessageParam[] = [];
  private readonly transcript: TranscriptEntry[] = [];
  private callerNumber: string | undefined;
  private callSid: string | undefined;
  private startedAt = Date.now();
  private abort: AbortController | null = null;
  private transcriptSent = false;

  constructor(
    private readonly socket: WebSocket,
    private readonly env: Env,
    private readonly ctx: ExecutionContext,
  ) {
    socket.addEventListener("message", (event) => {
      try {
        const data = typeof event.data === "string" ? event.data : "";
        if (!data) return;
        this.onMessage(JSON.parse(data) as RelayInboundMessage);
      } catch (err) {
        console.error("Relay message handling failed:", err);
      }
    });

    socket.addEventListener("close", () => this.onClose());
    socket.addEventListener("error", (err) => {
      console.error("Relay socket error:", err);
      this.onClose();
    });
  }

  private onMessage(msg: RelayInboundMessage): void {
    switch (msg.type) {
      case "setup":
        this.callerNumber = msg.from;
        this.callSid = msg.callSid;
        this.startedAt = Date.now();
        break;

      case "prompt": {
        // Ignore partial transcriptions; act on the final utterance only.
        if (msg.last === false) break;
        const text = (msg.voicePrompt ?? "").trim();
        if (!text) break;
        this.transcript.push({ role: "caller", text });
        // Fire and keep the Worker alive until the turn finishes streaming.
        this.ctx.waitUntil(this.runTurn(text));
        break;
      }

      case "interrupt":
        // Caller spoke over the agent — stop generating immediately.
        this.abort?.abort();
        if (msg.utteranceUntilInterrupt) {
          this.transcript.push({ role: "system", text: "[caller interrupted the agent]" });
        }
        break;

      case "error":
        console.error("ConversationRelay error:", msg.description);
        this.transcript.push({ role: "system", text: `[relay error: ${msg.description ?? "?"}]` });
        break;

      case "dtmf":
        // No IVR menus on this line by design (emergency-vertical rule).
        break;
    }
  }

  /** One caller utterance → one (possibly multi-step, tool-using) agent turn. */
  private async runTurn(callerText: string): Promise<void> {
    // A new utterance supersedes any in-flight generation.
    this.abort?.abort();
    const abort = new AbortController();
    this.abort = abort;

    if (this.messages.length >= MAX_TURNS) {
      // Drop oldest exchange to bound memory on marathon calls.
      this.messages.splice(0, 2);
    }
    this.messages.push({ role: "user", content: callerText });

    const system = VOICE_SYSTEM_PROMPT + callerContext(this.callerNumber);

    try {
      for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
        const { content, stopReason } = await streamClaude(
          this.env,
          system,
          this.messages,
          TOOL_DEFINITIONS,
          abort.signal,
          (delta) => this.sendToken(delta, false),
        );

        this.messages.push({ role: "assistant", content });

        const spoken = content
          .filter((b): b is { type: "text"; text: string } => b.type === "text")
          .map((b) => b.text)
          .join("")
          .trim();
        if (spoken) this.transcript.push({ role: "agent", text: spoken });

        if (stopReason !== "tool_use") break;

        const toolUses = content.filter((b): b is ToolUseBlock => b.type === "tool_use");
        if (toolUses.length === 0) break;

        const results: UserContentBlock[] = [];
        for (const tu of toolUses) {
          const { result, isError } = await runTool(this.env, tu.name, tu.input);
          this.transcript.push({ role: "system", text: `[tool ${tu.name} → ${result.slice(0, 300)}]` });
          results.push({ type: "tool_result", tool_use_id: tu.id, content: result, is_error: isError });
        }
        this.messages.push({ role: "user", content: results });
      }

      this.sendToken("", true); // end of agent turn — Twilio resumes listening
    } catch (err) {
      if (abort.signal.aborted) return; // interrupted by the caller — expected
      console.error("Agent turn failed:", err);
      this.transcript.push({ role: "system", text: `[agent error: ${String(err).slice(0, 200)}]` });
      this.sendToken(SPOKEN_ERROR, true);
      this.ctx.waitUntil(
        sendTelegram(
          this.env,
          `⚠️ Voice agent: ошибка во время звонка от ${this.callerNumber ?? "unknown"}\n${String(err).slice(0, 500)}`,
        ),
      );
    } finally {
      if (this.abort === abort) this.abort = null;
    }
  }

  private sendToken(token: string, last: boolean): void {
    try {
      this.socket.send(JSON.stringify({ type: "text", token, last }));
    } catch {
      // Socket already closed — nothing to do.
    }
  }

  /** Call ended — ship the full transcript to Eugene. */
  private onClose(): void {
    if (this.transcriptSent) return;
    this.transcriptSent = true;
    this.abort?.abort();

    const durationSec = Math.round((Date.now() - this.startedAt) / 1000);
    const lines = this.transcript.map((e) => {
      const label = e.role === "caller" ? "Caller" : e.role === "agent" ? "Agent" : "·";
      return `${label}: ${e.text}`;
    });

    const text =
      `📞 Звонок завершён\n` +
      `От: ${this.callerNumber ?? "unknown"}\n` +
      `Длительность: ~${durationSec}s` +
      (this.callSid ? `\nCallSid: ${this.callSid}` : "") +
      `\n———\n` +
      (lines.length > 0 ? lines.join("\n") : "(пустой транскрипт — звонок без реплик)");

    this.ctx.waitUntil(sendTelegram(this.env, text));
  }
}
