'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { markMultiplePayoutsPaid } from '@/app/actions/finance';
import { Loader2, X } from 'lucide-react';

interface PayAllModalProps {
    isOpen: boolean;
    onClose: () => void;
    cleanerName: string;
    payoutIds: string[];
    totalAmount: number;
}

export function PayAllModal({
    isOpen,
    onClose,
    cleanerName,
    payoutIds,
    totalAmount,
}: PayAllModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        method: 'venmo',
        transactionId: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await markMultiplePayoutsPaid(
            payoutIds,
            formData.method,
            formData.transactionId || undefined
        );

        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        // Reset form and close modal
        setFormData({ method: 'venmo', transactionId: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Pay All - {cleanerName}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold">${(totalAmount / 100).toFixed(2)}</p>
                        <p className="text-sm text-gray-600 mt-1">
                            {payoutIds.length} payout{payoutIds.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Payment Method
                        </label>
                        <select
                            value={formData.method}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="venmo">Venmo</option>
                            <option value="zelle">Zelle</option>
                            <option value="cash">Cash</option>
                            <option value="check">Check</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>

                    <Input
                        name="transactionId"
                        label="Transaction ID (optional)"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        placeholder="e.g., 1234567890"
                    />

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Mark as Paid
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
