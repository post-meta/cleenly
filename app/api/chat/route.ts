import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, looksLikeJailbreak, SCOPE_REFUSAL } from "@/lib/chat/system-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_INPUT_CHARS = 1000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_OUTPUT_TOKENS = 400;

// Per-IP rate limit (in-memory; lives only within a single serverless instance,
// so abuse can spread across cold starts. For production-grade limiting move to
// Upstash / Vercel KV. This catches casual spam without external deps.)
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 20;
type Bucket = { count: number; resetAt: number };
const ipBuckets = new Map<string, Bucket>();

function getClientIp(request: NextRequest): string {
    const fwd = request.headers.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    const real = request.headers.get("x-real-ip");
    if (real) return real;
    return "unknown";
}

function rateLimitExceeded(ip: string): boolean {
    const now = Date.now();
    const bucket = ipBuckets.get(ip);
    if (!bucket || now > bucket.resetAt) {
        ipBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    bucket.count += 1;
    return bucket.count > RATE_MAX_REQUESTS;
}

const ALLOWED_ORIGIN_HOSTS = new Set([
    "cleenly.app",
    "www.cleenly.app",
    "getcleenly.com",
    "localhost:3000",
]);

function originAllowed(request: NextRequest): boolean {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const candidate = origin ?? referer;
    if (!candidate) return false;
    try {
        const host = new URL(candidate).host;
        if (ALLOWED_ORIGIN_HOSTS.has(host)) return true;
        // Vercel preview URLs e.g. cleenly-xxxx-postmeta.vercel.app
        if (/^cleenly-[a-z0-9-]+-postmeta\.vercel\.app$/.test(host)) return true;
        return false;
    } catch {
        return false;
    }
}

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

function jsonError(message: string, status: number): Response {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
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
    if (!originAllowed(request)) {
        return jsonError("Forbidden", 403);
    }

    const ip = getClientIp(request);
    if (rateLimitExceeded(ip)) {
        return jsonError("Too many requests. Please slow down.", 429);
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return jsonError("Chat is not configured.", 503);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return jsonError("Invalid JSON", 400);
    }

    const payload = body as { messages?: unknown };
    if (!Array.isArray(payload.messages)) {
        return jsonError("messages array required", 400);
    }

    const messages = payload.messages.slice(-MAX_HISTORY_MESSAGES).filter(isValidMessage);
    if (messages.length === 0) {
        return jsonError("No valid messages", 400);
    }

    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) {
        return jsonError("Last message must be from user", 400);
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
                // Log error for ops without leaking the request body
                console.error("[chat] stream error:", err instanceof Error ? err.message : "unknown");
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
