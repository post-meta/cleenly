/**
 * Twilio helpers: X-Twilio-Signature validation + TwiML builders.
 * Raw WebCrypto — no dependencies.
 */

/**
 * Validate X-Twilio-Signature for an application/x-www-form-urlencoded POST.
 * Algorithm: Base64(HMAC-SHA1(authToken, url + concat(sortedKey + value))).
 * https://www.twilio.com/docs/usage/security#validating-requests
 */
export async function validateTwilioSignature(
  authToken: string,
  url: string,
  params: Record<string, string>,
  signature: string | null,
): Promise<boolean> {
  if (!signature) return false;

  let data = url;
  for (const key of Object.keys(params).sort()) {
    data += key + params[key];
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(authToken),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const expected = base64(new Uint8Array(mac));

  return timingSafeEqual(expected, signature);
}

function base64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Read form params from a Twilio webhook POST. */
export async function readFormParams(request: Request): Promise<Record<string, string>> {
  const form = await request.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") params[key] = value;
  }
  return params;
}

// ---------------------------------------------------------------------------
// TwiML
// ---------------------------------------------------------------------------

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function twimlResponse(body: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>${body}</Response>`, {
    headers: { "content-type": "text/xml; charset=utf-8" },
  });
}

export const WELCOME_GREETING = "Thanks for calling Cleenly! How can I help?";

export const FALLBACK_MESSAGE =
  "Sorry, our phone assistant is not available right now. " +
  "Please text us at this number, or email hello at cleenly dot app, and we will get back to you shortly.";

/** Main voice TwiML: ring for a beat, then connect to the ConversationRelay WebSocket. */
export function connectRelayTwiml(host: string): Response {
  const wsUrl = `wss://${host}/relay`;
  const actionUrl = `https://${host}/connect-done`;
  const ringbackUrl = `https://${host}/ringback.wav`;
  // <Play> the ringback first so an answered call rings briefly before the
  // agent greets — feels like a person picking up, not an instant robot.
  return twimlResponse(
    `<Play>${escapeXml(ringbackUrl)}</Play>` +
      `<Connect action="${escapeXml(actionUrl)}">` +
      `<ConversationRelay url="${escapeXml(wsUrl)}" welcomeGreeting="${escapeXml(WELCOME_GREETING)}" />` +
      `</Connect>`,
  );
}

// ---------------------------------------------------------------------------
// Ringback tone — synthesized once per isolate (US ringback: 440 + 480 Hz,
// one ring + a short beat), served at GET /ringback.wav for <Play>.
// ---------------------------------------------------------------------------

let ringbackCache: Uint8Array | null = null;

function buildRingbackWav(): Uint8Array {
  const rate = 8000; // telephony sample rate
  const segments: Array<{ tone: boolean; seconds: number }> = [
    { tone: true, seconds: 2.0 }, // one ring
    { tone: false, seconds: 1.0 }, // short beat before the agent greets
  ];
  let totalSamples = 0;
  for (const s of segments) totalSamples += Math.floor(s.seconds * rate);

  const dataBytes = totalSamples * 2;
  const buf = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buf);
  const writeStr = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, "data");
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (const s of segments) {
    const n = Math.floor(s.seconds * rate);
    for (let i = 0; i < n; i++) {
      let sample = 0;
      if (s.tone) {
        const a = Math.sin((2 * Math.PI * 440 * i) / rate);
        const b = Math.sin((2 * Math.PI * 480 * i) / rate);
        sample = ((a + b) / 2) * 0.6;
      }
      view.setInt16(offset, Math.round(sample * 32767), true);
      offset += 2;
    }
  }
  return new Uint8Array(buf);
}

/** GET /ringback.wav — the ringback tone played before the greeting. */
export function ringbackResponse(): Response {
  if (!ringbackCache) ringbackCache = buildRingbackWav();
  return new Response(ringbackCache, {
    headers: { "content-type": "audio/wav", "cache-control": "public, max-age=86400" },
  });
}

/** Spoken apology when the relay / model is unavailable. */
export function fallbackTwiml(): Response {
  return twimlResponse(`<Say>${escapeXml(FALLBACK_MESSAGE)}</Say><Hangup/>`);
}
