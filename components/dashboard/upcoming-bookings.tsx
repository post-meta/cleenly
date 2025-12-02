import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UpcomingBookings({ bookings }: { bookings: any[] }) {
    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Cleanings</h2>
                <Link href="/dashboard/bookings">
                    <Button variant="link" className="text-accent">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                    <Link
                        key={booking.id}
                        href={`/dashboard/bookings/${booking.id}`}
                        className="block border border-gray-200 p-4 rounded-sm hover:shadow-card transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <span className="font-medium capitalize">
                                {booking.service_type.replace('_', ' ')}
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-sm capitalize">
                                {booking.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {format(new Date(booking.scheduled_date), 'MMM d')} • {booking.scheduled_time}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">
                                    {booking.addresses.street_address}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
