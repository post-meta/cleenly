import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { format } from 'date-fns';
import { BookingActions } from '@/components/dashboard/booking-actions';
import { BookingTimeline } from '@/components/dashboard/booking-timeline';
import { CleanerInfo } from '@/components/dashboard/cleaner-info';
import { PaymentInfo } from '@/components/dashboard/payment-info';

function StatusBadge({ status }: { status: string }) {
    const styles = ({
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-green-100 text-green-700',
        in_progress: 'bg-blue-100 text-blue-700',
        completed: 'bg-gray-100 text-gray-700',
        cancelled: 'bg-red-100 text-red-700',
    } as Record<string, string>)[status] || 'bg-gray-100 text-gray-700';

    const label = status.replace('_', ' ');

    return (
        <span className={`px-3 py-1 rounded-sm text-xs font-medium capitalize ${styles}`}>
            {label}
        </span>
    );
}

export default async function BookingDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();
    if (!session) redirect('/login');

    const { data: booking } = await supabase
        .from('bookings')
        .select('*, addresses(*), cleaners(*), payments(*)')
        .eq('id', params.id)
        .eq('user_id', session.user?.id)
        .single();

    if (!booking) notFound();

    const serviceTypeLabel = ({
        regular: 'Regular Cleaning',
        deep: 'Deep Cleaning',
        move_out: 'Move-Out Cleaning',
    } as Record<string, string>)[booking.service_type] || booking.service_type;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">{serviceTypeLabel}</h1>
                        <p className="text-gray-600 mt-2">
                            Booking #{booking.id.slice(0, 8)}
                        </p>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Date & Time */}
                    <section className="border border-gray-200 p-6 rounded-sm">
                        <h2 className="font-semibold mb-4">Schedule</h2>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="text-gray-600">Date:</span>{' '}
                                <span className="font-medium">
                                    {format(new Date(booking.scheduled_date), 'EEEE, MMMM d, yyyy')}
                                </span>
                            </p>
                            <p className="text-sm">
                                <span className="text-gray-600">Time:</span>{' '}
                                <span className="font-medium">{booking.scheduled_time}</span>
                            </p>
                            <p className="text-sm">
                                <span className="text-gray-600">Duration:</span>{' '}
                                <span className="font-medium">~{booking.estimated_duration || 120} minutes</span>
                            </p>
                        </div>
                    </section>

                    {/* Address */}
                    <section className="border border-gray-200 p-6 rounded-sm">
                        <h2 className="font-semibold mb-4">Location</h2>
                        <div className="space-y-1">
                            <p className="font-medium">{booking.addresses.street_address}</p>
                            {booking.addresses.unit && (
                                <p className="text-sm text-gray-600">Unit {booking.addresses.unit}</p>
                            )}
                            <p className="text-sm text-gray-600">
                                {booking.addresses.city}, {booking.addresses.state} {booking.addresses.zip_code}
                            </p>
                        </div>
                        {booking.addresses.special_instructions && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-xs text-gray-600 mb-1">Special Instructions:</p>
                                <p className="text-sm">{booking.addresses.special_instructions}</p>
                            </div>
                        )}
                    </section>

                    {/* Cleaner Info */}
                    {booking.cleaners && (
                        <CleanerInfo cleaner={booking.cleaners} bookingId={booking.id} />
                    )}

                    {/* Timeline */}
                    <BookingTimeline booking={booking} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Payment Info */}
                    <PaymentInfo payment={booking.payments?.[0]} booking={booking} />

                    {/* Actions */}
                    <BookingActions booking={booking} />
                </div>
            </div>
        </div>
    );
}
