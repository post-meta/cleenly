-- Extend cleaners table with additional fields for CRM
DO $$
BEGIN
  -- Rename name to full_name for consistency
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaners' AND column_name = 'name') THEN
    ALTER TABLE cleaners RENAME COLUMN name TO full_name;
  END IF;

  -- Add phone field (required for contact)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaners' AND column_name = 'phone') THEN
    ALTER TABLE cleaners ADD COLUMN phone TEXT;
  END IF;

  -- Add email field (optional)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaners' AND column_name = 'email') THEN
    ALTER TABLE cleaners ADD COLUMN email TEXT;
  END IF;

  -- Add notes field (optional, for internal notes like "Prefers Eastside")
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaners' AND column_name = 'notes') THEN
    ALTER TABLE cleaners ADD COLUMN notes TEXT;
  END IF;

  -- Add is_active field for soft delete/deactivation
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaners' AND column_name = 'is_active') THEN
    ALTER TABLE cleaners ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;

  -- Rename profile_photo to photo_url for consistency
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cleaners' AND column_name = 'profile_photo') THEN
    ALTER TABLE cleaners RENAME COLUMN profile_photo TO photo_url;
  END IF;
END $$;

-- Create index for active cleaners lookup
CREATE INDEX IF NOT EXISTS idx_cleaners_is_active ON cleaners(is_active);

-- Create index for phone lookup
CREATE INDEX IF NOT EXISTS idx_cleaners_phone ON cleaners(phone);
