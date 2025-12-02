'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';

export function BookingActions({ booking }: { booking: any }) {
    const [loading, setLoading] = useState(false);

    const canReschedule = ['pending', 'confirmed'].includes(booking.status);
    const canCancel = ['pending', 'confirmed'].includes(booking.status);

    const handleReschedule = async () => {
        // Open reschedule modal
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
                method: 'POST',
            });

            if (res.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="border border-gray-200 p-6 rounded-sm space-y-3">
            <h2 className="font-semibold mb-4">Actions</h2>

            {canReschedule && (
                <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleReschedule}
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                </Button>
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

            {booking.status === 'completed' && !booking.review && (
                <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                        // Open review modal
                    }}
                >
                    Leave a Review
                </Button>
            )}

            <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                    // Rebook with same settings
                }}
            >
                Book Again
            </Button>
        </section>
    );
}
