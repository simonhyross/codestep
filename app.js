(() => {
"use strict";

/* ============================================================ helpers */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? "⌘" : "Ctrl";
const t = (k, v) => I18N.t(k, v), tn = (k, n) => I18N.tn(k, n);

const ICON = {
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="16" height="16" style="fill:currentColor;stroke:none"><path d="M7 4.5v15a1 1 0 001.5.9l12-7.5a1 1 0 000-1.8l-12-7.5A1 1 0 007 4.5z"/></svg>',
};

const ICONS = {
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  hash: '<path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/>',
  branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="9" r="2"/><path d="M6 7v10M18 11c0 4-6 3-12 6"/>',
  repeat: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 014-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 01-4 4H4"/>',
  braces: '<path d="M8 3H7a2 2 0 00-2 2v4a2 2 0 01-2 2 2 2 0 012 2v4a2 2 0 002 2h1M16 3h1a2 2 0 012 2v4a2 2 0 002 2 2 2 0 00-2 2v4a2 2 0 01-2 2h-1"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  queue: '<rect x="3" y="8" width="5" height="8" rx="1"/><rect x="10" y="8" width="5" height="8" rx="1"/><path d="M18 12h3M20 10l2 2-2 2"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  tree: '<circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M12 7.5V12M12 12L6 16.5M12 12l6 4.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  bars: '<path d="M5 20V12M12 20V4M19 20v-6"/>',
  merge: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="6" cy="18" r="2"/><path d="M6 7v9M6 12c0-4 12-1 12 4"/>',
  refresh: '<path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  network: '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7.2 10.8l9.6-4.6M7.2 13.2l9.6 4.6"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
  scale: '<path d="M12 3v18M6 21h12M5 7h14"/><path d="M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-7 0-3-1.6-5-3.3-6.8-.5 1.4-1.3 2.2-2.4 2.6C13.5 7 12.4 4.6 10 2c-.2 3.2-1.8 5-3.4 6.8C5 10.4 5 12.7 5 15c0 4.2 3 7 7 7z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
};
const ico = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
const LESSON_ICON = { hello: "sparkle", numbers: "hash", decisions: "branch", loops: "repeat", functions: "braces", lists: "list", dicts: "key", comprehensions: "bolt", stacks: "layers", queues: "queue", linked: "link", hashing: "grid", trees: "tree", linear: "search", binary: "target", sorting: "bars", merge: "merge", recursion: "refresh", graphs: "network", bigo: "trend", spot: "timer", twosum: "scale", memo: "database", space: "chip" };
const DECO = [
  '<circle cx="72" cy="28" r="34"/><circle cx="26" cy="82" r="15"/>',
  '<path d="M40 0h14L14 100H0zM70 0h14L44 100H30zM100 0h14L74 100H60z"/>',
  Array.from({ length: 16 }, (_, i) => `<circle cx="${14 + (i % 4) * 24}" cy="${14 + Math.floor(i / 4) * 24}" r="4.5"/>`).join(""),
  '<path d="M100 14A56 56 0 0044 70h56z"/><circle cx="26" cy="30" r="13"/>',
  '<path d="M0 56l20-20 20 20 20-20 20 20 20-20v18l-20 20-20-20-20 20-20-20-20 20z"/>',
];

/* ============================================================ mascot: Pip the snake */
function pip(mood = "happy", size = 80, extra = "") {
  const ink = "#0b1b3a", Y = "#ffc931", B = "#2f6bff";
  const look = { happy: [0, 1], think: [3, -3], oops: [0, 2], cheer: [0, 0] }[mood] || [0, 1];
  const eye = cx => mood === "cheer"
    ? `<path d="M${cx - 9} 48 Q${cx} 36 ${cx + 9} 48" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>`
    : `<g class="eye"><ellipse cx="${cx}" cy="46" rx="10.5" ry="11.5" fill="#fff" stroke="${ink}" stroke-width="3"/><circle cx="${cx + look[0]}" cy="${46 + look[1]}" r="5.6" fill="${ink}"/><circle cx="${cx + look[0] + 2}" cy="${46 + look[1] - 2}" r="1.9" fill="#fff"/></g>`;
  const line = d => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  const mouth = {
    happy: line("M49 63 Q60 74 71 63") + `<path d="M60 71 v8 M60 79 l-3.5 4.5 M60 79 l3.5 4.5" fill="none" stroke="#ff5a5f" stroke-width="2.8" stroke-linecap="round"/>`,
    cheer: `<path d="M45 61 Q60 86 75 61 Z" fill="${ink}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="M52 72 Q60 80 68 72 Q60 67 52 72Z" fill="#ff5a5f"/>`,
    think: line("M52 68 Q61 64 70 69"),
    oops: line("M49 72 Q60 61 71 72"),
  }[mood] || "";
  const extras = {
    think: line("M33 30 L50 34") + line("M70 28 L87 24") + `<text x="97" y="20" font-size="24" font-weight="800" fill="${B}" font-family="Bricolage Grotesque,Figtree,sans-serif">?</text>`,
    oops: line("M35 36 L50 29") + line("M85 36 L70 29") + `<path d="M95 30 q7 10 0 15 q-7 -5 0 -15z" fill="#8dbbff" stroke="${ink}" stroke-width="2"/>`,
    cheer: `<path d="M16 22 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="${B}"/><path d="M102 24 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5 -5.5 -5.5 -2.5 5.5 -2.5z" fill="${B}"/>`,
  }[mood] || "";
  const tail = "M62 74 C62 104 100 94 98 114";
  return `<span class="pip pip-${mood} ${extra}" style="width:${size}px" aria-hidden="true"><svg viewBox="0 0 120 130">
    <ellipse cx="62" cy="126" rx="34" ry="4" fill="${ink}" opacity=".13"/>
    <path d="${tail}" fill="none" stroke="${ink}" stroke-width="37" stroke-linecap="round"/>
    <path d="${tail}" fill="none" stroke="${Y}" stroke-width="29" stroke-linecap="round"/>
    <circle cx="68" cy="96" r="4.2" fill="${B}"/><circle cx="84" cy="100" r="3.6" fill="${B}"/><circle cx="95" cy="108" r="3" fill="${B}"/>
    <ellipse cx="60" cy="49" rx="37" ry="33" fill="${Y}" stroke="${ink}" stroke-width="4"/>
    <ellipse cx="42" cy="27" rx="13" ry="5.5" fill="#fff" opacity=".55" transform="rotate(-24 42 27)"/>
    ${eye(44)}${eye(76)}
    <circle cx="32" cy="62" r="5.5" fill="#ff7a59" opacity=".5"/><circle cx="88" cy="62" r="5.5" fill="#ff7a59" opacity=".5"/>
    ${mouth}${extras}</svg></span>`;
}
const say = (kind, i) => { const a = I18N.list("say_" + kind); return a[(i * 7 + kind.length) % a.length]; };

/* ============================================================ state */
const KEY = "pythonic:v1";
const PROGRESS_KEYS = ["xp", "streak", "last", "daily", "done"];
const defaults = { xp: 0, streak: 0, last: null, daily: {}, done: {}, theme: null, lang: null, goal: 50, unlockAll: false, pg: null };
let S, signedIn = false, guestSaved = null;      // while signed in, progress mirrors the server and is never written to localStorage
try { S = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { S = { ...defaults }; }
const pickProgress = o => Object.fromEntries(PROGRESS_KEYS.map(k => [k, o[k]]));
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(signedIn ? { ...S, ...guestSaved } : S)); } catch {} };

