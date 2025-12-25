import { createClient } from '@/lib/supabase/server';

export default async function FinancePage() {
    const supabase = await createClient();

    // Get unpaid cleaner payouts grouped by cleaner
    const { data: payouts } = await supabase
        .from('cleaner_payouts')
        .select(`
      *,
      cleaner:cleaner_profiles(*),
      booking:bookings(scheduled_date, service_type, price_final)
    `)
        .is('amount_paid', null)
        .order('created_at', { ascending: false });

    // Group by cleaner
    const payoutsByCleanerMap = new Map();

    payouts?.forEach((payout: any) => {
        const cleanerId = payout.cleaner_id;
        if (!payoutsByCleanerMap.has(cleanerId)) {
            payoutsByCleanerMap.set(cleanerId, {
                cleaner: payout.cleaner,
                payouts: [],
                totalOwed: 0,
            });
        }
        const entry = payoutsByCleanerMap.get(cleanerId);
        entry.payouts.push(payout);
        entry.totalOwed += Number(payout.amount_to_pay);
    });

    const payoutsByLeaner = Array.from(payoutsByCleanerMap.values());
    const totalOwedToAllCleaners = payoutsByLeaner.reduce(
        (sum, entry) => sum + entry.totalOwed,
        0
    );

    // Get pending customer payments
    const { data: pendingPayments } = await supabase
        .from('bookings')
        .select(`
      *,
      customer:profiles!customer_id(*)
    `)
        .in('status', ['pending_payment'])
        .order('scheduled_date', { ascending: true });

    const totalPendingRevenue = pendingPayments?.reduce(
        (sum, b) => sum + Number(b.price_final),
        0
    ) || 0;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-semibold">Finance</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background border rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">
                        Pending Customer Payments
                    </p>
                    <p className="text-3xl font-semibold">
                        ${totalPendingRevenue.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {pendingPayments?.length || 0} bookings
                    </p>
                </div>

                <div className="bg-background border rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">
                        Owed to Cleaners
                    </p>
                    <p className="text-3xl font-semibold text-red-600">
                        ${totalOwedToAllCleaners.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {payoutsByLeaner.length} cleaners
                    </p>
                </div>
            </div>

            {/* Unpaid Cleaners */}
            <div className="bg-background border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Unpaid Cleaner Payouts</h2>

                {payoutsByLeaner.length === 0 ? (
                    <p className="text-muted-foreground text-sm">All caught up! 🎉</p>
                ) : (
                    <div className="space-y-6">
                        {payoutsByLeaner.map((entry: any) => (
                            <div key={entry.cleaner.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-semibold">{entry.cleaner.full_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.payouts.length} unpaid job{entry.payouts.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <p className="text-2xl font-semibold text-red-600">
                                        ${entry.totalOwed.toFixed(2)}
                                    </p>
                                </div>

                                {/* Job Details */}
                                <div className="space-y-2">
                                    {entry.payouts.map((payout: any) => (
                                        <div
                                            key={payout.id}
                                            className="flex justify-between text-sm bg-muted p-3 rounded"
                                        >
                                            <div>
                                                <span className="font-medium">
                                                    {new Date(payout.booking.scheduled_date).toLocaleDateString()}
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span className="capitalize">
                                                    {payout.booking.service_type}
                                                </span>
                                                {payout.notes && (
                                                    <>
                                                        <span className="mx-2">•</span>
                                                        <span className="text-muted-foreground italic">
                                                            {payout.notes}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <span className="font-semibold">
                                                ${payout.amount_to_pay}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pending Customer Payments */}
            {pendingPayments && pendingPayments.length > 0 && (
                <div className="bg-background border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Pending Customer Payments
                    </h2>
                    <div className="space-y-3">
                        {pendingPayments.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex justify-between items-center p-3 border rounded"
                            >
                                <div>
                                    <p className="font-medium">{booking.customer?.full_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(booking.scheduled_date).toLocaleDateString()} •
                                        <span className="capitalize ml-1">{booking.service_type}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${booking.price_final}</p>

                                    <a
                                        href={`/admin/bookings/${booking.id}`}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
