// Runs schema.sql against an in-process Postgres (PGlite) with a stubbed Supabase auth layer.
//   npm i --no-save @electric-sql/pglite && node supabase/tests/schema.test.mjs
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..");
const db = new PGlite();
let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : (fail++, console.log("  FAIL:", m)); };
const q = async (sql, params) => (await db.query(sql, params)).rows;
const as = async (uid, role = "authenticated") => { await db.exec(`reset role; set role ${role}; select set_config('test.uid', '${uid || ""}', false);`); };
const su = () => db.exec("reset role");
const throws = async (fn, re, msg) => { try { await fn(); fail++; console.log("  FAIL (no error):", msg); } catch (e) { re.test(String(e.message)) ? pass++ : (fail++, console.log("  FAIL (wrong error):", msg, "->", e.message)); } };

await db.exec(`
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}'::jsonb);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  create role anon nologin; create role authenticated nologin; create role service_role nologin;
  grant usage on schema auth, public to anon, authenticated, service_role;
`);
await db.exec(readFileSync(join(dir, "schema.sql"), "utf8"));
await db.exec(readFileSync(join(dir, "seed_steps.sql"), "utf8"));
await db.exec("grant usage on schema public to anon, authenticated, service_role");

const mk = async (email, meta = {}) => (await q("insert into auth.users (email, raw_user_meta_data) values ($1, $2) returning id", [email, JSON.stringify(meta)]))[0].id;

console.log("profiles & username rules");
const alice = await mk("a@x.io", { username: "Alice_1" });
const bob = await mk("b@x.io", { username: "alice_1" });          // collides case-insensitively
const carl = await mk("c@x.io", { username: "admin" });           // reserved
const dina = await mk("d@x.io", {});                               // no username (Google style)
const profs = await q("select id, username, username_set from profiles");
const P = id => profs.find(p => p.id === id);
ok(P(alice).username === "Alice_1" && P(alice).username_set, "valid username kept");
ok(P(bob).username !== "alice_1" && !P(bob).username_set, "duplicate username replaced");
ok(P(carl).username !== "admin", "reserved username replaced");
ok(/^coder[0-9a-f]{7}$/.test(P(dina).username) && !P(dina).username_set, "random username when none given");

console.log("row level security");
await as(alice);
ok((await q("select id from profiles")).length === 1, "user sees only own profile");
await db.query("update profiles set display_name = 'Ali', language = 'sv', daily_goal = 100, theme = 'dark' where id = $1", [alice]);
ok((await q("select display_name from profiles"))[0].display_name === "Ali", "allowed columns update");
await throws(() => db.query("update profiles set created_at = now() where id = $1", [alice]), /permission denied/, "cannot update created_at");
await throws(() => db.query("update profiles set guest_imported = false where id = $1", [alice]), /permission denied/, "cannot update guest_imported");
await throws(() => db.query("update profiles set language = 'xx' where id = $1", [alice]), /check constraint/, "language constraint");
await throws(() => db.query("update profiles set username = 'x' where id = $1", [alice]), /check constraint/, "username format constraint");
await throws(() => db.query("update profiles set timezone = 'Mars/Base' where id = $1", [alice]), /time zone/, "invalid timezone rejected");
await db.query("update profiles set timezone = 'Europe/Stockholm' where id = $1", [alice]);
const r1 = await db.query("update profiles set display_name = 'hax' where id = $1", [bob]);
ok(r1.affectedRows === 0, "cannot update someone else's profile");
await throws(() => db.query("insert into profiles (id, username) values (gen_random_uuid(), 'sneaky')"), /permission denied/, "cannot insert profiles");
await throws(() => db.query("insert into completions (user_id, step_key, xp) values ($1, 'hello:1', 15)", [alice]), /permission denied/, "cannot write completions directly");
await throws(() => db.query("select * from claim_due_emails()"), /permission denied/, "claim_due_emails blocked for users");
await throws(() => db.query("delete from profiles"), /permission denied/, "cannot delete profiles");

