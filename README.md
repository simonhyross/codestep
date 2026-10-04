# Codestep: learn to code by doing

Interactive coding lessons that run entirely in the browser. No build step, no server needed for guests.
The first course is Python (24 lessons: basics, collections, data structures, algorithms, efficiency).

## What makes it different

- **Watch it run (code visualizer).** Step through any program line by line and see the call stack, variables and objects change,
  with arrows from variables to the objects they point at. Available in the playground, on every coding exercise and on the code samples in lessons.
- **Spaced review.** Every exercise you finish comes back after a growing gap (1 day, 3 days, about a week, ...) just before you'd forget it.
  Get one wrong and it returns sooner. A daily review takes a few minutes and counts for your streak.
- **Predict the output.** Read code, type what it prints, then watch it run to see why. Each wrong answer in a quiz also explains *why* it is wrong.
- **Real coding.** You write code, it runs in your browser (Pyodide in a Web Worker, runaway loops are stopped) and is graded by hidden tests,
  with a built-in linter for style and common mistakes.
- Duolingo-style path with XP, streaks and a daily goal, a playground with timing and memory profiling, light and dark mode,
  and an interface in English, Spanish, German, French and Swedish (lessons stay in English).

## Accounts, leaderboards and settings (optional)

Sign in with email or Google, keep progress and reviews across devices, climb a weekly and all-time leaderboard, and manage a profile
(username, avatar, language, theme, daily goal, reminder and summary emails, data export and account deletion).
It needs a free Supabase project; without one the app runs as a guest-only site.
**See [SETUP.md](SETUP.md)** for setup and the security model. To try the screens without any backend, run a local server and open
`http://localhost:5180/?mock=1` (a demo backend, localhost only).

## Run it

```bash
python3 -m http.server 5180
# open http://localhost:5180
```

It needs an internet connection on first load (Pyodide, CodeMirror and fonts come from CDNs).

## Files

| File | Purpose |
| --- | --- |
| `lessons.js` | All curriculum content, tests and playground examples. Add lessons here. |
| `pyruntime.js` | Python-side runner, test harness, profiler, tracer (visualizer) and linter |
| `visualizer.js` | The "Watch it run" screen |
| `srs.js` | Spaced-repetition scheduler (pure functions) |
| `tiers.js` | Turns each lesson's `needs` into path rows (pure functions) |
| `app.js` | UI, routing, lessons, reviews, progress, worker management |
| `account.js` / `backend.js` / `config.js` | Sign-in, settings, leaderboard, sync; Supabase adapter plus a localhost-only demo backend; public project settings |
| `i18n.js` | Interface translations |
| `styles.css` | Design system (dark and light themes) |
| `supabase/` | SQL schema with row level security, email functions, auth config and tests |
| `tests/` | Curriculum, tracer and scheduler tests |

## Tests

```bash
python3 tests/lessons_test.py        # every solution passes, every starter fails, predict answers match real output
python3 tests/tracer_test.py         # the visualizer's tracer
node tests/srs.test.mjs              # the review scheduler
node tests/tiers.test.mjs            # path rows and prerequisites
npm i --no-save @electric-sql/pglite
node supabase/tests/schema.test.mjs  # database rules, XP caps, reviews, leaderboard
node --experimental-strip-types supabase/tests/mail.test.mjs
```

## Adding a lesson

Add an object to a unit's `lessons` array in `lessons.js`, with `needs: [ids of lessons it builds on]` (it appears in the first row after all of them). Step types: `learn` (HTML; add `data-run` to a `<pre>` to give it a
"Watch it run" button), `quiz` (with a reason for every wrong option), `predict` (`code` and the exact `answer`) and `code`
(`starter`, `solution`, `hint`, `tests`). Test code runs after the learner's code and can use `output`, `source`,
`run_with(**vars)` (re-run with different top-level variables) and `timed(fn, *args)`.
Append new steps to the end of a lesson (step numbers identify progress), then run `node scripts/gen-seed.mjs` and apply
`supabase/seed_steps.sql` so the server knows the new steps.
