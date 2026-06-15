import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { format } from 'date-fns';
import { Gift, Check, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ReferralShare } from '@/components/dashboard/referral-share';
import { REFERRAL_REWARD_DOLLARS } from '@/lib/referrals/config';

function makeCode(userId: string): string {
    return crypto.createHash('md5').update(userId).digest('hex').slice(0, 8).toUpperCase();
}

export default async function ReferralsPage() {
    const session = await auth();
    if (!session) redirect('/login');
    const uid = (session.user as { id?: string } | undefined)?.id;

    // Ensure the user has a referral code (older/social accounts may lack one).
    const { data: user } = uid
        ? await supabase.from('users').select('referral_code').eq('id', uid).single()
        : { data: null };
    let code = user?.referral_code as string | undefined;
    if (!code && uid) {
        code = makeCode(uid);
        await supabase.from('users').update({ referral_code: code }).eq('id', uid);
    }
    const referralLink = `https://www.cleenly.app/register?ref=${code || 'WELCOME'}`;

    const { data: referrals } = uid
        ? await supabase
              .from('referrals')
              .select('*')
              .eq('referrer_user_id', uid)
              .order('created_at', { ascending: false })
        : { data: [] };
    const { data: credits } = uid
        ? await supabase.from('referral_credits').select('amount_cents, type').eq('user_id', uid)
        : { data: [] };

    const list = referrals || [];
    const ledger = credits || [];
    const totalReferrals = list.length;
    const rewardedCount = list.filter((r) => r.status === 'rewarded').length;
    const earnedCents = ledger
        .filter((c) => c.type === 'referrer_reward' && c.amount_cents > 0)
        .reduce((s, c) => s + Number(c.amount_cents), 0);
    const balanceCents = ledger.reduce((s, c) => s + Number(c.amount_cents), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold">Refer &amp; Earn</h1>
                <p className="text-gray-600 mt-2">
                    Share CLEENLY with friends and earn ${REFERRAL_REWARD_DOLLARS} credit for each referral
                </p>
            </div>

            {/* How it Works */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-sm flex items-center justify-center">
                        <Gift className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="font-sans text-2xl font-semibold">How It Works</h2>
                        <p className="text-gray-600">
                            Give ${REFERRAL_REWARD_DOLLARS}, Get ${REFERRAL_REWARD_DOLLARS}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        ['Share Your Link', `Send your unique link to friends who haven't used CLEENLY`],
                        ['They Book & Save', `Your friend gets $${REFERRAL_REWARD_DOLLARS} off their first cleaning`],
                        ['You Earn Credit', `After their first cleaning is completed, you get $${REFERRAL_REWARD_DOLLARS} credit`],
                    ].map(([title, desc], i) => (
                        <div key={title}>
                            <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold mb-3">
                                {i + 1}
                            </div>
                            <h3 className="font-semibold mb-2">{title}</h3>
                            <p className="text-sm text-gray-600">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Referral Link */}
            <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="font-sans text-xl font-semibold mb-4">Your Referral Link</h2>
                <ReferralShare link={referralLink} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat value={String(totalReferrals)} label="Total Referrals" />
                <Stat value={String(rewardedCount)} label="Completed Bookings" />
                <Stat value={`$${(earnedCents / 100).toFixed(0)}`} label="Credit Earned" accent />
                <Stat value={`$${(balanceCents / 100).toFixed(0)}`} label="Available Balance" muted />
            </div>

            {/* Referral History */}
            <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="font-sans text-xl font-semibold mb-4">Referral History</h2>

                {totalReferrals === 0 ? (
                    <div className="text-center py-12">
                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No referrals yet</h3>
                        <p className="text-gray-600">Share your link with friends to start earning credits</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {list.map((r) => {
                            const rewarded = r.status === 'rewarded';
                            return (
                                <div
                                    key={r.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                rewarded ? 'bg-green-100' : 'bg-gray-100'
                                            }`}
                                        >
                                            {rewarded ? (
                                                <Check className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{r.referred_email || 'Invited friend'}</p>
                                            <p className="text-sm text-gray-600">
                                                {rewarded ? 'Completed first booking' : 'Signed up — pending first cleaning'}
                                                {r.created_at && ` • ${format(new Date(r.created_at), 'MMM d, yyyy')}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${rewarded ? 'text-green-600' : 'text-gray-400'}`}>
                                            +${REFERRAL_REWARD_DOLLARS}
                                        </p>
                                        <p className="text-xs text-gray-500">{rewarded ? 'Applied' : 'Pending'}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Terms */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Referral Program Terms</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Referral credit is applied after your friend completes their first cleaning</li>
                    <li>• ${REFERRAL_REWARD_DOLLARS} credit is automatically applied to your next invoice</li>
                    <li>• Credit does not expire</li>
                    <li>• Your friend must be new to CLEENLY</li>
                    <li>• One referral credit per new customer</li>
                </ul>
            </div>
        </div>
    );
}

function Stat({
    value,
    label,
    accent,
    muted,
}: {
    value: string;
    label: string;
    accent?: boolean;
    muted?: boolean;
}) {
    return (
        <div className="border border-gray-200 rounded-lg p-6 text-center">
            <p className={`text-3xl font-bold ${accent ? 'text-green-600' : muted ? 'text-gray-400' : 'text-accent'}`}>
                {value}
            </p>
            <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
    );
}
