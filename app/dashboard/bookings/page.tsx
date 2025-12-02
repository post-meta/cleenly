import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { BookingsList } from '@/components/dashboard/bookings-list';
import { BookingFilters } from '@/components/dashboard/booking-filters';

export default async function BookingsPage({
    searchParams,
}: {
    searchParams: { status?: string };
}) {
    const session = await auth();
    if (!session) redirect('/login');

    const status = searchParams.status || 'upcoming';

    // Build query based on status
    let query = supabase
        .from('bookings')
        .select('*, addresses(*), cleaners(*)')
        .eq('user_id', session.user?.id);

    const today = new Date().toISOString().split('T')[0];

    if (status === 'upcoming') {
        query = query
            .gte('scheduled_date', today)
            .in('status', ['pending', 'confirmed'])
            .order('scheduled_date', { ascending: true });
    } else if (status === 'past') {
        query = query
            .lt('scheduled_date', today)
            .eq('status', 'completed')
            .order('scheduled_date', { ascending: false });
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
