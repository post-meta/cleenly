'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateBookingStatus } from '@/app/actions/bookings';
import { Loader2 } from 'lucide-react';

interface BookingStatusActionsProps {
    bookingId: string;
    currentStatus: string;
}

export function BookingStatusActions({ bookingId, currentStatus }: BookingStatusActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true);
        await updateBookingStatus(bookingId, newStatus);
        setLoading(false);
    };

    const getAvailableActions = () => {
        switch (currentStatus) {
            case 'new':
                return [
                    { label: 'Confirm', status: 'confirmed', variant: 'primary' as const },
                    { label: 'Cancel', status: 'cancelled', variant: 'secondary' as const },
                ];
            case 'confirmed':
                return [
                    { label: 'Start', status: 'in_progress', variant: 'primary' as const },
                    { label: 'Cancel', status: 'cancelled', variant: 'secondary' as const },
                ];
            case 'in_progress':
                return [
                    { label: 'Complete', status: 'completed', variant: 'primary' as const },
                    { label: 'Cancel', status: 'cancelled', variant: 'secondary' as const },
                ];
            case 'completed':
                return []; // No actions available for completed bookings
            case 'cancelled':
                return [
                    { label: 'Reopen', status: 'new', variant: 'secondary' as const },
                ];
            default:
                return [];
        }
    };

    const actions = getAvailableActions();

    if (actions.length === 0) {
        return <p className="text-sm text-gray-600">No actions available</p>;
    }

    return (
        <div className="space-y-2">
            {actions.map((action) => (
                <Button
                    key={action.status}
                    variant={action.variant}
                    size="sm"
                    onClick={() => handleStatusChange(action.status)}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        action.label
                    )}
                </Button>
            ))}
        </div>
    );
}
