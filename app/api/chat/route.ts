import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, looksLikeJailbreak, SCOPE_REFUSAL } from "@/lib/chat/system-prompt";

const MAX_INPUT_CHARS = 1000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_OUTPUT_TOKENS = 400;

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

function isValidMessage(m: unknown): m is ChatMessage {
    if (!m || typeof m !== "object") return false;
    const msg = m as Record<string, unknown>;
    return (
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string" &&
        msg.content.length > 0 &&
        msg.content.length <= MAX_INPUT_CHARS
    );
}

function refusalStream(text: string): Response {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, scope: "refused" })}\n\n`));
            controller.close();
        },
    });
    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}

export async function POST(request: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: "Chat is not configured." }),
            { status: 503, headers: { "Content-Type": "application/json" } },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid JSON" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    const payload = body as { messages?: unknown };
    if (!Array.isArray(payload.messages)) {
        return new Response(
            JSON.stringify({ error: "messages array required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    const messages = payload.messages.slice(-MAX_HISTORY_MESSAGES).filter(isValidMessage);
    if (messages.length === 0) {
        return new Response(
            JSON.stringify({ error: "No valid messages" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) {
        return new Response(
            JSON.stringify({ error: "Last message must be from user" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    if (looksLikeJailbreak(lastUser.content)) {
        return refusalStream(SCOPE_REFUSAL);
    }

    const client = new Anthropic({ apiKey });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const claudeStream = client.messages.stream({
                    model: "claude-haiku-4-5",
                    max_tokens: MAX_OUTPUT_TOKENS,
                    system: [
                        {
                            type: "text",
                            text: SYSTEM_PROMPT,
                            cache_control: { type: "ephemeral" },
                        },
                    ],
                    messages: messages.map(m => ({ role: m.role, content: m.content })),
                });

                for await (const event of claudeStream) {
                    if (
                        event.type === "content_block_delta" &&
                        event.delta.type === "text_delta"
                    ) {
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
                        );
                    }
                }

                const final = await claudeStream.finalMessage();
                const refused = final.content.some(
                    (b): b is Anthropic.TextBlock =>
                        b.type === "text" && b.text.trim().startsWith(SCOPE_REFUSAL),
                );

                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify({ done: true, scope: refused ? "refused" : "ok" })}\n\n`,
                    ),
                );
                controller.close();
            } catch (err) {
                const message =
                    err instanceof Anthropic.APIError
                        ? `Chat is temporarily unavailable. Try again in a moment.`
                        : `Something went wrong.`;
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`),
                );
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
        },
    });
}
