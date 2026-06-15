'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createBookingInvoice } from '@/app/actions/stripe';
import { Loader2, ExternalLink } from 'lucide-react';

// Hourly rates in DOLLARS, mirrored from lib/pricing.ts HOURLY_RATE_CENTS.
const HOURLY_RATE: Record<string, number> = {
    regular: 50,
    deep: 60,
    move_out: 60,
};

export function InvoiceCustomerForm({
    bookingId,
    serviceType,
}: {
    bookingId: string;
    serviceType: string;
}) {
    const [hours, setHours] = useState('');
    const [override, setOverride] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ url?: string | null; error?: string } | null>(null);

    const rate = HOURLY_RATE[serviceType] ?? 50;
    const hoursNum = parseFloat(hours);
    const computed = !isNaN(hoursNum) ? hoursNum * rate : 0;
    const overrideNum = parseFloat(override);
    const usingOverride = !isNaN(overrideNum) && overrideNum > 0;
    const amount = usingOverride ? overrideNum : computed;

    async function submit() {
        setLoading(true);
        setResult(null);
        try {
            const res = await createBookingInvoice({
                bookingId,
                hours: isNaN(hoursNum) ? 0 : hoursNum,
                amountOverrideCents: usingOverride ? Math.round(overrideNum * 100) : undefined,
            });
            if ('error' in res) setResult({ error: res.error });
            else setResult({ url: res.hostedInvoiceUrl });
        } catch (e: any) {
            setResult({ error: e?.message || 'Failed to create invoice' });
        } finally {
            setLoading(false);
        }
    }

    const canSubmit = !loading && amount >= 0.5;

    return (
        <div className="pt-4 border-t mt-4 space-y-4">
            <div>
                <h3 className="font-medium text-sm">Bill customer (hourly)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                    {serviceType === 'regular' ? 'Regular' : serviceType === 'deep' ? 'Deep' : 'Move-out'} ·
                    ${rate}/hr. Enter hours worked — Stripe emails the customer a hosted invoice to pay.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium mb-1">Hours worked</label>
                    <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="e.g. 3.5"
                        className="w-full px-3 py-2 border rounded text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1">
                        Or override amount ($)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={override}
                        onChange={(e) => setOverride(e.target.value)}
                        placeholder="optional"
                        className="w-full px-3 py-2 border rounded text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Invoice total</span>
                <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>

            <Button
                variant="primary"
                size="sm"
                className="w-full"
                disabled={!canSubmit}
                onClick={submit}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    'Create & send Stripe invoice'
                )}
            </Button>

            {result?.error && (
                <p className="text-sm text-red-600">{result.error}</p>
            )}
            {result && !result.error && (
                <div className="text-sm text-green-700 space-y-1">
                    <p>✓ Invoice created and emailed to the customer.</p>
                    {result.url && (
                        <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:underline"
                        >
                            Open hosted invoice <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