const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const dayOffset = n => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
const currentStreak = () => (S.last === dayKey() || S.last === dayKey(dayOffset(-1))) ? S.streak : 0;
function touchStreak() {
  const today = dayKey();
  if (S.last === today) return;
  S.streak = S.last === dayKey(dayOffset(-1)) ? S.streak + 1 : 1;
  S.last = today;
}
function award(n) {
  if (n > 0) { S.xp += n; S.daily[dayKey()] = (S.daily[dayKey()] || 0) + n; }
  touchStreak(); save();
}
const XP_PER_LEVEL = 100;
const level = () => 1 + Math.floor(S.xp / XP_PER_LEVEL);
const levelName = () => { const a = I18N.list("level_names"); return a[Math.min(level() - 1, a.length - 1)]; };
const goal = () => S.goal || 50;

/* ---- account bridge: swap between guest progress (localStorage) and server progress ---- */
function applyServerProgress(p) {
  S.xp = p.xp; S.streak = p.streak; S.daily = p.daily || {};
  S.done = Object.fromEntries((p.done || []).map(id => [id, true]));
  S.last = p.streak > 0 ? (p.today_xp > 0 ? dayKey() : dayKey(dayOffset(-1))) : null;
}
function enterAccount() { if (!signedIn) { guestSaved = structuredClone(pickProgress(S)); signedIn = true; } }
function leaveAccount() { if (signedIn) { Object.assign(S, structuredClone(guestSaved)); signedIn = false; guestSaved = null; } }
const guestDoneLessons = () => Object.keys((signedIn ? guestSaved : S).done || {});
function clearGuestProgress() { const fresh = pickProgress(structuredClone(defaults)); if (signedIn) guestSaved = fresh; else Object.assign(S, fresh); save(); }
const hooks = { step: null };

const FLAT = [];
UNITS.forEach(u => u.lessons.forEach(l => FLAT.push({ unit: u, lesson: l, i: FLAT.length })));
const lessonById = id => FLAT.find(x => x.lesson.id === id);
const isUnlocked = i => S.unlockAll || i === 0 || !!S.done[FLAT[i - 1].lesson.id];
const currentLesson = () => FLAT.find(x => !S.done[x.lesson.id]);
const lessonXp = l => l.steps.reduce((a, s) => a + (s.type === "quiz" ? 5 : s.type === "code" ? 15 : 0), 20);

