'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

const filters = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Past', value: 'past' },
    { label: 'Cancelled', value: 'cancelled' },
];

export function BookingFilters({ currentStatus }: { currentStatus: string }) {
    return (
        <div className="border-b border-gray-200">
            <div className="flex gap-6">
                {filters.map((filter) => (
                    <Link
                        key={filter.value}
                        href={`/dashboard/bookings?status=${filter.value}`}
                        className={cn(
                            'pb-3 border-b-2 transition-colors',
                            currentStatus === filter.value
                                ? 'border-accent text-accent font-medium'
                                : 'border-transparent text-gray-600 hover:text-foreground'
                        )}
                    >
                        {filter.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
