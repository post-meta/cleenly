# A2P 10DLC — Resubmission Package (rejection of 2026-07-22)

Campaign `CMad25c1c35c7d360ef151cb8405000ef1` (LOW_VOLUME) was rejected with:

- **Error 30908** — privacy policy could not be verified as compliant (missing from website *or `message_flow`*, or conflicting).
- **Error 30882** — terms/use-case conflict with prohibited third-party marketing rules.

## Diagnosis

The **website is already compliant and live** (verified 2026-07-22):
- `cleenly.app/privacy` has the required clause: *"We do not sell or share your mobile phone number or your SMS opt-in and consent information with third parties or affiliates for their marketing or promotional purposes."*
- `cleenly.app/terms` has the full SMS Program section (STOP/HELP, no third-party sharing).
- The booking opt-in has two separate unchecked checkboxes + Privacy/Terms links.

So the rejection is about the **campaign form fields in Twilio Console**, not the site. Two root causes:

1. **30882 — marketing mixed into a transactional LOW_VOLUME campaign.** This campaign must be **transactional / customer-care ONLY**. Remove every promotional sample/description. Marketing texts = a **separate** campaign, submitted on its own.
2. **30908 — the privacy URL wasn't tied to the opt-in inside `message_flow`.** The site has the policy, but the campaign's opt-in description must name `https://cleenly.app/privacy` directly so the reviewer connects them.

## Phone number roles (important, do not confuse)

| Number | Role |
|---|---|
| **+1 (425) 230-5957** | Twilio sending number — automated SMS go out from here. No human answers it. STOP/HELP handled automatically by Twilio. |
| **+1 (206) 641-4739** | Live business line the team actually answers. Use in message bodies for "call us." |

Customers **reply** to the 425 texts (Twilio forwards); customers **call** the 206 line for a human.

---

## Paste-ready campaign fields (transactional-only)

**Campaign use-case:** Customer Care / Account Notification (Low Volume). **NOT** Marketing.

**Use-case description:**

> CLEENLY is a residential cleaning company in Greater Seattle operated by Pro Craft Cleaning LLC (dba CLEENLY). This campaign sends transactional messages only to customers who booked a cleaning at https://cleenly.app/book and checked an explicit SMS-consent checkbox: booking confirmations with the price estimate, appointment reminders the day before, cleaner-arrival notifications, and post-service receipts. Every message relates to a specific booking the customer initiated. No marketing or promotional content is sent on this campaign. Consent is never shared with third parties.

**Opt-in / message-flow description (this fixes 30908 — note the privacy URL):**

> Customers opt in via an unchecked checkbox on the final contact step of the booking wizard at https://cleenly.app/book. The checkbox is separate from the Terms of Service and separate from the marketing checkbox. Checkbox text: "I agree to receive SMS notifications about my booking from CLEENLY. Message and data rates may apply. Reply STOP to unsubscribe." The privacy policy at https://cleenly.app/privacy is linked directly beside the opt-in and states that mobile opt-in and consent information is not shared with third parties or affiliates for marketing. Consent is logged server-side with phone number, exact consent text, IP address, user agent, and timestamp.

**Sample messages — use ONLY these 5 (all transactional):**

1. `CLEENLY: We got your booking for Tue, Jun 23, morning slot. Deep cleaning, 2 bed/2 bath, estimate $240-$290. We confirm within 2 hours. Reply STOP to opt out.`
2. `CLEENLY: Reminder - your cleaning is tomorrow, 9-11 am arrival window. Need to reschedule? Reply here or call (206) 641-4739.`
3. `CLEENLY: Your cleaner is on the way. Arrival in about 25 minutes. Access instructions received. Questions? (206) 641-4739.`
4. `CLEENLY: All done. Final price: $260. Receipt sent to your email. Not right? We fix it within 24 hrs - just reply here.`
5. `CLEENLY: Confirmed - Sat, Jun 27, afternoon (1-3 pm arrival). Reply HELP for help, STOP to opt out.`

**Do NOT** include any Pollen Purge / win-back / "3 months since your last cleaning" promotional samples — those belong to a separate marketing campaign only.

**Opt-out keywords:** enable Twilio Advanced Opt-Out on Messaging Service `MG48b661cab0ba1f329b7cf0cba1e76ab1`. Custom HELP reply: `CLEENLY support: reply here or call (206) 641-4739. cleenly.app`.

---

## How to resubmit — Twilio Console (recommended, safest)

