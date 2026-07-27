-- Customer-facing SMS: delivery log, opt-out registry, marketing consent flag.
-- Enabled by the A2P 10DLC campaign approval on 2026-07-27 (campaign CBBQJO6).
-- Service-role only, like consent_log: RLS on, no anon/authenticated policies.

-- 1. Every customer-facing send, one row. Two jobs:
--    - audit trail per phone (what we sent, when, did it land)
--    - source of truth for the promo cap (max 2 marketing messages/month)
CREATE TABLE IF NOT EXISTS sms_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  kind text NOT NULL CHECK (kind IN (
    'booking_received',
    'booking_confirmed',
    'booking_rescheduled',
    'booking_cancelled',
    'marketing'
  )),
  body text NOT NULL,
  segments int,
  booking_id uuid NULL REFERENCES bookings(id) ON DELETE SET NULL,
  twilio_sid text,
  status text,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE sms_log IS 'Customer-facing SMS sends. Audit trail plus the counter behind the 2-per-month marketing cap.';
COMMENT ON COLUMN sms_log.kind IS 'booking_* = transactional (needs bookings.sms_opt_in); marketing = promo (needs marketing consent).';
COMMENT ON COLUMN sms_log.error_code IS 'Twilio error code when the send was rejected, e.g. 21610 unsubscribed, 30034 unregistered.';

CREATE INDEX IF NOT EXISTS sms_log_phone_created_idx ON sms_log (phone, created_at DESC);
CREATE INDEX IF NOT EXISTS sms_log_kind_created_idx ON sms_log (kind, created_at DESC);

ALTER TABLE sms_log ENABLE ROW LEVEL SECURITY;

-- 2. Opt-out registry. Twilio's Advanced Opt-Out already blocks STOP numbers at
--    the Messaging Service, and rejects sends to them with error 21610. We mirror
--    that locally so we stop *attempting* sends, and so the promo audience query
--    can exclude them in one join instead of burning an API call per recipient.
CREATE TABLE IF NOT EXISTS sms_opt_outs (
  phone text PRIMARY KEY,
  source text NOT NULL DEFAULT 'twilio_21610',
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE sms_opt_outs IS 'Phones that replied STOP. Mirrors Twilio Advanced Opt-Out so we never re-attempt a blocked send.';
COMMENT ON COLUMN sms_opt_outs.source IS 'twilio_21610 = learned from a rejected send; manual = added by an admin.';

ALTER TABLE sms_opt_outs ENABLE ROW LEVEL SECURITY;

-- 3. Marketing consent on the booking row.
--    consent_log already holds the legal evidence with the exact wording shown.
--    These columns are the queryable mirror used to build the promo audience.
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS marketing_sms_opt_in boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_sms_opt_in_at timestamptz;

COMMENT ON COLUMN bookings.marketing_sms_opt_in IS 'True when the customer ticked the optional offers checkbox. Separate from sms_opt_in, per TCPA.';
COMMENT ON COLUMN bookings.marketing_sms_opt_in_at IS 'Timestamp of marketing consent. NULL if not given.';
