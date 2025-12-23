-- Add missing columns to addresses table for dashboard management
ALTER TABLE addresses 
ADD COLUMN IF NOT EXISTS label TEXT,
ADD COLUMN IF NOT EXISTS apartment TEXT,
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;

-- Add index for performance and to help with default address logic
CREATE INDEX IF NOT EXISTS idx_addresses_user_id_default ON addresses(user_id) WHERE is_default = true;
