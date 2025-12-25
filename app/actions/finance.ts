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

export async function markMultiplePayoutsPaid(
    payoutIds: string[],
    method: string,
    transactionId?: string
) {
    const supabase = await createClient();

    // Fetch payouts to get current amounts
    const { data: payouts, error: fetchError } = await supabase
        .from('cleaner_payouts')
        .select('id, amount_to_pay')
        .in('id', payoutIds);

    if (fetchError || !payouts) {
        return { error: 'Could not fetch payouts' };
    }

    const timestamp = new Date().toISOString();

    // updates for upsert must include all primary keys (id)
    const updates = payouts.map(p => ({
        id: p.id,
        amount_paid: p.amount_to_pay,
        method,
        transaction_id: transactionId,
        paid_at: timestamp,
        // We must include other required fields if upserting creates new rows, but here we update. 
        // Ideally we should use .update() but Supabase JS client doesn't support bulk update with different values easily (though here values are same except ID... wait).
        // Actually, since we are setting amount_paid = amount_to_pay (which varies per row), we can't do a simple bulk .update({ ... }).
        // We have to use .upsert(). But .upsert() requires all non-nullable columns if it were to insert. 
        // Since IDs exist, it *should* update. BUT typically upsert matches on PK.
        // Let's ensure we don't accidentally wipe out other fields if we don't provide them? 
        // Supabase upsert performs an INSERT ... ON CONFLICT DO UPDATE.
        // If we only provide partial data, does it preserve the rest? No, standard SQL REPLACE/UPSERT usually replaces the row. 
        // Postgres `ON CONFLICT DO UPDATE SET` allows specific column updates. Supabase client handles this by default by updating only provided columns if we don't specify `ignoreDuplicates`.  
        // However, `amount_to_pay` is needed? No, we just need to set `amount_paid` to that value.
        // We need to pass `amount_to_pay` back in if we are fully replacing? 
        // Actually, safer way for now: Promise.all of individual updates. It's slower but 100% safe.
    }));

    // Safe iteration approach
    const updatePromises = payouts.map(p =>
        supabase
            .from('cleaner_payouts')
            .update({
                amount_paid: p.amount_to_pay,
                method,
                transaction_id: transactionId,
                paid_at: timestamp
            })
            .eq('id', p.id)
    );

    const results = await Promise.all(updatePromises);
    const firstError = results.find(r => r.error)?.error;

    if (firstError) {
        return { error: firstError.message };
    }

    revalidatePath('/admin/finance');
    return { success: true };
}
