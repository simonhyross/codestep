# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Codestep (repo/dir name "Pythonic", config key `window.PYTHONIC_CONFIG`) is a static, no-build, no-bundler browser app that teaches Python. Plain `<script>` files share state through `window` globals; there is no package.json or module system in the app code.

## Commands

```bash
python3 -m http.server 5180                  # run the app: http://localhost:5180 (needs internet for Pyodide/CodeMirror CDNs)
                                             # http://localhost:5180/?mock=1 enables the localhost-only demo backend (no Supabase)

python3 tests/lessons_test.py                # curriculum: every solution passes, starter fails, predict answers match real output, quiz shape
python3 tests/tracer_test.py                 # visualizer tracer
node tests/srs.test.mjs                      # spaced-repetition scheduler
node tests/tiers.test.mjs                    # learning-path rows / prerequisites

npm i --no-save @electric-sql/pglite         # one-time, for the DB tests
node supabase/tests/schema.test.mjs          # runs the real schema.sql in in-process Postgres (RLS, XP caps, reviews, leaderboard)
node --experimental-strip-types supabase/tests/mail.test.mjs

node scripts/gen-seed.mjs                    # regenerate supabase/seed_steps.sql after editing lessons.js
```

`sh scripts/run-tests.sh` runs the four fast tests; `.githooks/pre-commit` runs it before every commit (enable per clone with `git config core.hooksPath .githooks`).

Tests are standalone scripts (no runner), so run a single one by invoking that file. There is no linter or build step.

## Architecture

- **Script load order matters** (`index.html`): `config.js`, `i18n.js`, `srs.js`, `pyruntime.js`, `lessons.js`, `backend.js`, `app.js`, `visualizer.js`, `account.js`. Each attaches to `window` (`UNITS`, `EXAMPLES`, `PY_RUNTIME`, `Tiers`, ...). `tiers.js` (pure prerequisite-row logic) loads before `app.js`.
- **Python runs in the browser.** `app.js` builds a Web Worker from an inline Blob that `importScripts` Pyodide, then loads `PY_RUNTIME` from `pyruntime.js` — a *JavaScript string containing Python source*: the runner, hidden-test harness, profiler, line tracer (feeds the visualizer) and linter. Runaway loops are stopped by terminating the worker.
- **Lessons are data** in `lessons.js` (`UNITS` → `lessons` → `steps` of type `learn | quiz | predict | code`). Step *index* identifies progress, so only append steps to a lesson, never insert or reorder. Every lesson declares `needs: [ids]` and a difficulty `level` (1 Beginner to 4 Expert; shown as pips on the path and used by its filter; `tests/tiers.test.mjs` requires it); `kind: "project"` marks a mini-project (diamond node, "Mini project" tag, only suggested by `nextUp` once no regular lesson is open); `tiers.js` turns that into rows on the path (same-row lessons are independent and open together, a lesson unlocks when its `needs` are done). The last lesson in curriculum order (`gradebook`, the capstone) is the path's goal and must stay alone in the last row, so it `needs` the deepest leaf of every field (adding a deeper lesson means adding it to the capstone's `needs`) (`tests/tiers.test.mjs`). `app.js` never uses array position for unlocking.
- **Python tests can't import the JS directly.** `tests/extract.mjs` evals `pyruntime.js` and `lessons.js` under Node with a fake `window` and dumps JSON; `tests/_runtime.py` consumes it. Test-time loading regexes `^const py` to `var py`, so keep that top-level declaration style in those files.
- **Backend is optional.** `backend.js` is a Supabase adapter plus a mock backend used only on localhost with `?mock=1`. With empty `supabaseUrl`/`supabaseAnonKey` in `config.js` the app is guest-only (progress in localStorage). `account.js` holds sign-in, settings, leaderboard and sync UI.
- **Server-side rules live in `supabase/schema.sql`** (RLS on every table; XP only via `record_step()` which accepts only known steps, so `seed_steps.sql` must be regenerated and applied whenever steps are added). Edge functions `send-reminders` and `unsubscribe` are in `supabase/functions/`. `SETUP.md` has deployment and the security model.
- **i18n:** UI strings are English only, in `i18n.js` (`I18N.t`); the other languages were removed on purpose, so do not add translations.
- **Security constraints:** a strict CSP and SRI hashes are on all CDN scripts in `index.html` (update the hash when bumping a CDN version), no inline event handlers, and all dynamic values must be HTML-escaped. `config.js` holds only the public anon key; never put a `service_role` key in the repo.

## Fields and colours

Each unit in `UNITS` is a *field* with its own `color` (`blue yellow sky orange navy purple green pink teal`, plus spare `red`, defined as `.u-<color>` in `styles.css`). The Learn view renders one section per field (header with progress, then a grid of lesson cards; locked cards say what they need), with an "Up next" card and the goal banner on top, so a new field = new unit object + colour. The `project` unit must stay last in `UNITS` (its lesson is the path goal). Mini-projects live inside the field they practise and are interleaved by `needs`. New fields should hang off existing lessons through `needs`, not extend one chain, so rows stay parallel.

## Adding a lesson

Add an object to a unit's `lessons` array in `lessons.js`. `code` steps need `starter`, `solution`, `hint`, `tests`; test code runs after the learner's code and can use `output`, `source`, `run_with(**vars)` and `timed(fn, *args)`. `quiz` steps need a reason for every wrong option; `predict` needs the exact printed `answer`; `<pre data-run>` in a `learn` step adds a "Watch it run" button. Then run `tests/lessons_test.py` and `scripts/gen-seed.mjs`.
