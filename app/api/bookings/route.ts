import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewBooking } from "@/lib/notifications";
import type { BookingFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingFormData & {
      estimated_min: number;
      estimated_max: number;
    };

    // Basic validation
    if (
      !body.email ||
      !body.service_type ||
      !body.bedrooms ||
      !body.bathrooms ||
      !body.name ||
      !body.phone ||
      !body.address
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        email: body.email,
        phone: body.phone,
        name: body.name,
        service_type: body.service_type,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        sqft_range: body.sqft_range || null,
        condition: body.condition || "average",
        special_requests: body.special_requests || null,
        addons: body.addons || [],
        address: body.address,
        city: body.city || "Seattle",
        zip: body.zip || null,
        access_instructions: body.access_instructions || null,
        preferred_date: body.preferred_date || null,
        preferred_time: body.preferred_time || null,
        estimated_min: body.estimated_min,
        estimated_max: body.estimated_max,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    notifyNewBooking({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      service_type: data.service_type,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      address: data.address,
      city: data.city,
      zip: data.zip,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      estimated_min: data.estimated_min,
      estimated_max: data.estimated_max,
      special_requests: data.special_requests,
      addons: data.addons,
    }).catch((e) => console.error("notifyNewBooking failed:", e));

    return NextResponse.json({ success: true, booking: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
