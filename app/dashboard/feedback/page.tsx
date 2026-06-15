import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Star, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { FeedbackForm } from '@/components/dashboard/feedback-form';

export default async function FeedbackPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const uid = (session.user as { id?: string } | undefined)?.id;
    const { data: items } = uid
        ? await supabase
              .from('feedback')
              .select('*')
              .eq('user_id', uid)
              .order('created_at', { ascending: false })
              .limit(20)
        : { data: null };

    const googleReviewUrl =
        process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
        'https://www.google.com/search?q=Pro+Craft+Cleaning+Tacoma+reviews';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold">Help &amp; Feedback</h1>
                <p className="text-gray-600 mt-2">
                    Questions, problems, or kind words — tell us. A real person reads every message.
                </p>
            </div>

            <FeedbackForm />

            {/* Public review nudge — the real channel for a local business */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold mb-1">Happy with your cleaning?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        A quick Google review helps your neighbors find us — it means a lot to a family business.
                    </p>
                    <a
                        href={googleReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                    >
                        Leave a Google review <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* History */}
            {items && items.length > 0 && (
                <div className="space-y-3">
                    <h2 className="font-sans text-xl font-semibold">Your messages</h2>
                    {items.map((it) => (
                        <div key={it.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 capitalize">
                                    {it.type}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {it.created_at ? format(new Date(it.created_at), 'MMM d, yyyy') : ''}
                                    {it.status === 'resolved' && ' • resolved'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{it.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
