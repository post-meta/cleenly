import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Receipt } from 'lucide-react';
import Link from 'next/link';

const SERVICE_LABELS: Record<string, string> = {
    regular: 'Regular Cleaning',
    deep: 'Deep Cleaning',
    move_out: 'Move-Out Cleaning',
};

export default async function PaymentsPage() {
    const session = await auth();
    const uid = (session?.user as { id?: string } | undefined)?.id;
    if (!uid) redirect('/login');

    const { data: payments } = await supabase
        .from('payments')
        .select('*, bookings!inner(id, user_id, service_type, scheduled_date, preferred_date)')
        .eq('bookings.user_id', uid)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold">Payments</h1>
                <p className="text-gray-600 mt-2">
                    Your invoices and payment history
                </p>
            </div>

            <div className="bg-surface-warm border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-foreground-soft">
                    <span className="font-medium text-foreground">How payment works:</span>{' '}
                    no card needed to book. After your cleaning is done, we email you an
                    invoice based on the actual hours worked — pay online by card.
                </p>
            </div>

            {!payments || payments.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
                    <p className="text-gray-600">
                        Your invoices will show up here after your first cleaning.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {payments.map((payment: any) => {
                        const booking = payment.bookings;
                        const serviceLabel =
                            SERVICE_LABELS[booking?.service_type] || booking?.service_type || 'Cleaning';
                        const date = payment.processed_at || payment.created_at;
                        const amount = payment.amount_paid ?? payment.amount;

                        return (
                            <Link
                                key={payment.id}
                                href={`/dashboard/bookings/${booking?.id}`}
                                className="flex items-center justify-between border border-gray-200 rounded-lg p-5 hover:shadow-card transition-shadow"
                            >
                                <div>
                                    <p className="font-medium">{serviceLabel}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {date ? format(new Date(date), 'MMM d, yyyy') : '—'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">
                                        {amount != null ? `$${(amount / 100).toFixed(2)}` : '—'}
                                    </p>
                                    <PaymentStatusBadge status={payment.status || 'pending'} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function PaymentStatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        completed: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-gray-100 text-gray-700',
    }[status] || 'bg-gray-100 text-gray-700';

    return (
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-sm text-xs font-medium capitalize ${styles}`}>
            {status}
        </span>
    );
}
