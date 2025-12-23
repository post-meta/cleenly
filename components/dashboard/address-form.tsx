'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Keep if used elsewhere, but not used now in this component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

import { saveAddressAction } from '@/app/dashboard/addresses/actions';

interface AddressFormProps {
    userId: string;
    initialData?: any;
    onSuccess?: () => void;
}

export function AddressForm({ userId, initialData, onSuccess }: AddressFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        label: initialData?.label || '',
        street_address: initialData?.street_address || '',
        unit: initialData?.unit || '',
        city: initialData?.city || 'Seattle',
        state: initialData?.state || 'WA',
        zip_code: initialData?.zip_code || '',
        special_instructions: initialData?.special_instructions || '',
        is_default: initialData?.is_default || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await saveAddressAction(userId, formData, initialData?.id);

            if (result.error) {
                setError(result.error);
                return;
            }

            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/dashboard/addresses');
            }
        } catch (err: any) {
            console.error('Error saving address:', err);
            setError('Failed to save address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Input
                        name="label"
                        label="Address Label"
                        placeholder="e.g. Home, Office, Mom's House"
                        value={formData.label}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <Input
                        name="street_address"
                        label="Street Address"
                        placeholder="123 Main St"
                        value={formData.street_address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Input
                        name="unit"
                        label="Apartment/Unit (optional)"
                        placeholder="Apt 4B"
                        value={formData.unit}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Input
                        name="city"
                        label="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Input
                        name="state"
                        label="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Input
                        name="zip_code"
                        label="ZIP Code"
                        placeholder="98101"
                        value={formData.zip_code}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Special Instructions (optional)
                    </label>
                    <textarea
                        name="special_instructions"
                        value={formData.special_instructions}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="Gate codes, parking info, etc."
                    />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_default"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <label htmlFor="is_default" className="text-sm font-medium text-gray-700">
                        Set as default service address
                    </label>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {initialData?.id ? 'Update Address' : 'Save Address'}
                </Button>
            </div>
        </form>
    );
}
