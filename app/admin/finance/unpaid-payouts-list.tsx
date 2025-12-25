'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PayAllModal } from '@/components/admin/pay-all-modal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GroupedPayout {
    cleaner: {
        id: string;
        full_name: string;
        phone: string | null;
        email: string | null;
    };
    payouts: Array<{
        id: string;
        amount: number;
        booking_id: string | null;
        created_at: string;
        bookings?: {
            id: string;
            service_type: string;
            scheduled_date: string | null;
        } | null;
    }>;
    total: number;
}

interface UnpaidPayoutsListProps {
    groupedPayouts: GroupedPayout[];
}

export function UnpaidPayoutsList({ groupedPayouts }: UnpaidPayoutsListProps) {
    return (
        <div className="space-y-4">
            {groupedPayouts.map((group) => (
                <CleanerPayoutCard key={group.cleaner.id} group={group} />
            ))}
        </div>
    );
}

function CleanerPayoutCard({ group }: { group: GroupedPayout }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const payoutIds = group.payouts.map((p) => p.id);

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {group.cleaner.full_name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold">{group.cleaner.full_name}</p>
                        <p className="text-sm text-gray-600">
                            {group.payouts.length} job{group.payouts.length > 1 ? 's' : ''} unpaid
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <p className="text-xl font-bold">${(group.total / 100).toFixed(0)}</p>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Pay All
                    </Button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="pb-2">Date</th>
                                <th className="pb-2">Service</th>
                                <th className="pb-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {group.payouts.map((payout) => (
                                <tr key={payout.id} className="border-t border-gray-200">
                                    <td className="py-2">
                                        {payout.bookings?.scheduled_date
                                            ? format(new Date(payout.bookings.scheduled_date), 'MMM d')
                                            : format(new Date(payout.created_at), 'MMM d')}
                                    </td>
                                    <td className="py-2">
                                        {payout.bookings?.service_type
                                            ? payout.bookings.service_type.replace('_', ' ')
                                            : 'Manual payout'}
                                    </td>
                                    <td className="py-2 text-right font-medium">
                                        ${(payout.amount / 100).toFixed(0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <PayAllModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cleanerName={group.cleaner.full_name}
                payoutIds={payoutIds}
                totalAmount={group.total}
            />
        </div>
    );
}
