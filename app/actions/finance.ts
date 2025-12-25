'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function recordPayment({
    bookingId,
    amountPaid,
    method,
    notes,
    transactionId,
    checkNumber,
}: {
    bookingId: string;
    amountPaid: number;
    method: string;
    notes?: string;
    transactionId?: string;
    checkNumber?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Create payment record
    const { error: paymentError } = await supabase
        .from('payments')
        .insert({
            booking_id: bookingId,
            amount_paid: amountPaid,
            method: method as any,
            status: 'completed',
            transaction_id: transactionId,
            check_number: checkNumber,
            notes,
            processed_by: user.id,
            processed_at: new Date().toISOString(),
        });

    if (paymentError) throw paymentError;

    // Get booking total
    const { data: booking } = await supabase
        .from('bookings')
        .select('price_final')
        .eq('id', bookingId)
        .single();

    if (!booking) throw new Error('Booking not found');

    // Check if booking is now fully paid
    const { data: totalPaid } = await supabase
        .rpc('get_booking_total_paid', { booking_uuid: bookingId });

    if ((totalPaid as unknown as number) >= booking.price_final) {
        await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId);
    }

    revalidatePath('/admin/bookings');
    revalidatePath('/admin/finance');

    return { success: true };
}

// NEW: Create payout with MANUAL amount
export async function createPayout({
    bookingId,
    cleanerId,
    amountToPay,
    notes,
}: {
    bookingId: string;
    cleanerId: string;
    amountToPay: number;
    notes?: string;
}) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('cleaner_payouts')
        .insert({
            booking_id: bookingId,
            cleaner_id: cleanerId,
            amount_to_pay: amountToPay,
            notes,
        });

    if (error) throw error;

    revalidatePath('/admin/bookings');
    revalidatePath('/admin/finance');

    return { success: true };
}

// Mark payout as paid
export async function markPayoutPaid({
    payoutId,
    method,
    transactionId,
}: {
    payoutId: string;
    method: string;
    transactionId?: string;
}) {
    const supabase = await createClient();

    // Get payout to know amount
    const { data: payout } = await supabase
        .from('cleaner_payouts')
        .select('amount_to_pay')
        .eq('id', payoutId)
        .single();

    if (!payout) throw new Error('Payout not found');

    const { error } = await supabase
        .from('cleaner_payouts')
        .update({
            amount_paid: payout.amount_to_pay,
            method,
            transaction_id: transactionId,
            paid_at: new Date().toISOString(),
        })
        .eq('id', payoutId);

    if (error) throw error;

    revalidatePath('/admin/finance');
    return { success: true };
}
