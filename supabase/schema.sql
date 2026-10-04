-- =====================================================================
-- Codestep backend schema (Supabase / Postgres)
--
-- Security model
--   * Every table has row level security (RLS) on. The browser only ever holds
--     the public "anon" key, so RLS and the functions below are the real gate.
--   * Clients can NOT write XP directly. They call record_step(), which
--     validates the step against lesson_steps, caps the XP to that step's
--     maximum, accepts each step once, and rate-limits. Total XP is therefore
--     bounded by the curriculum itself.
--   * Leaderboard data is exposed only through a SECURITY DEFINER function that
--     returns username + avatar + XP. Emails and other columns never leave.
--   * Users may update only a whitelist of their own profile columns.
-- Run this whole file in the Supabase SQL editor (after seed_steps.sql is
-- generated: `node scripts/gen-seed.mjs`).
-- =====================================================================

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  username            text not null,
  username_set        boolean not null default false,   -- false until the user picks one (e.g. after Google sign-up)
  username_changed_at timestamptz,
  display_name        text,
  avatar              text not null default 'preset:1',
  avatar_version      int  not null default 0,
  language            text not null default 'en',
  timezone            text not null default 'UTC',
  theme               text not null default 'system',
  daily_goal          int  not null default 50,
  email_notifications boolean not null default false,   -- weekly summary email (opt-in)
  reminders_enabled   boolean not null default false,   -- daily practice reminder email (opt-in)
  reminder_time       time not null default '18:00',
  show_on_leaderboard boolean not null default true,
  guest_imported      boolean not null default false,
  last_reminder_on    date,
  last_digest_on      date,
  created_at          timestamptz not null default now(),
  constraint username_format  check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  constraint display_name_len check (display_name is null or char_length(display_name) <= 40),
  constraint avatar_format    check (avatar ~ '^(preset:[1-8]|upload)$'),
  constraint language_valid   check (language in ('en', 'es', 'de', 'fr', 'sv')),
  constraint theme_valid      check (theme in ('light', 'dark', 'system')),
  constraint goal_valid       check (daily_goal in (20, 50, 100, 150))
);
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));

-- Names nobody may take (impersonation / routing). Used by the profile trigger, the sign-up trigger and the availability check.
create or replace function public.is_reserved_username(p text)
returns boolean language sql immutable set search_path = '' as $$
  select lower(p) = any (array['admin','administrator','root','support','help','bit','codestep','moderator','mod','staff','system','official','null','undefined','api','www'])
$$;

create or replace function public.profiles_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.username is distinct from old.username then
    if public.is_reserved_username(new.username) then
      raise exception 'username is reserved' using errcode = '22023';
    end if;
    if old.username_set and old.username_changed_at is not null and old.username_changed_at > now() - interval '7 days' then
      raise exception 'username can be changed once every 7 days' using errcode = '22023';
    end if;
    new.username_changed_at := now();
  end if;
  if new.timezone is distinct from old.timezone then
    perform now() at time zone new.timezone;           -- raises if the zone name is invalid
  end if;
  return new;
end $$;
drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles for each row execute function public.profiles_guard();

-- Create a profile automatically for every new auth user.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare wanted text := new.raw_user_meta_data ->> 'username'; uname text; picked boolean := false; tries int := 0;
begin
  if wanted ~ '^[A-Za-z0-9_]{3,20}$'
     and not public.is_reserved_username(wanted)
     and not exists (select 1 from public.profiles where lower(username) = lower(wanted)) then
    uname := wanted; picked := true;
  end if;
  while uname is null and tries < 20 loop
    uname := 'coder' || substr(md5(random()::text || new.id::text || tries::text), 1, 7);
    if exists (select 1 from public.profiles where lower(username) = lower(uname)) then uname := null; end if;
    tries := tries + 1;
  end loop;
  insert into public.profiles (id, username, username_set, avatar)
  values (new.id, uname, picked, 'preset:' || (1 + floor(random() * 8))::int);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- no insert / delete policies: rows are created by the trigger and removed by cascade.

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (username, username_set, display_name, avatar, avatar_version, language, timezone, theme, daily_goal,
              email_notifications, reminders_enabled, reminder_time, show_on_leaderboard) on public.profiles to authenticated;

-- ---------------------------------------------------------------- progress
create table if not exists public.lesson_steps (
  step_key  text primary key,                  -- 'loops:2' or 'loops:bonus'
  lesson_id text not null,
  max_xp    int  not null check (max_xp > 0),
  is_bonus  boolean not null default false
);
alter table public.lesson_steps enable row level security;
drop policy if exists lesson_steps_read on public.lesson_steps;
create policy lesson_steps_read on public.lesson_steps for select to authenticated using (true);
revoke all on public.lesson_steps from anon, authenticated;
grant select on public.lesson_steps to authenticated;

