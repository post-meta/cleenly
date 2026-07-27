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

    // First-touch campaign attribution. The visit that carries the UTM tags is
    // rarely the visit that books, so park them in a cookie and let
    // /api/bookings copy them onto the row.
    //
    // First touch wins: a visitor who arrives from post-03, leaves, and comes
    // back through the bio link is credited to post-03. Overwriting on the last
    // touch would credit the bio link for every booking the posts produced.
    if (!req.cookies.get('cleenly_attr')) {
        const p = nextUrl.searchParams;
        const attr: Record<string, string> = {};
        for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
            const v = p.get(key);
            if (v) attr[key] = v.slice(0, 64);
        }
        if (Object.keys(attr).length > 0) {
            attr.landing_path = nextUrl.pathname.slice(0, 200);
            // Host only — a full referrer URL can carry the other site's own query string.
            const referer = req.headers.get('referer');
            if (referer) {
                try {
                    attr.referrer = new URL(referer).host.slice(0, 200);
                } catch {
                    /* malformed Referer header — skip it rather than store garbage */
                }
            }
            res.cookies.set('cleenly_attr', JSON.stringify(attr), {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                sameSite: 'lax',
            });
        }
    }

    return res;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
