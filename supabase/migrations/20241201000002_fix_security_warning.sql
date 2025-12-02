-- Fix security warning: Function Search Path Mutable
-- Explicitly set search_path to 'public' for the function
ALTER FUNCTION delete_expired_otps() SET search_path = public;
