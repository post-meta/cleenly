'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// === PAYMENTS (Customer -> Business) ===

export interface CreatePaymentData {
    bookingId: string;
    amount: number; // in dollars
    method: string;
    transactionId?: string;
}

export async function getPayments(filters?: { bookingId?: string; status?: string }) {
    let query = supabase
        .from('payments')
        .select(`
            *,
            bookings (
                id,
                service_type,
                scheduled_date,
                guest_name,
                name,
                email,
                guest_email
            )
        `)
        .order('created_at', { ascending: false });

    if (filters?.bookingId) {
        query = query.eq('booking_id', filters.bookingId);
    }

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching payments:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function createPayment(data: CreatePaymentData) {
    const { bookingId, amount, method, transactionId } = data;

    const { data: payment, error } = await supabase
        .from('payments')
        .insert([{
            booking_id: bookingId,
            amount: amount * 100, // Convert to cents
            payment_method: method,
            status: 'completed',
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating payment:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/finance');
    revalidatePath('/admin/bookings');
    return { data: payment, error: null };
}

// === PAYOUTS (Business -> Cleaner) ===

export interface CreatePayoutData {
    cleanerId: string;
    bookingId?: string;
    amount: number; // in dollars
    method?: string;
    notes?: string;
}

export async function getPayouts(filters?: {
    cleanerId?: string;
    status?: string;
    bookingId?: string;
}) {
    let query = supabase
        .from('payouts')
        .select(`
            *,
            cleaners (
                id,
                full_name,
                phone,
                email
            ),
            bookings (
                id,
                service_type,
                scheduled_date,
                price_final
            )
        `)
        .order('created_at', { ascending: false });

    if (filters?.cleanerId) {
        query = query.eq('cleaner_id', filters.cleanerId);
    }

    if (filters?.status) {
        query = query.eq('status', filters.status);
    }

    if (filters?.bookingId) {
        query = query.eq('booking_id', filters.bookingId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching payouts:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function createPayout(data: CreatePayoutData) {
    const { cleanerId, bookingId, amount, method, notes } = data;

    const { data: payout, error } = await supabase
        .from('payouts')
        .insert([{
            cleaner_id: cleanerId,
            booking_id: bookingId || null,
            amount: amount * 100, // Convert to cents
            method: method || null,
            notes: notes || null,
            status: 'pending',
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating payout:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/finance');
    return { data: payout, error: null };
}

export async function markPayoutPaid(
    payoutId: string,
    method: string,
    transactionId?: string
) {
    const { data: payout, error } = await supabase
        .from('payouts')
        .update({
            status: 'paid',
            method,
            transaction_id: transactionId || null,
            paid_at: new Date().toISOString(),
        })
        .eq('id', payoutId)
        .select()
        .single();

    if (error) {
        console.error('Error marking payout as paid:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/finance');
    return { data: payout, error: null };
}

export async function markMultiplePayoutsPaid(
    payoutIds: string[],
    method: string,
    transactionId?: string
) {
    const { data, error } = await supabase
        .from('payouts')
        .update({
            status: 'paid',
            method,
            transaction_id: transactionId || null,
            paid_at: new Date().toISOString(),
        })
        .in('id', payoutIds)
        .select();

    if (error) {
        console.error('Error marking payouts as paid:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/finance');
    return { data, error: null };
}

// === AGGREGATIONS ===

export async function getUnpaidPayoutsByCleaner() {
    const { data: payouts, error } = await supabase
        .from('payouts')
        .select(`
            id,
            amount,
            booking_id,
            created_at,
            cleaners (
                id,
                full_name,
                phone,
                email
            ),
            bookings (
                id,
                service_type,
                scheduled_date
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching unpaid payouts:', error);
        return { error: error.message, data: null };
    }

    // Group by cleaner
    const grouped: Record<string, {
        cleaner: any;
        payouts: any[];
        total: number;
    }> = {};

    payouts?.forEach((payout) => {
        // Cast to any to handle Supabase relationship typing
        const cleaner = payout.cleaners as any;
        const cleanerId = cleaner?.id;
        if (!cleanerId) return;

        if (!grouped[cleanerId]) {
            grouped[cleanerId] = {
                cleaner: cleaner,
                payouts: [],
                total: 0,
            };
        }

        grouped[cleanerId].payouts.push(payout);
        grouped[cleanerId].total += payout.amount;
    });

    return { data: Object.values(grouped), error: null };
}

export async function getFinanceSummary() {
    // Get total unpaid payouts
    const { data: unpaidPayouts } = await supabase
        .from('payouts')
        .select('amount')
        .eq('status', 'pending');

    // Get total pending payments
    const { data: pendingPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending');

    // Get completed bookings this month without payment
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: completedBookings } = await supabase
        .from('bookings')
        .select('id, price_final')
        .eq('status', 'completed')
        .gte('completed_at', startOfMonth.toISOString());

    const totalUnpaidPayouts = unpaidPayouts?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalPendingPayments = pendingPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalRevenue = completedBookings?.reduce((sum, b) => sum + (b.price_final || 0), 0) || 0;

    return {
        totalUnpaidPayouts: totalUnpaidPayouts / 100,
        totalPendingPayments: totalPendingPayments / 100,
        monthlyRevenue: totalRevenue / 100,
        completedBookingsCount: completedBookings?.length || 0,
    };
}
