import { createAdminClient } from "@/lib/supabase/admin";
import { REFERRAL_REWARD_CENTS, REFERRAL_REFEREE_DISCOUNT_CENTS } from "./config";

/** Available referral credit balance (cents) = sum of the signed ledger. */
export async function getAvailableCreditCents(userId?: string | null): Promise<number> {
  if (!userId) return 0;
  const admin = createAdminClient();
  const { data } = await admin
    .from("referral_credits")
    .select("amount_cents")
    .eq("user_id", userId);
  return (data || []).reduce((s, r) => s + (Number(r.amount_cents) || 0), 0);
}

/**
 * At signup with a ?ref= code: record the referral and grant the new customer
 * their welcome discount credit. Best-effort, idempotency is loose (signup is
 * a one-time event per user).
 */
export async function applyReferralOnSignup(
  newUserId: string,
  email: string,
  refCode?: string | null
): Promise<void> {
  if (!newUserId || !refCode) return;
  try {
    const admin = createAdminClient();
    const code = refCode.toUpperCase().trim();

    const { data: referrer } = await admin
      .from("users")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();
    if (!referrer || referrer.id === newUserId) return;

    // Don't double-create if this person was already referred.
    const { data: already } = await admin
      .from("referrals")
      .select("id")
      .eq("referred_user_id", newUserId)
      .maybeSingle();
    if (already) return;

    const { data: referral } = await admin
      .from("referrals")
      .insert({
        referrer_user_id: referrer.id,
        referred_user_id: newUserId,
        referred_email: email,
        code,
        status: "pending",
      })
      .select("id")
      .single();

    await admin.from("referral_credits").insert({
      user_id: newUserId,
      amount_cents: REFERRAL_REFEREE_DISCOUNT_CENTS,
      type: "referee_discount",
      referral_id: referral?.id ?? null,
      note: "Welcome — referred-friend discount",
    });
  } catch (e) {
    console.warn("applyReferralOnSignup failed:", e);
  }
}

/**
 * When a booking is completed: if its customer was referred and the referral is
 * still pending, reward the referrer. The status guard prevents double rewards.
 */
export async function qualifyReferralOnCompletion(
  bookingUserId?: string | null,
  bookingId?: string | null
): Promise<void> {
  if (!bookingUserId) return;
  try {
    const admin = createAdminClient();
    const { data: referral } = await admin
      .from("referrals")
      .select("id, referrer_user_id, status")
      .eq("referred_user_id", bookingUserId)
      .eq("status", "pending")
      .maybeSingle();
    if (!referral) return;

    const { data: updated } = await admin
      .from("referrals")
      .update({
        status: "rewarded",
        qualifying_booking_id: bookingId ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", referral.id)
      .eq("status", "pending") // concurrency guard
      .select("id");

    // Only grant the reward if THIS call flipped pending -> rewarded.
    if (!updated || updated.length === 0) return;

    await admin.from("referral_credits").insert({
      user_id: referral.referrer_user_id,
      amount_cents: REFERRAL_REWARD_CENTS,
      type: "referrer_reward",
      referral_id: referral.id,
      booking_id: bookingId ?? null,
      note: "Referral reward — friend completed first cleaning",
    });
  } catch (e) {
    console.warn("qualifyReferralOnCompletion failed:", e);
  }
}

/**
 * Redeem available credit against an invoice amount. Returns cents redeemed
 * (0 if none) and records a negative ledger entry. Caller adds a matching
 * negative invoice line.
 */
export async function redeemCreditForBooking(
  userId: string | null | undefined,
  bookingId: string,
  amountCents: number
): Promise<number> {
  if (!userId || amountCents <= 0) return 0;
  try {
    const admin = createAdminClient();
    const balance = await getAvailableCreditCents(userId);
    const redeem = Math.min(balance, amountCents);
    if (redeem <= 0) return 0;

    await admin.from("referral_credits").insert({
      user_id: userId,
      amount_cents: -redeem,
      type: "redemption",
      booking_id: bookingId,
      note: "Applied to invoice",
    });
    return redeem;
  } catch (e) {
    console.warn("redeemCreditForBooking failed:", e);
    return 0;
  }
}
