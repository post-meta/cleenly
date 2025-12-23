'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

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
