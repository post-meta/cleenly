-- Create payouts table for cleaner payments
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id UUID REFERENCES cleaners(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    method TEXT, -- 'venmo', 'zelle', 'cash', etc.
    transaction_id TEXT, -- External transaction ID
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    notes TEXT,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payouts_cleaner ON payouts(cleaner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_booking ON payouts(booking_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

-- RLS policies
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Admins can manage all payouts
CREATE POLICY "Admins can manage payouts" ON payouts
    FOR ALL
    USING (true)
    WITH CHECK (true);
