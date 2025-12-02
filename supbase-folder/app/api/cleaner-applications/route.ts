// API Route: POST /api/cleaner-applications
// Handles cleaner application form submissions

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'phone',
      'city',
      'has_experience',
      'has_supplies',
      'has_transportation',
      'hours_per_week',
      'available_days',
      'service_areas',
      'work_authorized',
      'is_adult',
      'background_consent',
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate arrays
    if (!Array.isArray(body.available_days) || body.available_days.length === 0) {
      return NextResponse.json(
        { error: 'available_days must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.service_areas) || body.service_areas.length === 0) {
      return NextResponse.json(
        { error: 'service_areas must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate legal requirements
    if (!body.work_authorized || !body.is_adult || !body.background_consent) {
      return NextResponse.json(
        { error: 'Must meet all legal requirements' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('cleaner_applications')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      );
    }

    // Insert application into Supabase
    const { data, error } = await supabaseAdmin
      .from('cleaner_applications')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        city: body.city,
        zip: body.zip || null,
        referral_source: body.referral_source || null,
        has_experience: body.has_experience,
        years_experience: body.years_experience || null,
        previous_platforms: body.previous_platforms || null,
        has_supplies: body.has_supplies,
        has_transportation: body.has_transportation,
        hours_per_week: body.hours_per_week,
        available_days: body.available_days,
        preferred_times: body.preferred_times || [],
        service_areas: body.service_areas,
        work_authorized: body.work_authorized,
        is_adult: body.is_adult,
        background_consent: body.background_consent,
        bio: body.bio || null,
        motivation: body.motivation || null,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      );
    }

    // TODO: Send confirmation email to applicant
    // TODO: Send notification to admin

    return NextResponse.json(
      {
        success: true,
        application: data,
        message: 'Application submitted successfully',
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
