'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendMarketingBlast, type BlastResult } from '@/lib/sms/marketing';
import { clientSmsEnabled } from '@/lib/sms/client';

/**
 * Admin gate for anything that sends to customers.
 *
 * The middleware only checks that /admin visitors are signed in, not that they
 * are staff, so a plain customer account can reach admin pages. A broadcast to
 * the whole customer base must not rely on that. Allowed if the signed-in email
 * is in ADMIN_EMAILS, or the users row carries role = 'admin'.
 */
async function assertAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
    const session = await auth();
    const email = session?.user?.email?.toLowerCase();
    if (!email) return { ok: false, error: 'Not signed in.' };

    const allowlist = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    if (allowlist.includes(email)) return { ok: true };

    try {
        const supabase = createAdminClient();
        const { data } = await supabase
            .from('users')
            .select('role')
            .eq('email', email)
            .maybeSingle();
        if (data?.role === 'admin') return { ok: true };
    } catch (err) {
        console.error('[sms] admin check failed:', err);
    }

    return { ok: false, error: 'Admin access required.' };
}

export type BlastState =
    | { status: 'idle' }
    | { status: 'error'; error: string }
    | { status: 'done'; result: BlastResult };

export async function sendPromoAction(
    _prev: BlastState,
    formData: FormData
): Promise<BlastState> {
    const gate = await assertAdmin();
    if (!gate.ok) return { status: 'error', error: gate.error };

    if (!clientSmsEnabled()) {
        return {
            status: 'error',
            error: 'Customer SMS is switched off. Set CLIENT_SMS_ENABLED=true to send.',
        };
    }

    const body = String(formData.get('body') || '').trim();
    if (body.length < 10) {
        return { status: 'error', error: 'Write the message first.' };
    }
    if (body.length > 600) {
        return { status: 'error', error: 'Too long. Keep a promo under 600 characters.' };
    }

    // Typing the exact word is the last stop before a real broadcast.
    if (String(formData.get('confirm') || '').trim().toUpperCase() !== 'SEND') {
        return { status: 'error', error: 'Type SEND to confirm the broadcast.' };
    }

    const result = await sendMarketingBlast(body);
    revalidatePath('/admin/sms');
    return { status: 'done', result };
}
