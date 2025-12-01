import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CleanerApplicationFormData } from "@/types/cleaner";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CleanerApplicationFormData;

    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "city",
      "has_transportation",
      "hours_per_week",
      "available_days",
      "service_areas",
      "work_authorized",
      "is_adult",
      "background_consent",
    ] as const;

    const missingFields = requiredFields.filter(
      (field) =>
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate legal requirements
    if (!body.work_authorized) {
      return NextResponse.json(
        { error: "You must be authorized to work in the US" },
        { status: 400 }
      );
    }

    if (!body.is_adult) {
      return NextResponse.json(
        { error: "You must be 18 years or older" },
        { status: 400 }
      );
    }

    if (!body.background_consent) {
      return NextResponse.json(
        { error: "Background check consent is required" },
        { status: 400 }
      );
    }

    // Validate arrays are not empty
    if (!body.available_days?.length) {
      return NextResponse.json(
        { error: "Please select at least one available day" },
        { status: 400 }
      );
    }

    if (!body.service_areas?.length) {
      return NextResponse.json(
        { error: "Please select at least one service area" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email!)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate phone format (basic US phone validation)
    const phoneDigits = body.phone!.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already exists
    const { data: existingApplication } = await supabase
      .from("cleaner_applications")
      .select("id")
      .eq("email", body.email)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        {
          error:
            "An application with this email already exists. We'll be in touch soon!",
        },
        { status: 409 }
      );
    }

    // Insert application
    const { data, error } = await supabase
      .from("cleaner_applications")
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        city: body.city,
        referral_source: body.referral_source || null,
        has_experience: body.has_experience || false,
        years_experience: body.years_experience || null,
        previous_platforms: body.previous_platforms || null,
        has_supplies: body.has_supplies || false,
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
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      // Handle unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "An application with this email already exists. We'll be in touch soon!",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Failed to submit application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      application: { id: data.id },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
