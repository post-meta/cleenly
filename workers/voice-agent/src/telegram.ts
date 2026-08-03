import type { Env } from "./types";

const TELEGRAM_MAX_LENGTH = 3900; // hard limit is 4096; leave headroom

/**
 * Send a plain-text message to everyone on the alert list.
 *
 * ADMIN_TELEGRAM_CHAT_ID accepts a comma- or space-separated list, so adding a
 * second person is an environment change rather than a deploy. One recipient
 * failing does not stop the others.
 *
 * Long messages are split into sequential chunks. Never throws — Telegram being
 * down must not break a live phone call.
 */
export async function sendTelegram(env: Env, text: string): Promise<boolean> {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += TELEGRAM_MAX_LENGTH) {
    chunks.push(text.slice(i, i + TELEGRAM_MAX_LENGTH));
  }
  if (chunks.length === 0) chunks.push("(empty)");

  const chats = (env.ADMIN_TELEGRAM_CHAT_ID || "")
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);
  if (chats.length === 0) {
    console.error("Telegram skipped: ADMIN_TELEGRAM_CHAT_ID is empty");
    return false;
  }

  let ok = true;
  for (const chat_id of chats) {
    for (const chunk of chunks) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id, text: chunk }),
        });
        if (!res.ok) {
          console.error("Telegram sendMessage failed:", chat_id, res.status, await res.text().catch(() => ""));
          ok = false;
        }
      } catch (err) {
        console.error("Telegram sendMessage error:", chat_id, err);
        ok = false;
      }
    }
  }
  return ok;
}
