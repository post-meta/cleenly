import type { Env } from "./types";

const TELEGRAM_MAX_LENGTH = 3900; // hard limit is 4096; leave headroom

/**
 * Send a plain-text message to Eugene's Telegram chat.
 * Long messages are split into sequential chunks. Never throws —
 * Telegram being down must not break a live phone call.
 */
export async function sendTelegram(env: Env, text: string): Promise<boolean> {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += TELEGRAM_MAX_LENGTH) {
    chunks.push(text.slice(i, i + TELEGRAM_MAX_LENGTH));
  }
  if (chunks.length === 0) chunks.push("(empty)");

  let ok = true;
  for (const chunk of chunks) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: env.ADMIN_TELEGRAM_CHAT_ID,
          text: chunk,
        }),
      });
      if (!res.ok) {
        console.error("Telegram sendMessage failed:", res.status, await res.text().catch(() => ""));
        ok = false;
      }
    } catch (err) {
      console.error("Telegram sendMessage error:", err);
      ok = false;
    }
  }
  return ok;
}
