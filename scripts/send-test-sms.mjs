#!/usr/bin/env node
// Send one test SMS through the CLEENLY Twilio Messaging Service.
// No dependencies — plain fetch against the Twilio REST API.
//
//   export TWILIO_ACCOUNT_SID=AC...
//   export TWILIO_AUTH_TOKEN=...
//   export TWILIO_MESSAGING_SERVICE_SID=MG48b661cab0ba1f329b7cf0cba1e76ab1
//   node scripts/send-test-sms.mjs +12066414739
//
// Routing goes through the Messaging Service SID, same as lib/sms.ts — a bare
// `from` number risks error 30034 (unregistered A2P campaign).

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const to = process.argv[2];
const body =
    process.argv[3] ??
    'CLEENLY: Test message. This is how booking updates will reach customers. ' +
    'Example: your cleaning is confirmed for Tue, Jul 29, 9-11 am arrival window. ' +
    'Questions? (206) 641-4739. Reply STOP to opt out.';

if (!to) {
    console.error('Usage: node scripts/send-test-sms.mjs +1XXXXXXXXXX ["custom body"]');
    process.exit(1);
}
if (!accountSid || !authToken || (!messagingServiceSid && !fromNumber)) {
    console.error('Missing Twilio env vars. Need TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,');
    console.error('and TWILIO_MESSAGING_SERVICE_SID (or TWILIO_PHONE_NUMBER).');
    process.exit(1);
}

const params = new URLSearchParams({ To: to, Body: body });
if (messagingServiceSid) params.set('MessagingServiceSid', messagingServiceSid);
else params.set('From', fromNumber);

const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    },
);

const data = await res.json();

if (!res.ok) {
    console.error(`Failed (HTTP ${res.status}) — code ${data.code}: ${data.message}`);
    if (data.code === 30034) {
        console.error('30034 = A2P 10DLC campaign not registered/approved. See docs/a2p-resubmit-2026-07-22.md');
    }
    process.exit(1);
}

console.log(`Queued. SID ${data.sid}, status ${data.status}, segments ${data.num_segments}`);
console.log(`Check delivery: https://console.twilio.com/us1/monitor/logs/sms?filters=${data.sid}`);