console.log("username change cooldown");
await db.query("update profiles set username = 'Alice_2' where id = $1", [alice]);
await throws(() => db.query("update profiles set username = 'Alice_3' where id = $1", [alice]), /once every 7 days/, "second change within 7 days");
await as(bob);
await throws(() => db.query("update profiles set username = 'root' where id = $1", [bob]), /reserved/, "reserved name rejected on update");
await as(alice);
ok((await q("select username_available('Alice_2') as a"))[0].a === true, "own username counts as available to self");
await as(bob);
ok((await q("select username_available('Alice_2') as a"))[0].a === false, "taken username unavailable");
ok((await q("select username_available('ab') as a"))[0].a === false, "too short unavailable");
ok((await q("select username_available('Admin') as a"))[0].a === false, "reserved unavailable");

console.log("record_step");
await as(alice);
let pr = (await q("select record_step('hello:1', 999999) as r"))[0].r;
ok(pr.xp === 15, "xp capped to the step maximum (got " + pr.xp + ")");
pr = (await q("select record_step('hello:1', 15) as r"))[0].r;
ok(pr.xp === 15, "same step counted once");
pr = (await q("select record_step('hello:2', -50) as r"))[0].r;
ok(pr.xp === 15, "negative xp becomes 0");
await throws(() => db.query("select record_step('nope:1', 5)"), /unknown step/, "unknown step rejected");
pr = (await q("select record_step('hello:bonus', 20) as r"))[0].r;
ok(pr.xp === 35 && pr.done.includes("hello"), "bonus marks lesson done");
ok(pr.streak === 1 && pr.today_xp === 35, "streak and today xp");
await as(null, "anon");
await throws(() => db.query("select record_step('hello:2', 5)"), /permission denied/, "anon cannot record");
await throws(() => db.query("select * from get_leaderboard('week', 10)"), /permission denied/, "anon cannot read leaderboard");
ok((await q("select username_available('free_name') as a"))[0].a === true, "anon can check usernames");

console.log("rate limit");
await as(bob);
let limited = false;
for (const k of Object.keys(await q("select step_key from lesson_steps where not is_bonus limit 30").then(r => r.map((x, i) => i)))) {
  try { await db.query("select record_step(step_key, 1) from (select step_key from lesson_steps where not is_bonus order by step_key offset $1 limit 1) s", [Number(k)]); }
  catch (e) { if (/rate limited/.test(e.message)) { limited = true; break; } else throw e; }
}
ok(limited, "more than 20 steps a minute is rate limited");

console.log("streaks");
await su();
const sUser = await mk("s@x.io", { username: "streaky" });
const days = [0, 1, 2, 3, 5];                                      // gap at day 4 -> streak of 4
for (const [i, d] of days.entries())
  await db.query("insert into completions (user_id, step_key, xp, created_at) values ($1, $2, 5, now() - ($3 || ' days')::interval)", [sUser, ["hello:1", "hello:2", "numbers:1", "numbers:2", "numbers:3"][i], String(d)]);
await as(sUser);
ok((await q("select get_my_progress() as p"))[0].p.streak === 4, "streak counts consecutive days, stops at a gap");
await su();
const yUser = await mk("y@x.io", { username: "yesterday" });
await db.query("insert into completions (user_id, step_key, xp, created_at) values ($1, 'loops:1', 5, now() - interval '1 day')", [yUser]);
await as(yUser);
ok((await q("select get_my_progress() as p"))[0].p.streak === 1, "streak survives until end of today");
await su();
const oUser = await mk("o@x.io", { username: "oldtimer" });
await db.query("insert into completions (user_id, step_key, xp, created_at) values ($1, 'loops:1', 5, now() - interval '3 days')", [oUser]);
await as(oUser);
ok((await q("select get_my_progress() as p"))[0].p.streak === 0, "streak resets after a missed day");

