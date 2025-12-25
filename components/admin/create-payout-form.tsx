'use client';

import { useState } from 'react';
import { createPayout } from '@/app/actions/finance';

export function CreatePayoutForm({
    bookingId,
    cleanerId,
    customerPaid,
}: {
    bookingId: string;
    cleanerId: string;
    customerPaid: number;
}) {
    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await createPayout({
                bookingId,
                cleanerId,
                amountToPay: parseFloat(amount),
                notes,
            });

            alert('Payout created successfully');
        } catch (error: any) {
            alert('Failed to create payout: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    // Quick suggestion buttons
    const suggestions = [
        { label: '80%', value: customerPaid * 0.8 },
        { label: '85%', value: customerPaid * 0.85 },
        { label: '90%', value: customerPaid * 0.9 },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
            <div>
                <label className="block text-sm font-medium mb-2">
                    How much to pay cleaner?
                </label>

                {/* Quick buttons */}
                <div className="flex gap-2 mb-3">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.label}
                            type="button"
                            onClick={() => setAmount(suggestion.value.toFixed(2))}
                            className="px-3 py-1 text-sm border rounded hover:bg-muted"
                        >
                            {suggestion.label} (${suggestion.value.toFixed(2)})
                        </button>
                    ))}
                </div>

                <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Notes (optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. 'Standard rate' or 'Bonus for difficult job'"
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                />
            </div>

            <button
                type="submit"
                disabled={loading || !amount}
                className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Payout'}
            </button>
        </form>
    );
}
