'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User } from 'next-auth';

export function DashboardHeader({ user }: { user: User }) {
    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-semibold text-foreground">
                    CLEENLY
                </Link>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        {user.name || user.email}
                    </span>

                    <Button
                        variant="link"
                        size="sm"
                        onClick={() => signOut({ callbackUrl: '/' })}
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    );
}