/* ============================================================ theme */
function applyTheme() {
  const th = (S.theme && S.theme !== "system") ? S.theme : (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.dataset.theme = th;
  $("#btn-theme").innerHTML = th === "dark" ? ICON.sun : ICON.moon;
}

/* ============================================================ python runtime (web worker) */
const Py = (() => {
  const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
  const workerSrc = `
    let ready;
    importScripts(${JSON.stringify(PYODIDE)});
    ready = (async () => {
      const py = await loadPyodide();
      py.runPython(${JSON.stringify(window.PY_RUNTIME)});
      self.__run = py.globals.get("run_code");
      self.__lint = py.globals.get("lint");
      postMessage({ type: "ready" });
    })().catch(e => postMessage({ type: "fatal", error: String(e) }));
    onmessage = async (e) => {
      const m = e.data;
      await ready;
      try {
        const result = m.kind === "run"
          ? JSON.parse(self.__run(m.code, m.tests ?? null, !!m.profile))
          : JSON.parse(self.__lint(m.code));
        postMessage({ id: m.id, result });
      } catch (err) { postMessage({ id: m.id, result: { fatal: String(err) } }); }
    };`;
  let worker, readyP, readyRes, status = "loading", seq = 0;
  const pending = new Map();
  const listeners = new Set();
  const setStatus = (s, info) => { status = s; listeners.forEach(f => f(s, info)); };

  function start() {
    setStatus("loading");
    readyP = new Promise(r => (readyRes = r));
    worker = new Worker(URL.createObjectURL(new Blob([workerSrc], { type: "text/javascript" })));
    worker.onmessage = e => {
      const m = e.data;
      if (m.type === "ready") { setStatus("ready"); readyRes(); }
      else if (m.type === "fatal") setStatus("error", m.error);
      else {
        const p = pending.get(m.id);
        if (p) { pending.delete(m.id); clearTimeout(p.timer); p.resolve(m.result); }
      }
    };
    worker.onerror = e => setStatus("error", e.message || "Worker failed to start");
  }
  function restart() {
    worker.terminate();
    pending.forEach(p => { clearTimeout(p.timer); p.resolve({ cancelled: true }); });
    pending.clear();
    start();
  }
  function call(msg, timeout = 0) {
    return new Promise(resolve => {
      const id = ++seq, p = { resolve };
      pending.set(id, p);
      readyP.then(() => {
        if (!pending.has(id)) return;
        worker.postMessage({ ...msg, id });
        if (timeout) p.timer = setTimeout(() => { pending.delete(id); restart(); resolve({ timeout: true }); }, timeout);
      });
    });
  }
  start();
  return {
    get status() { return status; },
    onStatus(f) { listeners.add(f); f(status); return () => listeners.delete(f); },
    run: (code, { tests = null, profile = false, timeout = 8000 } = {}) => call({ kind: "run", code, tests, profile }, timeout),
    lint: code => call({ kind: "lint", code }),
  };
})();

const paintRuntime = () => Py.onStatus(s => {
  const el = $("#runtime");
  el.className = "runtime " + (s === "ready" ? "ready" : s === "error" ? "error" : "");
  $("span", el).textContent = s === "ready" ? t("py_ready") : s === "error" ? t("py_failed") : t("py_loading");
  if (s === "error") el.title = t("py_failed_tip");
});
let offRuntime = paintRuntime();

/* ============================================================ ui bits */
function toast(msg) {
  const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
}
function modal({ title, text = "", html = "", actions = [] }) {
  const root = $("#modal-root");
  root.innerHTML = `<div class="modal-back"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ""}${html}<div class="modal-actions"></div></div></div>`;
  const close = () => (root.innerHTML = "");
  const bar = $(".modal-actions", root);
  actions.forEach(a => {
    const b = document.createElement("button"); b.className = "btn " + (a.cls || "btn-ghost"); b.textContent = a.label;
    b.onclick = () => { if (a.onClick) a.onClick(close); if (!a.keep) close(); };
    bar.appendChild(b);
  });
  $(".modal-back", root).addEventListener("mousedown", e => { if (e.target.classList.contains("modal-back")) close(); });
  return close;
}
function confetti() {
  const colors = ["#2f6bff", "#ffc931", "#8dbbff", "#0b1b3a", "#ff9f1c", "#4f86ff"];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement("i"); c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw"; c.style.background = colors[i % colors.length];
    c.style.setProperty("--x", (Math.random() * 200 - 100) + "px"); c.style.setProperty("--r", (Math.random() * 900 - 450) + "deg");
    c.style.animationDuration = 1.8 + Math.random() * 1.8 + "s"; c.style.animationDelay = Math.random() * .5 + "s";
    c.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
    document.body.appendChild(c); setTimeout(() => c.remove(), 4500);
  }
}
function highlight(root) {
  $$("pre code", root).forEach(el => {
    const text = el.textContent;
    if (/^[\s\d/\\|_-]+$/.test(text)) return;
    el.textContent = ""; CodeMirror.runMode(text, "python", el);
  });
  $$(".codeblock[data-code]", root).forEach(el => { const t = el.dataset.code; el.textContent = ""; CodeMirror.runMode(t, "python", el); });
}
const fmtMs = ms => ms < 1 ? `${(ms * 1000).toFixed(0)} µs` : ms < 1000 ? `${ms.toFixed(ms < 10 ? 2 : 1)} ms` : `${(ms / 1000).toFixed(2)} s`;
const fmtKb = kb => kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;

/* ============================================================ editor + console */
function makeEditor(parent, { value = "", onRun, onChange, onProblems, onCursor }) {
  const run = () => { onRun && onRun(); return false; };
  const cm = CodeMirror(parent, {
    value, mode: "python", theme: "pl", lineNumbers: true, indentUnit: 4, tabSize: 4, indentWithTabs: false,
    matchBrackets: true, autoCloseBrackets: true, styleActiveLine: true, lineWrapping: false,
    gutters: ["CodeMirror-lint-markers"],
    extraKeys: {
      Tab: c => (c.somethingSelected() ? c.indentSelected("add") : c.replaceSelection("    ", "end")),
      "Shift-Tab": c => c.indentSelected("subtract"),
      "Cmd-Enter": run, "Ctrl-Enter": run,
    },
    lint: {
      async: true, delay: 500,
      getAnnotations(text, cb, _o, ed) {
        Py.lint(text).then(r => {
          const issues = Array.isArray(r) ? r : [];
          onProblems && onProblems(issues);
          cb(issues.map(i => {
            const ln = Math.max(0, i.line - 1), t = ed.getLine(ln) || "";
            let col = Math.min(i.col, Math.max(t.length - 1, 0));
            const m = /^\w+/.exec(t.slice(col));
            const end = Math.min(t.length, col + (m ? m[0].length : 1));
            return { from: CodeMirror.Pos(ln, col), to: CodeMirror.Pos(ln, Math.max(end, col + 1)), message: `${i.message}  (${i.rule})`, severity: i.severity === "info" ? "info" : i.severity };
          }));
        });
      },
    },
  });
  cm.on("change", () => onChange && onChange(cm.getValue()));
  cm.on("cursorActivity", () => onCursor && onCursor(cm.getCursor()));
  setTimeout(() => cm.refresh(), 0);
  return cm;
}

