'use client';

import { useActionState, useState } from 'react';
import { sendPromoAction, type BlastState } from '@/app/actions/sms';

const OPT_OUT_SUFFIX = 'Reply STOP to opt out.';

/** Mirror of countSegments in lib/sms/templates.ts, for live feedback while typing. */
function countSegments(body: string): number {
    // eslint-disable-next-line no-control-regex
    const nonGsm = /[^\x20-\x7E\n\r£¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ§¿äöñüà@]/.test(body);
    if (nonGsm) {
        const units = [...body].length;
        return units <= 70 ? 1 : Math.ceil(units / 67);
    }
    return body.length <= 160 ? 1 : Math.ceil(body.length / 153);
}

export function PromoForm({ eligible }: { eligible: number }) {
    const [state, formAction, pending] = useActionState<BlastState, FormData>(
        sendPromoAction,
        { status: 'idle' }
    );
    const [body, setBody] = useState('');

    const preview = /reply\s+stop/i.test(body)
        ? body.trim()
        : `${body.trim()} ${OPT_OUT_SUFFIX}`.trim();
    const segments = countSegments(preview);

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="body" className="block text-sm font-medium">
                    Message
                </label>
                <textarea
                    id="body"
                    name="body"
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
                    placeholder="Spring deep clean is open for May. Book at cleenly.app"
                />
                <p className="text-xs text-foreground-muted">
                    The opt-out line is appended automatically when you leave it out.
                </p>
            </div>

            {body.trim() ? (
                <div className="rounded-sm border border-mushroom bg-surface-warm p-3">
                    <p className="text-xs uppercase tracking-wide text-foreground-muted">
                        Preview
                    </p>
                    <p className="mt-1 text-sm">{preview}</p>
                    <p className="mt-2 text-xs text-foreground-muted">
                        {preview.length} characters · {segments} segment
                        {segments === 1 ? '' : 's'} · {eligible} recipient
                        {eligible === 1 ? '' : 's'} ·{' '}
                        {segments * eligible} message
                        {segments * eligible === 1 ? '' : 's'} billed
                    </p>
                </div>
            ) : null}

            <div className="space-y-2">
                <label htmlFor="confirm" className="block text-sm font-medium">
                    Type SEND to confirm
                </label>
                <input
                    id="confirm"
                    name="confirm"
                    autoComplete="off"
                    className="w-40 rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={pending || eligible === 0}
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background disabled:opacity-60"
            >
                {pending ? 'Sending…' : `Send to ${eligible}`}
            </button>

            {state.status === 'error' ? (
                <p className="text-sm text-red-700">{state.error}</p>
            ) : null}

            {state.status === 'done' ? (
                <div className="rounded-sm border border-mushroom bg-surface-warm p-3 text-sm">
                    <p className="font-medium">Broadcast finished</p>
                    <p className="mt-1 text-foreground-soft">
                        Sent {state.result.sent} of {state.result.attempted}. Skipped{' '}
                        {state.result.skippedCapped} at the monthly cap, {state.result.failed}{' '}
                        failed.
                    </p>
                    {state.result.errors.length ? (
                        <ul className="mt-2 space-y-1 text-xs text-foreground-muted">
                            {state.result.errors.slice(0, 10).map((e) => (
                                <li key={e.phone}>
                                    {e.phone}: {e.reason}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            ) : null}
        </form>
    );
}
