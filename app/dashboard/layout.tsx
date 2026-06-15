import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard/nav';
import { DashboardHeader } from '@/components/dashboard/header';
import { linkGuestBookingsToUser } from '@/lib/account/link-bookings';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    // Reconcile any guest bookings made with this email (covers bookings placed
    // while logged out, or before the account existed) on every dashboard visit.
    await linkGuestBookingsToUser(
        (session.user as { id?: string }).id,
        session.user.email
    );

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader user={session.user} />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3">
                        <DashboardNav />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
