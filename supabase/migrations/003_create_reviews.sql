-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  cleaner_id UUID NOT NULL REFERENCES public.cleaners(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_public BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT unique_booking_review UNIQUE (booking_id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews

-- Anyone can view public reviews
CREATE POLICY "Anyone can view public reviews"
  ON public.reviews
  FOR SELECT
  USING (is_public = true);

-- Customers can view their own reviews
CREATE POLICY "Customers can view own reviews"
  ON public.reviews
  FOR SELECT
  USING (auth.uid() = customer_id);

-- Cleaners can view reviews about them
CREATE POLICY "Cleaners can view their reviews"
  ON public.reviews
  FOR SELECT
  USING (
    cleaner_id IN (
      SELECT id FROM public.cleaners WHERE user_id = auth.uid()
    )
  );

-- Customers can create reviews for completed bookings
CREATE POLICY "Customers can create reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (
    auth.uid() = customer_id
    AND booking_id IN (
      SELECT id FROM public.bookings
      WHERE customer_id = auth.uid()
      AND status = 'completed'
    )
  );

-- Customers can update their own reviews
CREATE POLICY "Customers can update own reviews"
  ON public.reviews
  FOR UPDATE
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_cleaner_id ON public.reviews(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- Function to update cleaner rating when review is added
CREATE OR REPLACE FUNCTION public.update_cleaner_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.cleaners
  SET
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE cleaner_id = NEW.cleaner_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE cleaner_id = NEW.cleaner_id
    )
  WHERE id = NEW.cleaner_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update cleaner rating
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_cleaner_rating();
