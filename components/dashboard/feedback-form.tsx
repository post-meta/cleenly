'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitFeedback } from '@/app/dashboard/feedback/actions';

const OPTIONS = [
    { value: 'feedback', label: 'Feedback' },
    { value: 'question', label: 'Question' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'praise', label: 'Praise' },
];

export function FeedbackForm() {
    const [type, setType] = useState('feedback');
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        const res = await submitFeedback({ type, message });
        setBusy(false);
        if ('error' in res) setMsg({ err: res.error });
        else {
            setMsg({ ok: 'Thanks — we got it. We read every message.' });
            setMessage('');
        }
    }

    return (
        <form onSubmit={onSubmit} className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">What's this about?</label>
                <div className="flex flex-wrap gap-2">
                    {OPTIONS.map((o) => (
                        <button
                            key={o.value}
                            type="button"
                            onClick={() => setType(o.value)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                                type === o.value
                                    ? 'bg-accent/10 border-accent text-accent'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Your message</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Tell us what's on your mind — a problem, a question, or what went well."
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    required
                />
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={busy}>
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Send</>}
                </Button>
                {msg && (
                    <p className={`text-sm ${msg.err ? 'text-red-600' : 'text-green-700'}`}>
                        {msg.err || msg.ok}
                    </p>
                )}
            </div>
        </form>
    );
}
