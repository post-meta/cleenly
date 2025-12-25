'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Cleaner {
    id: string;
    full_name: string;
}

interface BookingsFiltersProps {
    cleaners: Cleaner[];
}

export function BookingsFilters({ cleaners }: BookingsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        router.push(`/admin/bookings?${createQueryString(name, value)}`);
    };

    const currentStatus = searchParams.get('status') || 'all';
    const currentCleaner = searchParams.get('cleaner') || '';
    const currentDateFrom = searchParams.get('dateFrom') || '';
    const currentDateTo = searchParams.get('dateTo') || '';

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={currentStatus}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Cleaner Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cleaner
                    </label>
                    <select
                        value={currentCleaner}
                        onChange={(e) => handleFilterChange('cleaner', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    >
                        <option value="">All Cleaners</option>
                        <option value="unassigned">Unassigned</option>
                        {cleaners.map((cleaner) => (
                            <option key={cleaner.id} value={cleaner.id}>
                                {cleaner.full_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date From */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={currentDateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                </div>

                {/* Date To */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={currentDateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                </div>
            </div>

            {/* Clear Filters */}
            {(currentStatus !== 'all' || currentCleaner || currentDateFrom || currentDateTo) && (
                <div className="mt-3">
                    <button
                        onClick={() => router.push('/admin/bookings')}
                        className="text-sm text-gray-600 hover:text-foreground underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
}
