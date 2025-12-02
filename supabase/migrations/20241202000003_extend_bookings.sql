-- Extend bookings table with cleaner assignment and tracking fields
DO $$
BEGIN
  -- Add assigned_cleaner_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'assigned_cleaner_id') THEN
    ALTER TABLE bookings ADD COLUMN assigned_cleaner_id UUID REFERENCES cleaners(id) ON DELETE SET NULL;
  END IF;

  -- Add assignment_date
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'assignment_date') THEN
    ALTER TABLE bookings ADD COLUMN assignment_date TIMESTAMP;
  END IF;

  -- Add actual timing fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'actual_start_time') THEN
    ALTER TABLE bookings ADD COLUMN actual_start_time TIMESTAMP;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'actual_end_time') THEN
    ALTER TABLE bookings ADD COLUMN actual_end_time TIMESTAMP;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'actual_duration') THEN
    ALTER TABLE bookings ADD COLUMN actual_duration INTEGER; -- in minutes
  END IF;

  -- Add notes fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'notes_for_cleaner') THEN
    ALTER TABLE bookings ADD COLUMN notes_for_cleaner TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'cleaner_notes') THEN
    ALTER TABLE bookings ADD COLUMN cleaner_notes TEXT;
  END IF;

  -- Add photo arrays
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'before_photos') THEN
    ALTER TABLE bookings ADD COLUMN before_photos JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'after_photos') THEN
    ALTER TABLE bookings ADD COLUMN after_photos JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add cancellation fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'cancellation_reason') THEN
    ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'cancelled_by') THEN
    ALTER TABLE bookings ADD COLUMN cancelled_by TEXT CHECK (cancelled_by IN ('customer', 'cleaner', 'admin'));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_cleaner ON bookings(assigned_cleaner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_assignment_date ON bookings(assignment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_actual_start_time ON bookings(actual_start_time);

-- Function to calculate booking duration automatically
CREATE OR REPLACE FUNCTION calculate_booking_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actual_end_time IS NOT NULL AND NEW.actual_start_time IS NOT NULL THEN
    NEW.actual_duration = EXTRACT(EPOCH FROM (NEW.actual_end_time - NEW.actual_start_time)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate duration
DROP TRIGGER IF EXISTS trigger_calculate_booking_duration ON bookings;
CREATE TRIGGER trigger_calculate_booking_duration
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_booking_duration();

-- Function to update cleaner statistics
CREATE OR REPLACE FUNCTION update_cleaner_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_bookings when booking is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE cleaners
    SET total_bookings = total_bookings + 1
    WHERE id = NEW.assigned_cleaner_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update cleaner stats
DROP TRIGGER IF EXISTS trigger_update_cleaner_stats ON bookings;
CREATE TRIGGER trigger_update_cleaner_stats
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  WHEN (NEW.assigned_cleaner_id IS NOT NULL)
  EXECUTE FUNCTION update_cleaner_stats();

-- Function to set assignment_date when cleaner is assigned
CREATE OR REPLACE FUNCTION set_assignment_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.assigned_cleaner_id IS NOT NULL AND (OLD.assigned_cleaner_id IS NULL OR OLD.assigned_cleaner_id != NEW.assigned_cleaner_id) THEN
    NEW.assignment_date = NOW();
    -- Also update status to 'assigned' if it's 'new'
    IF NEW.status = 'new' THEN
      NEW.status = 'assigned';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set assignment date
DROP TRIGGER IF EXISTS trigger_set_assignment_date ON bookings;
CREATE TRIGGER trigger_set_assignment_date
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_assignment_date();

-- Update RLS policies for extended bookings

-- Customers can view their own bookings
DROP POLICY IF EXISTS "Customers can view own bookings" ON bookings;
CREATE POLICY "Customers can view own bookings" ON bookings
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    guest_email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- Cleaners can view bookings assigned to them
DROP POLICY IF EXISTS "Cleaners can view assigned bookings" ON bookings;
CREATE POLICY "Cleaners can view assigned bookings" ON bookings
  FOR SELECT
  USING (
    assigned_cleaner_id IN (
      SELECT id FROM cleaners WHERE id = assigned_cleaner_id
    )
  );

-- Admins can view all bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cleaners can update their assigned bookings (cleaner_notes, photos, timing)
DROP POLICY IF EXISTS "Cleaners can update assigned bookings" ON bookings;
CREATE POLICY "Cleaners can update assigned bookings" ON bookings
  FOR UPDATE
  USING (
    assigned_cleaner_id IN (
      SELECT id FROM cleaners WHERE id = assigned_cleaner_id
    )
  )
  WITH CHECK (
    assigned_cleaner_id IN (
      SELECT id FROM cleaners WHERE id = assigned_cleaner_id
    )
  );

-- Customers can update their own bookings (before completion)
DROP POLICY IF EXISTS "Customers can update own bookings" ON bookings;
CREATE POLICY "Customers can update own bookings" ON bookings
  FOR UPDATE
  USING (
    user_id = auth.uid() AND
    status NOT IN ('completed', 'cancelled')
  )
  WITH CHECK (
    user_id = auth.uid()
  );
