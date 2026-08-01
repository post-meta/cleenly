-- Availability model.
--
-- Booking was a request: the wizard offered the next 14 days x 2 slots
-- unconditionally and a human confirmed by hand. Seven of ten bookings sat in
-- `new`, one of them a real customer whose date passed unanswered. This adds
-- the missing half: what the crew can actually take, and from that, instant
-- confirmation.
--
-- Busy time arrives from several places (Inna's TickTick, the apartment work
-- we do for another company, manual entry). They land in ONE table with a
-- common shape so the resolver never learns where a block came from.

-- ---------------------------------------------------------------------------
-- Working pattern: which weekdays are workable, the window, and crew size.
-- Editable without a deploy — this is an operating fact, not a constant.
-- ---------------------------------------------------------------------------
create table if not exists public.availability_rules (
    weekday      smallint primary key check (weekday between 0 and 6), -- 0 = Sunday
    works        boolean  not null default true,
    -- Minutes from midnight, local Seattle time. 480 = 08:00, 960 = 16:00.
    start_minute smallint not null default 480 check (start_minute between 0 and 1440),
    end_minute   smallint not null default 960 check (end_minute   between 0 and 1440),
    crew_size    smallint not null default 2 check (crew_size >= 0),
    constraint availability_rules_window check (end_minute > start_minute)
);

comment on table public.availability_rules is
    'Baseline working pattern per weekday. Busy blocks subtract from this.';

insert into public.availability_rules (weekday, works, start_minute, end_minute, crew_size)
values (0, false, 480, 960, 2),  -- Sunday off
       (1, true,  480, 960, 2),
       (2, true,  480, 960, 2),
       (3, true,  480, 960, 2),
       (4, true,  480, 960, 2),
       (5, true,  480, 960, 2),
       (6, true,  480, 960, 2)   -- Saturday on
on conflict (weekday) do nothing;

-- ---------------------------------------------------------------------------
-- Busy blocks: every source normalises into this.
-- ---------------------------------------------------------------------------
do $$ begin
    create type public.busy_source as enum ('ical', 'manual', 'smartsheet');
exception when duplicate_object then null; end $$;

-- Who the block consumes. A block on one person leaves the other workable,
-- which halves crew size for that day rather than closing it.
do $$ begin
    create type public.busy_who as enum ('eugene', 'inna', 'both');
exception when duplicate_object then null; end $$;

create table if not exists public.busy_blocks (
    id           uuid primary key default gen_random_uuid(),
    source       public.busy_source not null,
    -- Which feed inside a source, e.g. 'inna_ticktick'. Lets one adapter serve
    -- several calendars and lets a resync delete only its own rows.
    feed_key     text not null,
    -- Stable id in the origin system (iCal UID, sheet row id). Makes the sync
    -- idempotent and lets a deletion upstream delete here.
    source_ref   text,
    who          public.busy_who not null default 'both',
    block_date   date not null,
    -- NULL start/end = the whole working day.
    start_minute smallint check (start_minute between 0 and 1440),
    end_minute   smallint check (end_minute   between 0 and 1440),
    note         text,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    constraint busy_blocks_window check (
        (start_minute is null and end_minute is null)
        or (start_minute is not null and end_minute is not null and end_minute > start_minute)
    )
);

-- Idempotent upsert target for feed syncs: `on conflict (feed_key, source_ref)`.
--
-- Deliberately NOT a partial index. A `where source_ref is not null` predicate
-- makes Postgres reject `ON CONFLICT (feed_key, source_ref)` with 42P10 unless
-- the same predicate is repeated, and PostgREST's .upsert() cannot express one.
-- A plain unique index gives the semantics we want anyway: NULLs are distinct
-- in a unique index, so manual rows (which carry no source_ref) never collide
-- with each other, while feed rows stay unique per reference.
create unique index if not exists busy_blocks_feed_ref_key
    on public.busy_blocks (feed_key, source_ref);

create index if not exists busy_blocks_date_idx on public.busy_blocks (block_date);

comment on table public.busy_blocks is
    'Normalised busy time from every source. The resolver reads only this.';

-- ---------------------------------------------------------------------------
-- Sync freshness, per feed. This is what makes the system fail closed:
-- a feed that has not synced recently must not be read as "nothing is busy".
-- ---------------------------------------------------------------------------
create table if not exists public.availability_sync_state (
    feed_key        text primary key,
    enabled         boolean not null default true,
    last_success_at timestamptz,
    last_attempt_at timestamptz,
    last_error      text,
    blocks_synced   integer not null default 0,
    updated_at      timestamptz not null default now()
);

comment on table public.availability_sync_state is
    'Per-feed freshness. A stale enabled feed disables auto-confirm rather than widening availability.';

-- ---------------------------------------------------------------------------
-- Global switches. Single row.
-- ---------------------------------------------------------------------------
create table if not exists public.availability_settings (
    id                   boolean primary key default true check (id),
    -- OFF by default on purpose: turning it on commits the crew to visits
    -- without a human looking. The owner flips this, not a deploy.
    auto_confirm_enabled boolean not null default false,
    -- A feed silent longer than this stops auto-confirm.
    max_stale_minutes    integer not null default 180 check (max_stale_minutes > 0),
    -- Earliest bookable visit, in hours from now.
    lead_time_hours      integer not null default 24 check (lead_time_hours >= 0),
    -- How far ahead the wizard offers dates.
    horizon_days         integer not null default 14 check (horizon_days between 1 and 90),
    updated_at           timestamptz not null default now()
);

insert into public.availability_settings (id) values (true) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS. Every read in the app goes through the service-role client, which
-- bypasses RLS. Anon gets nothing: busy blocks can carry third-party notes,
-- and the working pattern is not public information.
-- Do NOT disable RLS to "fix" a read — switch the caller to service-role.
-- ---------------------------------------------------------------------------
alter table public.availability_rules      enable row level security;
alter table public.busy_blocks             enable row level security;
alter table public.availability_sync_state enable row level security;
alter table public.availability_settings   enable row level security;

revoke all on public.availability_rules      from anon;
revoke all on public.busy_blocks             from anon;
revoke all on public.availability_sync_state from anon;
revoke all on public.availability_settings   from anon;

-- Admin-only policies, via the existing SECURITY DEFINER helper. Inline
-- `select id from profiles where role='admin'` recurses; is_admin() does not.
do $$ begin
    create policy busy_blocks_admin_all on public.busy_blocks
        for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
    create policy availability_rules_admin_all on public.availability_rules
        for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
    create policy availability_settings_admin_all on public.availability_settings
        for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
    create policy availability_sync_state_admin_all on public.availability_sync_state
        for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Bookings gain a confirmation trail. `confirmed_at` already exists; this
-- records HOW it was confirmed, so an auto-confirmed visit is auditable and
-- can be told apart from one a human approved.
-- ---------------------------------------------------------------------------
do $$ begin
    create type public.confirmation_mode as enum ('auto', 'manual');
exception when duplicate_object then null; end $$;

alter table public.bookings
    add column if not exists confirmation_mode public.confirmation_mode;

comment on column public.bookings.confirmation_mode is
    'How the booking reached `confirmed`: auto (availability resolver) or manual (admin).';
