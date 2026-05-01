import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service-role key.
// Bypasses RLS — use ONLY in server endpoints where input is already validated.
// Never expose this client to the browser.

export function createAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("SUPABASE_URL is not set");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
