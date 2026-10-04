# Setting up accounts, leaderboards and email reminders

Pythonic runs as a plain static site. Accounts are optional: until you configure a backend the app works
exactly as before (guest mode, progress saved in the browser). To turn accounts on you need a free
[Supabase](https://supabase.com) project. This takes about 20 minutes.

> The anon key you will paste into `config.js` is **meant to be public**. Security comes from the row level
> security rules in `supabase/schema.sql`, not from hiding that key. Never put the `service_role` key in the repo.

## 1. Create the project and the database
1. Create a Supabase project (pick a region close to your users).
2. Install the CLI and sign in: `brew install supabase/tap/supabase`, then `supabase login` and
   `supabase link --project-ref <ref>` (the ref is the 20-letter id in the project URL).
3. Apply the database (no database password needed; it goes through the Management API):
   ```bash
   node scripts/gen-seed.mjs        # regenerate whenever you change lessons.js
   supabase db query --linked -f supabase/schema.sql
   supabase db query --linked -f supabase/seed_steps.sql
   supabase db query --linked -f supabase/storage.sql
   supabase db query --linked -f supabase/tests/live-smoke.sql   # expect an error that says SMOKE_OK (it rolls itself back)
   supabase db advisors --linked --type security                  # the remaining warnings are the intended API functions
   ```
4. Put the **Project URL** and the **publishable (anon) key** (`supabase projects api-keys`) into `config.js`, commit and push.

## 2. Authentication settings
The settings below are in `supabase/config.toml`. Review and apply them with **`supabase config push`**
(it shows a diff and asks for confirmation). You can also set them by hand under Dashboard → Authentication.

| Setting | Value | Why |
| --- | --- | --- |
| Email confirmations | **on** | stops sign-ups with other people's addresses |
| Password policy | minimum length **10**, lower + upper + digits | matches the client-side checks |
| Secure password change | on | requires a recent login before changing the password |
| Multi-factor → TOTP | enroll + verify enabled | powers the 2FA switch in Settings |
| Site URL / Redirect URLs | your Pages URL (plus `http://localhost:5180/`) | blocks open-redirect abuse |
| Leaked password protection | on (**Pro plan only**, dashboard) | rejects passwords found in breach lists |
| Attack protection → CAPTCHA | optional (dashboard) | stops bot sign-ups (needs a small client change) |
| Emails → SMTP | custom SMTP, e.g. Resend (dashboard) | the built-in mailer allows only a few emails per hour |

### Google sign-in
1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → **Create OAuth client ID** (Web application).
2. Authorised redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
3. `export GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=...`, set `enabled = true` under `[auth.external.google]` in `supabase/config.toml`, then run `supabase config push`.
4. Configure the OAuth consent screen (app name, support email). Publish it so users outside your test list can sign in.

## 3. Reminder and weekly-summary emails (optional)
Emails are **opt-in** (off by default) and every message carries a signed one-click unsubscribe link.

1. Create a [Resend](https://resend.com) account, verify your sending domain and create an API key.
2. Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then `supabase login` and `supabase link --project-ref <ref>`.
3. Set the secrets (generate the two random values with `openssl rand -hex 32`):
   ```bash
   supabase secrets set RESEND_API_KEY=... FROM_EMAIL="Pythonic <hello@yourdomain.com>" \
     SITE_URL="https://<user>.github.io/pythonic/" CRON_SECRET=<random> UNSUBSCRIBE_SECRET=<random>
   ```
4. Deploy the functions (they authenticate with the secrets above instead of a JWT):
   ```bash
   supabase functions deploy send-reminders --no-verify-jwt
   supabase functions deploy unsubscribe --no-verify-jwt
   ```
5. Schedule it every 15 minutes (SQL Editor). Replace the placeholders:
   ```sql
   create extension if not exists pg_cron;
   create extension if not exists pg_net;
   select cron.schedule('pythonic-emails', '*/15 * * * *', $$
     select net.http_post(
       url := 'https://<project-ref>.supabase.co/functions/v1/send-reminders',
       headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', '<CRON_SECRET>'),
       body := '{}'::jsonb);
   $$);
   ```

How it behaves: a daily reminder is sent once, at the user's chosen local time (within a 2 hour window), only if they have not practised
that day. The weekly summary goes out on Monday morning in the user's time zone. Users are claimed atomically in the database, so a
retry or overlapping run can never email someone twice.

## 4. Try it locally without a backend
Run `python3 -m http.server 5180` and open `http://localhost:5180/?mock=1`. This enables a **demo backend that simulates accounts inside
your browser** (sign-up, 2FA code `123456`, leaderboard with fake players, settings). It is deliberately disabled on any hostname other
than localhost, and it is **not secure**; it only exists so the UI can be developed and demoed without a server.

## 5. Tests
```bash
npm i --no-save @electric-sql/pglite
node supabase/tests/schema.test.mjs                               # 63 checks: RLS, XP caps, streaks, leaderboard, 2FA, email claims
node --experimental-strip-types supabase/tests/mail.test.mjs      # 22 checks: unsubscribe signatures and email templates
```
The database tests run the real `schema.sql` in an in-process Postgres with a stubbed Supabase auth layer.

## Security model in short
- **Row level security** on every table; users can only read and update their own rows, and only a whitelist of profile columns.
- **XP cannot be written by clients.** `record_step()` accepts only known lesson steps, caps XP per step, counts each step once and
  allows at most 20 steps a minute. The best possible score is therefore bounded by the curriculum. Lessons are still graded in the
  browser, so a determined user can claim steps without solving them: the leaderboard is competitive fun, not a proctored exam.
- **2FA is enforced by the database**: once a user has a verified authenticator, a password-only session cannot read or change anything.
- **Leaderboard** exposes only username, avatar and XP. Users can opt out; emails and other profile fields never leave the database.
- **Usernames** are validated (format, reserved words, 7-day change cooldown) in the database, not just the UI.
- **Avatars** are re-encoded to 256×256 in the browser (stripping EXIF and GPS), limited to 512 KB and image types by Storage itself,
  and writable only inside the owner's folder.
- **Browser hardening:** a strict Content-Security-Policy, subresource-integrity hashes on all CDN scripts, no inline event handlers,
  and every dynamic value is HTML-escaped.
- **Right to erasure and portability:** Settings has "Download my data" and "Delete account" (cascades to every table).
