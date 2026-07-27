import type { NextRequest } from "next/server";

/**
 * First-touch campaign attribution.
 *
 * middleware.ts writes the `cleenly_attr` cookie on the first page of a visit
 * that carries UTM parameters. This reads it back at booking time.
 *
 * The cookie is client-visible and therefore forgeable. That is acceptable —
 * the worst case is a wrong label on a marketing report, and the columns are
 * never used for pricing, auth, or anything a visitor could profit from. What
 * is not acceptable is a malformed cookie taking down a booking, so every
 * failure path here returns {} instead of throwing.
 */

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "landing_path",
  "referrer",
] as const;

export type Attribution = Partial<Record<(typeof KEYS)[number], string>>;

export function readAttribution(request: NextRequest): Attribution {
  const raw = request.cookies.get("cleenly_attr")?.value;
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const out: Attribution = {};
    for (const key of KEYS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string" && value.length > 0) {
        out[key] = value.slice(0, 200);
      }
    }
    return out;
  } catch {
    return {};
  }
}
