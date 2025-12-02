-- Update bookings table with new columns

-- Add new columns if they don't exist
DO $$
BEGIN
  -- Add customer_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'customer_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN customer_id UUID REFERENCES public.profiles(id);
  END IF;

  -- Add cleaner_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'cleaner_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN cleaner_id UUID REFERENCES public.cleaners(id);
  END IF;

  -- Add actual_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'actual_price'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN actual_price INTEGER;
  END IF;

  -- Add completed_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN completed_at TIMESTAMPTZ;
  END IF;

  -- Add payment_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending';
  END IF;
END $$;

-- Update status values constraint
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'));

-- Update payment_status constraint
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed'));

-- Enable RLS if not already enabled
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers can update own pending bookings" ON public.bookings;
DROP POLICY IF EXISTS "Cleaners can update assigned bookings" ON public.bookings;

-- Policies for bookings

-- Anyone can create a booking (for guest checkout)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- Customers can view their own bookings
CREATE POLICY "Customers can view own bookings"
  ON public.bookings
  FOR SELECT
  USING (
    customer_id = auth.uid()
    OR email = (SELECT auth.jwt() ->> 'email')
  );

-- Cleaners can view bookings assigned to them
CREATE POLICY "Cleaners can view assigned bookings"
  ON public.bookings
  FOR SELECT
  USING (
    cleaner_id IN (
      SELECT id FROM public.cleaners WHERE user_id = auth.uid()
    )
  );

-- Customers can update their own pending bookings (cancel, reschedule)
CREATE POLICY "Customers can update own pending bookings"
  ON public.bookings
  FOR UPDATE
  USING (
    customer_id = auth.uid()
    AND status IN ('pending', 'confirmed')
  );

-- Cleaners can update bookings assigned to them
CREATE POLICY "Cleaners can update assigned bookings"
  ON public.bookings
  FOR UPDATE
  USING (
    cleaner_id IN (
      SELECT id FROM public.cleaners WHERE user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_cleaner_id ON public.bookings(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_preferred_date ON public.bookings(preferred_date);

-- Function to update cleaner stats when booking is completed
CREATE OR REPLACE FUNCTION public.update_cleaner_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.cleaners
    SET total_jobs = total_jobs + 1
    WHERE id = NEW.cleaner_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for cleaner stats
DROP TRIGGER IF EXISTS on_booking_completed ON public.bookings;
CREATE TRIGGER on_booking_completed
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION public.update_cleaner_stats();
