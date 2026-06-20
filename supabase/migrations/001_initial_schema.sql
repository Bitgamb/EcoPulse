begin;

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.carbon_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null check (category in ('transport', 'electricity', 'food', 'shopping', 'waste')),
  activity_type text not null,
  value numeric not null check (value > 0),
  unit text not null,
  co2_amount numeric not null,
  entry_date date not null check (entry_date <= current_date),
  note text check (char_length(note) <= 300),
  created_at timestamptz not null default now()
);

create table public.eco_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  category text check (category in ('transport', 'electricity', 'food', 'shopping', 'waste')),
  estimated_saving numeric not null default 0 check (estimated_saving >= 0),
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text check (category in ('transport', 'electricity', 'food', 'shopping', 'waste')),
  target_reduction numeric not null check (target_reduction > 0),
  current_progress numeric not null default 0 check (current_progress >= 0),
  deadline date not null,
  status text not null default 'active' check (status in ('active', 'completed', 'expired')),
  created_at timestamptz not null default now()
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_name text not null,
  badge_description text,
  unlocked_at timestamptz not null default now(),
  unique (user_id, badge_name)
);

create table public.user_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users (id) on delete cascade,
  total_co2_saved numeric not null default 0 check (total_co2_saved >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  eco_score integer not null default 100 check (eco_score between 0 and 100),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create index carbon_entries_user_date_idx on public.carbon_entries (user_id, entry_date desc);
create index eco_actions_user_created_idx on public.eco_actions (user_id, created_at desc);
create index goals_user_deadline_idx on public.goals (user_id, deadline);
create index badges_user_idx on public.badges (user_id);

alter table public.profiles enable row level security;
alter table public.carbon_entries enable row level security;
alter table public.eco_actions enable row level security;
alter table public.goals enable row level security;
alter table public.badges enable row level security;
alter table public.user_stats enable row level security;

create policy "profiles_select_own" on public.profiles for select using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "entries_own" on public.carbon_entries for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "actions_own" on public.eco_actions for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "goals_own" on public.goals for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "badges_own" on public.badges for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "stats_own" on public.user_stats for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);

  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

commit;
