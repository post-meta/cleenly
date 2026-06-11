-- Consent log for A2P 10DLC compliance.
-- One row per consent event (checkbox ticked at booking time).
-- Stores the exact consent text the user saw — required evidence for carrier audits.
-- Service-role only: RLS enabled with NO anon/authenticated policies.

CREATE TABLE IF NOT EXISTS consent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  email text,
  consent_type text NOT NULL CHECK (consent_type IN ('transactional_sms', 'marketing_sms')),
  consent_text text NOT NULL,
  ip text,
  user_agent text,
  booking_id uuid NULL REFERENCES bookings(id),
  created_at timestamptz DEFAULT now()
);

COMMENT ON TABLE consent_log IS 'A2P 10DLC consent evidence. One row per ticked checkbox. consent_text = exact wording shown to the user.';
COMMENT ON COLUMN consent_log.consent_type IS 'transactional_sms = booking notifications checkbox; marketing_sms = offers/tips checkbox (express written consent, TCPA).';

ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;

-- No policies on purpose: only the service role (which bypasses RLS) may read/write.
