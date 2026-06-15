# A2P 10DLC — Brand + Campaign fill-in sheet

Companion to `a2p-campaigns.md` (which holds the full campaign copy). This is the
step-by-step sheet for the Twilio Console A2P wizard. Prepared 2026-06-14.

**Twilio account:** Cleenly (`ACxxxxxxxx-redacted-see-env-local`), type Full, active.
**Messaging Service (already created):** `MG48b661cab0ba1f329b7cf0cba1e76ab1` — number +1 425 230 5957 in sender pool.

Console path: **Messaging → Regulatory Compliance → A2P 10DLC → Get started**
(or Trust Hub → A2P/Customer Profiles). Do the Business Profile first, then Brand, then Campaign.

---

## 1. Business Profile (Primary Customer Profile)

| Field | Value |
|---|---|
| Legal business name | **Pro Craft Cleaning LLC** (must match IRS EIN record exactly) |
| DBA / brand | CLEENLY |
| Business type / structure | Limited Liability Company (LLC) |
| Business industry | Professional Services |
| Business registration ID type | USA: EIN |
| EIN | **92-1181226** (Pro Craft Cleaning LLC) |
| Business registration country | United States |
| Website | https://cleenly.app |
| Company type | Private |
| Stock exchange / ticker | N/A (private) |
| Business address | 5016 Fairwood Blvd NE apt 39, Tacoma, WA 98422, USA |
| Regions of operation | USA / Canada → USA |

### Authorized representative (Point of contact)

| Field | Value |
|---|---|
| First name | Evgenii |
| Last name | Krasnoperov |
| Email | hello@cleenly.app  *(confirm)* |
| Phone | +1 206 641 4739  *(confirm)* |
| Business title | Owner / Managing Member  *(confirm)* |
| Job position | Owner / Director |

> ⚠️ EIN ↔ legal name must match IRS records or the brand is rejected (fee still charged). Use the exact registered spelling of "Pro Craft Cleaning LLC" as it appears on the EIN / CP-575.

---

## 2. Brand Registration

| Field | Value |
|---|---|
| Brand tier | **Standard** (unlocks higher throughput than Low/Sole-Prop; small vetting) |
| Brand name shown in messages | CLEENLY |
| Customer profile | the Business Profile from section 1 |

Fees (shown in wizard before you confirm): one-time brand registration ~**$4**.

---

## 3. Campaign — Low-Volume Mixed (recommended, 1 campaign)

Covers both transactional + occasional promotional from one number. ~**$2/mo** + one-time vetting.

| Field | Value |
|---|---|
| Use case | **Low Volume Mixed** |
| Messaging Service | CLEENLY (`MG48b661cab0ba1f329b7cf0cba1e76ab1`) |
| Description | see below |
| Sample messages | see below (mix of transactional + promo) |
| Message contents — embedded link? | **Yes** — cleenly.app/book |
| Message contents — embedded phone? | **Yes** — (425) 230-5957 |
| Age-gated content? | No |
| Direct lending / loan arrangement? | No |
| Affiliate marketing? | No |
| Opt-in type | **WEB_FORM** |

### Campaign description (paste)

> CLEENLY is a residential cleaning company in Greater Seattle operated by Pro Craft Cleaning LLC (dba CLEENLY). This campaign sends transactional and occasional promotional messages to customers who booked a cleaning at cleenly.app/book and gave explicit SMS consent via unchecked checkboxes. Transactional: booking confirmations with the price estimate, day-before reminders, cleaner-arrival notifications, and post-service receipts. Promotional (separate, dedicated opt-in): seasonal cleaning offers and short home-care tips, no more than 2 per month. Every message includes opt-out language.

### Opt-in / call-to-action / message flow (paste)

> Customers opt in via unchecked checkboxes on the final contact step of the booking wizard at https://cleenly.app/book. The transactional checkbox is separate from the terms of service; a second, separate, unchecked checkbox collects express written consent for promotional messages. Transactional text: "I agree to receive SMS notifications about my booking from CLEENLY. Message and data rates may apply. Reply STOP to unsubscribe." Promotional text: "Send me occasional offers and seasonal cleaning tips by text (optional). Msg & data rates may apply. Reply STOP to unsubscribe." Each consent is logged server-side with phone, the exact consent text shown, IP, user agent, and timestamp. Opt-out is handled by Twilio Advanced Opt-Out (STOP/HELP).

### Sample messages (paste each)

1. `CLEENLY: We got your booking for Tue, Jun 23, morning slot. Deep cleaning, 2 bed/2 bath, estimate $240-$290. We confirm within 2 hours. Reply STOP to opt out.`
2. `CLEENLY: Reminder - your cleaning is tomorrow, 9-11 am arrival window. Need to reschedule? Reply here or call (425) 230-5957.`
3. `CLEENLY: All done. Final price: $260. Receipt sent to your email. Not right? We fix it within 24 hrs - just reply here.`
4. `CLEENLY: Pollen season hit Seattle early. The Pollen Purge - vents, sills, fabrics - from $180. Book: cleenly.app/book. Reply STOP to opt out.`
5. `CLEENLY: It's been 3 months since your last cleaning. A 2 bed/2 bath refresh runs $180-$220. Book: cleenly.app/book. Reply STOP to opt out.`

### Opt-in screenshot (attach)

Per `a2p-campaigns.md`: cleenly.app/book step 5, both checkboxes unchecked, URL bar visible.

---

## 4. After approval (I do via API on MG48b661…)

- Enable **Advanced Opt-Out** on the Messaging Service (STOP/UNSTOP/HELP), custom HELP:
  `CLEENLY support: reply here or call (425) 230-5957. cleenly.app`
- Verify campaign status `VERIFIED`, number registered to campaign.
- Update production env (Vercel) with the working creds + `TWILIO_MESSAGING_SERVICE_SID` + `ADMIN_SMS_RECIPIENTS` so owner SMS goes live.

---

## Status checklist

- [x] Twilio creds valid (Auth Token, account Cleenly)
- [x] Messaging Service created + number 425 added
- [ ] Business Profile submitted (section 1)
- [ ] Brand registered (section 2)
- [ ] Campaign submitted (section 3)
- [ ] Advanced Opt-Out + prod env (section 4)
