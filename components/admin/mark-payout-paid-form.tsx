'use client';

import { useState } from 'react';
import { markPayoutPaid } from '@/app/actions/finance';

export function MarkPayoutPaidForm({ payoutId }: { payoutId: string }) {
    const [method, setMethod] = useState('venmo');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await markPayoutPaid({
                payoutId,
                method,
                transactionId: transactionId || undefined,
            });

            alert('Payout marked as paid');
        } catch (error: any) {
            alert('Failed to mark as paid: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm font-medium">Mark as Paid</p>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                        Method
                    </label>
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                        <option value="venmo">Venmo</option>
                        <option value="zelle">Zelle</option>
                        <option value="check">Check</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                        Transaction ID
                    </label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Optional"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Mark as Paid'}
            </button>
        </form>
    );
}
