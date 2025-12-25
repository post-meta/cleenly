import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { RecordPaymentForm } from '@/components/admin/record-payment-form';
import { CreatePayoutForm } from '@/components/admin/create-payout-form';
import { MarkPayoutPaidForm } from '@/components/admin/mark-payout-paid-form';

export default async function BookingDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createClient();

    const { data: booking } = await supabase
        .from('bookings')
        .select(`
      *,
      customer:profiles!customer_id(*),
      cleaner:cleaner_profiles(*),
      payments(*),
      payouts:cleaner_payouts(*)
    `)
        .eq('id', params.id)
        .single();

    if (!booking) notFound();

    const totalPaid = booking.payments
        ?.filter((p: any) => p.status === 'completed')
        .reduce((sum: number, p: any) => sum + Number(p.amount_paid || 0), 0) || 0;

    const payoutExists = booking.payouts && booking.payouts.length > 0;
    const totalToPay = booking.payouts
        ?.reduce((sum: number, p: any) => sum + Number(p.amount_to_pay || 0), 0) || 0;
    const totalPaidToCleaner = booking.payouts
        ?.reduce((sum: number, p: any) => sum + Number(p.amount_paid || 0), 0) || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-semibold">
                        Booking #{booking.id.slice(0, 8)}
                    </h1>
                    <p className="text-muted-foreground">
                        {new Date(booking.scheduled_date).toLocaleDateString()}
                    </p>
                </div>
                <StatusBadge status={booking.status || 'pending_payment'} />
            </div>

            {/* Customer & Service Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background border rounded-lg p-6">
                    <h2 className="font-semibold mb-4">Customer</h2>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {booking.customer?.full_name}</p>
                        <p><span className="text-muted-foreground">Email:</span> {booking.customer?.email}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {booking.customer?.phone}</p>
                        <p><span className="text-muted-foreground">Types:</span> {booking.service_type}</p>
                    </div>
                </div>
                <div className="bg-background border rounded-lg p-6">
                    <h2 className="font-semibold mb-4">Properties</h2>
                    <div className="space-y-2 text-sm">
                        <p>{booking.address_line1}</p>
                        <p>{booking.city}, {booking.state} {booking.zip}</p>
                        <p>{booking.bedrooms} Bed, {booking.bathrooms} Bath</p>
                    </div>
                </div>
            </div>

            {/* Payment from Customer */}
            <div className="bg-background border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Payment from Customer</h2>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`font-medium ${totalPaid >= booking.price_final
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }`}>
                            {totalPaid >= booking.price_final ? '✓ Paid' : '⚠ Pending'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Amount Paid</span>
                        <span className="font-semibold">
                            ${totalPaid} / ${booking.price_final}
                        </span>
                    </div>
                </div>

                {/* Payment History */}
                {booking.payments && booking.payments.length > 0 && (
                    <div className="mb-4 space-y-2">
                        <p className="text-sm font-medium">Payment History</p>
                        {booking.payments.map((payment: any) => (
                            <div key={payment.id} className="flex justify-between text-sm border-t pt-2">
                                <div>
                                    <span className="text-muted-foreground">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span className="capitalize">{payment.method}</span>
                                </div>
                                <span className="font-medium">${payment.amount_paid}</span>
                            </div>
                        ))}
                    </div>
                )}

                {totalPaid < booking.price_final && (
                    <RecordPaymentForm
                        bookingId={booking.id}
                        amountDue={booking.price_final - totalPaid}
                    />
                )}
            </div>

            {/* Cleaner Payout - MANUAL VERSION */}
            {booking.cleaner_id && booking.cleaner && (
                <div className="bg-background border rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Payout to Cleaner</h2>

                    {!payoutExists ? (
                        // No payout set yet - show form to create one
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Customer paid: ${totalPaid}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                No payout set for {booking.cleaner.full_name}
                            </p>

                            <CreatePayoutForm
                                bookingId={booking.id}
                                cleanerId={booking.cleaner_id}
                                customerPaid={totalPaid}
                            />
                        </div>
                    ) : (
                        // Payout exists - show details
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Amount to Pay</span>
                                <span className="font-semibold">${totalToPay}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Amount Paid</span>
                                <span className={`font-medium ${totalPaidToCleaner >= totalToPay
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                    }`}>
                                    ${totalPaidToCleaner}
                                </span>
                            </div>

                            <div className="flex justify-between items-center font-semibold pt-2 border-t">
                                <span>Balance</span>
                                <span className={
                                    totalPaidToCleaner >= totalToPay
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }>
                                    ${totalToPay - totalPaidToCleaner}
                                </span>
                            </div>

                            {/* Payout Details */}
                            {booking.payouts.map((payout: any) => (
                                <div key={payout.id} className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Created</span>
                                        <span>{new Date(payout.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {payout.notes && (
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Note: </span>
                                            <span>{payout.notes}</span>
                                        </div>
                                    )}

                                    {!payout.amount_paid && (
                                        <MarkPayoutPaidForm payoutId={payout.id} />
                                    )}

                                    {payout.amount_paid && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Paid via</span>
                                                <span className="capitalize">{payout.method}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Paid on</span>
                                                <span>
                                                    {new Date(payout.paid_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {payout.transaction_id && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Transaction ID</span>
                                                    <span className="font-mono text-xs">
                                                        {payout.transaction_id}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        pending_payment: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-3 py-1 rounded text-sm font-medium ${colors[status] || ''}`}>
            {status.replace('_', ' ')}
        </span>
    );
}