console.log("leaderboard");
await su();
await db.exec("delete from completions");
const names = ["w1", "w2", "w3", "w4"];
const ids = []; for (const n of names) ids.push(await mk(n + "@x.io", { username: "user_" + n }));
const give = async (u, key, xp, ago = "0 days") => db.query("insert into completions (user_id, step_key, xp, created_at) values ($1, $2, $3, now() - $4::interval)", [u, key, xp, ago]);
await give(ids[0], "hello:1", 15); await give(ids[0], "hello:2", 5);              // 20 this week
await give(ids[1], "hello:1", 15);                                                 // 15
await give(ids[2], "hello:bonus", 20, "20 days");                                   // 20 all-time, 0 this week
await give(ids[3], "loops:1", 15); await db.query("update profiles set show_on_leaderboard = false where id = $1", [ids[3]]);
await as(ids[1]);
let lb = await q("select * from get_leaderboard('week', 50)");
ok(lb.length === 2 && lb[0].username === "user_w1" && lb[0].rank == 1 && lb[1].is_me, "weekly: ordered, excludes zero-week and hidden users");
ok(!lb.some(r => r.username === "user_w3"), "old xp not in weekly");
lb = await q("select * from get_leaderboard('all', 50)");
ok(lb.length === 3 && lb[0].xp === 20, "all-time includes old xp");
await as(ids[3]);
lb = await q("select * from get_leaderboard('week', 50)");
ok(lb.some(r => r.is_me), "hidden user still sees own row");
await as(ids[1]);
lb = await q("select * from get_leaderboard('week', 1)");
ok(lb.length === 2 && lb.some(r => r.is_me), "own row appended beyond the limit");
ok(!("email" in lb[0]), "no email column exposed");

console.log("guest import");
await as(alice);
let imp = (await q("select import_guest_progress(array['numbers','bogus']) as r"))[0].r;
const xpAfter = imp.xp;
ok(imp.done.includes("numbers"), "guest lesson imported");
imp = (await q("select import_guest_progress(array['loops']) as r"))[0].r;
ok(imp.xp === xpAfter && !imp.done.includes("loops"), "import only works once");
ok((await q("select created_at < now() - interval '7 days' as old from completions where step_key = 'numbers:bonus'"))[0].old, "imported xp is backdated (not weekly)");

console.log("export & delete");
await as(alice);
const ex = (await q("select export_my_data() as d"))[0].d;
ok(ex.profile && !ex.profile.id && ex.completions.length > 0, "export contains own data without internal id");
await db.query("select delete_my_account()");
await su();
ok((await q("select count(*)::int c from profiles where id = $1", [alice]))[0].c === 0 && (await q("select count(*)::int c from completions where user_id = $1", [alice]))[0].c === 0, "delete cascades to profile and completions");

console.log("email claims");
await su();
const eUser = await mk("e@x.io", { username: "emailer" });
await db.query("update profiles set reminders_enabled = true, reminder_time = '00:00', timezone = 'UTC', email_notifications = true where id = $1", [eUser]);
await db.exec("set role service_role");
let claim = await q("select * from claim_due_emails() where user_id = $1", [eUser]);
const hrs = new Date().getUTCHours();
ok(hrs < 2 ? claim.some(c => c.kind === 'reminder') : !claim.some(c => c.kind === 'reminder'), "reminder only inside its 2h window");
await su();
await db.query("update profiles set reminder_time = (now() at time zone 'utc')::time - interval '5 minutes', last_reminder_on = null where id = $1", [eUser]);
await db.exec("set role service_role");
claim = await q("select * from claim_due_emails() where user_id = $1", [eUser]);
const minsNow = new Date().getUTCHours() * 60 + new Date().getUTCMinutes();
if (minsNow >= 5) {
  ok(claim.some(c => c.kind === "reminder"), "reminder claimed when due");
  claim = await q("select * from claim_due_emails() where user_id = $1", [eUser]);
  ok(!claim.some(c => c.kind === "reminder"), "reminder is claimed only once per day");
}
await su();
await db.query("update profiles set last_reminder_on = null where id = $1", [eUser]);
await db.query("insert into completions (user_id, step_key, xp) values ($1, 'hello:1', 15)", [eUser]);
await db.exec("set role service_role");
claim = await q("select * from claim_due_emails() where user_id = $1", [eUser]);
ok(!claim.some(c => c.kind === "reminder"), "no reminder if already practised today");

