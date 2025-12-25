import Link from 'next/link';
import { getBookings, getBookingPayments } from '@/app/actions/bookings';
import { calculatePaymentStatus } from '@/lib/utils/payment-status';
import { getCleaners } from '@/app/actions/cleaners';
import { BookingsTable } from '@/components/admin/bookings-table';
import { BookingsFilters } from '@/components/admin/bookings-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';

interface PageProps {
    searchParams: Promise<{
        status?: string;
        cleaner?: string;
        dateFrom?: string;
        dateTo?: string;
    }>;
}

export default async function BookingsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const [bookingsResult, cleanersResult] = await Promise.all([
        getBookings({
            status: params.status,
            cleanerId: params.cleaner,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
        }),
        getCleaners(),
    ]);

    if (bookingsResult.error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                Error loading bookings: {bookingsResult.error}
            </div>
        );
    }

    // Fetch payment status for each booking
    const bookingsWithPayments = await Promise.all(
        (bookingsResult.data || []).map(async (booking) => {
            const { data: payments } = await getBookingPayments(booking.id);
            const paymentStatus = calculatePaymentStatus(
                booking.price_final || 0,
                payments || []
            );
            return { ...booking, paymentStatus };
        })
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Bookings</h1>
                <Link href="/admin/bookings/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Booking
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <BookingsFilters cleaners={cleanersResult.data || []} />
            </Suspense>

            <BookingsTable bookings={bookingsWithPayments} />
        </div>
    );
}
