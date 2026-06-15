import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/admin');

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    const res = NextResponse.next();

    // Capture a referral code from ?ref= into a cookie so it survives until signup.
    const ref = nextUrl.searchParams.get('ref');
    if (ref) {
        res.cookies.set('cleenly_ref', ref.toUpperCase().slice(0, 16), {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
            sameSite: 'lax',
        });
    }

    return res;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
