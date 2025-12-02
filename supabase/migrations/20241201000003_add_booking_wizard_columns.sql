-- Add missing columns to bookings table for booking wizard
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS bedrooms INTEGER,
ADD COLUMN IF NOT EXISTS bathrooms DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS sqft_range TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'average',
ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Seattle',
ADD COLUMN IF NOT EXISTS zip TEXT,
ADD COLUMN IF NOT EXISTS access_instructions TEXT,
ADD COLUMN IF NOT EXISTS preferred_date DATE,
ADD COLUMN IF NOT EXISTS preferred_time TEXT,
ADD COLUMN IF NOT EXISTS estimated_min INTEGER,
ADD COLUMN IF NOT EXISTS estimated_max INTEGER;

-- Update status column to use 'new' as default instead of 'pending'
ALTER TABLE bookings ALTER COLUMN status SET DEFAULT 'new';