1. Twilio Console → **Messaging → Regulatory Compliance → A2P 10DLC** (Trust Hub).
2. Open the rejected campaign `CMad25c1...`.
3. If Twilio shows an **Edit / Resubmit** button: update the use-case description, opt-in/message-flow, and sample messages with the text above, set use-case to **Customer Care / Account Notification** (not Marketing), then **Resubmit**.
4. If the campaign can't be edited (TCR campaigns are often locked once vetted): **delete the rejected campaign and create a new one** under the same Brand `BNa3f28972774f018d403aa8d1229262e3` and Messaging Service `MG48b661...`, using the fields above.
5. Attach opt-in screenshot: open `cleenly.app/book`, complete steps 1–4, on the contact step capture both unchecked checkboxes + the Privacy/Terms links, URL bar visible.
6. Submit for carrier review. Vetting typically returns in a few minutes to a couple of days.

## Alternative — via Twilio API (only if you insist; run it yourself)

TCR campaigns are largely immutable, so the API route means **delete + recreate**. This is billable and hits your live account, so run it with your own credentials — I cannot run it (no keys in this repo).

```bash
# Requires: TWILIO_ACCOUNT_SID (AC…) + TWILIO_AUTH_TOKEN from your Twilio Console.
# Fill both from Console → Account Info. Do NOT commit real values.
export TW_SID="AC_your_account_sid_here"
export TW_TOKEN="your_auth_token_here"
export MSG_SVC="MG48b661cab0ba1f329b7cf0cba1e76ab1"

# 1) Delete the rejected campaign
curl -X DELETE \
  "https://messaging.twilio.com/v1/Services/$MSG_SVC/Compliance/Usa2p/CMad25c1c35c7d360ef151cb8405000ef1" \
  -u "$TW_SID:$TW_TOKEN"

# 2) Create the corrected transactional campaign
#    BrandRegistrationSid + a Customer-Care/Account-Notification use case.
curl -X POST \
  "https://messaging.twilio.com/v1/Services/$MSG_SVC/Compliance/Usa2p" \
  --data-urlencode "BrandRegistrationSid=BNa3f28972774f018d403aa8d1229262e3" \
  --data-urlencode "Description=CLEENLY (Pro Craft Cleaning LLC) sends transactional SMS only to customers who booked at cleenly.app/book and checked an explicit SMS-consent box: booking confirmations, reminders, cleaner-arrival notices, and receipts. No marketing. Consent never shared with third parties." \
  --data-urlencode "MessageFlow=Customers opt in via an unchecked checkbox on the contact step of the booking wizard at https://cleenly.app/book, separate from the Terms and from the marketing checkbox. Checkbox text: 'I agree to receive SMS notifications about my booking from CLEENLY. Message and data rates may apply. Reply STOP to unsubscribe.' The privacy policy at https://cleenly.app/privacy is linked at the opt-in and states mobile opt-in/consent is not shared with third parties for marketing. Consent logged with phone, exact text, IP, user agent, timestamp." \
  --data-urlencode "UsAppToPersonUsecase=CUSTOMER_CARE" \
  --data-urlencode "HasEmbeddedLinks=true" \
  --data-urlencode "HasEmbeddedPhone=true" \
  --data-urlencode "MessageSamples=CLEENLY: We got your booking for Tue, Jun 23, morning slot. Deep cleaning, 2 bed/2 bath, estimate \$240-\$290. We confirm within 2 hours. Reply STOP to opt out." \
  --data-urlencode "MessageSamples=CLEENLY: Reminder - your cleaning is tomorrow, 9-11 am arrival window. Need to reschedule? Reply here or call (206) 641-4739." \
  --data-urlencode "MessageSamples=CLEENLY: All done. Final price: \$260. Receipt sent to your email. Not right? We fix it within 24 hrs - just reply here." \
  -u "$TW_SID:$TW_TOKEN"
```

> Note: exact accepted values for `UsAppToPersonUsecase` depend on what your brand qualifies for — the Console shows the valid list. `CUSTOMER_CARE` or `ACCOUNT_NOTIFICATION` (or the `LOW_VOLUME` mix) all work for transactional; the key is dropping marketing content.

---

## Checklist before resubmitting

- [ ] Campaign use-case = **Customer Care / Account Notification** (transactional), not Marketing.
- [ ] Use-case description + opt-in text include `https://cleenly.app/privacy`.
- [ ] Only the 5 transactional sample messages — zero promotional content.
- [ ] "Call us" numbers in samples = (206) 641-4739; STOP/HELP handled by Twilio on (425).
- [ ] Opt-in screenshot of `cleenly.app/book` attached (both boxes unchecked, links visible).
- [ ] Advanced Opt-Out enabled on Messaging Service `MG48b661…`.
