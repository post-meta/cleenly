import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="font-bold text-xl">Cleenly Admin</Link>
                        <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
                            <Link href="/admin/bookings" className="hover:text-foreground transition-colors">Bookings</Link>
                            <Link href="/admin/finance" className="hover:text-foreground transition-colors">Finance</Link>
                        </nav>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {/* Account dropdown could go here */}
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto">
                {children}
            </main>
        </div>
    );
}
