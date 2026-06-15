'use client';

import { useState } from 'react';
import { Star, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitReview } from '@/app/actions/reviews';

const GOOGLE_REVIEW_URL =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
    'https://www.google.com/search?q=Pro+Craft+Cleaning+Tacoma+reviews';

export function ReviewForm({
    bookingId,
    existing,
}: {
    bookingId: string;
    existing?: { rating: number; comment: string | null } | null;
}) {
    const [rating, setRating] = useState(existing?.rating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState(existing?.comment || '');
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState<number | null>(existing?.rating ?? null);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!rating) {
            setErr('Pick a star rating');
            return;
        }
        setBusy(true);
        setErr(null);
        const res = await submitReview({ bookingId, rating, comment });
        setBusy(false);
        if ('error' in res) setErr(res.error);
        else setDone(res.rating);
    }

    const Stars = (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    disabled={done !== null && existing != null}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    className="p-0.5"
                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                    <Star
                        className={`w-7 h-7 ${
                            (hover || rating) >= n
                                ? 'fill-accent text-accent'
                                : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );

    // After submitting, thank + (for happy customers) nudge a Google review.
    if (done !== null) {
        return (
            <section className="border border-gray-200 p-6 rounded-sm">
                <h2 className="font-sans font-semibold mb-3">Your review</h2>
                {Stars}
                {comment && <p className="text-sm text-gray-600 mt-3">{comment}</p>}
                <p className="text-sm text-green-700 mt-3">Thank you for the feedback!</p>
                {done >= 4 && (
                    <a
                        href={GOOGLE_REVIEW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-2"
                    >
                        Would you share it on Google? <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </section>
        );
    }

    return (
        <section className="border border-gray-200 p-6 rounded-sm">
            <h2 className="font-sans font-semibold mb-1">How did we do?</h2>
            <p className="text-sm text-gray-600 mb-4">Rate this cleaning — it helps us and your cleaner.</p>
            <form onSubmit={onSubmit} className="space-y-4">
                {Stars}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Anything you'd like us to know? (optional)"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                />
                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={busy}>
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit review'}
                    </Button>
                    {err && <p className="text-sm text-red-600">{err}</p>}
                </div>
            </form>
        </section>
    );
}