function makeConsole(onJump) {
  const el = document.createElement("div");
  el.className = "ide-console";
  el.innerHTML = `<div class="tabs"><button class="tab on" data-t="out">${t("output")}</button><button class="tab" data-t="prob">${t("problems")} <span class="n ok">✓</span></button><span class="sp"></span><div class="prof"></div></div><div class="pane"></div>`;
  const pane = $(".pane", el), badge = $(".tab .n", el);
  let tab = "out", out = { kind: "idle" }, probs = [];

  function renderOut() {
    if (out.kind === "idle") return `<div class="empty">${pip("think", 52)}<span>${t("press_run", { b: "<b>" + esc(t("run")) + "</b>", k: MOD })}</span></div>`;
    if (out.kind === "running") return `<div class="running"><span class="spin"></span>${Py.status === "ready" ? t("running") : t("warming")}</div>`;
    const r = out.r;
    if (r.timeout) return `<div class="errbox"><b>${t("stopped")}</b>: ${t("stopped_text", { n: r.limit || 8 })}<div class="h">${t("stopped_hint")}</div></div>`;
    let html = r.out ? `<pre>${esc(r.out)}</pre>` : (r.error ? "" : `<span class="dim">${t("no_output")}</span>`);
    if (r.error) {
      const e = r.error;
      html += `<div class="errbox"><b>${esc(e.type)}</b>: ${esc(e.msg)}${e.line ? ` <a data-line="${e.line}">${t("line_n", { n: e.line })}</a>` : ""}${e.hint ? `<div class="h">${esc(e.hint)}</div>` : ""}</div>`;
    }
    return html;
  }
  function renderProbs() {
    if (!probs.length) return `<div class="clean">✓ ${t("clean_code")}</div>`;
    return probs.map(p => `<div class="prob" data-line="${p.line}" data-col="${p.col}"><span class="sev ${p.severity}"></span><span class="loc">Ln ${p.line}</span><span>${esc(p.message)}</span><span class="rule">${p.rule}</span></div>`).join("");
  }
  function render() {
    $$(".tab", el).forEach(t => t.classList.toggle("on", t.dataset.t === tab));
    const e = probs.filter(p => p.severity === "error").length;
    badge.className = "n " + (e ? "err" : probs.length ? "warn" : "ok"); badge.textContent = probs.length || "✓";
    const keep = pane.scrollTop;
    pane.innerHTML = tab === "out" ? renderOut() : renderProbs();
    pane.scrollTop = keep;
    const prof = $(".prof", el);
    prof.innerHTML = out.r && out.r.profile ? `<span>${ico("timer")} ${fmtMs(out.r.profile.ms)}</span><span>${ico("chip")} ${t("peak", { m: fmtKb(out.r.profile.peak_kb) })}</span>` : "";
  }
  el.addEventListener("click", e => {
    const t = e.target.closest(".tab"); if (t) { tab = t.dataset.t; render(); return; }
    const j = e.target.closest("[data-line]"); if (j) onJump(+j.dataset.line, +(j.dataset.col || 0));
  });
  render();
  return {
    el,
    running() { out = { kind: "running" }; tab = "out"; render(); },
    result(r) { out = { kind: "res", r }; tab = "out"; render(); },
    problems(list) { probs = list; render(); },
    showTab(t) { tab = t; render(); },
    get problemList() { return probs; },
  };
}
function jumpTo(cm) { return (line, col) => { cm.focus(); cm.setCursor(line - 1, col); cm.scrollIntoView({ line: line - 1, ch: 0 }, 80); }; }
function normalizeRun(r) {
  if (r.fatal) return { out: "", error: { type: "InternalError", msg: r.fatal } };
  if (r.timeout) return { ...r, limit: 8 };
  return r;
}

