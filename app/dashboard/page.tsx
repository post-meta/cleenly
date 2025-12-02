import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { UpcomingBookings } from '@/components/dashboard/upcoming-bookings';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    // Fetch upcoming bookings
    const { data: upcomingBookings } = await supabase
        .from('bookings')
        .select('*, addresses(*), cleaners(*)')
        .eq('user_id', session.user?.id)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true })
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
