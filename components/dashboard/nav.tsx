'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Calendar,
    MapPin,
    CreditCard,
    Settings,
    Gift
} from 'lucide-react';

const navItems = [
    {
        label: 'My Bookings',
        href: '/dashboard/bookings',
        icon: Calendar,
    },
    {
        label: 'My Addresses',
        href: '/dashboard/addresses',
        icon: MapPin,
    },
    {
        label: 'Payment Methods',
        href: '/dashboard/payments',
        icon: CreditCard,
    },
    {
        label: 'Referrals',
        href: '/dashboard/referrals',
        icon: Gift,
    },
    {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className="space-y-1">
            {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-accent/10 text-accent'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-foreground'
                        )}
                    >
                        <Icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
