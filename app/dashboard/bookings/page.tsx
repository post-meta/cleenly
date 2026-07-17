import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { BookingsList } from '@/components/dashboard/bookings-list';
import { BookingFilters } from '@/components/dashboard/booking-filters';

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const session = await auth();
    if (!session) redirect('/login');

    const { status: statusParam } = await searchParams;
    const status = statusParam || 'upcoming';

    // Build query based on status
    let query = supabase
        .from('bookings')
        .select('*, addresses(*), cleaners!assigned_cleaner_id(*)')
        .eq('user_id', session.user?.id);

    // Filter by status, not scheduled_date — new requests have no scheduled_date
    // yet (only preferred_date), so a date filter would hide them entirely.
    if (status === 'upcoming') {
        query = query
            .in('status', ['new', 'pending', 'confirmed', 'in_progress'])
            .order('created_at', { ascending: false });
    } else if (status === 'past') {
        query = query
            .eq('status', 'completed')
            .order('created_at', { ascending: false });
    } else if (status === 'cancelled') {
        query = query
            .eq('status', 'cancelled')
            .order('created_at', { ascending: false });
    }

    const { data: bookings } = await query;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold">My Bookings</h1>
                <p className="text-gray-600 mt-2">
                    View and manage your cleaning appointments
                </p>
            </div>

            <BookingFilters currentStatus={status} />

            <BookingsList bookings={bookings || []} />
        </div>
    );
}
