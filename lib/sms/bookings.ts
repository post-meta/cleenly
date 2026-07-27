/**
 * Booking lifecycle SMS.
 *
 * Scope, set by the owner: the booking confirmation and any change to that
 * booking. Nothing else. No reminders, no arrival pings, no follow-ups.
 *
 * Consent gate: a transactional text only goes out when the booking carries
 * sms_opt_in = true, i.e. the customer ticked the isolated checkbox in the
 * wizard. A booking without it gets email only.
 */

import { sendCustomerSms, type SmsResult } from "./client";
import { bookingWhen, smsTemplates } from "./templates";

export type BookingSmsRow = {
  id: string;
  phone?: string | null;
  sms_opt_in?: boolean | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
};

export type BookingSmsEvent =
  | "booking_received"
  | "booking_confirmed"
  | "booking_rescheduled"
  | "booking_cancelled";

function bodyFor(event: BookingSmsEvent, when: string | null): string {
  switch (event) {
    case "booking_received":
      return smsTemplates.bookingReceived(when);
    case "booking_confirmed":
      return smsTemplates.bookingConfirmed(when);
    case "booking_rescheduled":
      return smsTemplates.bookingRescheduled(when);
    case "booking_cancelled":
      return smsTemplates.bookingCancelled(when);
  }
}

/**
 * Send one lifecycle message. Returns why it was skipped rather than throwing,
 * so callers can log without wrapping every call in try/catch.
 */
export async function sendBookingSms(
  booking: BookingSmsRow,
  event: BookingSmsEvent
): Promise<SmsResult> {
  if (!booking.sms_opt_in) {
    return { sent: false, reason: "no_sms_consent" };
  }

  const when = bookingWhen(booking);
  const body = bodyFor(event, when);

  const result = await sendCustomerSms({
    to: booking.phone,
    body,
    kind: event,
    bookingId: booking.id,
  });

  if (!result.sent && result.reason !== "client_sms_disabled") {
    console.warn(
      `[sms] ${event} not delivered for booking ${booking.id}: ${result.reason}${
        result.errorCode ? ` (${result.errorCode})` : ""
      }`
    );
  }

  return result;
}
