import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { UpcomingBookings } from '@/components/dashboard/upcoming-bookings';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    // Upcoming = anything not yet completed/cancelled. New requests have no
    // scheduled_date yet (only preferred_date), so we filter by status, not date.
    const { data: upcomingBookings } = await supabase
        .from('bookings')
        .select('*, addresses(*), cleaners!assigned_cleaner_id(*)')
        .eq('user_id', session.user?.id)
        .in('status', ['new', 'pending', 'confirmed', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(3);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold">
                    Welcome back, {session.user?.name?.split(' ')[0] || 'there'}
                </h1>
                <p className="text-gray-600 mt-2">
                    Manage your cleanings and account
                </p>
            </div>

            <QuickActions />

            {upcomingBookings && upcomingBookings.length > 0 && (
                <UpcomingBookings bookings={upcomingBookings} />
            )}
        </div>
    );
}
