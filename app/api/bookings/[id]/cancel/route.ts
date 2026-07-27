import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
import { notifyBookingCancelled } from "@/lib/notifications";
import { sendBookingSms } from "@/lib/sms/bookings";

// A booking can be cancelled by the customer until work starts.
const CANCELLABLE_STATUSES = ["new", "pending", "confirmed"];

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const uid = (session?.user as { id?: string } | undefined)?.id;
  if (!uid) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, user_id, status, name, email, phone, service_type, scheduled_date, scheduled_time, preferred_date, preferred_time, sms_opt_in"
    )
    .eq("id", id)
    .single();

  // 404 for both missing and foreign bookings — don't leak existence.
  if (!booking || booking.user_id !== uid) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (!CANCELLABLE_STATUSES.includes(booking.status)) {
    return NextResponse.json(
      { error: `This booking can no longer be cancelled online. Text us at (206) 641-4739 and we'll sort it out.` },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", booking.id);

  if (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Could not cancel the booking. Please try again." },
      { status: 500 }
    );
  }

  // Owner alert and the customer's own confirmation of the change they made.
  await Promise.allSettled([
    notifyBookingCancelled(booking),
    sendBookingSms(booking, "booking_cancelled"),
  ]);

  return NextResponse.json({ success: true });
}
