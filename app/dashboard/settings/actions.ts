'use server';

import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { compare, hash } from 'bcryptjs';

type Result = { success: true } | { error: string };

async function currentUserId(): Promise<string | null> {
    const session = await auth();
    return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function updateProfile(input: { name: string; phone: string }): Promise<Result> {
    const uid = await currentUserId();
    if (!uid) return { error: 'You are not signed in' };

    const { error } = await supabase
        .from('users')
        .update({ name: input.name?.trim() || null, phone: input.phone?.trim() || null })
        .eq('id', uid);

    if (error) return { error: error.message };
    revalidatePath('/dashboard/settings');
    return { success: true };
}

export async function changePassword(input: { current: string; next: string }): Promise<Result> {
    const uid = await currentUserId();
    if (!uid) return { error: 'You are not signed in' };
    if (!input.next || input.next.length < 8) {
        return { error: 'New password must be at least 8 characters' };
    }

    const { data: user } = await supabase
        .from('users')
        .select('password')
        .eq('id', uid)
        .single();
    if (!user) return { error: 'Account not found' };

    // Users who signed in with Google/SMS may have no password yet — let them set one.
    if (user.password) {
        if (!input.current) return { error: 'Enter your current password' };
        const ok = await compare(input.current, user.password);
        if (!ok) return { error: 'Current password is incorrect' };
    }

    const hashed = await hash(input.next, 12);
    const { error } = await supabase.from('users').update({ password: hashed }).eq('id', uid);
    if (error) return { error: error.message };
    return { success: true };
}

export async function saveNotificationPrefs(prefs: {
    booking_confirmations: boolean;
    service_reminders: boolean;
    marketing: boolean;
}): Promise<Result> {
    const uid = await currentUserId();
    if (!uid) return { error: 'You are not signed in' };

    const { data: u } = await supabase.from('users').select('preferences').eq('id', uid).single();
    const merged = { ...((u?.preferences as Record<string, unknown>) || {}), notifications: prefs };

    const { error } = await supabase.from('users').update({ preferences: merged }).eq('id', uid);
    if (error) return { error: error.message };
    revalidatePath('/dashboard/settings');
    return { success: true };
}

// Soft-deactivate: keeps bookings for business records, flips the account off.
// Hard delete would orphan/cascade booking history — deactivation is reversible & safer.
export async function deactivateAccount(input: { confirm: string }): Promise<Result> {
    const uid = await currentUserId();
    if (!uid) return { error: 'You are not signed in' };
    if (input.confirm !== 'DELETE') return { error: 'Type DELETE to confirm' };

    const { error } = await supabase.from('users').update({ is_active: false }).eq('id', uid);
    if (error) return { error: error.message };
    return { success: true };
}
