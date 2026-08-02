/**
 * Whether we are taking on cleaners right now.
 *
 * Set false 2026-08-01: the crew is not hiring. While it is false, the
 * recruitment funnel stops advertising itself — /join and /join/apply carry
 * noindex, /join leaves the sitemap, and the footer and About page drop their
 * "for cleaners" links. Sending Google a steady stream of applicants for a role
 * that does not exist costs the applicant their time and us the reply.
 *
 * The pages stay up and the form stays wired. Someone with a direct link, or a
 * person we invited ourselves, can still apply — that is a referral, not a
 * cold application, and it is the case worth keeping open.
 *
 * To start hiring again, set this true. That is the whole change: the sitemap,
 * the robots tags, and every link come back on their own.
 */
export const HIRING_OPEN = false;

/**
 * Robots directive for the recruitment pages.
 *
 * Note this is a `noindex` rather than a robots.txt block on purpose: Google
 * has to be allowed to fetch the page to see the tag. Blocking the path would
 * leave the already-indexed URL listed with no content behind it.
 */
export const hiringRobots = HIRING_OPEN
  ? undefined
  : { index: false, follow: true };
