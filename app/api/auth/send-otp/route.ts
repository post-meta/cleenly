import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOTP, generateOTP } from '@/lib/sms';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { phone } = await req.json();

        if (!phone || !/^\+1\d{10}$/.test(phone)) {
            return NextResponse.json(
                { error: 'Invalid phone number. Use format: +1XXXXXXXXXX' },
                { status: 400 }
            );
        }

        const code = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP
        await supabase.from('otp_codes').insert({
            phone,
            code,
            expires_at: expiresAt.toISOString(),
        });

        // Send SMS
        await sendOTP(phone, code);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
