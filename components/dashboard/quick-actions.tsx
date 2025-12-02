import Link from 'next/link';
import { Plus, Calendar, Gift } from 'lucide-react';

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
                href="/book"
                className="border border-gray-200 p-6 rounded-sm hover:shadow-card transition-shadow"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center">
                        <Plus className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Book Cleaning</h3>
                        <p className="text-sm text-gray-600">Schedule a new service</p>
                    </div>
                </div>
            </Link>

            <Link
                href="/dashboard/bookings"
                className="border border-gray-200 p-6 rounded-sm hover:shadow-card transition-shadow"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold">View Bookings</h3>
                        <p className="text-sm text-gray-600">See upcoming cleanings</p>
                    </div>
                </div>
            </Link>

            <Link
                href="/dashboard/referrals"
                className="border border-gray-200 p-6 rounded-sm hover:shadow-card transition-shadow"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center">
                        <Gift className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Refer & Earn</h3>
                        <p className="text-sm text-gray-600">Get $25 credit</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
