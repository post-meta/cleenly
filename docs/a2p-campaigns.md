# A2P 10DLC — Campaign Submission Package

Prepared 2026-06-10 for Twilio Trust Hub submission.

## Brand

| Field | Value |
|---|---|
| Legal entity | Pro Craft Cleaning LLC |
| EIN | 92-1181226 |
| Brand tier | Standard |
| DBA / brand name in messages | CLEENLY |
| Website | https://cleenly.app |
| Sending number | +1 425 230 5957 (Twilio) |
| Vertical | Home services (residential cleaning, Greater Seattle) |

## Consent infrastructure (live as of 2026-06-10)

- Two separate checkboxes in the booking wizard contact step (`cleenly.app/book`, step 5).
- Transactional checkbox: unchecked by default, isolated from TOS.
- Marketing checkbox: unchecked by default — express written consent (TCPA). Never pre-checked.
- Every ticked checkbox writes a row to the `consent_log` table in Supabase: phone, email, consent type, the exact consent text shown on screen, IP, user agent, booking id, timestamp.
- `bookings.sms_opt_in` + `bookings.sms_opt_in_at` record transactional consent per booking.
- Consent text source of truth: `lib/consent.ts` (UI and log always match).

---

## Campaign 1 — Transactional (Customer Care / Account Notification)

### Use-case description (paste into Trust Hub)

> CLEENLY is a residential cleaning company in Greater Seattle operated by Pro Craft Cleaning LLC (dba CLEENLY). This campaign sends transactional messages to customers who booked a cleaning at cleenly.app/book and checked an explicit SMS-consent checkbox: booking confirmations with the price estimate, appointment reminders the day before, cleaner-arrival notifications, and post-service receipts. Messages are tied to a specific booking the customer initiated. No marketing content is sent on this campaign.

### Opt-in flow description (paste into Trust Hub)

> Customers opt in via an unchecked checkbox on the final contact step of the booking wizard at https://cleenly.app/book. The checkbox is separate from the terms of service and separate from the marketing-SMS checkbox. Checkbox text: "I agree to receive SMS notifications about my booking from CLEENLY. Message and data rates may apply. Reply STOP to unsubscribe." Consent is logged server-side with phone number, exact consent text, IP address, user agent, and timestamp. Opt-out is handled by Twilio Advanced Opt-Out (STOP/HELP).

### Opt-in classification

`WEB_FORM` — booking wizard at cleenly.app/book.

### Screenshot instruction (attach to submission)

1. Open https://cleenly.app/book, complete steps 1-4 with any values.
2. On step 5 ("How can we reach you?") scroll to the two checkboxes below the contact fields.
3. Capture the full step: contact fields + both checkboxes, both visibly unchecked, with the URL bar showing cleenly.app/book.
4. Upload as the opt-in evidence image. Desktop viewport, no browser extensions visible.

### Sample messages

1. `CLEENLY: We got your booking for Tue, Jun 23, morning slot. Deep cleaning, 2 bed/2 bath, estimate $240-$290. We confirm within 2 hours. Reply STOP to opt out.` (158)
2. `CLEENLY: Reminder - your cleaning is tomorrow, 9-11 am arrival window. Need to reschedule? Reply here or call (206) 641-4739.` (125)
3. `CLEENLY: Your cleaner is on the way. Arrival in about 25 minutes. Access instructions received. Questions? (206) 641-4739.` (122)
4. `CLEENLY: All done. Final price: $260. Receipt sent to your email. Not right? We fix it within 24 hrs - just reply here.` (119)
5. `CLEENLY: Confirmed - Sat, Jun 27, afternoon (1-3 pm arrival). Final price confirmed before any charge. Reply HELP for help, STOP to opt out.` (140)

---

## Campaign 2 — Marketing (Promotional)

### Use-case description (paste into Trust Hub)

> CLEENLY (operated by Pro Craft Cleaning LLC, dba CLEENLY) sends occasional promotional messages to existing customers who gave express written consent via a second, separate, unchecked checkbox at booking: seasonal cleaning offers (spring Pollen Purge, fall Damp-Season Reset), short seasonal home-care tips, and win-back offers for past customers. Frequency: no more than 2 messages per month. Every message includes opt-out language. Audience is exclusively customers who completed a booking on cleenly.app and opted in to marketing.

### Opt-in flow description (paste into Trust Hub)

> Express written consent is collected via a dedicated, unchecked checkbox on the contact step of the booking wizard at https://cleenly.app/book, separate from the transactional-SMS checkbox and from the terms of service. Checkbox text: "Send me occasional offers and seasonal cleaning tips by text (optional). Msg & data rates may apply. Reply STOP to unsubscribe." Each consent is logged with phone, exact consent text, IP, user agent, and timestamp in a dedicated consent_log table. Opt-out via Twilio Advanced Opt-Out (STOP/HELP).

### Opt-in classification

`WEB_FORM` — same booking wizard, second checkbox, default unchecked.

### Screenshot instruction

Same capture as Campaign 1 — both checkboxes appear in one frame. Annotate (arrow or box) the second checkbox for this campaign's evidence.

### Sample messages (all include STOP)

1. `CLEENLY: Pollen season hit Seattle early this year. The Pollen Purge - vents, sills, fabrics - from $180. Book: cleenly.app/book. Reply STOP to opt out.` (152)
2. `CLEENLY: First fall rains are here. The Damp-Season Reset targets bathrooms, windows, entryways. From $190. cleenly.app/book. Reply STOP to opt out.` (148)
3. `CLEENLY: It's been 3 months since your last cleaning. A 2 bed/2 bath refresh runs $180-$220. Book: cleenly.app/book. Reply STOP to opt out.` (139)
4. `CLEENLY tip: run the bathroom fan 30 min after each shower - cuts mold risk. Deep clean overdue? cleenly.app/book. Reply STOP to opt out.` (137)
5. `CLEENLY: Hosting this season? Pre-event cleaning slots are open for the next 3 weeks. From $160. cleenly.app/book. Reply STOP to opt out.` (137)

---

## Operational notes

- **STOP/HELP**: enable Twilio **Advanced Opt-Out** on the Messaging Service for +1 425 230 5957. Default keywords (STOP, UNSTOP, HELP) + custom HELP response: `CLEENLY support: reply here or call (206) 641-4739. cleenly.app`.
- **Two campaigns, one number**: both campaigns can share +1 425 230 5957; opt-outs apply per number, so a STOP halts both — acceptable for a single-number setup.
- **Consent evidence**: `consent_log` table (Supabase project `onhrawahtfiuqzovglkb`) — exportable on carrier audit. RLS on, service-role access only.
- **Do not** send marketing to numbers whose only consent row is `transactional_sms`.
- **Message length**: keep ≤160 chars (single SMS segment); all samples above comply.
- Brand registration uses Pro Craft Cleaning LLC EIN 92-1181226, Standard tier (no vetting required for these volumes; upgrade if daily volume grows past Standard caps).
