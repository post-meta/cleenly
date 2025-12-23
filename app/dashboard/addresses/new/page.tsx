import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AddressForm } from '@/components/dashboard/address-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewAddressPage() {
    const session = await auth();
    if (!session) redirect('/login');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/addresses"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-semibold">Add New Address</h1>
                    <p className="text-gray-600 mt-1">
                        Enter your service location details
                    </p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
                <AddressForm userId={session.user?.id!} />
            </div>
        </div>
    );
}
