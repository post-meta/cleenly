-- Extend users table with additional profile fields
-- Using ALTER TABLE directly instead of DO $$ block to ensure proper execution order

-- Add role column
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'cleaner', 'admin'));

-- Add bio column
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add avatar_url column
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add default address fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Seattle';
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'WA';
ALTER TABLE users ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Add preferences as JSONB
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Add is_active flag
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add last_login_at timestamp
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Function to update last_login_at
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for extended user profiles
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read public profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can update any profile" ON users;

-- Users can read all public profile fields
CREATE POLICY "Users can read public profiles" ON users
  FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any profile (if admin role exists)
CREATE POLICY "Admins can update any profile" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create a view for public profiles (excludes sensitive data)
CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  name,
  email,
  phone,
  role,
  bio,
  avatar_url,
  city,
  state,
  created_at,
  is_active
FROM users
WHERE is_active = true;

-- Grant access to public_profiles view
GRANT SELECT ON public_profiles TO authenticated;
GRANT SELECT ON public_profiles TO anon;