create table if not exists public.completions (
  user_id    uuid not null references auth.users (id) on delete cascade,
  step_key   text not null references public.lesson_steps (step_key),
  xp         int  not null check (xp >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, step_key)
);
create index if not exists completions_user_time on public.completions (user_id, created_at);
create index if not exists completions_time on public.completions (created_at);
alter table public.completions enable row level security;
drop policy if exists completions_select_own on public.completions;
create policy completions_select_own on public.completions for select to authenticated using (user_id = auth.uid());
revoke all on public.completions from anon, authenticated;
grant select on public.completions to authenticated;   -- writes happen only through record_step()

-- ---------------------------------------------------------------- spaced review
-- One row per exercise the user has done: when it is next due and how well it is remembered (see srs.js).
create table if not exists public.reviews (
  user_id       uuid not null references auth.users (id) on delete cascade,
  step_key      text not null references public.lesson_steps (step_key),
  due           date not null,
  interval_days int  not null check (interval_days between 0 and 365),
  ease          numeric(3, 2) not null check (ease between 1.3 and 3.0),
  reps          int  not null check (reps between 0 and 1000),
  lapses        int  not null check (lapses between 0 and 1000),
  last_at       timestamptz not null default now(),
  primary key (user_id, step_key)
);
alter table public.reviews enable row level security;
drop policy if exists reviews_select_own on public.reviews;
create policy reviews_select_own on public.reviews for select to authenticated using (user_id = auth.uid());
revoke all on public.reviews from anon, authenticated;
grant select on public.reviews to authenticated;   -- writes happen only through record_review() / seed_reviews()

-- Append-only history of answers. It counts towards the daily streak and rate-limits writes; clients never read it directly.
create table if not exists public.review_log (
  user_id   uuid not null references auth.users (id) on delete cascade,
  step_key  text not null references public.lesson_steps (step_key),
  quality   text not null check (quality in ('again', 'hard', 'good')),
  logged_at timestamptz not null default now()
);
create index if not exists review_log_user_time on public.review_log (user_id, logged_at);
alter table public.review_log enable row level security;
revoke all on public.review_log from anon, authenticated;

-- consecutive days with activity (lessons or reviews), counted back from today (or yesterday), in the user's time zone
create or replace function public.compute_streak(p_user uuid, p_tz text)
returns int language plpgsql stable security definer set search_path = public as $$
declare days date[]; cur date := (now() at time zone p_tz)::date; n int := 0;
begin
  select array_agg(d order by d desc) into days
  from (select d from (select (created_at at time zone p_tz)::date as d from public.completions where user_id = p_user
                       union select (logged_at at time zone p_tz)::date from public.review_log where user_id = p_user) u
        order by d desc limit 800) x;
  if days is null then return 0; end if;
  if not (cur = any (days)) then cur := cur - 1; end if;
  while cur = any (days) loop n := n + 1; cur := cur - 1; end loop;
  return n;
end $$;
revoke all on function public.compute_streak(uuid, text) from public, anon, authenticated;

create or replace function public.get_my_progress()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid(); tz text; res jsonb;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  select timezone into tz from public.profiles where id = uid;
  tz := coalesce(tz, 'UTC');
  select jsonb_build_object(
    'xp',       coalesce((select sum(xp) from public.completions where user_id = uid), 0),
    'week_xp',  coalesce((select sum(xp) from public.completions where user_id = uid and created_at >= (date_trunc('week', now() at time zone 'utc') at time zone 'utc')), 0),
    'today_xp', coalesce((select sum(xp) from public.completions where user_id = uid and (created_at at time zone tz)::date = (now() at time zone tz)::date), 0),
    'streak',   public.compute_streak(uid, tz),
    'done',     coalesce((select jsonb_agg(s.lesson_id) from public.completions c join public.lesson_steps s using (step_key) where c.user_id = uid and s.is_bonus), '[]'::jsonb),
    'steps',    coalesce((select jsonb_agg(step_key) from public.completions where user_id = uid), '[]'::jsonb),
    'daily',    coalesce((select jsonb_object_agg(d, x) from (
                   select (created_at at time zone tz)::date::text as d, sum(xp)::int as x from public.completions
                   where user_id = uid and created_at > now() - interval '21 days' group by 1) q), '{}'::jsonb),
    'reviews',  coalesce((select jsonb_agg(jsonb_build_object('k', step_key, 'due', due, 'interval', interval_days, 'ease', ease, 'reps', reps, 'lapses', lapses))
                          from public.reviews where user_id = uid), '[]'::jsonb)
  ) into res;
  return res;
