-- NextAuth.js Supabase Adapter Tables
-- Link: https://authjs.dev/reference/adapter/supabase

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS next_auth;

-- Update users table for NextAuth compatibility
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP WITH TIME ZONE;

-- Create accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  
  UNIQUE(provider, "providerAccountId")
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  
  PRIMARY KEY (identifier, token)
);

-- Enable RLS on new tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Standard for Adapter)
-- Note: The SupabaseAdapter uses the Service Role Key, so it bypasses RLS.
-- However, we add policies for completeness or if client-side access is ever needed.

DROP POLICY IF EXISTS "Service role can do everything on accounts" ON public.accounts;
CREATE POLICY "Service role can do everything on accounts" ON public.accounts
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can do everything on sessions" ON public.sessions;
CREATE POLICY "Service role can do everything on sessions" ON public.sessions
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can do everything on verification_tokens" ON public.verification_tokens;
CREATE POLICY "Service role can do everything on verification_tokens" ON public.verification_tokens
  USING (true) WITH CHECK (true);
