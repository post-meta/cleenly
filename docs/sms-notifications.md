# Customer SMS

A2P 10DLC campaign `CBBQJO6` was approved 2026-07-27. Delivery works; the
`CLIENT_SMS_ENABLED` env var is the kill switch and must be `true` to send.

## What sends, and when

Scope is deliberately narrow: the booking confirmation and changes to that
booking. No reminders, no arrival pings, no follow-ups, no crew size, no
duration estimate, no promises.

| Event | Trigger | Text |
|---|---|---|
| `booking_received` | `POST /api/bookings` | `CLEENLY: booking received for Tue, Jul 28, morning. Reply STOP to opt out.` |
| `booking_confirmed` | admin sets status `confirmed` | `CLEENLY: your cleaning is confirmed for Tue, Jul 28 at 10 AM. …` |
| `booking_rescheduled` | `updateBooking` changes `scheduled_date` or `scheduled_time` | `CLEENLY: your cleaning is moved to Fri, Aug 1 at 1 PM. …` |
| `booking_cancelled` | customer cancels, or admin sets status `cancelled` | `CLEENLY: your cleaning for Tue, Jul 28 is cancelled. …` |

Every text fits one segment. `countSegments` in `lib/sms/templates.ts` is the
check: a curly quote or an em dash flips the encoding to UCS-2 and halves the
segment budget, turning a one-segment text into a two-segment bill.

## Consent

- Transactional sends require `bookings.sms_opt_in = true`, the isolated
  checkbox on the wizard's contact step. No checkbox, no SMS, email only.
- Marketing sends require the separate offers checkbox. Evidence lives in
  `consent_log` with the exact wording shown; `bookings.marketing_sms_opt_in`
  is the queryable mirror added 2026-07-27.
- STOP is handled by Twilio Advanced Opt-Out. A send to an unsubscribed number
  comes back as error 21610, and `lib/sms/client.ts` mirrors that number into
  `sms_opt_outs` so we stop attempting.

## Promo

`/admin/sms` sends promotional messages to customers who opted in to offers.

- Cap: 2 per phone per calendar month, the ceiling registered with the
  campaign. `MARKETING_MONTHLY_CAP` in `lib/sms/marketing.ts`. Raising it needs
  the campaign updated first.
- The cap counts rows in `sms_log`. If that count cannot be read, the send is
  skipped rather than risked.
- The opt-out line is appended when the author leaves it out.
- Access: the server action checks `ADMIN_EMAILS` or `users.role = 'admin'`.
  It does not rely on middleware, which only checks that a visitor is signed in
  and would let any customer account reach admin pages.

## Files

```
lib/sms/templates.ts   copy, date and time formatting, segment counting
lib/sms/client.ts      delivery, consent-independent checks, logging, opt-outs
lib/sms/bookings.ts    lifecycle events, transactional consent gate
lib/sms/marketing.ts   promo audience, monthly cap, blast
app/actions/sms.ts     admin-gated server action
app/admin/sms/         audience, composer, history
```

Owner alerts stay in `lib/notifications.ts` and skip all of this on purpose:
they go to us, not to customers.

## Verified 2026-07-27

Sent through the real code path to a live handset: `booking_confirmed` and
`booking_rescheduled` both `delivered`, one segment each, logged to `sms_log`
with the booking id. Consent gate returns `no_sms_consent` when the flag is
false, junk phone numbers return `invalid_phone`, and `/admin/sms` redirects to
login without a session.
