/**
 * Minimal streaming client for the Anthropic Messages API (raw fetch, no SDK —
 * keeps the Worker dependency-free). Parses SSE and surfaces text deltas as
 * they arrive so they can be forwarded to Twilio ConversationRelay tokens.
 */
import type { AssistantContentBlock, Env, MessageParam, ToolDefinition } from "./types";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

/** Fast + cheap; voice turns are short. Explicitly pinned per project decision. */
export const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 600; // voice replies are 1-3 sentences; tools need a bit of headroom

export interface ClaudeTurn {
  content: AssistantContentBlock[];
  stopReason: string | null;
}

interface SseEvent {
  type: string;
  index?: number;
  content_block?: { type: string; id?: string; name?: string; text?: string };
  delta?: {
    type?: string;
    text?: string;
    partial_json?: string;
    stop_reason?: string;
  };
  error?: { type?: string; message?: string };
}

/**
 * One streaming Messages API call.
 * `onText` fires for every text delta (forward to TTS immediately).
 */
export async function streamClaude(
  env: Env,
  system: string,
  messages: MessageParam[],
  tools: ToolDefinition[],
  signal: AbortSignal,
  onText: (delta: string) => void,
): Promise<ClaudeTurn> {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    signal,
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages,
      tools,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${body.slice(0, 500)}`);
  }

  const content: AssistantContentBlock[] = [];
  const partialJson = new Map<number, string>();
  let stopReason: string | null = null;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const handleEvent = (event: SseEvent): void => {
    switch (event.type) {
      case "content_block_start": {
        const block = event.content_block;
        const index = event.index ?? 0;
        if (!block) break;
        if (block.type === "text") {
          content[index] = { type: "text", text: block.text ?? "" };
        } else if (block.type === "tool_use") {
          content[index] = {
            type: "tool_use",
            id: block.id ?? "",
            name: block.name ?? "",
            input: {},
          };
          partialJson.set(index, "");
        }
        break;
      }
      case "content_block_delta": {
        const index = event.index ?? 0;
        const delta = event.delta;
        const block = content[index];
        if (!delta || !block) break;
        if (delta.type === "text_delta" && block.type === "text" && delta.text) {
          block.text += delta.text;
          onText(delta.text);
        } else if (delta.type === "input_json_delta" && block.type === "tool_use") {
          partialJson.set(index, (partialJson.get(index) ?? "") + (delta.partial_json ?? ""));
        }
        break;
      }
      case "content_block_stop": {
        const index = event.index ?? 0;
        const block = content[index];
        if (block?.type === "tool_use") {
          const raw = partialJson.get(index);
          if (raw) {
            try {
              block.input = JSON.parse(raw) as Record<string, unknown>;
            } catch {
              block.input = {};
            }
          }
        }
        break;
      }
      case "message_delta": {
        if (event.delta?.stop_reason) stopReason = event.delta.stop_reason;
        break;
      }
      case "error": {
        throw new Error(`Anthropic stream error: ${event.error?.message ?? "unknown"}`);
      }
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const chunk = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data) continue;
        handleEvent(JSON.parse(data) as SseEvent);
      }
    }
  }

  return { content: content.filter((b): b is AssistantContentBlock => Boolean(b)), stopReason };
}