end $$;

create or replace function public.record_step(p_step_key text, p_xp int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); mx int; recent int;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  select max_xp into mx from public.lesson_steps where step_key = p_step_key;
  if mx is null then raise exception 'unknown step' using errcode = '22023'; end if;
  select count(*) into recent from public.completions where user_id = uid and created_at > now() - interval '1 minute';
  if recent >= 20 then raise exception 'rate limited' using errcode = '54000'; end if;
  insert into public.completions (user_id, step_key, xp) values (uid, p_step_key, least(greatest(coalesce(p_xp, 0), 0), mx))
  on conflict do nothing;
  return public.get_my_progress();
end $$;

-- One-time import of progress made as a guest before creating the account.
create or replace function public.import_guest_progress(p_lessons text[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); already boolean;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  select guest_imported into already from public.profiles where id = uid for update;
  if already is null or already then return public.get_my_progress(); end if;
  insert into public.completions (user_id, step_key, xp, created_at)
  select uid, step_key, max_xp, now() - interval '8 days'        -- backdated so it counts for all-time, not this week
  from public.lesson_steps where lesson_id = any (coalesce(p_lessons, '{}')) on conflict do nothing;
  update public.profiles set guest_imported = true where id = uid;
  return public.get_my_progress();
end $$;

-- ---------------------------------------------------------------- leaderboard
create or replace function public.record_review(p_step_key text, p_quality text, p_interval int, p_ease numeric, p_reps int, p_lapses int, p_due date)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); recent int;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if not exists (select 1 from public.lesson_steps where step_key = p_step_key and not is_bonus) then raise exception 'unknown step' using errcode = '22023'; end if;
  if p_quality not in ('again', 'hard', 'good') or p_due < current_date - 2 or p_due > current_date + 400 then raise exception 'invalid review' using errcode = '22023'; end if;
  select count(*) into recent from public.review_log where user_id = uid and logged_at > now() - interval '1 minute';
  if recent >= 40 then raise exception 'rate limited' using errcode = '54000'; end if;
  insert into public.review_log (user_id, step_key, quality) values (uid, p_step_key, p_quality);
  insert into public.reviews (user_id, step_key, due, interval_days, ease, reps, lapses)
  values (uid, p_step_key, p_due, p_interval, p_ease, p_reps, p_lapses)
  on conflict (user_id, step_key) do update
    set due = excluded.due, interval_days = excluded.interval_days, ease = excluded.ease, reps = excluded.reps, lapses = excluded.lapses, last_at = now();
end $$;

-- Starter review items for exercises completed before reviews existed. Never overwrites an existing schedule.
create or replace function public.seed_reviews(p_items jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); it jsonb;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 200 then raise exception 'invalid items' using errcode = '22023'; end if;
  for it in select * from jsonb_array_elements(p_items) loop
    insert into public.reviews (user_id, step_key, due, interval_days, ease, reps, lapses)
    select uid, it ->> 'k', least(greatest((it ->> 'due')::date, current_date), current_date + 7), least(greatest((it ->> 'interval')::int, 1), 7), 2.5, 1, 0
    where exists (select 1 from public.lesson_steps where step_key = it ->> 'k' and not is_bonus)
    on conflict do nothing;
  end loop;
end $$;

create or replace function public.get_leaderboard(p_period text default 'week', p_limit int default 50)
returns table (rank bigint, username text, avatar text, avatar_version int, user_id uuid, xp int, is_me boolean)
language sql stable security definer set search_path = public as $$
  with agg as (
    select c.user_id, sum(c.xp)::int as xp from public.completions c
    where p_period = 'all' or c.created_at >= (date_trunc('week', now() at time zone 'utc') at time zone 'utc')
    group by c.user_id having sum(c.xp) > 0
  ), ranked as (
    select a.user_id, a.xp, rank() over (order by a.xp desc) as rnk, p.username, p.avatar, p.avatar_version
    from agg a join public.profiles p on p.id = a.user_id
    where p.show_on_leaderboard or a.user_id = auth.uid()
  )
  select r.rnk, r.username, r.avatar, r.avatar_version, r.user_id, r.xp, (r.user_id = auth.uid())
  from ranked r
  where (r.rnk <= least(greatest(p_limit, 1), 100) or r.user_id = auth.uid())
  order by r.rnk, r.username
$$;

-- ---------------------------------------------------------------- account helpers
create or replace function public.username_available(p_username text)
returns boolean language sql stable security definer set search_path = public as $$
  select p_username ~ '^[A-Za-z0-9_]{3,20}$'
     and not public.is_reserved_username(p_username)
     and not exists (select 1 from public.profiles where lower(username) = lower(p_username) and id is distinct from auth.uid())
