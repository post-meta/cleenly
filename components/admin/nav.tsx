'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Calendar,
    Users,
    DollarSign,
    LayoutDashboard,
} from 'lucide-react';

const navItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        exact: true,
    },
    {
        label: 'Bookings',
        href: '/admin/bookings',
        icon: Calendar,
    },
    {
        label: 'Cleaners',
        href: '/admin/cleaners',
        icon: Users,
    },
    {
        label: 'Finance',
        href: '/admin/finance',
        icon: DollarSign,
    },
];

export function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="space-y-1">
            {navItems.map((item) => {
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-foreground text-background'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-foreground'
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
