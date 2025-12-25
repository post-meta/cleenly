import Link from 'next/link';
import { Calendar, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickLink
                    href="/admin/bookings"
                    icon={Calendar}
                    title="Bookings"
                    description="Manage customer bookings"
                />
                <QuickLink
                    href="/admin/cleaners"
                    icon={Users}
                    title="Cleaners"
                    description="Manage cleaning staff"
                />
                <QuickLink
                    href="/admin/finance"
                    icon={DollarSign}
                    title="Finance"
                    description="Payments and payouts"
                />
            </div>
        </div>
    );
}

function QuickLink({
    href,
    icon: Icon,
    title,
    description,
}: {
    href: string;
    icon: any;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
            <Icon className="w-8 h-8 mb-4 text-gray-600" />
            <h2 className="font-semibold text-lg mb-1">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
        </Link>
    );
}
