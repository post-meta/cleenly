'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { PHONE_SMS_HREF, PHONE_DISPLAY } from '@/lib/constants';

// Matches CANCELLABLE_STATUSES in /api/bookings/[id]/cancel.
const CANCELLABLE_STATUSES = ['new', 'pending', 'confirmed'];

export function BookingActions({ booking }: { booking: any }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const canCancel = CANCELLABLE_STATUSES.includes(booking.status);
    const canReschedule = CANCELLABLE_STATUSES.includes(booking.status);

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
                method: 'POST',
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const data = await res.json().catch(() => null);
                setError(data?.error || 'Could not cancel the booking. Please try again.');
            }
        } catch {
            setError('Could not cancel the booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="border border-gray-200 p-6 rounded-sm space-y-3">
            <h2 className="font-sans font-semibold mb-4">Actions</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-sm text-sm">
                    {error}
                </div>
            )}

            {canReschedule && (
                <a href={PHONE_SMS_HREF} className="block">
                    <Button variant="secondary" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Text us to reschedule
                    </Button>
                </a>
            )}

            {canCancel && (
                <Button
                    variant="secondary"
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    <X className="w-4 h-4 mr-2" />
                    {loading ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
            )}

            <Link href="/book" className="block">
                <Button variant="secondary" className="w-full">
                    Book Again
                </Button>
            </Link>

            <p className="text-xs text-gray-600 pt-2">
                Questions? Text {PHONE_DISPLAY} — a real person answers.
            </p>
        </section>
    );
}
