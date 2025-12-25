import { getBooking, getBookingPayments } from '@/app/actions/bookings';
import { calculatePaymentStatus } from '@/lib/utils/payment-status';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import { BookingStatusActions } from './status-actions';

export default async function BookingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const { data: booking, error } = await getBooking(id);

    if (error || !booking) {
        notFound();
    }

    const { data: payments } = await getBookingPayments(id);
    const paymentStatus = calculatePaymentStatus(booking.price_final || 0, payments || []);

    const serviceTypeLabels: Record<string, string> = {
        regular: 'Regular Cleaning',
        deep: 'Deep Cleaning',
        move_out: 'Move-Out Cleaning',
    };
    const serviceTypeLabel = serviceTypeLabels[booking.service_type] || booking.service_type;

    return (
        <div>
            <Link
                href="/admin/bookings"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-foreground mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Bookings
            </Link>

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{serviceTypeLabel}</h1>
                    <p className="text-gray-600 text-sm mt-1">Booking #{id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <PaymentBadge status={paymentStatus} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Customer
                        </h2>
                        <div className="space-y-2 text-sm">
                            {(booking.name || booking.guest_name) && (
                                <p><span className="text-gray-600">Name:</span> {booking.name || booking.guest_name}</p>
                            )}
                            {(booking.email || booking.guest_email) && (
                                <p><span className="text-gray-600">Email:</span> {booking.email || booking.guest_email}</p>
                            )}
                            {(booking.phone || booking.guest_phone) && (
                                <p><span className="text-gray-600">Phone:</span> {booking.phone || booking.guest_phone}</p>
                            )}
                        </div>
                    </section>

                    {/* Address */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Address
                        </h2>
                        <div className="text-sm">
                            <p>{booking.address}</p>
                            <p>{booking.city}, {booking.zip}</p>
                        </div>
                    </section>

                    {/* Schedule */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Schedule
                        </h2>
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="text-gray-600">Date:</span>{' '}
                                {booking.scheduled_date
                                    ? format(new Date(booking.scheduled_date), 'MMMM d, yyyy')
                                    : 'Not scheduled'}
                            </p>
                            {booking.scheduled_time && (
                                <p><span className="text-gray-600">Time:</span> {booking.scheduled_time}</p>
                            )}
                            {booking.estimated_duration && (
                                <p><span className="text-gray-600">Duration:</span> {booking.estimated_duration} hours</p>
                            )}
                        </div>
                    </section>

                    {/* Service Details */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4">Service Details</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Type</p>
                                <p className="font-medium">{serviceTypeLabel}</p>
                            </div>
                            {booking.bedrooms && (
                                <div>
                                    <p className="text-gray-600">Bedrooms</p>
                                    <p className="font-medium">{booking.bedrooms}</p>
                                </div>
                            )}
                            {booking.bathrooms && (
                                <div>
                                    <p className="text-gray-600">Bathrooms</p>
                                    <p className="font-medium">{booking.bathrooms}</p>
                                </div>
                            )}
                            {booking.sqft_range && (
                                <div>
                                    <p className="text-gray-600">Sq Ft</p>
                                    <p className="font-medium">{booking.sqft_range}</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Notes */}
                    {(booking.special_requests || booking.notes_for_cleaner) && (
                        <section className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="font-semibold mb-4">Notes</h2>
                            {booking.special_requests && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">Customer Notes:</p>
                                    <p className="text-sm">{booking.special_requests}</p>
                                </div>
                            )}
                            {booking.notes_for_cleaner && (
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Admin Notes:</p>
                                    <p className="text-sm">{booking.notes_for_cleaner}</p>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Pricing
                        </h2>
                        <div className="space-y-2 text-sm">
                            {booking.price_quoted && (
                                <p>
                                    <span className="text-gray-600">Estimated:</span>{' '}
                                    ${(booking.price_quoted / 100).toFixed(2)}
                                </p>
                            )}
                            <p className="text-lg font-semibold">
                                Final: ${(booking.price_final / 100).toFixed(2)}
                            </p>
                        </div>
                    </section>

                    {/* Cleaner */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4">Assigned Cleaner</h2>
                        {booking.cleaners ? (
                            <div className="flex items-center gap-3">
                                {booking.cleaners.photo_url ? (
                                    <img
                                        src={booking.cleaners.photo_url}
                                        alt={booking.cleaners.full_name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                                        {booking.cleaners.full_name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{booking.cleaners.full_name}</p>
                                    {booking.cleaners.phone && (
                                        <p className="text-sm text-gray-600">{booking.cleaners.phone}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-sm">Not assigned</p>
                        )}
                    </section>

                    {/* Actions */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4">Actions</h2>
                        <BookingStatusActions
                            bookingId={id}
                            currentStatus={booking.status}
                        />
                    </section>

                    {/* Timeline */}
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Timeline
                        </h2>
                        <div className="space-y-3 text-sm">
                            <TimelineItem
                                label="Created"
                                date={booking.created_at}
                            />
                            {booking.confirmed_at && (
                                <TimelineItem
                                    label="Confirmed"
                                    date={booking.confirmed_at}
                                />
                            )}
                            {booking.started_at && (
                                <TimelineItem
                                    label="Started"
                                    date={booking.started_at}
                                />
                            )}
                            {booking.completed_at && (
                                <TimelineItem
                                    label="Completed"
                                    date={booking.completed_at}
                                />
                            )}
                            {booking.cancelled_at && (
                                <TimelineItem
                                    label="Cancelled"
                                    date={booking.cancelled_at}
                                />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        new: 'bg-blue-100 text-blue-700',
        confirmed: 'bg-green-100 text-green-700',
        in_progress: 'bg-yellow-100 text-yellow-700',
        completed: 'bg-gray-100 text-gray-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-3 py-1 rounded-sm text-xs font-medium capitalize ${styles[status] || styles.new}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

function PaymentBadge({ status }: { status: 'paid' | 'partial' | 'unpaid' }) {
    const styles = {
        paid: 'bg-green-100 text-green-700',
        partial: 'bg-yellow-100 text-yellow-700',
        unpaid: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-3 py-1 rounded-sm text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

function TimelineItem({ label, date }: { label: string; date: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-600">{label}</span>
            <span>{format(new Date(date), 'MMM d, h:mm a')}</span>
        </div>
    );
}
