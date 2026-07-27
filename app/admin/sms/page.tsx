import { clientSmsEnabled } from '@/lib/sms/client';
import {
    getMarketingAudience,
    getMarketingHistory,
    MARKETING_MONTHLY_CAP,
} from '@/lib/sms/marketing';
import { PromoForm } from './promo-form';

export const dynamic = 'force-dynamic';

function formatDate(value: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default async function AdminSmsPage() {
    const [audience, history] = await Promise.all([
        getMarketingAudience(),
        getMarketingHistory(),
    ]);

    const eligible = audience.filter(
        (m) => m.sentThisMonth < MARKETING_MONTHLY_CAP
    );
    const enabled = clientSmsEnabled();

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-semibold">SMS</h1>
                <p className="mt-2 max-w-[70ch] text-sm text-foreground-soft">
                    Booking confirmations and changes send themselves. This page is for
                    promotional messages to customers who opted in to offers, capped at{' '}
                    {MARKETING_MONTHLY_CAP} per phone per calendar month by the registered
                    campaign.
                </p>
                {!enabled ? (
                    <p className="mt-3 rounded-sm border border-mushroom bg-surface-warm p-3 text-sm">
                        Customer SMS is switched off. Set{' '}
                        <code className="font-mono">CLIENT_SMS_ENABLED=true</code> to send.
                    </p>
                ) : null}
            </div>

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-mushroom bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground-muted">
                        Opted in to offers
                    </p>
                    <p className="mt-1 text-2xl font-semibold">{audience.length}</p>
                </div>
                <div className="rounded-lg border border-mushroom bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground-muted">
                        Can receive today
                    </p>
                    <p className="mt-1 text-2xl font-semibold">{eligible.length}</p>
                </div>
                <div className="rounded-lg border border-mushroom bg-background p-4">
                    <p className="text-xs uppercase tracking-wide text-foreground-muted">
                        At monthly cap
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                        {audience.length - eligible.length}
                    </p>
                </div>
            </section>

            <section className="rounded-lg border border-mushroom bg-background p-5">
                <h2 className="text-lg font-medium">New promo</h2>
                <div className="mt-4">
                    <PromoForm eligible={eligible.length} />
                </div>
            </section>

            <section>
                <h2 className="text-lg font-medium">Audience</h2>
                {audience.length === 0 ? (
                    <p className="mt-3 text-sm text-foreground-muted">
                        Nobody has opted in to offers yet. The checkbox sits on the last step
                        of the booking wizard, separate from booking notifications.
                    </p>
                ) : (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wide text-foreground-muted">
                                <tr>
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Phone</th>
                                    <th className="py-2 pr-4">Last booking</th>
                                    <th className="py-2">This month</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audience.map((m) => (
                                    <tr key={m.phone} className="border-t border-mushroom/50">
                                        <td className="py-2 pr-4">{m.name ?? '—'}</td>
                                        <td className="py-2 pr-4 font-mono text-xs">{m.phone}</td>
                                        <td className="py-2 pr-4">{formatDate(m.lastBookingAt)}</td>
                                        <td className="py-2">
                                            {m.sentThisMonth}/{MARKETING_MONTHLY_CAP}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-lg font-medium">Recent promo sends</h2>
                {history.length === 0 ? (
                    <p className="mt-3 text-sm text-foreground-muted">Nothing sent yet.</p>
                ) : (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wide text-foreground-muted">
                                <tr>
                                    <th className="py-2 pr-4">Sent</th>
                                    <th className="py-2 pr-4">Phone</th>
                                    <th className="py-2 pr-4">Status</th>
                                    <th className="py-2">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((row) => (
                                    <tr key={row.id} className="border-t border-mushroom/50">
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {formatDate(row.created_at)}
                                        </td>
                                        <td className="py-2 pr-4 font-mono text-xs">{row.phone}</td>
                                        <td className="py-2 pr-4">
                                            {row.error_code ? `failed (${row.error_code})` : row.status}
                                        </td>
                                        <td className="py-2 text-foreground-soft">{row.body}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
