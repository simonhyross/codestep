/* Backend adapter. Two implementations behind one interface:
     - Supabase (production): needs supabaseUrl + supabaseAnonKey in config.js
     - Mock (development only): runs entirely in this browser, only on localhost with ?mock=1.
       It simulates accounts so the UI can be tried without a server. It is NOT secure and is
       disabled on any other hostname.
   Every method resolves to { data?, error? }; error is an Error whose .key is an i18n key. */
(() => {
const cfg = window.PYTHONIC_CONFIG || {};
const LOCAL = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const wantMock = LOCAL && (new URLSearchParams(location.search).has("mock") || localStorage.getItem("codestep:mock") === "1");
const redirectUrl = () => location.origin + location.pathname;

function errKey(e) {
  const m = String((e && (e.message || e.msg)) || e || ""), c = String((e && (e.code || e.error_code)) || "");
  if (/invalid login credentials|invalid_credentials/i.test(m + c)) return "err_invalid";
  if (/not confirmed|email_not_confirmed/i.test(m + c)) return "err_unconfirmed";
  if (/rate limit|too many|over_\w+_rate|429/i.test(m + c) || (e && e.status === 429)) return "err_rate";
  if (/weak_password|password.*(weak|short|at least|should contain)/i.test(m + c)) return "err_weak";
  if (/reauth|recent login|re-authenticat|same_password/i.test(m + c)) return /same_password/i.test(m + c) ? "err_weak" : "err_reauth";
  if (/reserved|not allowed|username_format|username_lower|duplicate key.*username/i.test(m)) return "err_username";
  if (/once every 7 days/i.test(m)) return "err_cooldown";
  if (/rate limited/i.test(m)) return "err_rate";
  if (/failed to fetch|networkerror|network request|load failed/i.test(m)) return "err_network";
  if (/invalid.*email|email.*invalid|unable to validate email/i.test(m)) return "err_email";
  return "err_generic";
}
const fail = e => { const err = e instanceof Error ? e : new Error(String(e)); err.key = errKey(e); return { error: err }; };
const toUser = u => u && ({ id: u.id, email: u.email, created_at: u.created_at, providers: (u.app_metadata && (u.app_metadata.providers || [u.app_metadata.provider])) || ["email"] });

/* ------------------------------------------------------------ Supabase */
function makeSupabase() {
  const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  const A = client.auth;
  let uid = null;
  const run = async fn => { try { const r = await fn(); return r && r.error ? fail(r.error) : { data: r ? r.data : null }; } catch (e) { return fail(e); } };
  const avatarUrl = (id, version) => `${cfg.supabaseUrl}/storage/v1/object/public/avatars/${encodeURIComponent(id)}/avatar.webp?v=${Number(version) || 0}`;

  return {
    mode: "supabase", demo: false,
    init(onAuth) {
      A.onAuthStateChange((event, session) => {
        uid = session ? session.user.id : null;
        setTimeout(() => onAuth(event, session ? toUser(session.user) : null), 0);   // never call supabase inside this callback
      });
      return Promise.resolve();
    },
    signUp: ({ email, password, username }) => run(async () => {
      const r = await A.signUp({ email, password, options: { data: { username }, emailRedirectTo: redirectUrl() } });
      return r.error ? r : { data: { needsConfirm: !r.data.session } };
    }),
    signIn: ({ email, password }) => run(() => A.signInWithPassword({ email, password })),
    signInGoogle: () => run(() => A.signInWithOAuth({ provider: "google", options: { redirectTo: redirectUrl() } })),
    signOut: (scope = "local") => run(() => A.signOut({ scope })),
    resetPassword: email => run(() => A.resetPasswordForEmail(email, { redirectTo: redirectUrl() })),
    resendConfirmation: email => run(() => A.resend({ type: "signup", email, options: { emailRedirectTo: redirectUrl() } })),
    updatePassword: password => run(() => A.updateUser({ password })),
    getProfile: () => run(() => client.from("profiles").select("*").eq("id", uid).single()),
    updateProfile: patch => run(() => client.from("profiles").update(patch).eq("id", uid).select().single()),
    usernameAvailable: u => run(() => client.rpc("username_available", { p_username: u })),
    async uploadAvatar(blob) {
      return run(() => client.storage.from("avatars").upload(`${uid}/avatar.webp`, blob, { upsert: true, contentType: "image/webp", cacheControl: "3600" }));
    },
    removeAvatar: () => run(() => client.storage.from("avatars").remove([`${uid}/avatar.webp`])),
    avatarUrl: (p) => (p && p.avatar === "upload" ? avatarUrl(p.id || p.user_id || uid, p.avatar_version) : null),

    getProgress: () => run(() => client.rpc("get_my_progress")),
    recordStep: (key, xp) => run(() => client.rpc("record_step", { p_step_key: key, p_xp: xp })),
    recordReview: (key, quality, it) => run(() => client.rpc("record_review", { p_step_key: key, p_quality: quality, p_interval: it.interval, p_ease: it.ease, p_reps: it.reps, p_lapses: it.lapses, p_due: it.due })),
    seedReviews: items => run(() => client.rpc("seed_reviews", { p_items: items })),
    importGuest: lessons => run(() => client.rpc("import_guest_progress", { p_lessons: lessons })),
    leaderboard: (period, limit = 50) => run(() => client.rpc("get_leaderboard", { p_period: period, p_limit: limit })),
    exportData: () => run(() => client.rpc("export_my_data")),
    deleteAccount: () => run(async () => { const r = await client.rpc("delete_my_account"); if (r.error) return r; await A.signOut({ scope: "local" }); return r; }),
  };
}

/* ------------------------------------------------------------ Mock (dev only) */
function makeMock() {
  const KEY = "codestep:mockdb";
  const empty = () => ({ users: [], profiles: {}, done: {}, reviews: {}, rlog: {}, avatars: {}, session: null });
  const load = () => { try { return { ...empty(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return empty(); } };
  let db = load();
  const persist = () => localStorage.setItem(KEY, JSON.stringify(db));
  const delay = (v) => new Promise(r => setTimeout(() => r(v), 120));
  const ok = data => delay({ data });
  const bad = (message) => delay(fail(new Error(message)));
  let onAuthCb = null;
  const RESERVED = ["admin", "administrator", "root", "support", "help", "bit", "codestep", "moderator", "mod", "staff", "system", "official", "null", "undefined", "api", "www"];
  const STEPS = {}; (window.UNITS || []).forEach(u => u.lessons.forEach(l => { l.steps.forEach((s, i) => { const x = { quiz: 5, predict: 5, code: 15 }[s.type]; if (x) STEPS[`${l.id}:${i}`] = { lesson: l.id, max: x, bonus: false }; }); STEPS[`${l.id}:bonus`] = { lesson: l.id, max: 20, bonus: true }; }));
  const me = () => db.session && db.users.find(u => u.id === db.session.uid);
  const emit = (event) => { const u = me(); setTimeout(() => onAuthCb && onAuthCb(event, u ? toUser2(u) : null), 0); };
  const toUser2 = u => ({ id: u.id, email: u.email, created_at: u.created, providers: u.providers });
  const day = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
  const weekStart = () => { const d = new Date(); const dow = (d.getUTCDay() + 6) % 7; return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dow); };
  const progressOf = id => {
    const c = db.done[id] || {}, rows = Object.entries(c), days = new Set([...rows.map(([, v]) => day(v.at)), ...(db.rlog[id] || []).map(day)]);
    let cur = new Date(), n = 0; if (!days.has(day(cur))) cur.setDate(cur.getDate() - 1);
    while (days.has(day(cur))) { n++; cur.setDate(cur.getDate() - 1); }
    const daily = {}; rows.forEach(([, v]) => { const k = day(v.at); daily[k] = (daily[k] || 0) + v.xp; });
    return { xp: rows.reduce((a, [, v]) => a + v.xp, 0), week_xp: rows.filter(([, v]) => v.at >= weekStart()).reduce((a, [, v]) => a + v.xp, 0), today_xp: daily[day(Date.now())] || 0, streak: n, daily,
      done: rows.filter(([k]) => STEPS[k] && STEPS[k].bonus).map(([k]) => STEPS[k].lesson), steps: rows.map(([k]) => k),
      reviews: Object.entries(db.reviews[id] || {}).map(([k, v]) => ({ k, ...v })) };
  };
  const BOTS = ["codewren", "bytefox", "loop_lily", "nina_py", "stack_sam", "hash_hana", "recurse_ro", "tuple_tim", "lambda_lu", "dict_dan", "bit_bea", "queue_quin"].map((u, i) => ({ id: "bot" + i, username: u, avatar: "preset:" + (1 + i % 8), week: Math.max(0, 210 - i * 17 + (i % 3) * 5), all: 900 - i * 61 }));
  const mkProfile = (id, username, picked) => ({ id, username, username_set: picked, display_name: null, avatar: "preset:" + (1 + Math.floor(Math.random() * 8)), avatar_version: 0, language: "en", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", theme: "system", daily_goal: 50, email_notifications: false, reminders_enabled: false, reminder_time: "18:00:00", show_on_leaderboard: true, guest_imported: false, username_changed_at: null, created_at: new Date().toISOString() });
  const guard = () => (me() ? null : "not authenticated");

  return {
    mode: "mock", demo: true,
    init(onAuth) { onAuthCb = onAuth; setTimeout(() => onAuth("INITIAL_SESSION", me() ? toUser2(me()) : null), 0); return Promise.resolve(); },
    async signUp({ email, password, username }) {
      if (db.users.some(u => u.email === email.toLowerCase())) return delay({ data: { needsConfirm: true } });     // like Supabase: no enumeration
      const picked = /^[A-Za-z0-9_]{3,20}$/.test(username || "") && !RESERVED.includes(String(username).toLowerCase()) && !Object.values(db.profiles).some(p => p.username.toLowerCase() === String(username).toLowerCase());
      const id = "u" + Math.random().toString(36).slice(2, 10);
      db.users.push({ id, email: email.toLowerCase(), pw: password, created: new Date().toISOString(), providers: ["email"] });
      db.profiles[id] = mkProfile(id, picked ? username : "coder" + Math.random().toString(16).slice(2, 9), picked);
      db.session = { uid: id }; persist(); emit("SIGNED_IN"); return delay({ data: { needsConfirm: false } });
    },
    async signIn({ email, password }) {
      const u = db.users.find(x => x.email === email.toLowerCase() && x.pw === password);
      if (!u) return bad("Invalid login credentials");
      db.session = { uid: u.id }; persist(); emit("SIGNED_IN"); return delay({ data: {} });
    },
    async signInGoogle() {
      const email = (prompt("Demo Google sign-in: enter an email") || "").trim().toLowerCase(); if (!email) return delay({ data: null });
      let u = db.users.find(x => x.email === email);
      if (!u) { u = { id: "u" + Math.random().toString(36).slice(2, 10), email, pw: null, created: new Date().toISOString(), providers: ["google"] }; db.users.push(u); db.profiles[u.id] = mkProfile(u.id, "coder" + Math.random().toString(16).slice(2, 9), false); }
      db.session = { uid: u.id }; persist(); emit("SIGNED_IN"); return delay({ data: {} });
    },
    async signOut() { db.session = null; persist(); emit("SIGNED_OUT"); return delay({ data: {} }); },
    async resetPassword() { return delay({ data: {} }); },
    async resendConfirmation() { return delay({ data: {} }); },
    async updatePassword(pw) { const u = me(); if (!u) return bad("not authenticated"); if (pw.length < 10) return bad("weak_password"); u.pw = pw; persist(); return delay({ data: {} }); },
    async getProfile() { const g = guard(); if (g) return bad(g); return ok(db.profiles[me().id]); },
    async updateProfile(patch) {
      const g = guard(); if (g) return bad(g); const p = db.profiles[me().id];
      if (patch.username && patch.username !== p.username) {
        if (!/^[A-Za-z0-9_]{3,20}$/.test(patch.username) || RESERVED.includes(patch.username.toLowerCase()) || Object.values(db.profiles).some(x => x.id !== p.id && x.username.toLowerCase() === patch.username.toLowerCase())) return bad("username is reserved");
        if (p.username_set && p.username_changed_at && Date.now() - new Date(p.username_changed_at) < 7 * 864e5) return bad("username can be changed once every 7 days");
        p.username_changed_at = new Date().toISOString();
      }
      const allowed = ["username", "username_set", "display_name", "avatar", "avatar_version", "language", "timezone", "theme", "daily_goal", "email_notifications", "reminders_enabled", "reminder_time", "show_on_leaderboard"];
      for (const k of allowed) if (k in patch) p[k] = patch[k];
      persist(); return ok({ ...p });
    },
    async usernameAvailable(u) { return ok(/^[A-Za-z0-9_]{3,20}$/.test(u) && !RESERVED.includes(u.toLowerCase()) && !Object.values(db.profiles).some(p => p.username.toLowerCase() === u.toLowerCase() && (!me() || p.id !== me().id))); },
    async uploadAvatar(blob) {
      if (!me()) return bad("not authenticated");
      const url = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
      db.avatars[me().id] = url; persist(); return ok({});
    },
    async removeAvatar() { if (me()) { delete db.avatars[me().id]; persist(); } return ok({}); },
    avatarUrl: p => (p && p.avatar === "upload" ? db.avatars[p.id || p.user_id] || null : null),

    async getProgress() { const g = guard(); if (g) return bad(g); return ok(progressOf(me().id)); },
    async recordStep(key, xp) {
      const g = guard(); if (g) return bad(g);
      const st = STEPS[key]; if (!st) return bad("unknown step");
      const c = (db.done[me().id] = db.done[me().id] || {});
      if (Object.values(c).filter(v => Date.now() - v.at < 60000).length >= 20) return bad("rate limited");
      if (!c[key]) c[key] = { xp: Math.min(Math.max(Number(xp) || 0, 0), st.max), at: Date.now() };
      persist(); return ok(progressOf(me().id));
    },
    async recordReview(key, quality, it) {
      const g = guard(); if (g) return bad(g);
      if (!STEPS[key] || STEPS[key].bonus || !["again", "hard", "good"].includes(quality)) return bad("unknown step");
      (db.reviews[me().id] = db.reviews[me().id] || {})[key] = { due: it.due, interval: it.interval, ease: it.ease, reps: it.reps, lapses: it.lapses };
      (db.rlog[me().id] = db.rlog[me().id] || []).push(Date.now()); persist(); return ok({});
    },
    async seedReviews(items) {
      const g = guard(); if (g) return bad(g); const r = (db.reviews[me().id] = db.reviews[me().id] || {});
      (items || []).forEach(x => { if (STEPS[x.k] && !STEPS[x.k].bonus && !r[x.k]) r[x.k] = { due: x.due, interval: x.interval, ease: 2.5, reps: 1, lapses: 0 }; });
      persist(); return ok({});
    },
    async importGuest(lessons) {
      const g = guard(); if (g) return bad(g); const p = db.profiles[me().id];
      if (!p.guest_imported) { const c = (db.done[me().id] = db.done[me().id] || {}); Object.entries(STEPS).forEach(([k, s]) => { if ((lessons || []).includes(s.lesson) && !c[k]) c[k] = { xp: s.max, at: Date.now() - 8 * 864e5 }; }); p.guest_imported = true; persist(); }
      return ok(progressOf(me().id));
    },
    async leaderboard(period, limit = 50) {
      const g = guard(); if (g) return bad(g);
      const rows = BOTS.map(b => ({ username: b.username, avatar: b.avatar, avatar_version: 0, user_id: b.id, xp: period === "all" ? b.all : b.week, is_me: false }));
      Object.values(db.profiles).forEach(p => { const pr = progressOf(p.id), xp = period === "all" ? pr.xp : pr.week_xp; if (xp > 0 && (p.show_on_leaderboard || p.id === me().id)) rows.push({ username: p.username, avatar: p.avatar, avatar_version: p.avatar_version, user_id: p.id, xp, is_me: p.id === me().id }); });
      rows.sort((a, b) => b.xp - a.xp || a.username.localeCompare(b.username));
      let last = 0, rank = 0; rows.forEach((r, i) => { if (r.xp !== last) { rank = i + 1; last = r.xp; } r.rank = rank; });
      return ok(rows.filter(r => r.rank <= limit || r.is_me));
    },
    async exportData() { const g = guard(); if (g) return bad(g); const id = me().id; return ok({ exported_at: new Date().toISOString(), profile: { ...db.profiles[id], id: undefined }, completions: Object.entries(db.done[id] || {}).map(([step, v]) => ({ step, xp: v.xp, at: new Date(v.at).toISOString() })) }); },
    async deleteAccount() { const g = guard(); if (g) return bad(g); const id = me().id; db.users = db.users.filter(u => u.id !== id); delete db.profiles[id]; delete db.done[id]; delete db.reviews[id]; delete db.rlog[id]; delete db.avatars[id]; db.session = null; persist(); emit("SIGNED_OUT"); return ok({}); },
  };
}

let impl = null;
if (wantMock) impl = makeMock();
else if (cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase) impl = makeSupabase();
window.Backend = impl || { mode: "none", demo: false };
window.Backend.errKey = errKey;
})();
