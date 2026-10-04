/* Accounts: auth screens, session lifecycle, progress sync, settings page and leaderboard.
   Everything talks to window.Backend (Supabase in production, a local mock in development). */
(() => {
const { t, tn, esc, ico, mascot, view, modal, toast, $, $$, MOD } = App;
const B = window.Backend;
const enabled = B && B.mode !== "none";

const Account = { phase: enabled ? "loading" : "guest", user: null, profile: null };
window.Account = Account;
Account.name = () => (Account.phase === "ready" && Account.profile ? Account.profile.display_name || Account.profile.username : null);
Account.onThemeChanged = th => { if (Account.phase === "ready") save({ theme: th || "system" }); };

const go = hash => { if (location.hash !== hash) location.hash = hash; else App.refresh(); };
const errText = e => t((e && e.key) || "err_generic");
const hasRoute = name => (location.hash.split("/")[1] || "learn") === name;

/* ------------------------------------------------------------ avatars */
const PRESETS = [
  { bg: "#dbe7ff", body: "#ffc931", rim: "#2f6bff" }, { bg: "#fff2c4", body: "#2f6bff", rim: "#ffc931" }, { bg: "#e4ecff", body: "#8dbbff", rim: "#ff7a59" }, { bg: "#ffe8cc", body: "#ff9f1c", rim: "#ffffff" },
  { bg: "#ffc931", body: "#26409a", rim: "#ffffff" }, { bg: "#dff5ea", body: "#ff7a59", rim: "#ffc931" }, { bg: "#fff2c4", body: "#4fd1a5", rim: "#2f6bff" }, { bg: "#2f6bff", body: "#c9b6ff", rim: "#ffc931" },
];
function presetSvg(n) {          // the mascot's head and hoodie, in the preset's colours
  const p = PRESETS[(n - 1) % 8] || PRESETS[0], ink = "#0b1b3a";
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" fill="${p.bg}"/>
    <g transform="translate(2 6) scale(.8)">
      <circle cx="26" cy="24" r="13" fill="${ink}"/><circle cx="94" cy="24" r="13" fill="${ink}"/>
      <path d="M22 112 C22 96 34 86 60 86 C86 86 98 96 98 112Z" fill="${p.body}" stroke="${ink}" stroke-width="4.4" stroke-linejoin="round"/>
      <path d="${HEAD}" fill="#fff" stroke="${ink}" stroke-width="4.4" stroke-linejoin="round"/>
      <ellipse cx="38.5" cy="52" rx="13.4" ry="16.6" transform="rotate(24 38.5 52)" fill="${ink}"/><ellipse cx="81.5" cy="52" rx="13.4" ry="16.6" transform="rotate(-24 81.5 52)" fill="${ink}"/>
      <circle cx="38.5" cy="53" r="6.2" fill="#fff"/><circle cx="81.5" cy="53" r="6.2" fill="#fff"/>
      <circle cx="39.5" cy="54" r="3.4" fill="${ink}"/><circle cx="80.5" cy="54" r="3.4" fill="${ink}"/>
      <circle cx="38.5" cy="52" r="10" fill="none" stroke="${p.rim}" stroke-width="3.6"/><circle cx="81.5" cy="52" r="10" fill="none" stroke="${p.rim}" stroke-width="3.6"/>
      <path d="M48.5 49 Q60 43.5 71.5 49" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><path d="M48.5 49 Q60 43.5 71.5 49" fill="none" stroke="${p.rim}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="31" cy="75.5" r="4.8" fill="#ff7a59" opacity=".55"/><circle cx="89" cy="75.5" r="4.8" fill="#ff7a59" opacity=".55"/>
      <path d="M54.2 60 Q60 57.2 65.8 60 Q65 65.8 60 67 Q55 65.8 54.2 60Z" fill="${ink}" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M60 67 V69" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/><path d="M52 68.6 Q56 75.2 60 69 Q64 75.2 68 68.6" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g></svg>`;
}
function avatar(p, size = 40) {
  const url = p && p.avatar === "upload" ? B.avatarUrl(p) : null;
  const ok = url && (/^data:image\//.test(url) || /^https:\/\//.test(url));
  const inner = ok ? `<img src="${esc(url)}" alt="" referrerpolicy="no-referrer" loading="lazy" decoding="async">` : presetSvg(parseInt(((p && p.avatar) || "preset:1").split(":")[1], 10) || 1);
  return `<span class="avatar" style="width:${size}px;height:${size}px">${inner}</span>`;
}

/* ------------------------------------------------------------ session lifecycle */
let loading = false, queue = [], flushing = false, retryTimer = null;
const qKey = () => "codestep:pending:" + (Account.user ? Account.user.id : "");
function loadQueue() { try { queue = JSON.parse(localStorage.getItem(qKey()) || "[]"); } catch { queue = []; } }
function saveQueue() { try { localStorage.setItem(qKey(), JSON.stringify(queue)); } catch {} }

async function flush() {
  if (flushing || Account.phase !== "ready") return;
  flushing = true;
  try {
    while (queue.length) {
      const it = queue[0], r = it.kind === "review" ? await B.recordReview(it.key, it.quality, it.item) : await B.recordStep(it.key, it.xp);
      if (r.error && ["err_network", "err_rate"].includes(r.error.key)) { clearTimeout(retryTimer); retryTimer = setTimeout(flush, r.error.key === "err_rate" ? 20000 : 15000); break; }
      if (!r.error && it.kind !== "review") App.applyServerProgress(r.data);
      queue.shift(); saveQueue();
      if (hasRoute("learn") || location.hash === "" || location.hash === "#/") App.refresh();
    }
  } finally { flushing = false; }
}
const enqueue = job => { if (Account.phase !== "ready") return; queue.push(job); saveQueue(); flush(); };
App.hooks.step = (key, xp) => enqueue({ kind: "step", key, xp });
App.hooks.review = (key, quality, item) => enqueue({ kind: "review", key, quality, item });
App.hooks.seed = items => { if (Account.phase === "ready") B.seedReviews(items); };
addEventListener("online", flush);

function applyProfilePrefs(p) {
  App.setLanguage(p.language || "en", true);
  App.S.theme = p.theme === "system" ? null : p.theme;
  App.setGoal(p.daily_goal || 50);
  App.applyTheme();
}

async function loadAccount() {
  if (loading) return; loading = true;
  try {
    const pr = await B.getProfile();
    if (pr.error) { toast(errText(pr.error)); return; }
    Account.profile = pr.data;
    App.enterAccount(); loadQueue();
    let prog = null;
    const guestLessons = App.guestDoneLessons();
    if (!pr.data.guest_imported && guestLessons.length) {
      const r = await B.importGuest(guestLessons);
      if (!r.error) { App.clearGuestProgress(); prog = r.data; toast(t("imported")); }
    }
    if (!prog) { const r = await B.getProgress(); prog = r.error ? { xp: 0, streak: 0, daily: {}, done: [], today_xp: 0 } : r.data; }
    App.applyServerProgress(prog, true);
    Account.phase = "ready";
    App.seedReviews();
    applyProfilePrefs(Account.profile);
    paintChip(); flush();
    if (hasRoute("auth")) go("#/learn"); else App.refresh();
    if (!Account.profile.username_set) promptUsername();
  } finally { loading = false; }
}

async function onAuth(event, user) {
  if (event === "TOKEN_REFRESHED") return;
  if (event === "PASSWORD_RECOVERY") { Account.user = user; Account.phase = "recovery"; go("#/auth/recovery"); return; }
  if (!user) {
    const was = Account.phase === "ready";
    Account.user = null; Account.profile = null;
    App.leaveAccount(); queue = []; Account.phase = "guest";
    paintChip();
    if (was) { toast(t("signed_out")); go("#/learn"); } else App.refresh();
    return;
  }
  if (Account.phase === "recovery") { Account.user = user; return; }
  if (Account.phase === "ready" && Account.user && Account.user.id === user.id) { Account.user = user; return; }
  Account.user = user;
  await loadAccount();
}

async function save(patch, { quiet = false } = {}) {
  const r = await B.updateProfile(patch);
  if (r.error) { toast(errText(r.error)); return false; }
  Account.profile = { ...Account.profile, ...r.data };
  if (!quiet) toast(t("saved"));
  paintChip(); return true;
}

/* ------------------------------------------------------------ sidebar chip */
function paintChip() {
  const el = $("#acct"); if (!el) return;
  if (!enabled) { el.hidden = true; } else {
    el.hidden = false;
    if (Account.phase === "ready" && Account.profile) {
      const p = Account.profile;
      el.innerHTML = `<a class="acct-me" href="#/settings">${avatar(p, 38)}<span><b>${esc(p.display_name || p.username)}</b><small>@${esc(p.username)}</small></span></a>`;
    } else if (Account.phase === "loading") el.innerHTML = "";
    else el.innerHTML = `<a class="btn btn-primary btn-sm btn-block" href="#/auth/signup">${t("create_account")}</a><a class="btn btn-ghost btn-sm btn-block" href="#/auth/signin">${t("sign_in")}</a>`;
  }
  const mp = $("#nav-profile"); if (mp) mp.setAttribute("href", Account.phase === "ready" ? "#/settings" : enabled ? "#/auth/signin" : "#/settings");
}

/* ------------------------------------------------------------ password + username checks */
const COMMON = new Set(["password", "password1", "password12", "password123", "passw0rd123", "1234567890", "12345678910", "0123456789", "qwertyuiop", "qwerty12345", "qwertyuiop1", "asdfghjkl1", "iloveyou123", "letmein123", "welcome123", "welcome1234", "admin12345", "abc1234567", "1q2w3e4r5t", "football123", "monkey1234", "dragon1234", "sunshine123", "princess123", "baseball123", "superman123", "changeme123", "trustno1234", "pythonpython", "python1234", "python12345", "codestep123"]);
function checkPassword(pw, { email = "", username = "" } = {}) {
  const issues = [], low = pw.toLowerCase(), local = email.split("@")[0].toLowerCase();
  if (pw.length < 10) issues.push("pw_too_short");
  if (COMMON.has(low) || /^(.)\1+$/.test(pw) || "01234567890123456789".includes(low) || "abcdefghijklmnopqrstuvwxyz".includes(low)) issues.push("pw_common");
  if ((local.length >= 4 && low.includes(local)) || (username.length >= 3 && low.includes(username.toLowerCase()))) issues.push("pw_personal");
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
  if (pw.length >= 10 && pw.length < 14 && classes < 3) issues.push("pw_variety");
  let score = 0;
  if (pw.length >= 10) score = 1;
  if (pw.length >= 14) score++;
  if (classes >= 3) score++;
  if (pw.length >= 18 || (classes === 4 && pw.length >= 12)) score++;
  if (issues.includes("pw_common") || issues.includes("pw_personal")) score = Math.min(score, 1);
  return { score: Math.min(score, 4), issues, ok: issues.length === 0 };
}
const strengthHtml = (pw, ctx) => {
  const r = checkPassword(pw, ctx), lab = r.score <= 1 ? "pw_weak" : r.score <= 2 ? "pw_ok" : "pw_strong", cls = r.score <= 1 ? "weak" : r.score <= 2 ? "ok" : "strong";
  if (!pw) return `<div class="hint">${t("pw_hint")}</div>`;
  return `<div class="meter ${cls}" role="img" aria-label="${esc(t(lab))}">${[1, 2, 3, 4].map(i => `<i class="${i <= r.score ? "on" : ""}"></i>`).join("")}<span>${t(lab)}</span></div>${r.issues.length ? `<div class="hint warn">${t(r.issues[0])}</div>` : ""}`;
};
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
function usernameChecker(input, statusEl, ownName) {
  let timer = null, seq = 0, state = { ok: false };
  const run = async () => {
    const v = input.value.trim(); const my = ++seq;
    if (!v) { statusEl.textContent = t("user_rules"); statusEl.className = "hint"; state.ok = false; return; }
    if (!/^[A-Za-z0-9_]{3,20}$/.test(v)) { statusEl.textContent = t("user_rules"); statusEl.className = "hint warn"; state.ok = false; return; }
    if (ownName && v === ownName) { statusEl.textContent = ""; state.ok = true; return; }
    statusEl.textContent = t("user_checking"); statusEl.className = "hint";
    const r = await B.usernameAvailable(v); if (my !== seq) return;
    state.ok = !r.error && r.data === true;
    statusEl.textContent = r.error ? errText(r.error) : state.ok ? "✓ " + t("user_free") : t("user_taken"); statusEl.className = "hint " + (state.ok ? "good" : "warn");
  };
  input.addEventListener("input", () => { clearTimeout(timer); state.ok = false; timer = setTimeout(run, 350); });
  return state;
}

/* ------------------------------------------------------------ auth screen */
let authNotice = null, failedLogins = 0, lockUntil = 0, resendAt = 0;
const field = (id, label, inner, extra = "") => `<div class="field"><label for="${id}">${label}</label>${inner}${extra}</div>`;
const pwInput = (id, ac) => `<div class="pwbox"><input class="input" id="${id}" type="password" autocomplete="${ac}" required maxlength="128" spellcheck="false"><button type="button" class="pwtoggle" data-toggle="${id}" aria-label="${esc(t("show"))}">${ico("eye")}</button></div>`;
function bindPwToggles(root) {
  $$("[data-toggle]", root).forEach(b => (b.onclick = () => { const i = $("#" + b.dataset.toggle, root); const show = i.type === "password"; i.type = show ? "text" : "password"; b.setAttribute("aria-label", t(show ? "hide" : "show")); b.classList.toggle("on", show); }));
}

function renderAuth(mode = "signin") {
  document.title = t("sign_in") + " · Codestep";
  if (!enabled) { view.innerHTML = `<div class="auth-wrap"><div class="auth-card">${mascot("think", 90)}<h1>${t("not_configured")}</h1><a class="btn btn-primary" href="#/learn">${t("back_to_path")}</a></div></div>`; return; }
  if (Account.phase === "ready" && mode !== "recovery") { go("#/settings"); return; }
  if (Account.phase === "recovery") mode = "recovery";
  const demo = B.demo ? `<div class="banner demo">${t("demo_banner")}</div>` : "";
  const google = `<button class="btn btn-ghost btn-block gbtn" type="button" id="g-btn"><svg viewBox="0 0 24 24" width="20" height="20" style="stroke:none"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 01-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.800 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.500-1 7.300-2.700l-3.600-2.700c-1 .7-2.300 1.100-3.700 1.100-2.900 0-5.300-1.900-6.200-4.500H2.100v2.800A11 11 0 0012 23z"/><path fill="#FBBC05" d="M5.800 14.200a6.600 6.600 0 010-4.400V7H2.100a11 11 0 000 10z"/><path fill="#EA4335" d="M12 5.400c1.600 0 3.100.6 4.200 1.700l3.200-3.200A11 11 0 002.100 7l3.700 2.800C6.700 7.300 9.100 5.400 12 5.400z"/></svg>${t("continue_google")}</button><div class="or"><span>${t("or")}</span></div>`;
  let body = "";
  if (mode === "signin") body = `<h1>${t("auth_title_in")}</h1><p class="sub">${t("auth_sub_in")}</p>${google}
    <form id="f" novalidate>${field("em", t("email"), `<input class="input" id="em" type="email" autocomplete="email" required maxlength="254">`)}
    ${field("pw", t("password"), pwInput("pw", "current-password"))}<div class="err" id="err" role="alert"></div>
    <button class="btn btn-primary btn-block" type="submit" id="go">${t("sign_in")}</button></form>
    <div class="links"><a href="#/auth/forgot">${t("forgot")}</a><span>${t("no_account")} <a href="#/auth/signup">${t("create_account")}</a></span></div>`;
  else if (mode === "signup") body = `<h1>${t("auth_title_up")}</h1><p class="sub">${t("auth_sub_up")}</p>${google}
    <form id="f" novalidate>${field("un", t("username"), `<input class="input" id="un" autocomplete="username" required maxlength="20" spellcheck="false" autocapitalize="none">`, `<div class="hint" id="un-s">${t("user_rules")}</div>`)}
    ${field("em", t("email"), `<input class="input" id="em" type="email" autocomplete="email" required maxlength="254">`)}
    ${field("pw", t("password"), pwInput("pw", "new-password"), `<div id="pw-s">${strengthHtml("", {})}</div>`)}<div class="err" id="err" role="alert"></div>
    <button class="btn btn-primary btn-block" type="submit" id="go">${t("create_account")}</button></form>
    <div class="links"><span>${t("have_account")} <a href="#/auth/signin">${t("sign_in")}</a></span></div>`;
  else if (mode === "forgot") body = `<h1>${t("reset_title")}</h1><p class="sub">${t("reset_text")}</p>
    <form id="f" novalidate>${field("em", t("email"), `<input class="input" id="em" type="email" autocomplete="email" required maxlength="254">`)}<div class="err" id="err" role="alert"></div>
    <button class="btn btn-primary btn-block" type="submit" id="go">${t("send_link")}</button></form><div class="links"><a href="#/auth/signin">${t("back")}</a></div>`;
  else if (mode === "recovery") body = `<h1>${t("reset_title")}</h1>
    <form id="f" novalidate>${field("pw", t("new_password"), pwInput("pw", "new-password"), `<div id="pw-s">${strengthHtml("", {})}</div>`)}<div class="err" id="err" role="alert"></div>
    <button class="btn btn-primary btn-block" type="submit" id="go">${t("set_password")}</button></form>`;
  else if (mode === "confirm") body = `<h1>${t("check_inbox")}</h1><p class="sub">${t("check_inbox_text", { email: `<b>${esc(authNotice || "")}</b>` })}</p>
    <button class="btn btn-ghost btn-block" id="resend">${t("resend")}</button><div class="err good" id="err" role="status"></div><div class="links"><a href="#/auth/signin">${t("sign_in")}</a></div>`;

  view.innerHTML = `<div class="auth-wrap"><div class="auth-card">${demo}<div class="auth-mascot">${mascot(mode === "confirm" ? "cheer" : "happy", 84)}</div>${body}</div></div>`;
  const root = view, err = $("#err", root), f = $("#f", root), btn = $("#go", root);
  const showErr = m => { if (err) { err.textContent = m || ""; err.className = "err" + (m ? " show" : ""); } };
  const busy = on => { if (btn) { btn.disabled = on; btn.classList.toggle("loading", on); } };
  bindPwToggles(root);
  const g = $("#g-btn", root); if (g) g.onclick = async () => { const r = await B.signInGoogle(); if (r.error) showErr(errText(r.error)); };

  if (mode === "confirm") {
    $("#resend", root).onclick = async () => {
      if (Date.now() < resendAt) return; resendAt = Date.now() + 60000;
      const r = await B.resendConfirmation(authNotice); const e = $("#err", root); e.textContent = r.error ? errText(r.error) : t("resent"); e.className = "err show" + (r.error ? "" : " good");
    }; return;
  }
  if (mode === "forgot") {
    f.onsubmit = async e => {
      e.preventDefault(); showErr(""); const em = $("#em", root).value.trim();
      if (!EMAIL_RE.test(em)) return showErr(t("err_email")); busy(true);
      await B.resetPassword(em); busy(false);            // same message whether or not the account exists
      err.textContent = t("reset_sent"); err.className = "err show good";
    }; return;
  }
  if (mode === "recovery" || mode === "signup") {
    const pw = $("#pw", root), un = $("#un", root), em = $("#em", root);
    const ctx = () => ({ email: em ? em.value : (Account.user && Account.user.email) || "", username: un ? un.value : "" });
    const upd = () => { $("#pw-s", root).innerHTML = strengthHtml(pw.value, ctx()); };
    pw.addEventListener("input", upd); if (em) em.addEventListener("input", upd); if (un) un.addEventListener("input", upd);
    const uState = un ? usernameChecker(un, $("#un-s", root), null) : null;
    f.onsubmit = async e => {
      e.preventDefault(); showErr("");
      if (mode === "signup") {
        if (!/^[A-Za-z0-9_]{3,20}$/.test(un.value.trim())) return showErr(t("user_rules"));
        if (!uState.ok) return showErr(t("user_taken"));
        if (!EMAIL_RE.test(em.value.trim())) return showErr(t("err_email"));
      }
      const c = checkPassword(pw.value, ctx()); if (!c.ok) return showErr(t(c.issues[0]));
      busy(true);
      if (mode === "recovery") {
        const r = await B.updatePassword(pw.value); busy(false);
        if (r.error) return showErr(errText(r.error));
        toast(t("pw_updated")); Account.phase = "guest"; const u = Account.user; Account.user = null; go("#/learn"); onAuth("SIGNED_IN", u); return;
      }
      const r = await B.signUp({ email: em.value.trim(), password: pw.value, username: un.value.trim() }); busy(false);
      if (r.error) return showErr(errText(r.error));
      if (r.data && r.data.needsConfirm) { authNotice = em.value.trim(); renderAuth("confirm"); }
    }; return;
  }
  // sign in
  f.onsubmit = async e => {
    e.preventDefault(); showErr("");
    if (Date.now() < lockUntil) return showErr(t("err_rate"));
    const em = $("#em", root).value.trim(), pw = $("#pw", root).value;
    if (!EMAIL_RE.test(em)) return showErr(t("err_email")); if (!pw) return showErr(t("err_invalid"));
    busy(true); const r = await B.signIn({ email: em, password: pw }); busy(false);
    if (r.error) { if (++failedLogins >= 5) { lockUntil = Date.now() + 30000; failedLogins = 0; } return showErr(errText(r.error)); }
    failedLogins = 0;
  };
}

/* ------------------------------------------------------------ username onboarding */
function promptUsername() {
  const close = modal({ title: t("choose_username"), text: t("choose_username_text"), keep: true,
    html: `<div class="field"><input class="input" id="nu" maxlength="20" autocomplete="username" spellcheck="false" autocapitalize="none" value="${esc(Account.profile.username)}"><div class="hint" id="nu-s"></div></div>`,
    actions: [{ label: t("save"), cls: "btn-primary", keep: true, onClick: async () => {
      const v = $("#nu").value.trim(); if (!st.ok) return;
      if (await save({ username: v, username_set: true })) close(); } }] });
  const st = usernameChecker($("#nu"), $("#nu-s"), null); $("#nu").dispatchEvent(new Event("input")); $("#nu").select();
}

/* ------------------------------------------------------------ settings */
const row = (title, note, control) => `<div class="srow"><div class="stext"><b>${title}</b>${note ? `<span>${note}</span>` : ""}</div><div class="sctl">${control}</div></div>`;
const toggle = (id, on) => `<button class="switch" role="switch" id="${id}" aria-checked="${!!on}"></button>`;
const opt = (v, label, cur) => `<option value="${esc(v)}" ${String(v) === String(cur) ? "selected" : ""}>${esc(label)}</option>`;
function timezones() { try { return Intl.supportedValuesOf("timeZone"); } catch { return ["UTC", "Europe/Stockholm", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo"]; } }

async function renderSettings() {
  document.title = t("settings_title") + " · Codestep";
  const S = App.S, ready = Account.phase === "ready" && Account.profile, p = Account.profile || {};
  const themeCur = ready ? (p.theme || "system") : (S.theme || "system");
  const goalCur = ready ? p.daily_goal : (S.goal || 50);
  const tzNow = (ready && p.timezone) || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const tzs = timezones(); if (!tzs.includes(tzNow)) tzs.unshift(tzNow);

  const guestBanner = !ready && enabled ? `<div class="set-card banner-card">${mascot("happy", 70)}<div><h3>${t("guest_banner_title")}</h3><p>${t("guest_banner_text")}</p><div class="btns"><a class="btn btn-primary btn-sm" href="#/auth/signup">${t("create_account")}</a><a class="btn btn-ghost btn-sm" href="#/auth/signin">${t("sign_in")}</a></div></div></div>` : "";
  const prefs = `<section class="set-card"><h3>${t("sec_prefs")}</h3>
    ${row(t("theme"), "", `<div class="seg" id="s-theme">${["system", "light", "dark"].map(v => `<button data-v="${v}" class="${v === themeCur ? "on" : ""}">${t("theme_" + v)}</button>`).join("")}</div>`)}
    ${row(t("goal_label"), "", `<select class="select" id="s-goal">${[20, 50, 100, 150].map(n => opt(n, t("goal_xp", { n }), goalCur)).join("")}</select>`)}
    ${ready ? row(t("show_lb"), t("show_lb_note"), toggle("s-lb", p.show_on_leaderboard)) : ""}</section>`;

  const profile = ready ? `<section class="set-card"><h3>${t("sec_profile")}</h3>
    <div class="avatar-row">${avatar(p, 88)}<div><b>${t("avatar")}</b><div class="presets" id="presets">${PRESETS.map((_, i) => `<button data-n="${i + 1}" class="${p.avatar === "preset:" + (i + 1) ? "on" : ""}" aria-label="${t("choose_preset")} ${i + 1}">${avatar({ avatar: "preset:" + (i + 1) }, 40)}</button>`).join("")}</div>
      <div class="btns"><button class="btn btn-ghost btn-sm" id="up-btn">${t("upload_photo")}</button>${p.avatar === "upload" ? `<button class="btn btn-ghost btn-sm" id="rm-btn">${t("remove_photo")}</button>` : ""}<input type="file" id="up-file" accept="image/jpeg,image/png,image/webp" hidden></div><div class="hint">${t("photo_hint")}</div></div></div>
    ${row(t("display_name"), t("display_name_hint"), `<input class="input" id="s-dn" maxlength="40" value="${esc(p.display_name || "")}" autocomplete="nickname">`)}
    ${row(t("username"), t("username_note"), `<div><input class="input" id="s-un" maxlength="20" value="${esc(p.username)}" autocomplete="username" spellcheck="false" autocapitalize="none"><div class="hint" id="s-un-s"></div></div>`)}
    ${row(t("email"), Account.user && Account.user.created_at ? t("member_since", { d: new Date(Account.user.created_at).toLocaleDateString(I18N.lang) }) : "", `<span class="static">${esc((Account.user && Account.user.email) || "")}</span>`)}</section>` : "";

  const notif = ready ? `<section class="set-card"><h3>${t("sec_notif")}</h3>
    ${row(t("reminders"), t("reminders_note"), toggle("s-rem", p.reminders_enabled))}
    <div id="rem-opts" ${p.reminders_enabled || p.email_notifications ? "" : "hidden"}>${row(t("remind_time"), "", `<input class="input time" id="s-time" type="time" value="${esc(String(p.reminder_time || "18:00").slice(0, 5))}">`)}
    ${row(t("timezone"), "", `<select class="select" id="s-tz">${tzs.map(z => opt(z, z.replace(/_/g, " "), tzNow)).join("")}</select>`)}</div>
    ${row(t("email_notif"), t("email_notif_note"), toggle("s-dig", p.email_notifications))}
    <p class="fine">${t("notif_note")}</p></section>` : "";

  const security = ready ? `<section class="set-card"><h3>${t("sec_security")}</h3>
    ${row(t("change_pw"), "", `<button class="btn btn-ghost btn-sm" id="pw-btn">${t("change_pw")}</button>`)}
    <div id="pw-form" hidden><div class="field">${pwInput("npw", "new-password")}<div id="npw-s">${strengthHtml("", {})}</div><div class="err" id="npw-e" role="alert"></div><button class="btn btn-primary btn-sm" id="npw-go">${t("set_password")}</button></div></div>
    ${row(t("providers"), "", `<span class="static">${esc(((Account.user && Account.user.providers) || ["email"]).map(x => x === "email" ? t("email") : x[0].toUpperCase() + x.slice(1)).join(", "))}</span>`)}
    ${row(t("signout_all"), t("signout_all_note"), `<button class="btn btn-ghost btn-sm" id="so-all">${t("signout_all")}</button>`)}</section>
    <section class="set-card"><h3>${t("sec_data")}</h3>
    ${row(t("export_data"), t("export_note"), `<button class="btn btn-ghost btn-sm" id="exp">${t("export_data")}</button>`)}
    ${row(`<span class="danger">${t("delete_account")}</span>`, t("delete_note"), `<button class="btn btn-bad btn-sm" id="del">${t("delete_account")}</button>`)}</section>` : "";

  const learning = `<section class="set-card"><h3>${t("sec_learning")}</h3>
    ${row(t("unlock_all"), t("unlock_all_note"), toggle("s-unlock", S.unlockAll))}
    ${!ready ? row(t("reset_progress"), t("reset_note"), `<button class="btn btn-ghost btn-sm" id="s-reset">${t("reset_progress")}</button>`) : ""}</section>`;

  const out = ready ? `<div class="set-foot"><button class="btn btn-ghost" id="so">${t("sign_out")}</button></div>` : "";
  view.innerHTML = `<div class="topbar"><h1>${t("settings_title")}</h1></div><div class="settings">${B && B.demo ? `<div class="banner demo">${t("demo_banner")}</div>` : ""}${guestBanner}${profile}${prefs}${notif}${security}${learning}${out}</div>`;
  const root = view;

  /* preferences */
  $$("#s-theme button", root).forEach(b => (b.onclick = async () => { const v = b.dataset.v; App.S.theme = v === "system" ? null : v; App.save(); App.applyTheme(); if (ready) await save({ theme: v }, { quiet: true }); $$("#s-theme button", root).forEach(x => x.classList.toggle("on", x === b)); }));
  $("#s-goal", root).onchange = async e => { const n = +e.target.value; App.setGoal(n); if (ready) await save({ daily_goal: n }); else toast(t("saved")); };
  const flip = (id, fn) => { const el = $(id, root); if (!el) return; el.onclick = async () => { const on = el.getAttribute("aria-checked") !== "true"; el.setAttribute("aria-checked", on); await fn(on); }; };
  flip("#s-lb", on => save({ show_on_leaderboard: on }));
  flip("#s-unlock", on => { App.S.unlockAll = on; App.save(); });
  const rs = $("#s-reset", root); if (rs) rs.onclick = () => modal({ title: t("reset_confirm"), text: t("cant_undo"), actions: [{ label: t("cancel") }, { label: t("reset_progress"), cls: "btn-bad", onClick: () => { App.clearGuestProgress(); toast(t("progress_reset")); } }] });
  if (!ready) return;

  /* profile */
  $$("#presets button", root).forEach(b => (b.onclick = async () => { if (await save({ avatar: "preset:" + b.dataset.n })) renderSettings(); }));
  $("#up-btn", root).onclick = () => $("#up-file", root).click();
  $("#up-file", root).onchange = async e => {
    const file = e.target.files[0]; e.target.value = ""; if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) return toast(t("photo_err"));
    try {
      const blob = await resizeAvatar(file);
      const u = await B.uploadAvatar(blob); if (u.error) return toast(errText(u.error));
      if (await save({ avatar: "upload", avatar_version: (p.avatar_version || 0) + 1 })) renderSettings();
    } catch { toast(t("photo_err")); }
  };
  const rm = $("#rm-btn", root); if (rm) rm.onclick = async () => { await B.removeAvatar(); if (await save({ avatar: "preset:1", avatar_version: (p.avatar_version || 0) + 1 })) renderSettings(); };
  const dn = $("#s-dn", root); dn.onchange = () => save({ display_name: dn.value.trim() || null });
  const un = $("#s-un", root), uS = usernameChecker(un, $("#s-un-s", root), p.username);
  un.onchange = async () => { const v = un.value.trim(); if (v === p.username) return; if (!uS.ok) { un.value = p.username; return; } if (await save({ username: v, username_set: true })) renderSettings(); else { un.value = p.username; } };

  /* notifications */
  const syncOpts = () => { $("#rem-opts", root).hidden = !(Account.profile.reminders_enabled || Account.profile.email_notifications); };
  flip("#s-rem", async on => { await save({ reminders_enabled: on, timezone: $("#s-tz", root)?.value || tzNow }); syncOpts(); });
  flip("#s-dig", async on => { await save({ email_notifications: on, timezone: $("#s-tz", root)?.value || tzNow }); syncOpts(); });
  $("#s-time", root).onchange = e => { if (e.target.value) save({ reminder_time: e.target.value }); };
  $("#s-tz", root).onchange = e => save({ timezone: e.target.value });

  /* security */
  const pwForm = $("#pw-form", root); $("#pw-btn", root).onclick = () => { pwForm.hidden = !pwForm.hidden; if (!pwForm.hidden) $("#npw", root).focus(); };
  bindPwToggles(pwForm);
  $("#npw", root).oninput = e => { $("#npw-s", root).innerHTML = strengthHtml(e.target.value, { email: Account.user.email, username: p.username }); };
  $("#npw-go", root).onclick = async () => {
    const e = $("#npw-e", root), v = $("#npw", root).value, c = checkPassword(v, { email: Account.user.email, username: p.username });
    if (!c.ok) { e.textContent = t(c.issues[0]); e.className = "err show"; return; }
    const r = await B.updatePassword(v); if (r.error) { e.textContent = errText(r.error); e.className = "err show"; return; }
    e.textContent = ""; $("#npw", root).value = ""; pwForm.hidden = true; toast(t("pw_updated"));
  };
  $("#so-all", root).onclick = async () => { await B.signOut("global"); };
  $("#so", root).onclick = async () => { await B.signOut(); };
  $("#exp", root).onclick = async () => {
    const r = await B.exportData(); if (r.error) return toast(errText(r.error));
    const url = URL.createObjectURL(new Blob([JSON.stringify(r.data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "codestep-data.json"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  $("#del", root).onclick = () => {
    const close = modal({ title: t("delete_confirm_title"), text: t("delete_confirm_text", { u: p.username }), keep: true, html: `<div class="field"><input class="input" id="dc" autocomplete="off" spellcheck="false"></div>`,
      actions: [{ label: t("cancel") }, { label: t("delete_account"), cls: "btn-bad", keep: true, onClick: async () => {
        if ($("#dc").value.trim() !== p.username) return;
        const r = await B.deleteAccount(); if (r.error) return toast(errText(r.error));
        close(); toast(t("deleted_toast")); } }] });
  };
}

async function resizeAvatar(file) {
  const bmp = await createImageBitmap(file), size = 256, c = document.createElement("canvas"); c.width = c.height = size;
  const s = Math.min(bmp.width, bmp.height), sx = (bmp.width - s) / 2, sy = (bmp.height - s) / 2;
  const ctx = c.getContext("2d"); ctx.drawImage(bmp, sx, sy, s, s, 0, 0, size, size);       // re-encoding drops EXIF / GPS metadata
  let blob = await new Promise(r => c.toBlob(r, "image/webp", 0.85));
  if (!blob || blob.type !== "image/webp") blob = await new Promise(r => c.toBlob(r, "image/jpeg", 0.85));
  if (!blob || blob.size > 500 * 1024) throw new Error("too big");
  return blob;
}

/* ------------------------------------------------------------ leaderboard */
let lbPeriod = "week";
function resetsIn() {
  const d = new Date(), dow = (d.getUTCDay() + 6) % 7, next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + (7 - dow));
  const ms = next - d.getTime(), days = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
  return days ? `${days}d ${h}h` : `${h}h ${m}m`;
}
async function renderLeaderboard() {
  document.title = t("lb_title") + " · Codestep";
  const head = `<div class="topbar"><h1>${t("lb_title")}</h1></div>`;
  if (!enabled || Account.phase !== "ready") {
    view.innerHTML = `${head}<div class="lb-wrap"><div class="empty-card">${mascot("think", 96)}<h2>${t("lb_signin_title")}</h2><p>${enabled ? t("lb_signin_text") : t("not_configured")}</p>${enabled ? `<div class="btns"><a class="btn btn-primary" href="#/auth/signup">${t("create_account")}</a><a class="btn btn-ghost" href="#/auth/signin">${t("sign_in")}</a></div>` : ""}</div></div>`;
    return;
  }
  view.innerHTML = `${head}<div class="lb-wrap"><div class="lb-head"><div class="seg" id="lb-tabs">${[["week", "lb_week"], ["all", "lb_all"]].map(([v, k]) => `<button data-v="${v}" class="${v === lbPeriod ? "on" : ""}">${t(k)}</button>`).join("")}</div><span class="chip" id="lb-reset">${lbPeriod === "week" ? t("lb_resets", { t: resetsIn() }) : ""}</span></div><div id="lb-body"><div class="lb-skel">${"<i></i>".repeat(6)}</div></div></div>`;
  $$("#lb-tabs button", view).forEach(b => (b.onclick = () => { lbPeriod = b.dataset.v; renderLeaderboard(); }));
  const my = ++lbSeq;
  const r = await B.leaderboard(lbPeriod, 50); if (my !== lbSeq || !hasRoute("leaderboard")) return;
  const body = $("#lb-body", view); if (!body) return;
  if (r.error) { body.innerHTML = `<div class="empty-card"><p>${t("lb_error")}</p><button class="btn btn-ghost btn-sm" id="lb-retry">${t("retry")}</button></div>`; $("#lb-retry").onclick = renderLeaderboard; return; }
  const rows = r.data || [];
  if (!rows.length) { body.innerHTML = `<div class="empty-card">${mascot("cheer", 90)}<p>${t("lb_empty")}</p></div>`; return; }
  const medal = n => n <= 3 ? `<span class="rk m${n}">${n}</span>` : `<span class="rk">${n}</span>`;
  const meHidden = Account.profile && !Account.profile.show_on_leaderboard;
  body.innerHTML = `<ol class="lb-list">${rows.map((x, i) => `${i > 0 && x.rank - rows[i - 1].rank > 1 && x.is_me ? `<li class="lb-gap">⋯</li>` : ""}<li class="lb-row ${x.is_me ? "me" : ""} ${x.rank <= 3 ? "top" : ""}">${medal(x.rank)}${avatar({ avatar: x.avatar, avatar_version: x.avatar_version, user_id: x.user_id }, 42)}<span class="nm">${esc(x.username)}${x.is_me ? ` <em>${t("lb_you")}</em>` : ""}</span><span class="xp">${x.xp.toLocaleString()} <small>${t("xp")}</small></span></li>`).join("")}</ol>${meHidden ? `<p class="fine">${t("lb_hidden")}</p>` : ""}`;
}
let lbSeq = 0;

/* ------------------------------------------------------------ boot */
App.routes.auth = renderAuth;
App.routes.settings = renderSettings;
App.routes.leaderboard = renderLeaderboard;
paintChip();
if (["auth", "settings", "leaderboard"].includes(location.hash.split("/")[1])) App.refresh();   // initial route was rendered before these pages existed
if (enabled) {
  // strip OAuth / email-link query params once Supabase has consumed them
  addEventListener("load", () => { if (/[?&](code|error|error_description)=/.test(location.search)) setTimeout(() => history.replaceState(null, "", location.pathname + location.hash), 1500); });
  B.init(onAuth);
}
document.addEventListener("langchange", paintChip);
const origSet = App.setLanguage; App.setLanguage = (l, silent) => { origSet(l, silent); paintChip(); };
})();
