import { format } from 'date-fns';
import { CreditCard, Banknote, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PaymentInfo({
    payment,
    booking
}: {
    payment: any;
    booking: any;
}) {
    const paymentMethodIcons = {
        card: CreditCard,
        cash: Banknote,
        check: FileText,
    };

    const Icon = payment?.payment_method
        ? paymentMethodIcons[payment.payment_method as keyof typeof paymentMethodIcons]
        : CreditCard;

    return (
        <section className="border border-gray-200 p-6 rounded-sm">
            <h2 className="font-semibold mb-4">Payment</h2>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Method</span>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium capitalize">
                            {payment?.payment_method || 'Pending'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">
                        ${((booking.price_final || booking.price_quoted) / 100).toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <PaymentStatusBadge status={payment?.status || 'pending'} />
                </div>
            </div>

            {payment?.status === 'completed' && (
                <Button
                    variant="link"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => {
                        // Download receipt
                    }}
                >
                    Download Receipt
                </Button>
            )}

            {payment?.status === 'pending' && booking.status === 'confirmed' && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-sm">
                    <p className="text-xs text-yellow-800">
                        Payment will be processed 24 hours before your scheduled cleaning.
                    </p>
                </div>
            )}
        </section>
    );
}

function PaymentStatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-700',
        authorized: 'bg-blue-100 text-blue-700',
        captured: 'bg-green-100 text-green-700',
        completed: 'bg-gray-100 text-gray-700',
        failed: 'bg-red-100 text-red-700',
    }[status] || 'bg-gray-100 text-gray-700';

    return (
        <span className={`px-2 py-1 rounded-sm text-xs font-medium capitalize ${styles}`}>
            {status}
        </span>
    );
}
