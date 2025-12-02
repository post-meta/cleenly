import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const bookingId = searchParams.get('bookingId');

    if (!email) {
        return NextResponse.redirect(new URL('/login?error=InvalidMagicLink', req.url));
    }

    // Auto sign-in
    await signIn('email', {
        email,
        redirect: false,
    });

    // Redirect to booking details
    const redirectUrl = bookingId
        ? `/dashboard/bookings/${bookingId}`
        : '/dashboard';

    return NextResponse.redirect(new URL(redirectUrl, req.url));
}
