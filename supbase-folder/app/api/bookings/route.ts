// API Route: POST /api/bookings
// Handles booking form submissions

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'email',
      'phone',
      'service_type',
      'bedrooms',
      'bathrooms',
      'address',
      'city',
      'preferred_date',
      'preferred_time',
      'estimated_min',
      'estimated_max',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate service_type
    const validServiceTypes = ['regular', 'deep', 'moveout'];
    if (!validServiceTypes.includes(body.service_type)) {
      return NextResponse.json(
        { error: 'Invalid service_type' },
        { status: 400 }
      );
    }

    // Validate preferred_time
    const validTimes = ['morning', 'afternoon', 'evening'];
    if (!validTimes.includes(body.preferred_time)) {
      return NextResponse.json(
        { error: 'Invalid preferred_time' },
        { status: 400 }
      );
    }

    // Insert booking into Supabase
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        service_type: body.service_type,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        sqft_range: body.sqft_range || null,
        home_condition: body.home_condition || null,
        address: body.address,
        city: body.city || 'Seattle',
        state: body.state || 'WA',
        zip: body.zip || null,
        access_instructions: body.access_instructions || null,
        preferred_date: body.preferred_date,
        preferred_time: body.preferred_time,
        is_flexible: body.is_flexible || false,
        estimated_min: body.estimated_min,
        estimated_max: body.estimated_max,
        addons: body.addons || [],
        special_requests: body.special_requests || null,
        has_pets: body.has_pets || false,
        pet_details: body.pet_details || null,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin

    return NextResponse.json(
      {
        success: true,
        booking: data,
        message: 'Booking created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
