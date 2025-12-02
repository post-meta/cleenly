-- Create cleaners table
CREATE TABLE IF NOT EXISTS public.cleaners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  hourly_rate INTEGER NOT NULL DEFAULT 3500, -- $35 in cents
  service_types TEXT[] NOT NULL DEFAULT ARRAY['regular'],
  service_areas TEXT[] NOT NULL DEFAULT ARRAY['Seattle'],
  years_experience INTEGER NOT NULL DEFAULT 0,
  availability JSONB NOT NULL DEFAULT '{"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []}',
  photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  background_check_passed BOOLEAN NOT NULL DEFAULT false,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_jobs INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_cleaner UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.cleaners ENABLE ROW LEVEL SECURITY;

-- Policies for cleaners

-- Public can view active and verified cleaners
CREATE POLICY "Anyone can view active verified cleaners"
  ON public.cleaners
  FOR SELECT
  USING (is_active = true AND is_verified = true);

-- Cleaners can view their own profile (even if not active/verified)
CREATE POLICY "Cleaners can view own profile"
  ON public.cleaners
  FOR SELECT
  USING (auth.uid() = user_id);

-- Cleaners can update their own profile
CREATE POLICY "Cleaners can update own profile"
  ON public.cleaners
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Cleaners can insert their own profile
CREATE POLICY "Cleaners can insert own profile"
  ON public.cleaners
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_cleaners_updated_at
  BEFORE UPDATE ON public.cleaners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cleaners_user_id ON public.cleaners(user_id);
CREATE INDEX IF NOT EXISTS idx_cleaners_is_active ON public.cleaners(is_active);
CREATE INDEX IF NOT EXISTS idx_cleaners_rating ON public.cleaners(rating DESC);
CREATE INDEX IF NOT EXISTS idx_cleaners_service_areas ON public.cleaners USING GIN(service_areas);
CREATE INDEX IF NOT EXISTS idx_cleaners_service_types ON public.cleaners USING GIN(service_types);

-- Function to create cleaner profile for new cleaner users
CREATE OR REPLACE FUNCTION public.handle_new_cleaner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'cleaner' THEN
    INSERT INTO public.cleaners (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create cleaner profile when user role is set to cleaner
DROP TRIGGER IF EXISTS on_cleaner_profile_created ON public.profiles;
CREATE TRIGGER on_cleaner_profile_created
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  WHEN (NEW.role = 'cleaner')
  EXECUTE FUNCTION public.handle_new_cleaner();
