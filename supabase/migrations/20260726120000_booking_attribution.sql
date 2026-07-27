-- First-touch campaign attribution on bookings.
--
-- Written for the Instagram launch: eighteen content units go out and without
-- this there is no way to tell which two did the work. Middleware captures the
-- UTM parameters into the `cleenly_attr` cookie on the first page of a visit;
-- /api/bookings copies them onto the row.
--
-- All columns are nullable. A booking that arrives with no campaign data is
-- normal (direct, organic, a phone call) and must never fail on this account.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS utm_source   text,
  ADD COLUMN IF NOT EXISTS utm_medium   text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content  text,
  ADD COLUMN IF NOT EXISTS utm_term     text,
  ADD COLUMN IF NOT EXISTS landing_path text,
  ADD COLUMN IF NOT EXISTS referrer     text;

COMMENT ON COLUMN bookings.utm_source   IS 'First-touch utm_source. "instagram" for the IG channel — GA4 classifies that value as Organic Social, "ig" it does not.';
COMMENT ON COLUMN bookings.utm_medium   IS 'First-touch utm_medium. "social" for IG posts, "bio" for the profile link.';
COMMENT ON COLUMN bookings.utm_campaign IS 'First-touch utm_campaign, e.g. "launch-2026-08".';
COMMENT ON COLUMN bookings.utm_content  IS 'The content unit: post-01 … post-09, carousel-1, story-3, reel-1, bio-link. The column the launch is actually measured on.';
COMMENT ON COLUMN bookings.utm_term     IS 'First-touch utm_term. Reserved for paid search; unused by the IG channel.';
COMMENT ON COLUMN bookings.landing_path IS 'Path of the first page of the visit that carried the campaign parameters.';
COMMENT ON COLUMN bookings.referrer     IS 'Referer header on that first page, host only. Truncated to 200 chars.';

-- Grouping by utm_content is the whole point, so index it. Partial: the
-- overwhelming majority of rows will be NULL here and do not belong in the index.
CREATE INDEX IF NOT EXISTS bookings_utm_content_idx
  ON bookings (utm_content)
  WHERE utm_content IS NOT NULL;

-- One row per content unit. security_invoker keeps the view under the caller's
-- RLS instead of the definer's — without it a view silently hands anon the rows
-- the underlying policy denies.
CREATE OR REPLACE VIEW booking_attribution
WITH (security_invoker = on) AS
SELECT
  COALESCE(utm_source,  '(none)') AS source,
  COALESCE(utm_medium,  '(none)') AS medium,
  COALESCE(utm_campaign,'(none)') AS campaign,
  COALESCE(utm_content, '(none)') AS content,
  COUNT(*)                                            AS bookings,
  COUNT(*) FILTER (WHERE status = 'completed')        AS completed,
  COUNT(*) FILTER (WHERE status = 'cancelled')        AS cancelled,
  SUM(estimated_max)                                  AS pipeline_estimated_max_cents,
  MIN(created_at)                                     AS first_booking_at,
  MAX(created_at)                                     AS last_booking_at
FROM bookings
GROUP BY 1, 2, 3, 4;

COMMENT ON VIEW booking_attribution IS 'Bookings grouped by first-touch campaign. Read it to answer "which content unit produced bookings".';

REVOKE ALL ON booking_attribution FROM anon;
