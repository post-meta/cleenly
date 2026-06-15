import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        signOut: '/logout',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            return true;
        },
        // JWT strategy: carry the user id onto the token and expose it on the
        // session, so server pages can query bookings/addresses by user_id.
        async jwt({ token, user }) {
            if (user) token.id = (user as { id?: string }).id;
            return token;
        },
        async session({ session, token }) {
            if (session.user && token?.id) {
                (session.user as { id?: string }).id = token.id as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // After login, redirect to dashboard
            if (url.startsWith(baseUrl)) return url;
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            return `${baseUrl}/dashboard`;
        },
    },
    providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
