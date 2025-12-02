import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Booking = {
    id: string;
    service_type: string;
    scheduled_date: string;
    scheduled_time: string;
    status: string;
    price_final: number;
    addresses: {
        street_address: string;
        city: string;
    };
    cleaners?: {
        name: string;
        profile_photo?: string;
    };
};

export function BookingsList({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No bookings found</p>
                <Link href="/book">
                    <Button variant="primary">Book Your First Cleaning</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
            ))}
        </div>
    );
}

function BookingCard({ booking }: { booking: Booking }) {
    const serviceTypeLabel = {
        regular: 'Regular Cleaning',
        deep: 'Deep Cleaning',
        move_out: 'Move-Out Cleaning',
    }[booking.service_type] || booking.service_type;

    return (
        <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="block border border-gray-200 p-6 rounded-sm hover:shadow-card transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-lg">{serviceTypeLabel}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.scheduled_date), 'MMM d, yyyy')} • {booking.scheduled_time}
                        </span>
                    </div>
                </div>

                <StatusBadge status={booking.status} />
            </div>

            {booking.cleaners && (
                <div className="flex items-center gap-3 mb-4">
                    {booking.cleaners.profile_photo ? (
                        <img
                            src={booking.cleaners.profile_photo}
                            alt={booking.cleaners.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                    <div>
                        <p className="text-sm font-medium">{booking.cleaners.name}</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {booking.addresses.street_address}, {booking.addresses.city}
                </div>

                <div className="flex items-center gap-1 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {(booking.price_final / 100).toFixed(0)}
                </div>
            </div>
        </Link>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-green-100 text-green-700',
        in_progress: 'bg-blue-100 text-blue-700',
        completed: 'bg-gray-100 text-gray-700',
        cancelled: 'bg-red-100 text-red-700',
    }[status] || 'bg-gray-100 text-gray-700';

    const label = status.replace('_', ' ');

    return (
        <span className={`px-3 py-1 rounded-sm text-xs font-medium capitalize ${styles}`}>
            {label}
        </span>
    );
}
