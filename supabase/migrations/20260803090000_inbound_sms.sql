-- Inbound texts, so the phone agent can be handed what it cannot hear.
--
-- Spelling a street name down a phone line is slow and still wrong: the first
-- real call turned "Fairwood" into "Fayetteville" and "Evgeniy" into "Yemi".
-- Letting the caller type it instead removes the transcription step entirely.
--
-- The voice session lives in a WebSocket and an inbound text arrives on a
-- separate HTTP request, so the two need somewhere they can both see. The
-- worker has no KV and no Durable Object, but it already holds Supabase
-- service-role credentials — this table is that shared surface.
--
-- These rows hold addresses and emails typed by customers. They are working
-- memory for a call in progress, not a record worth keeping: prune them.

create table if not exists public.inbound_sms (
    id           uuid primary key default gen_random_uuid(),
    -- Last 10 digits, so a call from +12065551234 finds a text from 2065551234.
    from_phone   text not null,
    raw_from     text,
    body         text not null,
    -- Twilio's message id. Unique so a webhook retry cannot double-insert.
    message_sid  text unique,
    received_at  timestamptz not null default now(),
    -- Set when the agent reads it, so the same text is not used twice in one
    -- call and a later call cannot pick up a stale address.
    consumed_at  timestamptz
);

create index if not exists inbound_sms_phone_time_idx
    on public.inbound_sms (from_phone, received_at desc);

comment on table public.inbound_sms is
    'Texts received on the Cleenly number. Working memory for the voice agent — prune regularly, these carry customer addresses.';

-- Every read and write goes through the service-role client (the worker and
-- the site). Anon gets nothing: this is other people's home addresses.
alter table public.inbound_sms enable row level security;
revoke all on public.inbound_sms from anon;

do $$ begin
    create policy inbound_sms_admin_all on public.inbound_sms
        for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;
