import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/header';
import { AdminNav } from '@/components/admin/nav';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader user={session.user} />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-2">
                        <AdminNav />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-10">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
