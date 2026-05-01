// Dynamic Number Insertion (DNI).
// Returns the phone number to display on a page based on city slug.
// Until additional Twilio numbers are purchased, every city falls back
// to the central 206 number — switching to area-code-matched numbers is
// a one-line edit per area-code group below.
//
// To activate per-area-code numbers:
//   1. Buy 425 (Eastside) and 253 (South Sound) numbers in Twilio.
//   2. Set TWILIO_PHONE_425_E164 and TWILIO_PHONE_253_E164 env vars.
//   3. The helper picks them up automatically on next deploy.

import { PHONE_E164, PHONE_DISPLAY } from "@/lib/constants";

export interface DniPhone {
  e164: string;
  display: string;
  telHref: string;
  smsHref: string;
}

const CENTRAL_206: DniPhone = {
  e164: PHONE_E164,
  display: PHONE_DISPLAY,
  telHref: `tel:${PHONE_E164}`,
  smsHref: `sms:${PHONE_E164}`,
};

const EASTSIDE = ["bellevue", "redmond", "kirkland", "sammamish", "mercer-island", "medina", "clyde-hill", "issaquah", "bothell", "woodinville"];
const SOUTH_SOUND = ["tacoma", "lakewood", "federal-way", "kent", "auburn", "renton"];

function buildPhoneFromEnv(envKey: string): DniPhone | null {
  const e164 = process.env[envKey];
  if (!e164) return null;
  const display = formatDisplay(e164);
  return {
    e164,
    display,
    telHref: `tel:${e164}`,
    smsHref: `sms:${e164}`,
  };
}

function formatDisplay(e164: string): string {
  // Expects +1XXXYYYZZZZ → "(XXX) YYY-ZZZZ"
  const digits = e164.replace(/\D/g, "");
  if (digits.length !== 11 || !digits.startsWith("1")) return e164;
  return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
}

export function getPhoneByCity(citySlug?: string): DniPhone {
  if (!citySlug) return CENTRAL_206;

  if (EASTSIDE.includes(citySlug)) {
    return buildPhoneFromEnv("TWILIO_PHONE_425_E164") ?? CENTRAL_206;
  }
  if (SOUTH_SOUND.includes(citySlug)) {
    return buildPhoneFromEnv("TWILIO_PHONE_253_E164") ?? CENTRAL_206;
  }
  return CENTRAL_206;
}
