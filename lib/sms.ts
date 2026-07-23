import twilio from 'twilio';

export async function sendOTP(phone: string, code: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    // For US A2P 10DLC, route through the Messaging Service SID — it carries the
    // registered campaign association. Sending with a bare `from` number risks
    // error 30034 (unregistered) even after the campaign is approved.
    if (!accountSid || !authToken || (!messagingServiceSid && !fromNumber)) {
        console.warn('Twilio credentials missing. OTP not sent.');
        return;
    }

    const client = twilio(accountSid, authToken);

    await client.messages.create({
        body: `Your CLEENLY verification code is: ${code}. Valid for 10 minutes.`,
        ...(messagingServiceSid
            ? { messagingServiceSid }
            : { from: fromNumber }),
        to: phone,
    });
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
