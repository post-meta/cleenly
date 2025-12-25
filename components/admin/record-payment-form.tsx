'use client';

import { useState } from 'react';
import { recordPayment } from '@/app/actions/finance';

export function RecordPaymentForm({
    bookingId,
    amountDue,
}: {
    bookingId: string;
    amountDue: number;
}) {
    const [amount, setAmount] = useState(amountDue.toFixed(2));
    const [method, setMethod] = useState('stripe');
    const [transactionId, setTransactionId] = useState('');
    const [checkNumber, setCheckNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await recordPayment({
                bookingId,
                amountPaid: parseFloat(amount),
                method,
                transactionId: transactionId || undefined,
                checkNumber: checkNumber || undefined,
                notes: notes || undefined,
            });

            alert('Payment recorded successfully');
            // No need to reset detailed fields as page will revalidate
        } catch (error: any) {
            alert('Failed to record payment: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t mt-4">
            <h3 className="font-medium text-sm">Record New Payment</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium mb-1">Amount ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">Method</label>
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                    >
                        <option value="stripe">Stripe</option>
                        <option value="venmo">Venmo</option>
                        <option value="zelle">Zelle</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="invoice">Invoice</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium mb-1">Transaction ID (Optional)</label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                        placeholder="e.g. pi_123..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">Check Number (Optional)</label>
                    <input
                        type="text"
                        value={checkNumber}
                        onChange={(e) => setCheckNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm"
                        placeholder="e.g. 1045"
                        disabled={method !== 'check'}
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium mb-1">Notes (Optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                    rows={2}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50"
            >
                {loading ? 'Recording...' : 'Record Payment'}
            </button>
        </form>
    );
}
