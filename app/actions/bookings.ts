'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface CreateBookingData {
    // Customer
    customerId?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;

    // Service
    serviceType: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: string;

    // Address
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;

    // Schedule
    scheduledDate: string;
    scheduledStart?: string;
    estimatedDuration?: number;

    // Pricing
    priceEstimated?: number;
    priceFinal: number;

    // Assignment
    cleanerId?: string;

    // Notes
    customerNotes?: string;
    adminNotes?: string;
}

export async function getBookings(filters?: {
    status?: string;
    cleanerId?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    let query = supabase
        .from('bookings')
        .select(`
            *,
            cleaners:assigned_cleaner_id (
                id,
                full_name,
                photo_url
            )
        `)
        .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    if (filters?.cleanerId) {
        if (filters.cleanerId === 'unassigned') {
            query = query.is('assigned_cleaner_id', null);
        } else {
            query = query.eq('assigned_cleaner_id', filters.cleanerId);
        }
    }

    if (filters?.dateFrom) {
        query = query.gte('scheduled_date', filters.dateFrom);
    }

    if (filters?.dateTo) {
        query = query.lte('scheduled_date', filters.dateTo);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching bookings:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function getBooking(id: string) {
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            cleaners:assigned_cleaner_id (
                id,
                full_name,
                phone,
                email,
                photo_url
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching booking:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

export async function createBooking(data: CreateBookingData) {
    const {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        bedrooms,
        bathrooms,
        squareFeet,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
        scheduledDate,
        scheduledStart,
        estimatedDuration,
        priceEstimated,
        priceFinal,
        cleanerId,
        customerNotes,
        adminNotes,
    } = data;

    // Validation
    if (!scheduledDate) {
        return { error: 'Scheduled date is required', data: null };
    }

    if (!addressLine1?.trim()) {
        return { error: 'Address is required', data: null };
    }

    if (!priceFinal) {
        return { error: 'Final price is required', data: null };
    }

    if (!serviceType) {
        return { error: 'Service type is required', data: null };
    }

    // Build full address
    const fullAddress = addressLine2
        ? `${addressLine1}, ${addressLine2}`
        : addressLine1;

    const bookingData: Record<string, any> = {
        service_type: serviceType,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledStart || null,
        address: fullAddress,
        city: city || 'Seattle',
        zip: zip || null,
        bedrooms: bedrooms || null,
        bathrooms: bathrooms || null,
        sqft_range: squareFeet || null,
        estimated_duration: estimatedDuration || null,
        price_quoted: priceEstimated ? priceEstimated * 100 : null, // Convert to cents
        price_final: priceFinal * 100, // Convert to cents
        assigned_cleaner_id: cleanerId || null,
        special_requests: customerNotes || null,
        notes_for_cleaner: adminNotes || null,
        status: cleanerId ? 'confirmed' : 'new',
    };

    // Add customer info
    if (customerId) {
        bookingData.user_id = customerId;
    }
    if (customerName) {
        bookingData.guest_name = customerName;
        bookingData.name = customerName;
    }
    if (customerEmail) {
        bookingData.guest_email = customerEmail;
        bookingData.email = customerEmail;
    }
    if (customerPhone) {
        bookingData.guest_phone = customerPhone;
        bookingData.phone = customerPhone;
    }

    const { data: booking, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

    if (error) {
        console.error('Error creating booking:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/bookings');
    return { data: booking, error: null };
}

export async function updateBooking(id: string, data: Partial<CreateBookingData>) {
    const updatePayload: Record<string, any> = {};

    if (data.serviceType !== undefined) {
        updatePayload.service_type = data.serviceType;
    }
    if (data.scheduledDate !== undefined) {
        updatePayload.scheduled_date = data.scheduledDate;
    }
    if (data.scheduledStart !== undefined) {
        updatePayload.scheduled_time = data.scheduledStart;
    }
    if (data.addressLine1 !== undefined) {
        const fullAddress = data.addressLine2
            ? `${data.addressLine1}, ${data.addressLine2}`
            : data.addressLine1;
        updatePayload.address = fullAddress;
    }
    if (data.city !== undefined) {
        updatePayload.city = data.city;
    }
    if (data.zip !== undefined) {
        updatePayload.zip = data.zip;
    }
    if (data.priceEstimated !== undefined) {
        updatePayload.price_quoted = data.priceEstimated * 100;
    }
    if (data.priceFinal !== undefined) {
        updatePayload.price_final = data.priceFinal * 100;
    }
    if (data.cleanerId !== undefined) {
        updatePayload.assigned_cleaner_id = data.cleanerId || null;
    }
    if (data.customerNotes !== undefined) {
        updatePayload.special_requests = data.customerNotes;
    }
    if (data.adminNotes !== undefined) {
        updatePayload.notes_for_cleaner = data.adminNotes;
    }

    const { data: booking, error } = await supabase
        .from('bookings')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating booking:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${id}`);
    return { data: booking, error: null };
}

export async function updateBookingStatus(id: string, status: string) {
    const updatePayload: Record<string, any> = { status };

    // Set timestamps based on status
    const now = new Date().toISOString();
    if (status === 'confirmed') {
        updatePayload.confirmed_at = now;
    } else if (status === 'completed') {
        updatePayload.completed_at = now;
    } else if (status === 'cancelled') {
        updatePayload.cancelled_at = now;
    }

    const { data: booking, error } = await supabase
        .from('bookings')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating booking status:', error);
        return { error: error.message, data: null };
    }

    revalidatePath('/admin/bookings');
    revalidatePath(`/admin/bookings/${id}`);
    return { data: booking, error: null };
}

export async function getCustomers(search?: string) {
    let query = supabase
        .from('users')
        .select('id, name, email, phone')
        .order('name', { ascending: true })
        .limit(20);

    if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching customers:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

// Get payments for a booking to calculate payment status
export async function getBookingPayments(bookingId: string) {
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId);

    if (error) {
        console.error('Error fetching payments:', error);
        return { error: error.message, data: null };
    }

    return { data, error: null };
}

