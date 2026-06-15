import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AddressForm } from '@/components/dashboard/address-form';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditAddressPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session) redirect('/login');
    const uid = (session.user as { id?: string } | undefined)?.id;

    const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', uid)
        .single();

    if (!address) notFound();

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
                    <h1 className="text-3xl font-semibold">Edit Address</h1>
                    <p className="text-gray-600 mt-1">Update your service location details</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
                <AddressForm userId={uid!} initialData={address} />
            </div>
        </div>
    );
}
