'use server';

import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

async function currentUserId(): Promise<string | null> {
    const session = await auth();
    return (session?.user as { id?: string } | undefined)?.id ?? null;
}

async function ownsAddress(addressId: string, uid: string): Promise<boolean> {
    const { data } = await supabase.from('addresses').select('user_id').eq('id', addressId).single();
    return !!data && data.user_id === uid;
}

export async function deleteAddress(addressId: string): Promise<{ success: true } | { error: string }> {
    const uid = await currentUserId();
    if (!uid) return { error: 'You are not signed in' };
    if (!(await ownsAddress(addressId, uid))) return { error: 'Address not found' };

    const { error } = await supabase.from('addresses').delete().eq('id', addressId);
    if (error) {
        return {
            error: error.message.includes('foreign key')
                ? 'This address is used by a booking and can’t be deleted.'
                : error.message,
        };
    }
    revalidatePath('/dashboard/addresses');
    return { success: true };
}

export async function setDefaultAddress(addressId: string): Promise<{ success: true } | { error: string }> {
    const uid = await currentUserId();
    if (!uid) return { error: 'You are not signed in' };
    if (!(await ownsAddress(addressId, uid))) return { error: 'Address not found' };

    await supabase.from('addresses').update({ is_default: false }).eq('user_id', uid);
    const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', addressId);
    if (error) return { error: error.message };
    revalidatePath('/dashboard/addresses');
    return { success: true };
}

export async function saveAddressAction(userId: string, formData: any, addressId?: string) {
    try {
        if (formData.is_default) {
            // Reset other default addresses for this user
            const { error: resetError } = await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', userId);

            if (resetError) {
                console.error('Error resetting default addresses:', resetError);
                // We continue anyway, the current one will be set as default
            }
        }

        const payload = {
            ...formData,
            user_id: userId,
        };

        let result;
        if (addressId) {
            result = await supabase
                .from('addresses')
                .update(payload)
                .eq('id', addressId);
        } else {
            result = await supabase
                .from('addresses')
                .insert([payload]);
        }

        if (result.error) {
            console.error('Supabase error saving address:', result.error);
            return { error: result.error.message };
        }

        revalidatePath('/dashboard/addresses');
        return { success: true };
    } catch (err: any) {
        console.error('Unexpected error saving address:', err);
        return { error: 'An unexpected error occurred' };
    }
}
