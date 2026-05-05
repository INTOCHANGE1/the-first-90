-- THE FIRST 90 — DATABASE SCHEMA
-- Run this in the Supabase SQL Editor as a single transaction.
-- All tables have Row Level Security enabled with owner-only policies.

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- HELPER FUNCTION: updated_at trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- PROFILES (linked to auth.users)
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  invite_code_used text,
  program_source text,
  started_at timestamptz default now(),
  current_phase int default 1,
  current_day int default 1,
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

create policy "users can read own profile" on profiles
  for select using (auth.uid() = id);
create policy "users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- ============================================================
-- INVITE CODES
-- ============================================================
create table invite_codes (
  code text primary key,
  program_source text not null,
  is_active boolean default true,
  used_by uuid references profiles(id),
  used_at timestamptz,
  created_at timestamptz default now()
);

alter table invite_codes enable row level security;

-- Anyone authenticated can read codes (to validate them)
-- Only service role can write (founder will manage codes via Supabase dashboard)
create policy "authenticated users can read codes" on invite_codes
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- FRONT MATTER ENTRIES
-- ============================================================
create table front_matter_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  page_key text not null,
  content jsonb default '{}'::jsonb,
  signed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, page_key)
);

create trigger trg_front_matter_updated_at
  before update on front_matter_entries
  for each row execute function set_updated_at();

alter table front_matter_entries enable row level security;

create policy "users own front matter" on front_matter_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- WHEEL ENTRIES
-- ============================================================
create table wheel_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  moment text not null check (moment in ('phase_1_start', 'post_90')),
  ratings jsonb default '{}'::jsonb,
  debrief jsonb default '{}'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, moment)
);

create trigger trg_wheel_updated_at
  before update on wheel_entries
  for each row execute function set_updated_at();

alter table wheel_entries enable row level security;

create policy "users own wheel entries" on wheel_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- GAP ENTRIES
-- ============================================================
create table gap_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  have jsonb default '{}'::jsonb,
  be jsonb default '{}'::jsonb,
  do_section jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

create trigger trg_gap_updated_at
  before update on gap_entries
  for each row execute function set_updated_at();

alter table gap_entries enable row level security;

create policy "users own gap entries" on gap_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- FOUR PILLARS ENTRIES
-- ============================================================
create table four_pillars_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  moment text not null check (moment in ('audit', 'leadership')),
  self_text text default '',
  partner_text text default '',
  children_text text default '',
  work_text text default '',
  reflection text default '',
  updated_at timestamptz default now(),
  unique(user_id, moment)
);

create trigger trg_four_pillars_updated_at
  before update on four_pillars_entries
  for each row execute function set_updated_at();

alter table four_pillars_entries enable row level security;

create policy "users own four pillars entries" on four_pillars_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- INTEGRITY INVENTORY
-- ============================================================
create table integrity_inventory_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  broken_to_self text default '',
  broken_to_partner text default '',
  broken_to_children text default '',
  broken_to_work text default '',
  reflection text default '',
  updated_at timestamptz default now()
);

create trigger trg_integrity_updated_at
  before update on integrity_inventory_entries
  for each row execute function set_updated_at();

alter table integrity_inventory_entries enable row level security;

create policy "users own integrity entries" on integrity_inventory_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- MAN COMPARISON
-- ============================================================
create table man_comparison_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  been text[] default '{}',
  becoming text[] default '{}',
  updated_at timestamptz default now()
);

create trigger trg_man_comparison_updated_at
  before update on man_comparison_entries
  for each row execute function set_updated_at();

alter table man_comparison_entries enable row level security;

create policy "users own man comparison" on man_comparison_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- MORNING / NIGHT ROUTINES
-- ============================================================
create table morning_night_routines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  routine_type text not null check (routine_type in ('morning', 'night')),
  description text default '',
  non_negotiables text[] default '{}',
  reflection text default '',
  benefits text default '',
  updated_at timestamptz default now(),
  unique(user_id, routine_type)
);

create trigger trg_routines_updated_at
  before update on morning_night_routines
  for each row execute function set_updated_at();

alter table morning_night_routines enable row level security;

create policy "users own routines" on morning_night_routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- PHASE HABIT GRIDS
-- ============================================================
create table phase_habit_grids (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  phase int not null check (phase in (1, 2, 3)),
  habits text[] default '{}',
  ticks jsonb default '{}'::jsonb,
  reflection text default '',
  updated_at timestamptz default now(),
  unique(user_id, phase)
);

