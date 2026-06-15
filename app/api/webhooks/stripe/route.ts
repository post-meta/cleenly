import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe webhook. Stripe POSTs here with no user session, so we write via the
// service-role admin client (same pattern as the guest /api/bookings endpoint).
// The raw request body is required for signature verification — do NOT parse JSON first.

async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch {
    /* best-effort */
  }
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json(
      { error: "Missing signature or STRIPE_WEBHOOK_SECRET" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & {
          payment_intent?: string | { id: string } | null;
          charge?: string | { id: string } | null;
        };

        const bookingId = invoice.metadata?.booking_id || null;
        // Only act on invoices we created for a booking — ignore anything else.
        if (!bookingId) break;

        const amountCents = invoice.amount_paid; // cents
        const pi =
          typeof invoice.payment_intent === "string"
            ? invoice.payment_intent
            : invoice.payment_intent?.id ?? null;
        const charge =
          typeof invoice.charge === "string"
            ? invoice.charge
            : invoice.charge?.id ?? null;

        const payload = {
          amount: amountCents,
          amount_paid: amountCents,
          currency: invoice.currency,
          method: "stripe",
          payment_method: "stripe",
          status: "completed",
          stripe_payment_intent_id: pi,
          stripe_charge_id: charge,
          processed_at: new Date().toISOString(),
        };

        // Update the pending row created at invoice time (matched by invoice id);
        // fall back to inserting if it's missing.
        const { data: existing } = await admin
          .from("payments")
          .select("id")
          .eq("transaction_id", invoice.id)
          .maybeSingle();

        if (existing) {
          await admin.from("payments").update(payload).eq("id", existing.id);
        } else if (bookingId) {
          await admin
            .from("payments")
            .insert({ booking_id: bookingId, transaction_id: invoice.id, ...payload });
        }

        await notifyTelegram(
          `💰 <b>Payment received</b>\n$${(amountCents / 100).toFixed(2)} — ${invoice.customer_email ?? ""}\nBooking: ${bookingId ?? "—"}`
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await notifyTelegram(
          `⚠️ <b>Payment failed</b>\nInvoice ${invoice.id} — ${invoice.customer_email ?? ""}\nBooking: ${invoice.metadata?.booking_id ?? "—"}`
        );
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
