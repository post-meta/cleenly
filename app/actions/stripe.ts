"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe/client";
import { HOURLY_RATE_CENTS, calculateHourlyTotalCents } from "@/lib/pricing";
import { redeemCreditForBooking } from "@/lib/referrals/credits";
import { revalidatePath } from "next/cache";

const SERVICE_LABELS: Record<string, string> = {
  regular: "Regular cleaning",
  deep: "Deep cleaning",
  move_out: "Move-out cleaning",
};

/**
 * Post-service hourly invoicing (current stage of the business).
 *
 * Customer sees a price RANGE at booking; the real price is billed by the hour
 * AFTER the work is done. Admin enters the hours worked here, we compute
 * `hours × hourly rate`, create a Stripe Invoice, and Stripe emails the customer
 * a hosted invoice page to pay. `invoice.paid` webhook records the payment.
 *
 * `amountOverrideCents` lets the admin set the final amount by hand (e.g. flat
 * quote, discount) — when present, it wins over the hourly calculation.
 *
 * All money is in CENTS, consistent with bookings.price_final and Stripe.
 */
export async function createBookingInvoice({
  bookingId,
  hours,
  amountOverrideCents,
}: {
  bookingId: string;
  hours: number;
  amountOverrideCents?: number;
}): Promise<
  | {
      success: true;
      hostedInvoiceUrl: string | null;
      invoiceId: string;
      amountCents: number;
      creditAppliedCents: number;
    }
  | { error: string }
> {
  // 1. Admin-only.
  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await ssr
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Admin access required" };

  // 2. Load booking via service role (guest bookings keep email/name on the row,
  //    not on a joined profile).
  const admin = createAdminClient();
  const { data: booking, error: bErr } = await admin
    .from("bookings")
    .select(
      "id, user_id, service_type, email, guest_email, name, guest_name, phone, address, status"
    )
    .eq("id", bookingId)
    .single();
  if (bErr || !booking) return { error: "Booking not found" };

  const email = booking.email || booking.guest_email;
  const name = booking.name || booking.guest_name || undefined;
  if (!email) return { error: "Booking has no customer email" };

  const serviceType = String(booking.service_type);
  const rate = HOURLY_RATE_CENTS; // single rate per cleaner-hour

  const usingOverride =
    typeof amountOverrideCents === "number" && amountOverrideCents > 0;
  const amountCents = usingOverride
    ? Math.round(amountOverrideCents as number)
    : calculateHourlyTotalCents(hours);

  if (!amountCents || amountCents < 50) {
    return { error: "Amount too small (Stripe minimum is $0.50)" };
  }
  if (!usingOverride && (!hours || hours <= 0)) {
    return { error: "Enter the hours worked (or a manual amount)" };
  }

  const label = SERVICE_LABELS[serviceType] || "Cleaning service";
  const lineDescription = usingOverride
    ? `${label}${booking.address ? ` — ${booking.address}` : ""}`
    : `${label} — ${hours} hr${hours === 1 ? "" : "s"} × $${(rate / 100).toFixed(0)}/hr`;

  const stripe = getStripe();

  try {
    // 3. Reuse a Stripe customer by email, else create one.
    const found = await stripe.customers.list({ email, limit: 1 });
    const customerId =
      found.data[0]?.id ||
      (
        await stripe.customers.create({
          email,
          name,
          phone: booking.phone || undefined,
          metadata: { booking_id: bookingId },
        })
      ).id;

    // 4. Draft invoice -> add line item -> finalize & email.
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 7,
      description: `CLEENLY — ${label}`,
      metadata: {
        booking_id: bookingId,
        service_type: serviceType,
        hours: usingOverride ? "" : String(hours),
      },
    });

    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      amount: amountCents,
      currency: "usd",
      description: lineDescription,
    });

    // Apply any available referral credit as a discount line.
    let creditAppliedCents = 0;
    if (booking.user_id) {
      creditAppliedCents = await redeemCreditForBooking(
        booking.user_id,
        bookingId,
        amountCents
      );
      if (creditAppliedCents > 0) {
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: -creditAppliedCents,
          currency: "usd",
          description: `Referral credit (−$${(creditAppliedCents / 100).toFixed(2)})`,
        });
      }
    }

    const sent = await stripe.invoices.sendInvoice(invoice.id);

    // 5. Persist the billed amount + a pending payment row for the ledger.
    //    actual_duration stores minutes worked (feeds the future area calculator).
    await admin
      .from("bookings")
      .update({
        price_final: amountCents,
        actual_duration: usingOverride ? null : Math.round(hours * 60),
      })
      .eq("id", bookingId);

    await admin.from("payments").insert({
      booking_id: bookingId,
      amount: amountCents,
      amount_paid: 0,
      currency: "usd",
      method: "stripe",
      payment_method: "stripe",
      status: "pending",
      transaction_id: invoice.id,
      notes: lineDescription,
      processed_by: user.id,
    });

    revalidatePath(`/admin/bookings/${bookingId}`);
    revalidatePath("/admin/finance");

    return {
      success: true,
      hostedInvoiceUrl: sent.hosted_invoice_url ?? null,
      invoiceId: invoice.id,
      amountCents,
      creditAppliedCents,
    };
  } catch (err: any) {
    console.error("createBookingInvoice failed:", err);
    return { error: err?.message || "Stripe invoice failed" };
  }
}
