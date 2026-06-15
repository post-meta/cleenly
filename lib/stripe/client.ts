import Stripe from "stripe";

// Lazy server-only Stripe client. Instantiated on first use so a missing key
// never crashes the build — it throws only when a Stripe call is actually made.
// Standalone "CLEENLY APP" account (acct_1TiMvOGgtJxpfFr2). Never import in client code.

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    // No explicit apiVersion — use the SDK's pinned default / account default.
    _stripe = new Stripe(key);
  }
  return _stripe;
}
