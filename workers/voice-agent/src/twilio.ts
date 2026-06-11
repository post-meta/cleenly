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

/** Main voice TwiML: connect the call to the ConversationRelay WebSocket. */
export function connectRelayTwiml(host: string): Response {
  const wsUrl = `wss://${host}/relay`;
  const actionUrl = `https://${host}/connect-done`;
  return twimlResponse(
    `<Connect action="${escapeXml(actionUrl)}">` +
      `<ConversationRelay url="${escapeXml(wsUrl)}" welcomeGreeting="${escapeXml(WELCOME_GREETING)}" />` +
      `</Connect>`,
  );
}

/** Spoken apology when the relay / model is unavailable. */
export function fallbackTwiml(): Response {
  return twimlResponse(`<Say>${escapeXml(FALLBACK_MESSAGE)}</Say><Hangup/>`);
}