console.log("spaced review");
await su();
const rv = await mk("rv@x.io", { username: "reviewer" }), rv2 = await mk("rv2@x.io", { username: "reviewer2" });
const today = (await q("select current_date::text d"))[0].d;
await as(rv);
await db.query("select record_review('hello:1', 'good', 1, 2.55, 1, 0, current_date + 1)");
await db.query("select record_review('hello:1', 'good', 3, 2.6, 2, 0, current_date + 3)");
let pr2 = (await q("select get_my_progress() as p"))[0].p;
ok(pr2.reviews.length === 1 && pr2.reviews[0].interval === 3 && pr2.reviews[0].reps === 2 && pr2.reviews[0].k === "hello:1", "review is upserted, one row per exercise");
ok(pr2.streak === 1 && pr2.xp === 0, "a review counts for the streak but earns no XP");
await throws(() => db.query("select record_review('hello:bonus', 'good', 1, 2.5, 1, 0, current_date + 1)"), /unknown step/, "bonus steps cannot be reviewed");
await throws(() => db.query("select record_review('nope:1', 'good', 1, 2.5, 1, 0, current_date + 1)"), /unknown step/, "unknown step rejected");
await throws(() => db.query("select record_review('hello:1', 'perfect', 1, 2.5, 1, 0, current_date + 1)"), /invalid review/, "unknown quality rejected");
await throws(() => db.query("select record_review('hello:1', 'good', 1, 2.5, 1, 0, current_date + 4000)"), /invalid review/, "absurd due date rejected");
await throws(() => db.query("select record_review('hello:1', 'good', 9999, 2.5, 1, 0, current_date + 1)"), /check constraint/, "interval is bounded");
await throws(() => db.query("select record_review('hello:1', 'good', 1, 9, 1, 0, current_date + 1)"), /numeric field overflow|check constraint/, "ease is bounded");
await throws(() => db.query("insert into reviews (user_id, step_key, due, interval_days, ease, reps, lapses) values ($1, 'hello:2', current_date, 1, 2.5, 1, 0)", [rv]), /permission denied/, "no direct writes to reviews");
await throws(() => db.query("select * from review_log"), /permission denied/, "review_log is not readable by clients");
await as(rv2);
ok((await q("select count(*)::int c from reviews"))[0].c === 0 && (await q("select get_my_progress() as p"))[0].p.reviews.length === 0, "other users cannot see someone else's reviews");
await as(rv);
await db.query("select seed_reviews($1::jsonb)", [JSON.stringify([{ k: "hello:1", due: today, interval: 2 }, { k: "hello:2", due: "2999-01-01", interval: 99 }, { k: "bogus", due: today, interval: 1 }, { k: "hello:bonus", due: today, interval: 1 }])]);
pr2 = (await q("select get_my_progress() as p"))[0].p;
const byKey = Object.fromEntries(pr2.reviews.map(x => [x.k, x]));
ok(byKey["hello:1"].interval === 3, "seeding never overwrites an existing schedule");
ok(byKey["hello:2"] && byKey["hello:2"].interval === 7 && !byKey.bogus && !byKey["hello:bonus"], "seeding clamps values and ignores unknown or bonus steps");
let limited2 = false;
for (let k = 0; k < 45; k++) { try { await db.query("select record_review('hello:1', 'good', 1, 2.5, 1, 0, current_date + 1)"); } catch (e) { if (/rate limited/.test(e.message)) { limited2 = true; break; } throw e; } }
ok(limited2, "reviews are rate limited");
await su();
await db.query("insert into review_log (user_id, step_key, quality, logged_at) values ($1, 'hello:1', 'good', now() - interval '1 day')", [rv]);
await as(rv);
ok((await q("select get_my_progress() as p"))[0].p.streak === 2, "review days extend the streak");
await su();
await db.query("update profiles set reminders_enabled = true, reminder_time = (now() at time zone 'utc')::time - interval '5 minutes', timezone = 'UTC', last_reminder_on = null where id = $1", [rv]);
await db.exec("set role service_role");
if (new Date().getUTCHours() * 60 + new Date().getUTCMinutes() >= 5) ok(!(await q("select * from claim_due_emails() where user_id = $1", [rv])).some(c => c.kind === "reminder"), "no reminder after practising by review");
await su();
await db.query("delete from auth.users where id = $1", [rv]);
ok((await q("select (select count(*) from reviews where user_id = $1)::int + (select count(*) from review_log where user_id = $1)::int c", [rv]))[0].c === 0, "deleting the account removes reviews and history");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
