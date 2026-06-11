// A2P 10DLC consent texts — single source of truth.
// These exact strings render in the booking wizard (step-contact.tsx)
// AND are written verbatim to consent_log by app/api/bookings/route.ts.
// If you edit the wording, both the UI and the logged evidence update together.
// Do NOT edit retroactively in the DB — past rows must reflect what users actually saw.

export const TRANSACTIONAL_SMS_CONSENT_TEXT =
  "I agree to receive SMS notifications about my booking from CLEENLY. Message and data rates may apply. Reply STOP to unsubscribe.";

export const MARKETING_SMS_CONSENT_TEXT =
  "Send me occasional offers and seasonal cleaning tips by text (optional). Msg & data rates may apply. Reply STOP to unsubscribe.";
