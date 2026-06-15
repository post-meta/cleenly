'use server';

import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const TYPES = ['feedback', 'question', 'complaint', 'praise'] as const;

async function notifyAdmin(type: string, message: string, name?: string | null, email?: string | null) {
    const header = `📝 New ${type} from ${name || email || 'a customer'}`;
    // Telegram
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
        if (token && chatId) {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `${header}\n\n${message}\n\n${email || ''}`,
                }),
            });
        }
    } catch { /* best-effort */ }
    // Email
    try {
        const key = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL;
        if (key && adminEmail) {
            const resend = new Resend(key);
            await resend.emails.send({
                from: 'CLEENLY <hello@cleenly.app>',
                to: adminEmail,
                replyTo: email || undefined,
                subject: `[${type}] from ${name || email || 'customer'}`,
                text: `${message}\n\n— ${name || ''} ${email || ''}`,
            });
        }
    } catch { /* best-effort */ }
}

export async function submitFeedback(input: {
    type: string;
    message: string;
    bookingId?: string;
}): Promise<{ success: true } | { error: string }> {
    const session = await auth();
    const uid = (session?.user as { id?: string } | undefined)?.id;
    if (!uid) return { error: 'You are not signed in' };

    const type = (TYPES as readonly string[]).includes(input.type) ? input.type : 'feedback';
    const message = (input.message || '').trim();
    if (message.length < 3) return { error: 'Please write a short message' };

    const { data: user } = await supabase.from('users').select('name, email').eq('id', uid).single();

    const { error } = await supabase.from('feedback').insert({
        user_id: uid,
        booking_id: input.bookingId || null,
        type,
        message,
        email: user?.email || null,
        name: user?.name || null,
    });
    if (error) return { error: error.message };

    notifyAdmin(type, message, user?.name, user?.email).catch(() => {});
    revalidatePath('/dashboard/feedback');
    return { success: true };
}
