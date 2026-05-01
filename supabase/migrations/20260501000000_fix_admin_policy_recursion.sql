-- Fix infinite recursion in admin RLS policies.
-- The CRM migration created policies that did `SELECT id FROM profiles WHERE role='admin'`
-- on tables that themselves had the same policy (profiles), causing infinite recursion
-- whenever any FOR ALL / SELECT happened. Replace with a SECURITY DEFINER helper
-- that bypasses RLS when checking admin status.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Drop and recreate policies that referenced profiles inline
DROP POLICY IF EXISTS "Admins: full access profiles" ON public.profiles;
CREATE POLICY "Admins: full access profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins: full access cleaners" ON public.cleaner_profiles;
CREATE POLICY "Admins: full access cleaners"
  ON public.cleaner_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins: full access bookings" ON public.bookings;
CREATE POLICY "Admins: full access bookings"
  ON public.bookings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins: full access payments" ON public.payments;
CREATE POLICY "Admins: full access payments"
  ON public.payments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins: full access payouts" ON public.cleaner_payouts;
CREATE POLICY "Admins: full access payouts"
  ON public.cleaner_payouts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins: full access notes" ON public.customer_notes;
CREATE POLICY "Admins: full access notes"
  ON public.customer_notes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Also fix the legacy "Admins can update any profile" on users table (same pattern).
DROP POLICY IF EXISTS "Admins can update any profile" ON public.users;
CREATE POLICY "Admins can update any profile"
  ON public.users FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.is_admin());
