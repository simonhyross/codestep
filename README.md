# Pythonic: learn Python by doing

A Duolingo-style Python course that runs entirely in the browser. No backend, no build step.

## Run it

```bash
python3 -m http.server 5173
# open http://localhost:5173
```

It needs an internet connection on first load (Pyodide, CodeMirror and fonts come from CDNs).

## What's inside

- **Learning path**: 5 units, 24 lessons, with locked and unlocked nodes, XP, levels, a daily goal and streaks.
  Basics, functions and collections, data structures, algorithms, efficiency.
- **Lesson flow**: Learn card, quiz, then coding challenges graded by hidden Python tests.
- **Playground**: a full editor with Run, **Run + Profile** (time and peak memory) and example programs.
- **Linter**: live squiggles, a gutter and a Problems panel (unused imports and variables, undefined names,
  mutable defaults, bare except, naming, unreachable code, style).
- **Safe execution**: Python (Pyodide) runs in a Web Worker. Infinite loops are stopped after 8 seconds.

## Accounts, leaderboards and settings (optional)

Sign in with email or Google, keep progress across devices, climb a weekly and all-time leaderboard, and manage a profile
(username, avatar, language, theme, daily goal, reminder and summary emails, data export and account deletion).
The interface is available in English, Spanish, German, French and Swedish (lessons stay in English).

It needs a free Supabase project; without one the app runs as a guest-only site exactly as before.
**See [SETUP.md](SETUP.md)** for the step-by-step setup, the security model and the tests.
To try the screens without any backend, open `http://localhost:5180/?mock=1` (demo mode, localhost only).

## Files

| File | Purpose |
| --- | --- |
| `lessons.js` | All curriculum content, tests and playground examples. Add lessons here. |
| `pyruntime.js` | Python-side runner, test harness, profiler and linter |
| `app.js` | UI, routing, progress, worker management |
| `styles.css` | Design system (dark and light themes) |
| `i18n.js` | Interface translations (5 languages) |
| `backend.js` | Supabase adapter plus a localhost-only demo backend |
| `account.js` | Sign-in, settings, leaderboard and progress sync |
| `config.js` | Public Supabase URL and anon key (empty = guest-only) |
| `supabase/` | SQL schema, RLS, email functions and tests |

## Adding a lesson

Add an object to a unit's `lessons` array. Code steps take `starter`, `solution`, `hint` and `tests`.
Test code runs after the learner's code and has access to `output`, `source`,
`run_with(**vars)` (re-run the code with different top-level variables) and `timed(fn, *args)`.
