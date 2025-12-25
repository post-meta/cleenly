-- ============================================
-- CLEENLY CRM + FINANCE SCHEMA
-- Version: 2.1 (Resilient Migration)
-- ============================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
      'pending_payment',
      'confirmed',
      'completed',
      'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
      'stripe',
      'venmo',
      'zelle',
      'cash',
      'check',
      'invoice'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
      'pending',
      'completed',
      'failed',
      'refunded',
      'partial'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. CORE TABLES & COLUMNS
-- ============================================

-- 2.1 PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns safely
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;


-- 2.2 CLEANER PROFILES
CREATE TABLE IF NOT EXISTS public.cleaner_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS full_name TEXT; -- Make nullable initially if strict not desired
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.cleaner_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;


-- 2.3 BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cleaner_id UUID REFERENCES public.cleaner_profiles(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS bedrooms INT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS bathrooms INT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS square_feet INT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'WA';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS zip TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS scheduled_start TIME;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS scheduled_end TIME;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS estimated_duration NUMERIC(3,1);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS status booking_status DEFAULT 'pending_payment';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price_estimated DECIMAL(10,2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price_final DECIMAL(10,2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;


-- 2.4 PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS method payment_method;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS status payment_status DEFAULT 'completed';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS check_number TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS processed_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS notes TEXT;


-- 2.5 CLEANER PAYOUTS
CREATE TABLE IF NOT EXISTS public.cleaner_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS cleaner_id UUID REFERENCES public.cleaner_profiles(id) ON DELETE RESTRICT;
ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE RESTRICT;
ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS amount_to_pay DECIMAL(10,2);
ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2);
ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS method TEXT;
ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE public.cleaner_payouts ADD COLUMN IF NOT EXISTS notes TEXT;


-- 2.6 CUSTOMER NOTES
CREATE TABLE IF NOT EXISTS public.customer_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customer_notes ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.customer_notes ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.customer_notes ADD COLUMN IF NOT EXISTS content TEXT;


-- ============================================
-- 3. INDEXES (IF NOT EXISTS)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_cleaner ON public.bookings(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe ON public.payments(stripe_payment_intent_id) 
  WHERE stripe_payment_intent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payouts_cleaner ON public.cleaner_payouts(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_booking ON public.cleaner_payouts(booking_id);
CREATE INDEX IF NOT EXISTS idx_payouts_unpaid ON public.cleaner_payouts(cleaner_id, amount_paid) 
  WHERE amount_paid IS NULL;

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON public.customer_notes(customer_id);

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaner_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;

-- Note: Policies usually throw if exist, we should drop if exist or use DO blocks. 
-- For simplicity in this run, we'll strip policies to avoid errors if they act weird, 
-- or better, just leave them as is if they are "CREATE POLICY" usually duplicates error out.
-- I'll wrap them in DO blocks or just delete them and recreate? No, that's destructive.
-- I'll skip policy creation if it exists.

-- Helper for policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins: full access profiles' AND tablename = 'profiles'
    ) THEN
        CREATE POLICY "Admins: full access profiles" 
          ON public.profiles FOR ALL 
          USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins: full access cleaners' AND tablename = 'cleaner_profiles'
    ) THEN
        CREATE POLICY "Admins: full access cleaners" 
          ON public.cleaner_profiles FOR ALL 
          USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins: full access bookings' AND tablename = 'bookings'
    ) THEN
        CREATE POLICY "Admins: full access bookings" 
          ON public.bookings FOR ALL 
          USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins: full access payments' AND tablename = 'payments'
    ) THEN
        CREATE POLICY "Admins: full access payments" 
          ON public.payments FOR ALL 
          USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins: full access payouts' AND tablename = 'cleaner_payouts'
    ) THEN
        CREATE POLICY "Admins: full access payouts" 
          ON public.cleaner_payouts FOR ALL 
          USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins: full access notes' AND tablename = 'customer_notes'
    ) THEN
        CREATE POLICY "Admins: full access notes" 
          ON public.customer_notes FOR ALL 
          USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
    END IF;
END $$;

-- CUSTOMER POLICIES
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Customers: read own profile' AND tablename = 'profiles'
    ) THEN
        CREATE POLICY "Customers: read own profile" 
          ON public.profiles FOR SELECT 
          USING (auth.uid() = id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Customers: read own bookings' AND tablename = 'bookings'
    ) THEN
        CREATE POLICY "Customers: read own bookings" 
          ON public.bookings FOR SELECT 
          USING (customer_id = auth.uid());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Customers: read own payments' AND tablename = 'payments'
    ) THEN
        CREATE POLICY "Customers: read own payments" 
          ON public.payments FOR SELECT 
          USING (booking_id IN (SELECT id FROM bookings WHERE customer_id = auth.uid()));
    END IF;
END $$;

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION get_booking_total_paid(booking_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount_paid), 0)
    FROM payments
    WHERE booking_id = booking_uuid 
      AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_cleaner_unpaid_balance(cleaner_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(amount_to_pay - COALESCE(amount_paid, 0)), 0)
    FROM cleaner_payouts
    WHERE cleaner_id = cleaner_uuid
      AND (amount_paid IS NULL OR amount_paid < amount_to_pay)
  );
END;
$$ LANGUAGE plpgsql;
