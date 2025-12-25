'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AdminHeader({ user }: { user: any }) {
    return (
        <header className="bg-foreground text-background">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="font-bold text-xl">
                            CLEENLY Admin
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-300">
                            {user?.email || user?.name || 'Admin'}
                        </span>
                        <Link
                            href="/dashboard"
                            className="text-sm text-gray-300 hover:text-white"
                        >
                            Customer Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
