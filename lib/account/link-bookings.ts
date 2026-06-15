import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Attach past guest bookings to a user account.
 *
 * Bookings placed by email — either before the account existed, or while logged
 * out — have no `user_id`. This links every such row whose email matches the
 * account, so the customer dashboard (which reads by `user_id`) shows them.
 *
 * Idempotent: only touches rows that are still unlinked. Best-effort — never
 * throws, so it is safe to call from auth events / route handlers.
 */
export async function linkGuestBookingsToUser(
  userId?: string | null,
  email?: string | null
): Promise<void> {
  if (!userId || !email) return;
  try {
    const admin = createAdminClient();
    // Two narrow updates (email, then guest_email) instead of an .or() filter —
    // avoids PostgREST filter-injection from odd characters in an email.
    await admin
      .from("bookings")
      .update({ user_id: userId })
      .is("user_id", null)
      .eq("email", email);
    await admin
      .from("bookings")
      .update({ user_id: userId })
      .is("user_id", null)
      .eq("guest_email", email);
  } catch (e) {
    console.warn("linkGuestBookingsToUser failed:", e);
  }
}
