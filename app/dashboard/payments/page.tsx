import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Plus, CreditCard, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function PaymentsPage() {
    const session = await auth();
    if (!session) redirect('/login');

    // TODO: Fetch payment methods from Stripe or payment provider
    // For now, showing placeholder UI
    const paymentMethods: any[] = [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Payment Methods</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your saved payment methods
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">ℹ️</div>
                <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Secure Payment Processing</p>
                    <p>
                        All payment information is securely processed and stored by our payment provider.
                        We never store your full card details on our servers.
                    </p>
                </div>
            </div>

            {paymentMethods.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No payment methods yet</h3>
                    <p className="text-gray-600 mb-6">
                        Add a payment method to complete your bookings faster
                    </p>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Payment Method
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-card transition-shadow relative"
                        >
                            {method.is_default && (
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                                        <Star className="w-3 h-3 fill-current" />
                                        Default
                                    </span>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1">
                                        {method.brand} •••• {method.last4}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Expires {method.exp_month}/{method.exp_year}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                {!method.is_default && (
                                    <button className="text-sm text-accent hover:underline">
                                        Set as Default
                                    </button>
                                )}
                                <span className="text-gray-300 ml-auto">•</span>
                                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold mb-4">Payment History</h2>
                <div className="text-center py-8 text-gray-500">
                    No payment history yet
                </div>
            </div>
        </div>
    );
}
