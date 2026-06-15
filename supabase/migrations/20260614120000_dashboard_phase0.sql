-- ============================================================
-- Dashboard Phase 0: account linkage + referrals + credits + feedback
-- Additive & idempotent. Customer dashboard reads via service-role (bypasses
-- RLS); admin panel reads via Supabase Auth (public.is_admin()).
-- ============================================================

-- 1. Backfill bookings.user_id from matching user emails (one-time data fix).
UPDATE public.bookings b
SET user_id = u.id
FROM public.users u
WHERE b.user_id IS NULL
  AND b.email IS NOT NULL
  AND lower(b.email) = lower(u.email);

-- 2. Stable per-user referral code (for ?ref= lookups).
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_code TEXT;
UPDATE public.users
SET referral_code = upper(substr(md5(id::text), 1, 8))
WHERE referral_code IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code
  ON public.users(referral_code) WHERE referral_code IS NOT NULL;

-- 3. Referrals — one row per invited person.
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  referred_email TEXT,
  code TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | qualified | rewarded | void
  qualifying_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_email ON public.referrals(lower(referred_email));

-- 4. Referral credit ledger — signed cents, balance = SUM(amount_cents).
CREATE TABLE IF NOT EXISTS public.referral_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,          -- + earned, - redeemed
  type TEXT NOT NULL,                     -- referrer_reward | referee_discount | redemption | adjustment
  referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_referral_credits_user ON public.referral_credits(user_id);

-- 5. Feedback / questions / complaints — private, admin-only.
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'feedback',  -- feedback | question | complaint | praise
  message TEXT NOT NULL,
  email TEXT,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'open',     -- open | resolved
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);

-- 6. RLS: enable (denies anon) + admin-all. Service-role bypasses for the app.
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='admin all referrals' AND tablename='referrals') THEN
    CREATE POLICY "admin all referrals" ON public.referrals FOR ALL USING (public.is_admin());
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='admin all credits' AND tablename='referral_credits') THEN
    CREATE POLICY "admin all credits" ON public.referral_credits FOR ALL USING (public.is_admin());
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='admin all feedback' AND tablename='feedback') THEN
    CREATE POLICY "admin all feedback" ON public.feedback FOR ALL USING (public.is_admin());
  END IF;
END $$;
