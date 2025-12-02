import twilio from 'twilio';

export async function sendOTP(phone: string, code: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
        console.warn('Twilio credentials missing. OTP not sent.');
        return;
    }

    const client = twilio(accountSid, authToken);

    await client.messages.create({
        body: `Your CLEENLY verification code is: ${code}. Valid for 10 minutes.`,
        from: fromNumber,
        to: phone,
    });
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
