-- Adds explicit SMS opt-in tracking to bookings.
-- Required for A2P 10DLC compliance: must record per-user consent independent of TOS acceptance.
-- The booking wizard's contact step writes this from an isolated checkbox.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS sms_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sms_opt_in_at timestamptz;

-- Comment for future readers
COMMENT ON COLUMN bookings.sms_opt_in IS 'True when the customer ticked the isolated SMS-consent checkbox at booking time. Required by A2P 10DLC.';
COMMENT ON COLUMN bookings.sms_opt_in_at IS 'Timestamp of consent. NULL if customer did not opt in.';
