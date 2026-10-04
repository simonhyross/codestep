-- Smoke test against a REAL Supabase project (real auth schema). Everything runs inside one DO block that
-- always ends by raising an exception, so the whole transaction rolls back and nothing is stored.
--   supabase db query --linked -f supabase/tests/live-smoke.sql      -> expect: "SMOKE_OK"
do $$
declare
  uid uuid := gen_random_uuid(); p jsonb; n int; uname text; lb int;
  claims text;
begin
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
  values (uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'smoke-' || uid || '@example.invalid', '{"username":"smoke_user"}', now(), now());

  select username into uname from public.profiles where id = uid;
  assert uname = 'smoke_user', 'profile trigger should create the profile with the chosen username, got ' || coalesce(uname, 'null');

  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated', 'aal', 'aal1')::text, true);
  set local role authenticated;

  p := public.record_step('hello:1', 999999);
  assert (p->>'xp')::int = 15, 'XP must be capped to the step maximum, got ' || (p->>'xp');
  p := public.record_step('hello:1', 15);
  assert (p->>'xp')::int = 15, 'a step must only count once';
  begin perform public.record_step('nope:1', 5); assert false, 'unknown step must be rejected';
  exception when others then assert sqlerrm = 'unknown step', 'unexpected error: ' || sqlerrm; end;
  p := public.record_step('hello:bonus', 20);
  assert p->'done' ? 'hello' and (p->>'streak')::int = 1, 'bonus should mark the lesson done and start a streak';

  select count(*) into lb from public.get_leaderboard('week', 10) where is_me and xp = 35;
  assert lb = 1, 'user must appear on the weekly leaderboard with 35 XP';
  begin insert into public.completions (user_id, step_key, xp) values (uid, 'hello:2', 15); assert false, 'direct writes to completions must be denied';
  exception when insufficient_privilege then null; end;
  begin update public.profiles set created_at = now() where id = uid; assert false, 'protected profile column must not be writable';
  exception when insufficient_privilege then null; end;

  -- 2FA: once a verified factor exists, a password-only (aal1) session must be locked out
  reset role;
  insert into auth.mfa_factors (id, user_id, factor_type, status, created_at, updated_at) values (gen_random_uuid(), uid, 'totp', 'verified', now(), now());
  set local role authenticated;
  begin perform public.get_my_progress(); assert false, 'aal1 session must be blocked once 2FA is enabled';
  exception when others then assert sqlerrm = 'second factor required', 'unexpected error: ' || sqlerrm; end;
  select count(*) into n from public.profiles; assert n = 0, 'aal1 session must not read the profile once 2FA is enabled';
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated', 'aal', 'aal2')::text, true);
  p := public.get_my_progress(); assert (p->>'xp')::int = 35, 'aal2 session must see progress';

  -- anonymous callers
  reset role; set local role anon;
  begin perform public.get_leaderboard('week', 5); assert false, 'anon must not read the leaderboard';
  exception when insufficient_privilege then null; end;
  begin perform public.record_step('hello:2', 5); assert false, 'anon must not record steps';
  exception when insufficient_privilege then null; end;
  assert public.username_available('totally_free_name') is true, 'anon may check username availability';
  reset role;

  raise exception 'SMOKE_OK';
end $$;
