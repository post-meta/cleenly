import { auth } from '@/auth';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Staff check for anything behind /admin.
 *
 * The middleware only checks that a visitor is signed in, so every customer
 * account can reach admin pages — and Server Actions are reachable over HTTP
 * regardless of which page imported them. Each admin action therefore has to
 * gate itself; route protection alone is not enough.
 *
 * Allowed if the signed-in email is in ADMIN_EMAILS, or the users row carries
 * role = 'admin'.
 */
export async function isAdmin(): Promise<boolean> {
    const session = await auth();
    const email = session?.user?.email?.toLowerCase();
    if (!email) return false;

    const allowlist = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    if (allowlist.includes(email)) return true;

    try {
        const supabase = createAdminClient();
        const { data } = await supabase
            .from('users')
            .select('role')
            .eq('email', email)
            .maybeSingle();
        return data?.role === 'admin';
    } catch (err) {
        console.error('[auth] admin check failed:', err);
        return false;
    }
}

/** Throws unless the caller is staff. Use as the first line of an admin action. */
export async function requireAdmin(): Promise<void> {
    if (!(await isAdmin())) {
        throw new Error('Admin access required');
    }
}
