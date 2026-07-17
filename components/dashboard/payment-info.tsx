import { CreditCard, Banknote, FileText } from 'lucide-react';

export function PaymentInfo({
    payment,
    booking
}: {
    payment: any;
    booking: any;
}) {
    const paymentMethodIcons = {
        card: CreditCard,
        stripe: CreditCard,
        cash: Banknote,
        check: FileText,
    };

    const Icon = payment?.payment_method
        ? paymentMethodIcons[payment.payment_method as keyof typeof paymentMethodIcons] || CreditCard
        : CreditCard;

    return (
        <section className="border border-gray-200 p-6 rounded-sm">
            <h2 className="font-sans font-semibold mb-4">Payment</h2>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Method</span>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium capitalize">
                            {payment?.payment_method === 'stripe'
                                ? 'Card'
                                : payment?.payment_method || 'Invoice after cleaning'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        {booking.price_final || payment?.amount_paid ? 'Amount' : 'Estimate'}
                    </span>
                    <span className="font-medium">{amountLabel(payment, booking)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <PaymentStatusBadge status={payment?.status || 'pending'} />
                </div>
            </div>

            {payment?.status !== 'completed' && (
                <div className="mt-4 p-3 bg-surface-warm rounded-sm">
                    <p className="text-xs text-foreground-soft">
                        You pay after the cleaning is done. We email your invoice —
                        pay online by card, no card needed to book.
                    </p>
                </div>
            )}
        </section>
    );
}

function amountLabel(payment: any, booking: any): string {
    if (payment?.amount_paid) return `$${(payment.amount_paid / 100).toFixed(2)}`;
    if (booking.price_final) return `$${(booking.price_final / 100).toFixed(2)}`;
    if (booking.estimated_min && booking.estimated_max) {
        return `$${Math.round(booking.estimated_min / 100)}–$${Math.round(booking.estimated_max / 100)}`;
    }
    if (booking.price_quoted) return `$${(booking.price_quoted / 100).toFixed(2)}`;
    return '—';
}

function PaymentStatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        authorized: 'bg-blue-100 text-blue-700',
        captured: 'bg-green-100 text-green-700',
        completed: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
    }[status] || 'bg-gray-100 text-gray-700';

    const label = status === 'pending' ? 'Due after cleaning' : status;

    return (
        <span className={`px-2 py-1 rounded-sm text-xs font-medium capitalize ${styles}`}>
            {label}
        </span>
    );
}
