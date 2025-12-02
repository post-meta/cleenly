import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Gift, Copy, Mail, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function ReferralsPage() {
    const session = await auth();
    if (!session) redirect('/login');

    // Generate referral code from user email or ID
    const referralCode = session.user?.email?.split('@')[0]?.toUpperCase().slice(0, 8) || 'WELCOME';
    const referralLink = `https://www.cleenly.app/register?ref=${referralCode}`;

    // TODO: Fetch actual referral stats from database
    const stats = {
        totalReferrals: 0,
        completedBookings: 0,
        creditEarned: 0,
        pendingCredit: 0,
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold">Refer & Earn</h1>
                <p className="text-gray-600 mt-2">
                    Share CLEENLY with friends and earn $25 credit for each referral
                </p>
            </div>

            {/* How it Works */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-sm flex items-center justify-center">
                        <Gift className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold">How It Works</h2>
                        <p className="text-gray-600">Give $25, Get $25</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold mb-3">
                            1
                        </div>
                        <h3 className="font-semibold mb-2">Share Your Link</h3>
                        <p className="text-sm text-gray-600">
                            Send your unique referral link to friends who haven't used CLEENLY
                        </p>
                    </div>
                    <div>
                        <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold mb-3">
                            2
                        </div>
                        <h3 className="font-semibold mb-2">They Book & Save</h3>
                        <p className="text-sm text-gray-600">
                            Your friend gets $25 off their first cleaning when they sign up
                        </p>
                    </div>
                    <div>
                        <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-semibold mb-3">
                            3
                        </div>
                        <h3 className="font-semibold mb-2">You Earn Credit</h3>
                        <p className="text-sm text-gray-600">
                            After their first cleaning is completed, you get $25 credit
                        </p>
                    </div>
                </div>
            </div>

            {/* Referral Link */}
            <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                        <code className="flex-1 text-sm font-mono break-all">
                            {referralLink}
                        </code>
                        <Button variant="secondary" size="sm">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="secondary">
                        <Mail className="w-4 h-4 mr-2" />
                        Share via Email
                    </Button>
                    <Button variant="secondary">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-3xl font-bold text-accent">
                        {stats.totalReferrals}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Referrals</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-3xl font-bold text-accent">
                        {stats.completedBookings}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Completed Bookings</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-3xl font-bold text-green-600">
                        ${stats.creditEarned}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Credit Earned</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-3xl font-bold text-gray-400">
                        ${stats.pendingCredit}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Pending Credit</p>
                </div>
            </div>

            {/* Referral History */}
            <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Referral History</h2>

                {stats.totalReferrals === 0 ? (
                    <div className="text-center py-12">
                        <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No referrals yet</h3>
                        <p className="text-gray-600 mb-6">
                            Share your link with friends to start earning credits
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Placeholder for referral items */}
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">John Doe</p>
                                    <p className="text-sm text-gray-600">
                                        Completed first booking • Dec 1, 2024
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-green-600">+$25</p>
                                <p className="text-xs text-gray-500">Applied</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Terms */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Referral Program Terms</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Referral credit is applied after referred friend completes their first cleaning</li>
                    <li>• $25 credit can be used towards any future booking</li>
                    <li>• Credit does not expire</li>
                    <li>• Both you and your friend must be new or existing CLEENLY customers</li>
                    <li>• Limit one referral credit per new customer</li>
                </ul>
            </div>
        </div>
    );
}
