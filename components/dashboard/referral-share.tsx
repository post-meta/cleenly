'use client';

import { useState } from 'react';
import { Copy, Check, Share2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ReferralShare({ link }: { link: string }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard blocked */
        }
    }

    async function share() {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: 'CLEENLY',
                    text: 'Get $25 off your first house cleaning with CLEENLY',
                    url: link,
                });
            } catch {
                /* cancelled */
            }
        } else {
            copy();
        }
    }

    const mailto = `mailto:?subject=${encodeURIComponent(
        '$25 off your first CLEENLY cleaning'
    )}&body=${encodeURIComponent(
        `I use CLEENLY for house cleaning in the Seattle area — here's $25 off your first cleaning: ${link}`
    )}`;

    return (
        <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                    <code className="flex-1 text-sm font-mono break-all">{link}</code>
                    <Button variant="secondary" size="sm" onClick={copy}>
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2" /> Copied
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <a href={mailto}>
                    <Button variant="secondary">
                        <Mail className="w-4 h-4 mr-2" />
                        Share via Email
                    </Button>
                </a>
                <Button variant="secondary" onClick={share}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </div>
        </div>
    );
}
