'use server';

import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/**
 * Customer rates a completed booking (1–5 + optional comment). Private to the
 * business — feeds the cleaner's average rating via the reviews trigger. Not
 * shown publicly on the site.
 */
export async function submitReview(input: {
    bookingId: string;
    rating: number;
    comment?: string;
}): Promise<{ success: true; rating: number } | { error: string }> {
    const session = await auth();
    const uid = (session?.user as { id?: string } | undefined)?.id;
    if (!uid) return { error: 'You are not signed in' };

    const rating = Math.round(Number(input.rating));
    if (!(rating >= 1 && rating <= 5)) return { error: 'Pick a rating from 1 to 5' };

    const { data: booking } = await supabase
        .from('bookings')
        .select('id, user_id, status, assigned_cleaner_id')
        .eq('id', input.bookingId)
        .single();

    if (!booking || booking.user_id !== uid) return { error: 'Booking not found' };
    if (booking.status !== 'completed') {
        return { error: 'You can leave a review once the cleaning is completed' };
    }

    const { error } = await supabase
        .from('reviews')
        .upsert(
            {
                booking_id: input.bookingId,
                user_id: uid,
                cleaner_id: booking.assigned_cleaner_id || null,
                rating,
                comment: input.comment?.trim() || null,
            },
            { onConflict: 'booking_id' }
        );

    if (error) return { error: error.message };
    revalidatePath(`/dashboard/bookings/${input.bookingId}`);
    return { success: true, rating };
}