create trigger trg_habit_grids_updated_at
  before update on phase_habit_grids
  for each row execute function set_updated_at();

alter table phase_habit_grids enable row level security;

create policy "users own habit grids" on phase_habit_grids
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- DAILY ENTRIES
-- ============================================================
create table daily_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  day_number int not null check (day_number between 1 and 84),
  phase int not null check (phase in (1, 2, 3)),
  morning jsonb default '{}'::jsonb,
  evening jsonb default '{}'::jsonb,
  morning_completed_at timestamptz,
  evening_completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, day_number)
);

create trigger trg_daily_updated_at
  before update on daily_entries
  for each row execute function set_updated_at();

alter table daily_entries enable row level security;

create policy "users own daily entries" on daily_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index idx_daily_user_day on daily_entries(user_id, day_number);

-- ============================================================
-- WEEKLY ENTRIES
-- ============================================================
create table weekly_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  week_number int not null check (week_number between 1 and 12),
  phase int not null check (phase in (1, 2, 3)),
  focus jsonb default '{}'::jsonb,
  sunday_review jsonb default '{}'::jsonb,
  focus_completed_at timestamptz,
  review_completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, week_number)
);

create trigger trg_weekly_updated_at
  before update on weekly_entries
  for each row execute function set_updated_at();

alter table weekly_entries enable row level security;

create policy "users own weekly entries" on weekly_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index idx_weekly_user_week on weekly_entries(user_id, week_number);

-- ============================================================
-- PHASE RESETS
-- ============================================================
create table phase_resets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  phase int not null check (phase in (1, 2, 3)),
  reflections jsonb default '{}'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, phase)
);

create trigger trg_phase_resets_updated_at
  before update on phase_resets
  for each row execute function set_updated_at();

alter table phase_resets enable row level security;

create policy "users own phase resets" on phase_resets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- LEGACY ENTRIES
-- ============================================================
create table legacy_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  children_remember text default '',
  partner_say text default '',
  brotherhood_say text default '',
  bigger_work text default '',
  ten_year_legacy text default '',
  updated_at timestamptz default now()
);

create trigger trg_legacy_updated_at
  before update on legacy_entries
  for each row execute function set_updated_at();

alter table legacy_entries enable row level security;

create policy "users own legacy" on legacy_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- FINAL REVIEW
-- ============================================================
create table final_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  most_important_lesson text default '',
  habit_for_life text default '',
  relationships_changed text default '',
  who_am_i_when_alone text default '',
  truth_now_known text default '',
  still_needs_work text default '',
  committing_to text default '',
  completed_at timestamptz,
  updated_at timestamptz default now()
);

create trigger trg_final_review_updated_at
  before update on final_reviews
  for each row execute function set_updated_at();

alter table final_reviews enable row level security;

create policy "users own final review" on final_reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- FREEFORM ENTRIES
-- ============================================================
create table freeform_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text,
  content text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger trg_freeform_updated_at
  before update on freeform_entries
  for each row execute function set_updated_at();

alter table freeform_entries enable row level security;

create policy "users own freeform" on freeform_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index idx_freeform_user on freeform_entries(user_id, created_at desc);

-- ============================================================
-- RESET EVENTS
-- ============================================================
create table reset_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  missed_days int,
  reflections jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table reset_events enable row level security;

create policy "users own resets" on reset_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- AUTOMATIC PROFILE CREATION ON SIGNUP
-- When a user signs in via Google for the first time,
-- automatically create their profile row.
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CODE REDEMPTION FUNCTION
-- Atomic operation: validate code, mark as used, link to user.
-- Call this from a server action after successful auth.
-- ============================================================
create or replace function redeem_invite_code(code_input text)
returns boolean as $$
declare
  found_code invite_codes%rowtype;
begin
  select * into found_code
  from invite_codes
  where code = code_input
    and is_active = true
    and used_by is null
  for update;

  if not found then
    return false;
  end if;

  update invite_codes
  set used_by = auth.uid(),
      used_at = now()
  where code = code_input;

  update profiles
  set invite_code_used = code_input,
      program_source = found_code.program_source
  where id = auth.uid();

  return true;
end;
$$ language plpgsql security definer;

-- ============================================================
-- DONE
-- ============================================================
