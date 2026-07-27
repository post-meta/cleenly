/**
 * Customer-facing SMS copy.
 *
 * Rules these texts follow, set by the owner 2026-07-27:
 *   - booking confirmation and changes only, nothing else
 *   - no crew size, no duration estimate, no promises, no filler
 *   - one segment (under 160 GSM-7 characters) so a send costs one message
 *
 * Every text carries the opt-out line. Twilio Advanced Opt-Out handles the STOP
 * keyword itself; the line is what keeps the message compliant on its face.
 */

export const OPT_OUT_SUFFIX = "Reply STOP to opt out.";

/** "Tue, Jul 28" from a YYYY-MM-DD date string. Returns null on junk input. */
export function formatSmsDate(date?: string | null): string | null {
  if (!date) return null;
  // Parse as local calendar date: "2026-07-28" must not shift a day via UTC.
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  const parsed = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Time wording. Accepts either a slot ("morning" / "afternoon") or a clock time
 * ("10:00", "10:00:00"). Anything else is dropped rather than shown raw.
 */
export function formatSmsTime(time?: string | null): string | null {
  if (!time) return null;
  const value = time.trim().toLowerCase();
  if (value === "morning" || value === "afternoon") return value;

  const clock = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!clock) return null;
  const hour = Number(clock[1]);
  const minute = clock[2];
  if (hour > 23) return null;
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return minute === "00"
    ? `${display} ${suffix}`
    : `${display}:${minute} ${suffix}`;
}

/** "Tue, Jul 28 at 10 AM" / "Tue, Jul 28, morning" / "Tue, Jul 28" / null */
export function formatWhen(
  date?: string | null,
  time?: string | null
): string | null {
  const day = formatSmsDate(date);
  if (!day) return null;
  const when = formatSmsTime(time);
  if (!when) return day;
  return when === "morning" || when === "afternoon"
    ? `${day}, ${when}`
    : `${day} at ${when}`;
}

type BookingWhen = {
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
};

/** Scheduled date wins over the customer's preferred one once it exists. */
export function bookingWhen(b: BookingWhen): string | null {
  return (
    formatWhen(b.scheduled_date, b.scheduled_time) ??
    formatWhen(b.preferred_date, b.preferred_time)
  );
}

export const smsTemplates = {
  bookingReceived(when: string | null) {
    return when
      ? `CLEENLY: booking received for ${when}. ${OPT_OUT_SUFFIX}`
      : `CLEENLY: booking received. ${OPT_OUT_SUFFIX}`;
  },

  bookingConfirmed(when: string | null) {
    return when
      ? `CLEENLY: your cleaning is confirmed for ${when}. ${OPT_OUT_SUFFIX}`
      : `CLEENLY: your cleaning is confirmed. ${OPT_OUT_SUFFIX}`;
  },

  bookingRescheduled(when: string | null) {
    return when
      ? `CLEENLY: your cleaning is moved to ${when}. ${OPT_OUT_SUFFIX}`
      : `CLEENLY: your cleaning has a new date. ${OPT_OUT_SUFFIX}`;
  },

  bookingCancelled(when: string | null) {
    return when
      ? `CLEENLY: your cleaning for ${when} is cancelled. ${OPT_OUT_SUFFIX}`
      : `CLEENLY: your cleaning is cancelled. ${OPT_OUT_SUFFIX}`;
  },
} as const;

/**
 * GSM-7 segment count. Anything outside the GSM alphabet (curly quotes, dashes,
 * emoji) forces UCS-2 and cuts the segment to 70 characters, which is how a
 * one-segment text silently becomes a two-segment bill.
 */
const GSM7 =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM7_EXTENDED = "^{}\\[~]|€";

export function countSegments(body: string): number {
  let isGsm7 = true;
  let length = 0;

  for (const char of body) {
    if (GSM7.includes(char)) {
      length += 1;
    } else if (GSM7_EXTENDED.includes(char)) {
      length += 2; // escape + char
    } else {
      isGsm7 = false;
      break;
    }
  }

  if (!isGsm7) {
    const units = [...body].length;
    return units <= 70 ? 1 : Math.ceil(units / 67);
  }
  return length <= 160 ? 1 : Math.ceil(length / 153);
}
