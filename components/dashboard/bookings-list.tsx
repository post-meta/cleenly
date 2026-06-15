import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Booking = {
    id: string;
    service_type: string;
    scheduled_date?: string | null;
    scheduled_time?: string | null;
    preferred_date?: string | null;
    preferred_time?: string | null;
    status: string;
    price_final?: number | null;
    estimated_min?: number | null;
    estimated_max?: number | null;
    address?: string | null;
    city?: string | null;
    zip?: string | null;
    addresses?: {
        street_address: string;
        city: string;
    } | null;
    cleaners?: {
        name?: string;
        full_name?: string;
        profile_photo?: string;
        photo_url?: string;
    } | null;
};

const SERVICE_LABELS: Record<string, string> = {
    regular: 'Regular Cleaning',
    deep: 'Deep Cleaning',
    move_out: 'Move-Out Cleaning',
};

function whenLabel(b: Booking): string {
    const d = b.scheduled_date || b.preferred_date;
    const time = b.scheduled_time || b.preferred_time;
    if (!d) return 'To be scheduled';
    const datePart = format(new Date(d), 'MMM d, yyyy');
    return time ? `${datePart} • ${time}` : datePart;
}

function addressLabel(b: Booking): string {
    if (b.addresses) return `${b.addresses.street_address}, ${b.addresses.city}`;
    return [b.address, b.city].filter(Boolean).join(', ') || 'Address on file';
}

function priceLabel(b: Booking): string {
    if (b.price_final) return `$${(b.price_final / 100).toFixed(0)}`;
    if (b.estimated_min && b.estimated_max) {
        return `~$${(b.estimated_min / 100).toFixed(0)}–${(b.estimated_max / 100).toFixed(0)}`;
    }
    return '—';
}

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
    const serviceTypeLabel = SERVICE_LABELS[booking.service_type] || booking.service_type;
    const cleanerName = booking.cleaners?.full_name || booking.cleaners?.name;
    const cleanerPhoto = booking.cleaners?.photo_url || booking.cleaners?.profile_photo;

    return (
        <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="block border border-gray-200 p-6 rounded-sm hover:shadow-card transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-lg">{serviceTypeLabel}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1 capitalize">
                            <Calendar className="w-4 h-4" />
                            {whenLabel(booking)}
                        </span>
                    </div>
                </div>

                <StatusBadge status={booking.status} />
            </div>

            {cleanerName && (
                <div className="flex items-center gap-3 mb-4">
                    {cleanerPhoto ? (
                        <img
                            src={cleanerPhoto}
                            alt={cleanerName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                    <div>
                        <p className="text-sm font-medium">{cleanerName}</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {addressLabel(booking)}
                </div>

                <div className="flex items-center gap-1 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {priceLabel(booking).replace('$', '')}
                </div>
            </div>
        </Link>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        new: 'bg-yellow-100 text-yellow-700',
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
