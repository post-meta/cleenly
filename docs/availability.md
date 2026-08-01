# Availability & instant confirmation

Built 2026-07-31. **Shipped switched off** — see "Going live" below.

## The model

```
offerable = working pattern
          − busy blocks (Inna's calendar, apartment work, manual entry)
          − visits already booked
```

Capacity is measured in **cleaner-hours**, not slots. `estimateCleanerHours()`
in `lib/pricing.ts` is the single engine behind both the price and the
schedule, so the two cannot drift into offering a day that cannot hold the job.

Wall-clock time is cleaner-hours ÷ the crew actually free that day. One person
out means the same visit takes twice as long; the hourly pricing model absorbs
that without changing the customer's estimate.

A visit too long for either half-day is offered as **Full day** rather than as
a morning the crew cannot finish in. With the seeded 8:00–16:00 window and a
crew of two, that is most move-outs and many deep cleans — realistic, not a
bug. Widen the window in `/admin/availability` and more of them fit.

## Fail closed

Busy time arrives from calendars we do not own. A sync that breaks must never
read as "nothing is busy".

| Failure | What happens |
|---|---|
| Feed silent longer than `max_stale_minutes` | Auto-confirm off. Availability still shown; bookings stay requests. |
| Feed fetch or parse fails | `last_error` recorded. **Existing blocks are not deleted.** Only a successful parse may delete. |
| `CRON_SECRET` unset | Cron returns 503. It never runs unauthenticated. |
| Resolver throws inside `/api/bookings` | Logged; the booking inserts as an ordinary request. A booking that cannot be auto-confirmed is still a booking. |
| `/api/availability` throws | Returns `{days: [], degraded: true}`; the wizard falls back to the old 14-day list and says we'll confirm. Never an error screen. |

Over-blocking costs a phone call. Double-booking costs a visit. Every ambiguous
case resolves toward over-blocking.

## Tables

| Table | Holds |
|---|---|
| `availability_rules` | Working pattern per weekday: works, window, crew size. Seeded Mon–Sat 08:00–16:00, crew 2, Sunday off. |
| `busy_blocks` | Normalised busy time from every source. `NULL` start/end = all day. `who` is `eugene`/`inna`/`both`. |
| `availability_sync_state` | Per-feed freshness. This is what withdraws auto-confirm. |
| `availability_settings` | One row: `auto_confirm_enabled`, `max_stale_minutes`, `lead_time_hours`, `horizon_days`. |

`bookings.confirmation_mode` (`auto`/`manual`) records how a visit was confirmed.

The unique index on `busy_blocks (feed_key, source_ref)` is deliberately **not
partial**. A `WHERE source_ref IS NOT NULL` predicate makes Postgres reject
`ON CONFLICT` with 42P10, and PostgREST's `.upsert()` cannot express one. NULLs
are distinct in a unique index anyway, so manual rows never clash.

## Adding a calendar feed

Feeds are read-only iCal subscriptions. Set `ICAL_FEEDS` in Vercel Production:

```json
[{"key":"inna_ticktick","url":"https://ticktick.com/pub/calendar/feeds/...","who":"inna"}]
```

TickTick: avatar → Settings → Integrations & Import → Others → Subscribe to
TickTick → Enable the URL → pick the list.

**Privacy:** only dates and times are stored. Event titles are parsed and then
discarded — third-party calendars carry other people's client names, and none
of that belongs in this database.

Smartsheet is **not** wired up: its API needs a Business plan ($19/member/month
billed yearly) and the sheet belongs to another company. Mark those days by
hand in `/admin/availability`, or keep them in a TickTick list and add a second
feed.

## Going live

Two switches, both off, in this order:

1. **`/admin/availability` → auto-confirm.** Before flipping: check the working
   pattern is right, and that busy days for the next two weeks are in. With no
   feed configured the only busy source is manual entry — auto-confirm will
   happily take a day you are working on apartments if that day is not blocked.

2. **`CLIENT_SMS_ENABLED=true` in Vercel.** This turns on customer SMS. Note
   there are existing bookings with transactional consent, including a real
   customer (booking from 2026-07-12); changing their status will text them.
   Settle those rows first.

`CRON_SECRET` is already set. `ICAL_FEEDS` is not — until it is, the cron runs,
finds no feeds, and records nothing.

## Files

```
lib/availability/dates.ts       Seattle-local date maths (own module so the parser
                                does not import a database client)
lib/availability/intervals.ts   pure interval arithmetic
lib/availability/ical.ts        RFC 5545 parser, no dependencies
lib/availability/sync.ts        feed → busy_blocks, idempotent, fail-closed
lib/availability/resolver.ts    the model above
app/api/availability/           what the wizard asks
app/api/cron/sync-availability/ every 15 min, Bearer CRON_SECRET
app/admin/availability/         switches, working pattern, manual busy days
```

## Known gaps

- `scheduled_time` carries two shapes: slot ids from the wizard, clock times
  from the admin form. `bookedSlot()` maps clock times to the half they start
  in. A start time says nothing about duration, so an admin booking that
  overruns into the afternoon is not seen — cover it with a manual block.
- `estimated_duration` has a pre-existing unit conflict (admin labels it hours,
  the dashboard prints minutes). Not used by the resolver for that reason.
- No reminder messages exist. Do not write copy promising one.
