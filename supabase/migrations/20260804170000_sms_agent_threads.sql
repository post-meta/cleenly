-- SMS agent conversation threads.
--
-- One row per customer phone number (last 10 digits). `messages` stores the
-- Anthropic-format history verbatim (including tool_use/tool_result blocks) so
-- the agent keeps its working context across webhook invocations. `status`
-- flips to 'human' on escalation: from then on inbound texts are forwarded to
-- Telegram only and the agent stays silent until the conversation window
-- expires (48h of quiet) and resets.
--
-- Worker-only table: accessed exclusively with the service role.
create table if not exists public.sms_agent_threads (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  messages jsonb not null default '[]'::jsonb,
  status text not null default 'agent' check (status in ('agent', 'human')),
  escalated_at timestamptz,
  -- Twilio MessageSids already folded into `messages` — webhook retries are
  -- dropped instead of double-answered.
  seen_sids jsonb not null default '[]'::jsonb,
  turn_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sms_agent_threads enable row level security;
revoke all on public.sms_agent_threads from anon, authenticated;
