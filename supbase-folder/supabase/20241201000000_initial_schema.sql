-- CLEENLY Initial Database Schema
-- Migration: 20241201000000_initial_schema

-- ==============================================
-- 1. BOOKINGS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contact Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Service Details
  service_type TEXT NOT NULL CHECK (service_type IN ('regular', 'deep', 'moveout')),
  bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0 AND bedrooms <= 10),
  bathrooms NUMERIC(2,1) NOT NULL CHECK (bathrooms >= 1 AND bathrooms <= 10),
  sqft_range TEXT,
  home_condition TEXT CHECK (home_condition IN ('clean', 'average', 'needs_work')),
  
  -- Address
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Seattle',
  state TEXT NOT NULL DEFAULT 'WA',
  zip TEXT,
  access_instructions TEXT,
  
  -- Scheduling
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL CHECK (preferred_time IN ('morning', 'afternoon', 'evening')),
  is_flexible BOOLEAN DEFAULT FALSE,
  
  -- Pricing
  estimated_min INTEGER NOT NULL, -- in cents
  estimated_max INTEGER NOT NULL, -- in cents
  final_price INTEGER, -- in cents, set after confirmation
  
  -- Add-ons
  addons TEXT[], -- array of addon names
  
  -- Special Requests
  special_requests TEXT,
  has_pets BOOLEAN DEFAULT FALSE,
  pet_details TEXT,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new',           -- just submitted
    'contacted',     -- we reached out
    'confirmed',     -- cleaner assigned, customer confirmed
    'scheduled',     -- on calendar
    'in_progress',   -- cleaner is there
    'completed',     -- done
    'cancelled',     -- cancelled by customer or us
    'refunded'       -- refunded
  )),
  
  -- Admin Notes
  admin_notes TEXT,
  
  -- Assigned Cleaner (future: FK to cleaners table)
  assigned_cleaner_id UUID,
  
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  
  -- Payment
  payment_intent_id TEXT, -- Stripe payment intent
  paid_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================
-- 2. CLEANER APPLICATIONS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS cleaner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Basic Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT,
  referral_source TEXT,
  
  -- Experience
  has_experience BOOLEAN NOT NULL,
  years_experience TEXT,
  previous_platforms TEXT,
  has_supplies BOOLEAN NOT NULL,
  has_transportation BOOLEAN NOT NULL,
  
  -- Availability
  hours_per_week TEXT NOT NULL,
  available_days TEXT[] NOT NULL, -- ['monday', 'tuesday', etc]
  preferred_times TEXT[], -- ['morning', 'afternoon', 'evening']
  service_areas TEXT[] NOT NULL, -- ['Seattle', 'Bellevue', etc]
  
  -- Legal
  work_authorized BOOLEAN NOT NULL,
  is_adult BOOLEAN NOT NULL,
  background_consent BOOLEAN NOT NULL,
  
  -- About
  bio TEXT,
  motivation TEXT,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new',              -- just submitted
    'reviewing',        -- we're reviewing
    'background_check', -- sent for background check
    'approved',         -- approved, can create profile
    'rejected',         -- not approved
    'inactive'          -- approved but inactive
  )),
  
  -- Admin
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  rejection_reason TEXT,
  
  -- Background Check
  background_check_started_at TIMESTAMPTZ,
  background_check_completed_at TIMESTAMPTZ,
  background_check_status TEXT CHECK (background_check_status IN (
    'pending',
    'clear',
    'flagged',
    'failed'
  ))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cleaner_apps_email ON cleaner_applications(email);
CREATE INDEX IF NOT EXISTS idx_cleaner_apps_status ON cleaner_applications(status);
CREATE INDEX IF NOT EXISTS idx_cleaner_apps_created ON cleaner_applications(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_cleaner_applications_updated_at BEFORE UPDATE ON cleaner_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaner_applications ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
-- Public can insert (for booking form)
CREATE POLICY "Anyone can create booking"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- Users can read their own bookings (when auth is added)
CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Admin can do everything (set up service role)
CREATE POLICY "Service role can do everything on bookings"
  ON bookings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- Policies for cleaner applications
-- Public can insert (for application form)
CREATE POLICY "Anyone can create cleaner application"
  ON cleaner_applications FOR INSERT
  TO anon
  WITH CHECK (true);

-- Users can read their own application
CREATE POLICY "Users can read own application"
  ON cleaner_applications FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Admin can do everything
CREATE POLICY "Service role can do everything on applications"
  ON cleaner_applications FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ==============================================
-- 4. HELPER VIEWS (Optional)
-- ==============================================

-- New bookings (for admin dashboard)
CREATE OR REPLACE VIEW new_bookings AS
SELECT 
  id,
  name,
  email,
  phone,
  service_type,
  bedrooms,
  bathrooms,
  city,
  preferred_date,
  preferred_time,
  estimated_min / 100.0 as estimated_min_dollars,
  estimated_max / 100.0 as estimated_max_dollars,
  created_at
FROM bookings
WHERE status = 'new'
ORDER BY created_at DESC;

-- New cleaner applications
CREATE OR REPLACE VIEW new_cleaner_applications AS
SELECT
  id,
  first_name,
  last_name,
  email,
  phone,
  city,
  has_experience,
  years_experience,
  available_days,
  service_areas,
  created_at
FROM cleaner_applications
WHERE status = 'new'
ORDER BY created_at DESC;
