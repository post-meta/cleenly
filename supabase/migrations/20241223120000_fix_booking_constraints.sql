-- Relax NOT NULL constraints for scheduled_date and scheduled_time
-- as they are not used in the initial booking wizard (preferred_date/time are used instead)
ALTER TABLE bookings ALTER COLUMN scheduled_date DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN scheduled_time DROP NOT NULL;

-- Enable guest/anonymous inserts for bookings
DROP POLICY IF EXISTS "Allow anonymous bookings" ON bookings;
CREATE POLICY "Allow anonymous bookings" ON bookings
  FOR INSERT 
  WITH CHECK (true);

-- Ensure guests can view their own bookings if they have the ID (later we might use guest_email)
-- Currently, we have:
--   user_id = auth.uid() OR
--   guest_email = (SELECT email FROM users WHERE id = auth.uid())
-- For public/guest access, we might need a more permissive view policy or rely on status check
-- But for now, fixing INSERT is the primary goal.
