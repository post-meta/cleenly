-- Create reviews table with auto-rating functionality
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  cleaner_id UUID REFERENCES cleaners(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_cleaner_id ON reviews(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Function to update cleaner's average rating
CREATE OR REPLACE FUNCTION update_cleaner_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the cleaner's rating and total reviews
  UPDATE cleaners
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE cleaner_id = COALESCE(NEW.cleaner_id, OLD.cleaner_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE cleaner_id = COALESCE(NEW.cleaner_id, OLD.cleaner_id)
    )
  WHERE id = COALESCE(NEW.cleaner_id, OLD.cleaner_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update cleaner rating on review INSERT/UPDATE/DELETE
DROP TRIGGER IF EXISTS trigger_update_cleaner_rating ON reviews;
CREATE TRIGGER trigger_update_cleaner_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_cleaner_rating();

-- Function to prevent duplicate reviews
CREATE OR REPLACE FUNCTION prevent_duplicate_review()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM reviews 
    WHERE booking_id = NEW.booking_id 
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) THEN
    RAISE EXCEPTION 'A review already exists for this booking';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent duplicate reviews
DROP TRIGGER IF EXISTS trigger_prevent_duplicate_review ON reviews;
CREATE TRIGGER trigger_prevent_duplicate_review
  BEFORE INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_review();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON reviews;
CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can read all reviews
CREATE POLICY "Users can read all reviews"
  ON reviews FOR SELECT
  USING (true);

-- Users can create reviews for their own bookings
CREATE POLICY "Users can create reviews for their bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = booking_id
      AND user_id = auth.uid()
      AND status = 'completed'
    )
  );

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (user_id = auth.uid());

-- Cleaners can add responses to reviews about them
CREATE POLICY "Cleaners can add responses to their reviews"
  ON reviews FOR UPDATE
  USING (
    cleaner_id IN (
      SELECT id FROM cleaners WHERE id = cleaner_id
    )
  )
  WITH CHECK (
    cleaner_id IN (
      SELECT id FROM cleaners WHERE id = cleaner_id
    )
  );