$$;

create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  delete from auth.users where id = auth.uid();       -- cascades to profiles and completions
end $$;

create or replace function public.export_my_data()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  return jsonb_build_object(
    'exported_at', now(),
    'profile', (select to_jsonb(p) - 'id' from public.profiles p where p.id = auth.uid()),
    'completions', coalesce((select jsonb_agg(jsonb_build_object('step', step_key, 'xp', xp, 'at', created_at) order by created_at) from public.completions where user_id = auth.uid()), '[]'::jsonb),
    'reviews', coalesce((select jsonb_agg(jsonb_build_object('step', step_key, 'due', due, 'interval_days', interval_days, 'ease', ease, 'reps', reps, 'lapses', lapses)) from public.reviews where user_id = auth.uid()), '[]'::jsonb));
end $$;

-- ---------------------------------------------------------------- email jobs (service role only)
-- Atomically claims users whose daily reminder / weekly digest is due, so a user is never emailed twice.
create or replace function public.claim_due_emails()
returns table (user_id uuid, kind text, username text, language text, streak int, week_xp int)
language plpgsql security definer set search_path = public as $$
begin
  return query
  with r as (
    update public.profiles p set last_reminder_on = (now() at time zone p.timezone)::date
    where p.reminders_enabled
      and p.last_reminder_on is distinct from (now() at time zone p.timezone)::date
      and (extract(hour from (now() at time zone p.timezone)) * 60 + extract(minute from (now() at time zone p.timezone))) >= (extract(hour from p.reminder_time) * 60 + extract(minute from p.reminder_time))
      and (extract(hour from (now() at time zone p.timezone)) * 60 + extract(minute from (now() at time zone p.timezone))) <  (extract(hour from p.reminder_time) * 60 + extract(minute from p.reminder_time)) + 120
      and not exists (select 1 from public.completions c where c.user_id = p.id and (c.created_at at time zone p.timezone)::date = (now() at time zone p.timezone)::date)
      and not exists (select 1 from public.review_log r where r.user_id = p.id and (r.logged_at at time zone p.timezone)::date = (now() at time zone p.timezone)::date)
    returning p.id, p.username, p.language, p.timezone
  ), d as (
    update public.profiles p set last_digest_on = (now() at time zone p.timezone)::date
    where p.email_notifications
      and extract(isodow from (now() at time zone p.timezone)) = 1
      and extract(hour from (now() at time zone p.timezone)) between 9 and 11
      and p.last_digest_on is distinct from (now() at time zone p.timezone)::date
    returning p.id, p.username, p.language, p.timezone
  )
  select r.id, 'reminder'::text, r.username, r.language, public.compute_streak(r.id, r.timezone),
         coalesce((select sum(c.xp)::int from public.completions c where c.user_id = r.id and c.created_at > now() - interval '7 days'), 0) from r
  union all
  select d.id, 'digest'::text, d.username, d.language, public.compute_streak(d.id, d.timezone),
         coalesce((select sum(c.xp)::int from public.completions c where c.user_id = d.id and c.created_at > now() - interval '7 days'), 0) from d;
end $$;

create or replace function public.set_email_pref(p_user uuid, p_kind text, p_value boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_kind = 'reminder' then update public.profiles set reminders_enabled = p_value where id = p_user;
  elsif p_kind = 'digest' then update public.profiles set email_notifications = p_value where id = p_user;
  end if;
end $$;

-- Lock down function execution: nothing is callable by default; grant explicitly.
revoke all on function public.handle_new_user() from public, anon, authenticated;   -- trigger function: never callable as an API endpoint
revoke all on function public.get_my_progress(), public.record_step(text, int), public.import_guest_progress(text[]), public.record_review(text, text, int, numeric, int, int, date), public.seed_reviews(jsonb),
  public.get_leaderboard(text, int), public.username_available(text), public.delete_my_account(), public.export_my_data(),
  public.claim_due_emails(), public.set_email_pref(uuid, text, boolean) from public, anon, authenticated;
grant execute on function public.get_my_progress(), public.record_step(text, int), public.import_guest_progress(text[]), public.record_review(text, text, int, numeric, int, int, date), public.seed_reviews(jsonb),
  public.get_leaderboard(text, int), public.delete_my_account(), public.export_my_data() to authenticated;
grant execute on function public.username_available(text) to anon, authenticated;
grant execute on function public.claim_due_emails(), public.set_email_pref(uuid, text, boolean) to service_role;
