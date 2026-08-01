# Availability

`resolver.ts` answers what the crew can take. `ical.ts` reads calendars,
`sync.ts` writes them into `busy_blocks`, `intervals.ts` does the arithmetic.

## Fail-closed contract

- Only a fetch that succeeded **and** parsed may delete blocks. A timeout, a
  non-2xx, an empty body, or a response without `BEGIN:VCALENDAR` (an expired
  share link serves an HTML sign-in page) records `last_error` and leaves every
  existing block in place.
- Writes happen before deletes. A run that dies halfway leaves too much busy
  time, never too little.
- Deletes are scoped to one `feed_key` and to the synced horizon. History stays.
- A feed silent longer than `availability_settings.max_stale_minutes` stops
  auto-confirm. Bookings still arrive; they wait for a human.
- A recurrence we cannot expand keeps its first occurrence, flagged `complex`.

## Privacy

`parseIcs` returns `summary` so a caller can judge; the sync writes
`note = null`. Do not store event titles from someone else's calendar.

## Adding a feed

1. Add to the `ICAL_FEEDS` env var (JSON array):
   `[{"key":"inna_ticktick","url":"https://…/x.ics","who":"inna"}]`
   `who` is `eugene` | `inna` | `both`; anything unreadable becomes `both`.
2. Deploy. The cron creates the `availability_sync_state` row on first run.
3. `CRON_SECRET` must be set or `/api/cron/sync-availability` returns 503.
