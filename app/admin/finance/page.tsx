import { getFinanceSummary, getUnpaidPayoutsByCleaner } from '@/app/actions/finance';
import { DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { UnpaidPayoutsList } from './unpaid-payouts-list';

export default async function FinancePage() {
    const [summary, unpaidResult] = await Promise.all([
        getFinanceSummary(),
        getUnpaidPayoutsByCleaner(),
    ]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Finance</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <SummaryCard
                    icon={TrendingUp}
                    label="Monthly Revenue"
                    value={`$${summary.monthlyRevenue.toFixed(0)}`}
                    color="text-green-600"
                />
                <SummaryCard
                    icon={Calendar}
                    label="Completed Bookings"
                    value={summary.completedBookingsCount.toString()}
                    color="text-blue-600"
                />
                <SummaryCard
                    icon={Users}
                    label="Unpaid Payouts"
                    value={`$${summary.totalUnpaidPayouts.toFixed(0)}`}
                    color="text-orange-600"
                />
                <SummaryCard
                    icon={DollarSign}
                    label="Pending Payments"
                    value={`$${summary.totalPendingPayments.toFixed(0)}`}
                    color="text-red-600"
                />
            </div>

            {/* Unpaid Payouts by Cleaner */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Unpaid Cleaner Payouts</h2>

                {unpaidResult.error ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                        Error loading payouts: {unpaidResult.error}
                    </div>
                ) : unpaidResult.data?.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                        No unpaid payouts. All cleaners are paid up!
                    </div>
                ) : (
                    <UnpaidPayoutsList groupedPayouts={unpaidResult.data || []} />
                )}
            </section>
        </div>
    );
}

function SummaryCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: any;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${color}`} />
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
