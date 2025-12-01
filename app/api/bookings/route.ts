import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { BookingFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingFormData & {
      estimated_min: number;
      estimated_max: number;
    };

    // Basic validation
    if (!body.email || !body.service_type || !body.bedrooms || !body.bathrooms) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.from("bookings").insert({
      email: body.email,
      phone: body.phone || null,
      name: body.name || null,
      service_type: body.service_type,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      sqft: body.sqft || null,
      address: body.address || null,
      city: body.city || "Seattle",
      zip: body.zip || null,
      preferred_date: body.preferred_date || null,
      preferred_time: body.preferred_time || null,
      estimated_min: body.estimated_min,
      estimated_max: body.estimated_max,
      status: "new",
    }).select().single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
