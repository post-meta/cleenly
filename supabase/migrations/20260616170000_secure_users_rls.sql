-- Security fix — Supabase advisor: rls_disabled_in_public + sensitive_columns_exposed on public.users.
-- public.users (email, phone, address, telegram_id, hashed password, role…) was readable by the
-- anonymous API role: RLS had been turned off (or a permissive policy added) outside of migrations,
-- so anyone with the project URL + anon key could read every user row.
--
-- Safe to fix: ALL application access to users is via the service_role client
-- (lib/supabase.ts singleton, lib/supabase/admin.ts, and @auth/supabase-adapter in auth.ts),
-- and service_role BYPASSES RLS. No browser/anon path reads users. Enabling RLS and removing
-- anon access closes the leak without breaking the app or NextAuth.

-- 1) Clean slate: drop every existing policy on public.users by name (service_role ignores
--    policies entirely, so the app is unaffected). This removes any permissive leak regardless
--    of what it was named, then we recreate a known-good least-privilege set below.
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
  END LOOP;
END $$;

-- 2) Enforce row-level security.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3) Least-privilege policies. Dormant for current service_role traffic; correct if a
--    Supabase-JWT (authenticated) client is ever introduced. service_role always bypasses.
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "users_admin_all" ON public.users
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4) Defense-in-depth: the anon API role must never touch users.
REVOKE ALL ON public.users FROM anon;

-- 5) Re-assert RLS on sensitive auth-internal tables (service_role-managed only; never anon).
ALTER TABLE public.accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes           ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.accounts, public.sessions, public.verification_tokens, public.password_resets, public.otp_codes FROM anon;
