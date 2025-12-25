'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface CreateCleanerData {
    fullName: string;
    phone: string;
    email?: string;
    photoUrl?: string;
    notes?: string;
}

export interface UpdateCleanerData extends Partial<CreateCleanerData> {
    isActive?: boolean;
}

export async function getCleaners() {
    const { data, error } = await supabase
        .from('cleaners')
        .select('*')
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching cleaners:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function getActiveCleaners() {
    const { data, error } = await supabase
        .from('cleaners')
        .select('*')
        .eq('is_active', true)
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching active cleaners:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function getCleaner(id: string) {
    const { data, error } = await supabase
        .from('cleaners')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching cleaner:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function createCleaner(data: CreateCleanerData) {
    const { fullName, phone, email, photoUrl, notes } = data;

    if (!fullName?.trim()) {
        return { error: 'Full name is required', data: null };
    }

    if (!phone?.trim()) {
        return { error: 'Phone number is required', data: null };
    }

    const { data: cleaner, error } = await supabase
        .from('cleaners')
        .insert([{
            full_name: fullName.trim(),
            phone: phone.trim(),
            email: email?.trim() || null,
            photo_url: photoUrl?.trim() || null,
            notes: notes?.trim() || null,
            is_active: true,
            rating: null,
            total_reviews: 0,
            total_bookings: 0,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating cleaner:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/cleaners');
    return { data: cleaner, error: null };
}

export async function updateCleaner(id: string, data: UpdateCleanerData) {
    const updatePayload: Record<string, any> = {};

    if (data.fullName !== undefined) {
        updatePayload.full_name = data.fullName.trim();
    }
    if (data.phone !== undefined) {
        updatePayload.phone = data.phone.trim();
    }
    if (data.email !== undefined) {
        updatePayload.email = data.email?.trim() || null;
    }
    if (data.photoUrl !== undefined) {
        updatePayload.photo_url = data.photoUrl?.trim() || null;
    }
    if (data.notes !== undefined) {
        updatePayload.notes = data.notes?.trim() || null;
    }
    if (data.isActive !== undefined) {
        updatePayload.is_active = data.isActive;
    }

    const { data: cleaner, error } = await supabase
        .from('cleaners')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating cleaner:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/cleaners');
    return { data: cleaner, error: null };
}

export async function toggleCleanerActive(id: string, isActive: boolean) {
    return updateCleaner(id, { isActive });
}

export async function deleteCleaner(id: string) {
    // Soft delete - just deactivate
    return toggleCleanerActive(id, false);
}
