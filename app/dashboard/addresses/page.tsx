import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { Plus, MapPin, Home, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AddressesPage() {
    const session = await auth();
    if (!session) redirect('/login');

    // Fetch user's addresses
    const { data: addresses } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', session.user?.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">My Addresses</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your saved service addresses
                    </p>
                </div>
                <Link href="/dashboard/addresses/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                    </Button>
                </Link>
            </div>

            {!addresses || addresses.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No addresses yet</h3>
                    <p className="text-gray-600 mb-6">
                        Add your first address to make booking faster
                    </p>
                    <Link href="/dashboard/addresses/new">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Address
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-card transition-shadow relative"
                        >
                            {address.is_default && (
                                <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                                        <Star className="w-3 h-3 fill-current" />
                                        Default
                                    </span>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center flex-shrink-0">
                                    <Home className="w-5 h-5 text-gray-600" />
                                </div>

                                <div className="flex-1">
                                    {address.label && (
                                        <h3 className="font-semibold mb-1">{address.label}</h3>
                                    )}
                                    <p className="text-gray-600 text-sm">
                                        {address.street_address}
                                    </p>
                                    {address.apartment && (
                                        <p className="text-gray-600 text-sm">
                                            {address.apartment}
                                        </p>
                                    )}
                                    <p className="text-gray-600 text-sm">
                                        {address.city}, {address.state} {address.zip_code}
                                    </p>

                                    {address.special_instructions && (
                                        <p className="text-gray-500 text-xs mt-2">
                                            Note: {address.special_instructions}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <Link
                                    href={`/dashboard/addresses/${address.id}/edit`}
                                    className="text-sm text-accent hover:underline"
                                >
                                    Edit
                                </Link>
                                {!address.is_default && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <button className="text-sm text-gray-600 hover:text-foreground">
                                            Set as Default
                                        </button>
                                    </>
                                )}
                                <span className="text-gray-300 ml-auto">•</span>
                                <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
