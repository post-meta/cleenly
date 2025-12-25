'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { MapPin, User } from 'lucide-react';

interface Booking {
    id: string;
    service_type: string;
    scheduled_date: string | null;
    scheduled_time: string | null;
    status: string;
    price_final: number | null;
    address: string | null;
    city: string | null;
    name: string | null;
    guest_name: string | null;
    email: string | null;
    guest_email: string | null;
    cleaners?: {
        id: string;
        full_name: string;
        photo_url: string | null;
    } | null;
    paymentStatus?: 'paid' | 'partial' | 'unpaid';
}

interface BookingsTableProps {
    bookings: Booking[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <p className="text-gray-600">No bookings found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cleaner
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function BookingRow({ booking }: { booking: Booking }) {
    const serviceTypeLabel = {
        regular: 'Regular',
        deep: 'Deep',
        move_out: 'Move-Out',
    }[booking.service_type] || booking.service_type;

    const customerName = booking.name || booking.guest_name || booking.email || booking.guest_email || 'Unknown';

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4">
                <Link href={`/admin/bookings/${booking.id}`} className="block">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900 hover:text-accent">
                            {customerName}
                        </span>
                    </div>
                    {booking.address && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {booking.city}
                        </div>
                    )}
                </Link>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {serviceTypeLabel}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {booking.scheduled_date
                    ? format(new Date(booking.scheduled_date), 'MMM d, yyyy')
                    : '-'}
                {booking.scheduled_time && (
                    <span className="block text-xs text-gray-400">
                        {booking.scheduled_time}
                    </span>
                )}
            </td>
            <td className="px-6 py-4">
                {booking.cleaners ? (
                    <div className="flex items-center gap-2">
                        {booking.cleaners.photo_url ? (
                            <img
                                src={booking.cleaners.photo_url}
                                alt={booking.cleaners.full_name}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                {booking.cleaners.full_name.charAt(0)}
                            </div>
                        )}
                        <span className="text-sm">{booking.cleaners.full_name}</span>
                    </div>
                ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                )}
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={booking.status} />
            </td>
            <td className="px-6 py-4">
                <PaymentBadge status={booking.paymentStatus || 'unpaid'} />
            </td>
            <td className="px-6 py-4 text-right text-sm font-medium">
                {booking.price_final
                    ? `$${(booking.price_final / 100).toFixed(0)}`
                    : '-'}
            </td>
        </tr>
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
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm capitalize ${styles[status] || styles.new}`}>
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
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}