/* ============================================================ big-O widget */
function bigoWidget(el) {
  const W = 640, H = 300, P = { l: 38, b: 26, t: 12, r: 14 }, N = 20, YMAX = 120;
  const fns = [
    ["O(1)", () => 1, "#8dbbff"], ["O(log n)", n => Math.log2(n), "#4f86ff"], ["O(n)", n => n, "#2f6bff"],
    ["O(n log n)", n => n * Math.log2(n), "#ffc931"], ["O(n²)", n => n * n, "#ff8a1f"], ["O(2ⁿ)", n => 2 ** n, "#e03a45"],
  ];
  const X = n => P.l + (n - 1) / (N - 1) * (W - P.l - P.r);
  const Y = v => H - P.b - Math.min(v, YMAX) / YMAX * (H - P.t - P.b);
  const paths = fns.map(([, f, c]) => {
    let d = "";
    for (let n = 1; n <= N + 1e-9; n += .25) { const v = f(n); d += (d ? "L" : "M") + X(n).toFixed(1) + " " + Y(v).toFixed(1); if (v > YMAX) break; }
    return `<path d="${d}" stroke="${c}" fill="none"/>`;
  }).join("");
  const grid = [0, 30, 60, 90, 120].map(v => `<line class="axis" x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${P.l - 8}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`).join("");
  el.className = "bigo";
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Growth of common complexities"><g>${grid}</g>${paths}<g id="bo-mark"></g><text x="${W / 2}" y="${H - 6}" text-anchor="middle">input size n →   (operations ↑)</text></svg>
    <div class="bigo-ctl"><span>n =</span><input type="range" min="1" max="${N}" value="8" aria-label="Input size n"><output>8</output></div><div class="bigo-leg"></div>`;
  const input = $("input", el), out = $("output", el), mark = $("#bo-mark", el), leg = $(".bigo-leg", el);
  const upd = () => {
    const n = +input.value; out.textContent = n;
    mark.innerHTML = `<line class="axis" x1="${X(n)}" x2="${X(n)}" y1="${P.t}" y2="${H - P.b}" stroke-dasharray="4 4"/>` +
      fns.map(([, f, c]) => `<circle cx="${X(n)}" cy="${Y(f(n))}" r="4.5" fill="${c}" stroke="none"/>`).join("");
    leg.innerHTML = fns.map(([l, f, c]) => `<div><i style="background:${c}"></i>${l}<b>${Math.round(f(n)).toLocaleString()}</b></div>`).join("");
  };
  input.addEventListener("input", upd); upd();
}
const initWidgets = root => $$("[data-widget=bigo]", root).forEach(bigoWidget);

/* ============================================================ learn view */
let openNode = null;
const view = $("#view");
const stats = () => `<div class="stat fire" title="${esc(t("streak"))}">${ico("flame", "fill")}<b>${currentStreak()}</b></div><div class="stat xp" title="${esc(t("total_xp"))}">${ico("bolt", "fill")}<b>${S.xp}</b></div><div class="stat lvl" title="${levelName()}">${ico("star", "fill")}<b>${level()}</b></div>`;

function renderLearn() {
  const cur = currentLesson();
  const dx = [0, 46, 74, 46, 0, -46, -74, -46];
  const units = UNITS.map(u => {
    const done = u.lessons.filter(l => S.done[l.id]).length;
    const nodes = u.lessons.map((l, k) => {
      const f = lessonById(l.id);
      const state = S.done[l.id] ? "done" : !isUnlocked(f.i) ? "locked" : (cur && cur.lesson.id === l.id ? "current" : "open");
      const pop = openNode === l.id ? popover(f, state) : "";
      return `<div class="node-row"><div class="node-wrap" style="--dx:${dx[k % 8]}px">
        ${state === "current" && openNode !== l.id ? `<span class="start-tag">${t("start")}</span>` : ""}
        <button class="node ${state}" data-node="${l.id}" aria-label="${esc(l.title)} (${state})">${ico(state === "locked" ? "lock" : LESSON_ICON[l.id] || "sparkle")}${state === "done" ? `<span class="badge">${ico("check")}</span>` : ""}</button>
        <span class="node-label">${esc(l.title)}</span></div>${pop}</div>`;
    }).join("");
    return `<section class="unit u-${u.color}"><div class="unit-banner"><svg class="deco" viewBox="0 0 100 100" aria-hidden="true">${DECO[UNITS.indexOf(u) % DECO.length]}</svg><small>${t("unit_n", { n: UNITS.indexOf(u) + 1 })}</small><h2>${esc(u.title)}</h2><p>${esc(u.desc)}</p><div class="bar"><i style="width:${done / u.lessons.length * 100}%"></i></div></div><div class="nodes">${nodes}</div></section>`;
  }).join("");

  const today = S.daily[dayKey()] || 0, pct = Math.min(1, today / goal()), C = 2 * Math.PI * 35;
  const lv = (S.xp % XP_PER_LEVEL);
  const week = Array.from({ length: 7 }, (_, i) => { const d = dayOffset(i - 6); return { l: [...t("weekdays")][d.getDay()], on: (S.daily[dayKey(d)] || 0) > 0, today: i === 6 }; });
  const doneCount = FLAT.filter(x => S.done[x.lesson.id]).length;
  const sk = currentStreak();
  const greeting = `<div class="card pipcard">${pip(sk ? "happy" : "think", 74)}<p><strong>${window.Account && Account.name() ? t("pip_welcome", { name: esc(Account.name()) }) : sk ? t("pip_streak", { n: sk }) : t("pip_hi")}</strong>${sk ? t("pip_more") : window.Account && Account.name() ? t("pip_ready") : t("pip_guide")}</p></div>`;
  const rail = `${greeting}
    <div class="card"><h3>${t("daily_goal")}</h3><div class="goal">
      <div class="ring"><svg viewBox="0 0 84 84"><circle class="trk" cx="42" cy="42" r="35" fill="none"/><circle class="val" cx="42" cy="42" r="35" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg><b>${pct >= 1 ? "✓" : today}</b></div>
      <p><strong>${pct >= 1 ? t("goal_reached") : t("xp_to_go", { n: goal() - today })}</strong>${t("goal_text", { n: goal() })}</p></div></div>
    <div class="card"><h3>${t("level")}</h3><div class="lvl-top"><b>${t("level_line", { n: level(), name: levelName() })}</b><span>${lv}/${XP_PER_LEVEL} XP</span></div><div class="lvl-bar"><i style="width:${lv}%"></i></div><span class="chip">${t("lessons_done", { done: doneCount, total: FLAT.length })}</span></div>
    <div class="card"><h3>${t("this_week")}</h3><div class="week">${week.map(d => `<div class="${d.on ? "on" : ""} ${d.today ? "today" : ""}"><i>${d.on ? ico("flame", "fill") : ""}</i>${d.l}</div>`).join("")}</div></div>`;
  view.innerHTML = `<div class="topbar"><h1>${t("path_title")}</h1>${stats()}</div><div class="learn"><div class="path"><div class="greet">${greeting}</div>${units}</div><aside class="rail">${rail}</aside></div>`;
}
function popover(f, state) {
  const l = f.lesson, mins = Math.max(3, Math.round(l.steps.length * 1.2));
  const meta = `<div class="meta"><span class="chip">${t("n_steps", { n: l.steps.length })}</span><span class="chip">${t("n_min", { n: mins })}</span><span class="chip">+${lessonXp(l)} XP</span></div>`;
  if (state === "locked") return `<div class="node-pop"><h3>${esc(l.title)}</h3><p>${t("unlock_msg", { title: esc(FLAT[f.i - 1].lesson.title) })}</p></div>`;
  return `<div class="node-pop"><h3>${esc(l.title)}</h3><p>${esc(l.blurb)}</p>${meta}<button class="btn btn-primary btn-block" data-start="${l.id}">${state === "done" ? t("practice_again") : t("start_lesson")}</button></div>`;
}
view.addEventListener("click", e => {
  const st = e.target.closest("[data-start]"); if (st) { location.hash = "#/lesson/" + st.dataset.start; return; }
  const nd = e.target.closest("[data-node]");
  if (nd) { const id = nd.dataset.node; openNode = openNode === id ? null : id; renderLearn(); }
});

/* ============================================================ playground */
function renderPlayground() {
  const initial = S.pg ?? EXAMPLES[0].code;
  view.innerHTML = `<div class="pg">
    <div class="pg-tools"><h1>${t("playground")} <small>Python 3.12</small></h1>
      <select class="select" id="pg-ex" aria-label="${esc(t("examples"))}"><option value="">${t("examples")}</option>${EXAMPLES.map((e, i) => `<option value="${i}">${esc(e.name)}</option>`).join("")}</select>
      <button class="btn btn-ghost btn-sm" id="pg-copy">${t("copy")}</button>
      <button class="btn btn-ghost btn-sm" id="pg-clear">${t("clear")}</button>
      <button class="btn btn-ghost btn-sm" id="pg-prof" title="${esc(t("run_profile_tip"))}">${ico("timer")} ${t("run_profile")}</button>
      <button class="btn btn-primary btn-sm" id="pg-run">${ICON.play} ${t("run")} <span class="kbd">${MOD}↵</span></button></div>
    <div class="pg-grid"><div class="ide"><div class="ide-bar"><div class="dots"><i></i><i></i><i></i></div><span>main.py</span><span class="sp"></span></div><div class="ide-ed"></div>
      <div class="statusline"><span class="pill ok" id="pg-pill">✓ ${t("no_problems")}</span><span id="pg-pos">${t("ln_col", { l: 1, c: 1 })}</span><span style="margin-left:auto">UTF-8 · Spaces: 4</span></div></div>
      <div class="pg-out"></div></div></div>`;
  const cons = makeConsole((l, c) => jumpTo(cm)(l, c));
  $(".pg-out", view).appendChild(cons.el);
  let busy = false;
  async function run(profile) {
    if (busy) return; busy = true; cons.running();
    const r = await Py.run(cm.getValue(), { profile, timeout: 10000 });
    busy = false;
    if (r.cancelled) return;
    const n = normalizeRun(r); if (n.timeout) n.limit = 10;
    cons.result(n);
  }
  const cm = makeEditor($(".ide-ed", view), {
    value: initial, onRun: () => run(false),
    onChange: v => { S.pg = v; save(); },
    onCursor: c => { $("#pg-pos").textContent = t("ln_col", { l: c.line + 1, c: c.ch + 1 }); },
    onProblems: list => {
      cons.problems(list);
      const e = list.filter(p => p.severity === "error").length, w = list.length - e;
      const pill = $("#pg-pill"); if (!pill) return;
      pill.className = "pill " + (e ? "err" : list.length ? "warn" : "ok");
      pill.textContent = !list.length ? "✓ " + t("no_problems") : `${e ? "● " + tn("n_errors", e) : ""}${e && w ? ", " : ""}${w ? "▲ " + tn("n_sugg", w) : ""}`;
    },
  });
  $("#pg-pill").onclick = () => cons.showTab("prob");
  $("#pg-run").onclick = () => run(false);
  $("#pg-prof").onclick = () => run(true);
  $("#pg-clear").onclick = () => { cm.setValue(""); cm.focus(); };
  $("#pg-copy").onclick = () => navigator.clipboard.writeText(cm.getValue()).then(() => toast(t("copied")), () => toast(t("copy_fail")));
  $("#pg-ex").onchange = e => { if (e.target.value === "") return; cm.setValue(EXAMPLES[+e.target.value].code); e.target.value = ""; cm.focus(); };
}

/* ============================================================ lesson runner */
const lroot = $("#lesson-root");
let L = null; // active lesson state

function openLesson(id) {
  const f = lessonById(id);
  if (!f || !isUnlocked(f.i)) { location.hash = "#/learn"; return; }
  L = { f, lesson: f.lesson, i: 0, replay: !!S.done[id], xp: 0, graded: 0, first: 0, token: 0 };
  $("#shell").hidden = true; lroot.hidden = false;
  lroot.innerHTML = `<header class="l-top"><button class="l-close" aria-label="${esc(t("quit"))}">${ICON.x}</button><div class="l-progress"></div><div class="stat xp" id="l-xp">${ico("bolt", "fill")}<b>0</b></div></header><section class="l-body" id="l-body"></section><footer class="l-foot" id="l-foot"><div class="l-foot-in"></div></footer>`;
  $(".l-close", lroot).onclick = () => {
    if (L.i === 0 && !L.xp) return (location.hash = "#/learn");
    modal({ title: t("quit_title"), text: t("quit_text"), actions: [{ label: t("keep_going"), cls: "btn-primary" }, { label: t("quit"), cls: "btn-ghost", onClick: () => (location.hash = "#/learn") }] });
  };
  renderStep();
}
function closeLesson() { L = null; lroot.hidden = true; lroot.innerHTML = ""; $("#shell").hidden = false; }

function progressBar() {
  $(".l-progress", lroot).innerHTML = L.lesson.steps.map((_, k) => `<i class="${k < L.i ? "done" : k === L.i ? "cur" : ""}"></i>`).join("");
}
const foot = html => { const f = $("#l-foot"); f.className = "l-foot"; $(".l-foot-in", f).innerHTML = html; return f; };
function setFoot(kind, inner) { const f = $("#l-foot"); f.className = "l-foot " + (kind || ""); $(".l-foot-in", f).innerHTML = inner; }
function gain(n) {
  if (L.replay) n = 0;
  L.xp += n; if (n) { award(n); hooks.step && hooks.step(`${L.lesson.id}:${L.i}`, n); }
  const x = $("#l-xp"); if (x) { $("b", x).textContent = L.xp; x.classList.remove("bump"); void x.offsetWidth; x.classList.add("bump"); }
  return n;
}
function next() { L.i++; renderStep(); }

function renderStep() {
  const step = L.lesson.steps[L.i];
  if (!step) return renderFinish();
  progressBar();
  const body = $("#l-body"); body.scrollTop = 0;
  ({ learn: renderLearnStep, quiz: renderQuiz, code: renderCodeStep })[step.type](step, body);
}

function renderLearnStep(step, body) {
  body.innerHTML = `<div class="l-wrap"><div class="learn-card"><div class="kicker">${esc(L.lesson.title)}</div><h2>${esc(step.title)}</h2><div class="pipsay">${pip("happy", 64)}<div class="bubble">${say("learn", L.i)}</div></div><div class="prose">${step.html}</div></div></div>`;
  highlight(body); initWidgets(body);
  foot(`<span class="kbd-hint">${t("to_continue", { k: `<kbd>${MOD} ↵</kbd>` })}</span><span class="grow"></span><button class="btn btn-primary" id="go">${t("cont")} <span class="kbd">${MOD}↵</span></button>`);
  $("#go").onclick = next;
}

function renderQuiz(step, body) {
  const order = step.options.map((_, i) => i).sort(() => Math.random() - .5);
  let sel = null, tries = 0, locked = false;
  body.innerHTML = `<div class="l-wrap quiz"><div class="kicker">${t("quick_check")}</div><div class="pipsay">${pip("think", 64)}<div class="bubble">${say("quiz", L.i)}</div></div><h2>${esc(step.q)}</h2>${step.code ? `<pre class="codeblock" data-code="${esc(step.code)}"></pre>` : ""}<div class="opts" role="listbox">${order.map((o, k) => `<button class="opt" data-o="${o}"><span class="k">${k + 1}</span><span class="${/[\[\]\(\)\{\}=*%\/]|^[\d,. ]+$/.test(step.options[o]) ? "t" : ""}">${esc(step.options[o])}</span></button>`).join("")}</div><div class="kbd-hint">${t("press_choose", { a: "<kbd>1</kbd>", b: `<kbd>${order.length}</kbd>`, k: `<kbd>${MOD} ↵</kbd>` })}</div></div>`;
  highlight(body);
  const opts = $$(".opt", body);
  const idle = () => foot(`<span class="grow"></span><button class="btn btn-primary" id="chk" ${sel === null ? "disabled" : ""}>${t("check")} <span class="kbd">${MOD}↵</span></button>`) && ($("#chk").onclick = check);
  function choose(b) {
    if (locked) return;
    opts.forEach(o => o.classList.remove("sel")); b.classList.add("sel"); sel = +b.dataset.o; idle();
  }
  opts.forEach(b => (b.onclick = () => choose(b)));
  function check() {
    if (sel === null || locked) return;
    const ok = sel === step.answer, chosen = opts.find(o => +o.dataset.o === sel);
    L.graded += tries === 0 ? 1 : 0;
    if (ok) {
      locked = true; if (tries === 0) L.first++;
      chosen.classList.replace("sel", "right"); opts.forEach(o => (o.disabled = true));
      const g = gain(tries === 0 ? 5 : 2);
      setFoot("good", `<div class="fb"><span class="fb-pip">${pip("cheer", 58)}</span><div class="fb-text"><h4>${t("correct")}${g ? ` +${g} XP` : ""}</h4><p>${esc(step.explain)}</p></div></div><button class="btn btn-good" id="go">${t("cont")} <span class="kbd">${MOD}↵</span></button>`);
      $("#go").onclick = next; return;
    }
    tries++; chosen.classList.replace("sel", "wrong");
    const why = step.why && step.why[sel];
    if (tries >= 2) {
      locked = true; opts.forEach(o => { o.disabled = true; if (+o.dataset.o === step.answer) o.classList.add("right"); });
      setFoot("bad", `<div class="fb"><span class="fb-pip">${pip("oops", 58)}</span><div class="fb-text"><h4>${t("correct_answer", { a: esc(step.options[step.answer]) })}</h4><p>${why ? esc(why) + " " : ""}${esc(step.explain)}</p></div></div><button class="btn btn-bad" id="go">${t("cont")} <span class="kbd">${MOD}↵</span></button>`);
      $("#go").onclick = next; return;
    }
    locked = true; opts.forEach(o => (o.disabled = true));
    setFoot("bad", `<div class="fb"><span class="fb-pip">${pip("oops", 58)}</span><div class="fb-text"><h4>${t("not_quite")}</h4><p>${esc(why || t("look_again"))}</p></div></div><button class="btn btn-bad" id="again">${t("try_again")} <span class="kbd">${MOD}↵</span></button>`);
    $("#again").onclick = () => { locked = false; opts.forEach(o => { o.disabled = false; o.classList.remove("wrong", "sel"); }); sel = null; idle(); };
  }
  idle();
}

function renderCodeStep(step, body) {
  const token = ++L.token;
  let attempts = 0, hintUsed = false, shown = false, busy = false, graded = false, passed = false;
  body.innerHTML = `<div class="l-wrap wide"><div class="code-step">
    <div class="task"><div class="card"><div class="kicker">${t("challenge")}</div><h2>${esc(L.lesson.title)}</h2><div class="pipsay">${pip("happy", 54)}<div class="bubble">${say("code", L.i)}</div></div><div class="prose" style="margin-top:14px">${step.prompt}</div></div><div id="hintslot"></div></div>
    <div class="ide"><div class="ide-bar"><div class="dots"><i></i><i></i><i></i></div><span>solution.py</span><span class="sp"></span></div><div class="ide-ed"></div></div></div></div>`;
  highlight($(".task", body));
  const cons = makeConsole((l, c) => jumpTo(cm)(l, c));
  $(".ide", body).appendChild(cons.el);
  const cm = makeEditor($(".ide-ed", body), { value: step.starter, onRun: () => (passed ? next() : check()), onProblems: cons.problems });
  setTimeout(() => cm.focus(), 50);

  const controls = () => {
    foot(`<button class="btn btn-ghost btn-sm" id="hint">${ico("bulb")} ${t("hint")}</button><button class="btn btn-ghost btn-sm" id="reset">${t("reset")}</button><span class="grow"></span><button class="btn btn-ghost" id="run">${ICON.play} ${t("run")}</button><button class="btn btn-primary" id="chk">${t("check")} <span class="kbd">${MOD}↵</span></button>`);
    $("#hint").onclick = () => { hintUsed = true; $("#hintslot", body).innerHTML = `<div class="hintbox">${pip("think", 44)}<span><b>${t("hint_from")}</b> ${esc(step.hint)}</span></div>`; };
    $("#reset").onclick = () => { cm.setValue(step.starter); cm.focus(); };
    $("#run").onclick = () => exec(false);
    $("#chk").onclick = () => check();
    if (hintUsed) $("#hint").disabled = true;
  };
  async function exec(withTests) {
    if (busy) return null; busy = true;
    $$("#l-foot button").forEach(b => (b.disabled = true)); cons.running();
    const r = await Py.run(cm.getValue(), { tests: withTests ? step.tests : null, timeout: 8000 });
    busy = false;
    if (token !== L?.token || r.cancelled) return null;
    const n = normalizeRun(r); cons.result(n);
    if (!withTests) controls();
    return n;
  }
  async function check() {
    const r = await exec(true); if (!r) return;
    attempts++;
    if (r.passed) {
      passed = true;
      if (!graded) { graded = true; L.graded++; if (attempts === 1 && !hintUsed && !shown) L.first++; }
      const g = gain(shown ? 0 : attempts === 1 && !hintUsed ? 15 : hintUsed || attempts > 2 ? 5 : 10);
      setFoot("good", `<div class="fb"><span class="fb-pip">${pip("cheer", 58)}</span><div class="fb-text"><h4>${t("brilliant")}${g ? ` +${g} XP` : ""}</h4><p>${t("all_tests")}</p></div></div><button class="btn btn-good" id="go">${t("cont")} <span class="kbd">${MOD}↵</span></button>`);
      $("#go").onclick = next; return;
    }
    if (!graded) { graded = true; L.graded++; }
    const msg = r.timeout ? t("too_long") : r.error ? t("has_error") : (r.message || t("not_right"));
    setFoot("bad", `<div class="fb"><span class="fb-pip">${pip("oops", 58)}</span><div class="fb-text"><h4>${t("not_quite")}</h4><p>${esc(msg)}</p></div></div>${attempts >= 3 && !shown ? `<button class="btn btn-ghost btn-sm" id="sol">${t("show_solution")}</button>` : ""}<button class="btn btn-bad" id="again">${t("try_again")}</button>`);
    $("#again").onclick = () => { controls(); cm.focus(); };
    const sol = $("#sol"); if (sol) sol.onclick = () => { shown = true; cm.setValue(step.solution); controls(); toast(t("sol_loaded")); };
  }
  controls();
}

function renderFinish() {
  const first = !S.done[L.lesson.id];
  let bonus = 0;
  if (first) { S.done[L.lesson.id] = true; bonus = L.replay ? 0 : 20; }
  if (bonus) L.xp += bonus;
  award(bonus);
  if (bonus) hooks.step && hooks.step(`${L.lesson.id}:bonus`, bonus);
  $(".l-progress", lroot).innerHTML = L.lesson.steps.map(() => `<i class="done"></i>`).join("");
  const acc = L.graded ? Math.round(L.first / L.graded * 100) : 100;
  const nx = FLAT[L.f.i + 1];
  $("#l-body").innerHTML = `<div class="l-wrap"><div class="done-screen"><div class="trophy">${pip("cheer", 150)}</div><h2>${L.replay ? t("practice_complete") : t("lesson_complete")}</h2><p>${esc(L.lesson.title)}${nx && !L.replay ? ` · ${t("next_up", { t: esc(nx.lesson.title) })}` : ""}</p>
    <div class="done-stats"><div class="xp"><small>${t("xp_earned")}</small><b>${ico("bolt","fill")}+${L.xp}</b></div><div class="acc"><small>${t("first_try")}</small><b>${acc}%</b></div><div class="st"><small>${t("streak")}</small><b>${ico("flame","fill")}${currentStreak()}</b></div></div></div></div>`;
  foot(`<span class="grow"></span><button class="btn btn-primary" id="go">${nx ? t("back_to_path") : t("finish")}</button>`);
  $("#go").onclick = () => (location.hash = "#/learn");
  if (!L.replay) { const x = $("#l-xp"); if (x) $("b", x).textContent = L.xp; }
  confetti(); openNode = null;
}

/* ============================================================ router */
const routes = {};   // extra pages registered by account.js: name -> fn(arg)
function route() {
  const [, r, arg] = (location.hash || "#/learn").split("/");
  if (r === "lesson") { if (!L || L.lesson.id !== arg) { closeLesson(); openLesson(arg); } return; }
  if (L) closeLesson();
  $$("[data-route]").forEach(a => a.classList.toggle("active", a.dataset.route === (r || "learn")));
  if (routes[r]) { routes[r](arg); return; }
  if (r === "playground") { document.title = t("playground") + " · Pythonic"; renderPlayground(); }
  else {
    document.title = "Pythonic: Learn Python by Doing"; renderLearn();
    requestAnimationFrame(() => {
      const cur = $(".node.current", view); if (!cur) return;
      const r = cur.getBoundingClientRect();
      if (r.top < 120 || r.bottom > innerHeight - 80) scrollTo(0, Math.max(0, r.top + scrollY - innerHeight / 2));
    });
  }
}

$("#btn-theme").onclick = () => { S.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; save(); applyTheme(); window.Account && Account.onThemeChanged(S.theme); };
$("#btn-settings").onclick = () => (location.hash = "#/settings");
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && $("#modal-root").firstChild) { $("#modal-root").innerHTML = ""; return; }
  if (!L || $("#modal-root").firstChild) return;
  const t = e.target;
  if (t.closest && t.closest(".CodeMirror")) return;              // the editor handles its own shortcuts
  if (/INPUT|SELECT|TEXTAREA/.test(t.tagName)) return;
  const primary = () => $("#l-foot .btn-primary:not(:disabled), #l-foot .btn-good, #l-foot .btn-bad:not(.btn-sm)");
  const opts = $$(".opt").filter(o => !o.disabled);
  const mod = e.metaKey || e.ctrlKey;

  // Cmd/Ctrl+Enter: check / continue / try again, from anywhere
  if (mod && e.key === "Enter") { e.preventDefault(); if (/BUTTON/.test(t.tagName)) t.blur(); const b = primary(); if (b) b.click(); return; }
  if (e.altKey || mod) return;

  // 1-9 choose an answer. Uses the physical key (e.code) so it works on any keyboard layout (AZERTY, Cyrillic, ...)
  const m = /^(?:Digit|Numpad)([1-9])$/.exec(e.code) || /^([1-9])$/.exec(e.key);
  if (m && opts.length) {
    const o = $$(".opt")[+m[1] - 1];
    if (o && !o.disabled) { e.preventDefault(); o.click(); o.blur(); }
    return;
  }
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && opts.length) {
    e.preventDefault();
    const cur = opts.findIndex(o => o.classList.contains("sel"));
    const nxt = e.key === "ArrowDown" ? (cur + 1) % opts.length : (cur <= 0 ? opts.length - 1 : cur - 1);
    opts[nxt].click(); opts[nxt].blur(); return;
  }
  // plain Enter: same as the primary button, unless a footer/other button has focus
  if (e.key === "Enter" && !e.shiftKey && (!/BUTTON/.test(t.tagName) || t.classList.contains("opt"))) {
    const b = primary(); if (b) { e.preventDefault(); b.click(); }
  }
});
window.addEventListener("hashchange", route);
function setLanguage(l, silent) {
  S.lang = I18N.setLang(l); save();
  offRuntime && offRuntime(); offRuntime = paintRuntime();
  if (!silent) route();
}
I18N.setLang(S.lang || I18N.detect());
offRuntime && offRuntime(); offRuntime = paintRuntime();
applyTheme(); route();
window.App = {
  get S() { return S; }, get signedIn() { return signedIn; }, save, view, modal, toast, t, tn, esc, ico, pip, MOD, $, $$, hooks, routes,
  applyTheme, setLanguage, applyServerProgress, enterAccount, leaveAccount, clearGuestProgress, guestDoneLessons,
  refresh: route, setGoal: n => { S.goal = n; save(); },
};
})();
