import { format } from 'date-fns';
import { Check, Clock, X } from 'lucide-react';

export function BookingTimeline({ booking }: { booking: any }) {
    const events = [
        {
            status: 'created',
            label: 'Booking Created',
            timestamp: booking.created_at,
            completed: true,
        },
        {
            status: 'confirmed',
            label: 'Confirmed',
            timestamp: booking.confirmed_at,
            completed: ['confirmed', 'in_progress', 'completed'].includes(booking.status),
        },
        {
            status: 'in_progress',
            label: 'Cleaning Started',
            timestamp: booking.started_at,
            completed: ['in_progress', 'completed'].includes(booking.status),
        },
        {
            status: 'completed',
            label: 'Completed',
            timestamp: booking.completed_at,
            completed: booking.status === 'completed',
        },
    ];

    if (booking.status === 'cancelled') {
        events.push({
            status: 'cancelled',
            label: 'Cancelled',
            timestamp: booking.cancelled_at,
            completed: true,
        });
    }

    return (
        <section className="border border-gray-200 p-6 rounded-sm">
            <h2 className="font-semibold mb-4">Timeline</h2>

            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={event.status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${event.completed
                                        ? event.status === 'cancelled'
                                            ? 'bg-red-100'
                                            : 'bg-green-100'
                                        : 'bg-gray-100'
                                    }`}
                            >
                                {event.completed ? (
                                    event.status === 'cancelled' ? (
                                        <X className="w-4 h-4 text-red-600" />
                                    ) : (
                                        <Check className="w-4 h-4 text-green-600" />
                                    )
                                ) : (
                                    <Clock className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                            {index < events.length - 1 && (
                                <div
                                    className={`w-0.5 h-12 ${event.completed ? 'bg-gray-300' : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>

                        <div className="flex-1 pb-6">
                            <p className="font-medium">{event.label}</p>
                            {event.timestamp && (
                                <p className="text-sm text-gray-600">
                                    {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
