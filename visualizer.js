/* Code visualizer: step through a program and watch the call stack, variables and objects change.
   The Python side (trace_code in pyruntime.js) records a snapshot before every line; this file plays it back. */
(() => {
const { t, esc, ico, mascot, Py, $, $$ } = App;

let root = null, cm = null, steps = [], out = "", lines = [], i = 0, playing = false, speed = 1, timer = null, onKey = null, lastLineMarks = [];

/* ------------------------------------------------------------ value formatting */
function preview(e, h, depth = 0) {
  if (e.p !== undefined) return e.p;
  const o = h[e.r];
  if (!o) return "…";
  const part = x => (depth > 1 ? "…" : preview(x, h, depth + 1));
  const take = (arr, f) => arr.slice(0, 5).map(f).join(", ") + (arr.length > 5 || o.m ? ", …" : "");
  switch (o.k) {
    case "list": return `[${take(o.i, part)}]`;
    case "tuple": return `(${take(o.i, part)}${o.i.length === 1 ? "," : ""})`;
    case "set": case "frozenset": return o.i.length ? `{${take(o.i, part)}}` : "set()";
    case "dict": return `{${take(o.i, ([k, v]) => `${part(k)}: ${part(v)}`)}}`;
    case "func": return `function ${o.n}`;
    case "class": return `class ${o.n}`;
    case "obj": return `${o.n} object`;
    default: return o.n;
  }
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ------------------------------------------------------------ narration: what just happened */
function narrate(k) {
  const s = steps[k], p = steps[k - 1];
  if (!p) return { mood: "happy", text: t("viz_start") };
  const msgs = [];
  if (s.ev === "exception") return { mood: "oops", text: s.exc };
  if (p.ev === "return") {
    const f = p.s[p.s.length - 1];
    msgs.push(t("viz_returned", { name: f.n, value: preview(p.ret, p.h) }));
  }
  if (s.s.length > p.s.length) {
    const f = s.s[s.s.length - 1], args = f.v.map(([n, e]) => `${n} = ${preview(e, s.h)}`).join(", ");
    msgs.push(t("viz_called", { name: f.n }) + (args ? ` (${args})` : ""));
  } else if (s.s.length === p.s.length || p.ev === "return") {
    const depth = Math.min(s.s.length, p.s.length);
    for (let d = 0; d < depth && msgs.length < 3; d++) {
      const a = new Map(p.s[d].v), b = s.s[d].v;
      if (s.s[d].n !== p.s[d].n) continue;
      for (const [name, e] of b) {
        const old = a.get(name);
        if (!old) msgs.push(t("viz_created", { name, value: preview(e, s.h) }));
        else if (!same(old, e)) msgs.push(t("viz_changed", { name, old: preview(old, p.h), new: preview(e, s.h) }));
        else if (e.r && !same(p.h[e.r], s.h[e.r])) msgs.push(t("viz_changed_obj", { name, value: preview(e, s.h) }));
        if (msgs.length >= 3) break;
      }
    }
  }
  if (s.o > p.o) msgs.push("→ " + out.slice(p.o, s.o).trim().split("\n").join(" ⏎ "));
  if (s.ev === "end") msgs.push(t("viz_end"));
  if (s.ev === "line" && k > 0) msgs.push(t("viz_next_line", { n: s.ln }));
  return { mood: s.ev === "end" ? "cheer" : "think", text: msgs.length ? msgs.join("  ·  ") : t("viz_unchanged") };
}

/* ------------------------------------------------------------ rendering */
const cell = e => (e.p !== undefined ? `<span class="pv">${esc(e.p)}</span>` : `<i class="ptr" data-ref="${e.r}"></i>`);

function renderFrames(s, p) {
  return s.s.map((f, d) => {
    const prev = p && p.s[d] && p.s[d].n === f.n ? new Map(p.s[d].v) : null;
    const rows = f.v.map(([n, e]) => {
      const old = prev && prev.get(n), changed = prev && (!old || !same(old, e));
      return `<tr class="${changed ? "flash" : ""}"><th>${esc(n)}</th><td>${cell(e)}</td></tr>`;
    }).join("") || `<tr><td class="none" colspan="2">${t("viz_empty_vars")}</td></tr>`;
    const active = d === s.s.length - 1;
    const ret = active && s.ev === "return" ? `<div class="ret">↩ ${esc(preview(s.ret, s.h))}</div>` : "";
    return `<div class="frame ${active ? "active" : ""}"><div class="fh">${f.n === "Global frame" ? esc(t("viz_global")) : esc(f.n) + "()"}</div><table>${rows}</table>${ret}</div>`;
  }).join("");
}

function renderObjs(s, p) {
  const ids = Object.keys(s.h).map(Number).sort((a, b) => a - b);
  if (!ids.length) return `<div class="none">${t("viz_empty_objs")}</div>`;
  return ids.map(id => {
    const o = s.h[id], changed = p && !same(p.h[id], o) ? "flash" : "";
    const more = o.m ? `<span class="more">${t("viz_more", { n: o.m })}</span>` : "";
    let body = "";
    if (o.k === "list" || o.k === "tuple") body = `<div class="cells">${o.i.map((e, n) => `<div class="cell"><small>${n}</small>${cell(e)}</div>`).join("")}${more}</div>`;
    else if (o.k === "set" || o.k === "frozenset") body = `<div class="cells">${o.i.map(e => `<div class="cell">${cell(e)}</div>`).join("")}${more}</div>`;
    else if (o.k === "dict") body = `<table class="kv">${o.i.map(([k, v]) => `<tr><td>${cell(k)}</td><td>${cell(v)}</td></tr>`).join("")}</table>${more}`;
    else if (o.k === "obj") body = `<table class="kv">${o.i.map(([n, e]) => `<tr><th>${esc(n)}</th><td>${cell(e)}</td></tr>`).join("")}</table>`;
    const title = o.k === "obj" ? esc(o.n) : o.k === "func" ? `function ${esc(o.n)}` : o.k === "class" ? `class ${esc(o.n)}` : esc(o.k === "other" ? o.n : o.k);
    return `<div class="obj ${changed}" id="viz-o${id}"><div class="oh">${title}</div>${body}</div>`;
  }).join("");
}

function drawArrows() {
  const wrap = $(".viz-state", root), svg = $(".viz-arrows", root);
  if (!wrap || !svg) return;
  const wr = wrap.getBoundingClientRect(), W = wrap.scrollWidth, H = wrap.scrollHeight;
  svg.setAttribute("width", W); svg.setAttribute("height", H);
  const paths = $$(".ptr", wrap).map(dot => {
    const target = $("#viz-o" + dot.dataset.ref, wrap); if (!target) return "";
    const a = dot.getBoundingClientRect(), b = target.getBoundingClientRect();
    const x1 = a.left + a.width / 2 - wr.left + wrap.scrollLeft, y1 = a.top + a.height / 2 - wr.top + wrap.scrollTop;
    const x2 = b.left - wr.left + wrap.scrollLeft, y2 = b.top + Math.min(22, b.height / 2) - wr.top + wrap.scrollTop;
    const dx = Math.max(40, Math.abs(x2 - x1) / 2);
    return `<path d="M${x1} ${y1} C${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2 - 2} ${y2}" marker-end="url(#viz-head)"/>`;
  }).join("");
  svg.innerHTML = `<defs><marker id="viz-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" stroke="none"/></marker></defs>${paths}`;
}

function render() {
  const s = steps[i], p = steps[i - 1];
  $(".viz-count", root).textContent = t("viz_step", { n: i + 1, total: steps.length });
  $("#viz-frames", root).innerHTML = renderFrames(s, p);
  $("#viz-objs", root).innerHTML = renderObjs(s, p);
  $("#viz-out", root).textContent = out.slice(0, s.o);
  const n = narrate(i);
  $(".viz-note p", root).textContent = n.text;
  $(".viz-note .mascot-slot", root).innerHTML = mascot(n.mood, 54);
  const slider = $("#viz-slider", root); slider.max = steps.length - 1; slider.value = i;
  $("[data-a=first]", root).disabled = $("[data-a=prev]", root).disabled = i === 0;
  $("[data-a=next]", root).disabled = $("[data-a=last]", root).disabled = i === steps.length - 1;
  $("[data-a=play]", root).innerHTML = playing ? ico("pause", "fill") : ico("play", "fill");
  $("[data-a=play]", root).setAttribute("aria-label", t(playing ? "viz_pause" : "viz_play"));
  // code panel
  lastLineMarks.forEach(([ln, cls]) => cm.removeLineClass(ln, "background", cls));
  lastLineMarks = [];
  const mark = (ln, cls) => { if (ln >= 1 && ln <= cm.lineCount()) { cm.addLineClass(ln - 1, "background", cls); lastLineMarks.push([ln - 1, cls]); } };
  if (p && p.ev === "line" && p.ln !== s.ln) mark(p.ln, "viz-prev");
  if (s.ev !== "end") mark(s.ln, s.ev === "exception" ? "viz-err" : "viz-cur");
  if (s.ev !== "end") cm.scrollIntoView({ line: s.ln - 1, ch: 0 }, 70);
  requestAnimationFrame(drawArrows);
}

/* ------------------------------------------------------------ controls */
function go(k) { i = Math.max(0, Math.min(steps.length - 1, k)); render(); }
function stop() { playing = false; clearInterval(timer); timer = null; }
function play() {
  if (playing) { stop(); render(); return; }
  if (i >= steps.length - 1) i = 0;
  playing = true;
  timer = setInterval(() => { if (i >= steps.length - 1) { stop(); render(); return; } go(i + 1); }, 900 / speed);
  render();
}
function close() {
  stop();
  if (onKey) document.removeEventListener("keydown", onKey, true);
  if (root) root.remove();
  root = cm = onKey = null; lastLineMarks = [];
  document.body.classList.remove("viz-open");
}

function showMessage(mood, title, text, hint) {
  $(".viz-main", root).innerHTML = `<div class="viz-msg">${mascot(mood, 96)}<h2>${esc(title)}</h2><p>${esc(text)}</p>${hint ? `<p class="h">${esc(hint)}</p>` : ""}<button class="btn btn-primary" data-a="close">${t("done")}</button></div>`;
  $("[data-a=close]", root).onclick = close;
}

/* ------------------------------------------------------------ open */
async function open({ code, title }) {
  close();
  root = document.createElement("div");
  root.className = "viz-root";
  root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", t("viz_title"));
  root.innerHTML = `<header class="viz-top"><button class="l-close" data-a="close" aria-label="${esc(t("quit"))}">${ico("x")}</button><h2>${esc(title || t("viz_title"))}</h2><span class="viz-count"></span><span class="viz-keys">${t("viz_keys")}</span></header>
    <div class="viz-main"><div class="viz-loading"><span class="spin"></span>${t("viz_tracing")}</div></div>`;
  document.body.appendChild(root); document.body.classList.add("viz-open");
  $("[data-a=close]", root).onclick = close;
  onKey = e => {
    if (!root) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (!steps.length || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    const map = { ArrowRight: () => { stop(); go(i + 1); }, ArrowLeft: () => { stop(); go(i - 1); }, " ": play, Home: () => { stop(); go(0); }, End: () => { stop(); go(steps.length - 1); } };
    if (map[e.key] && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); e.stopPropagation(); map[e.key](); }
  };
  document.addEventListener("keydown", onKey, true);

  const r = await Py.trace(code);
  if (!root || r.cancelled) return;
  if (r.timeout || r.fatal) return showMessage("oops", t("stopped"), t("stopped_hint"));
  if (!r.steps.length) {
    const e = r.error;
    return showMessage("oops", t("viz_error_title"), e ? `${e.type}: ${e.msg}${e.line ? ` (${t("line_n", { n: e.line })})` : ""}` : t("no_output"), e && e.hint);
  }
  steps = r.steps; out = r.out; lines = code.split("\n"); i = 0; playing = false;
  $(".viz-main", root).innerHTML = `<div class="viz-left"><div class="viz-code"></div><div class="viz-outbox"><h3>${t("viz_output")}</h3><pre id="viz-out"></pre></div></div>
    <div class="viz-right"><div class="viz-note"><span class="mascot-slot"></span><p></p></div>${r.truncated ? `<div class="viz-trunc">${t("viz_truncated", { n: steps.length })}</div>` : ""}
      <div class="viz-state"><div class="viz-col"><h3>${t("viz_frames")}</h3><div id="viz-frames"></div></div><div class="viz-col"><h3>${t("viz_objects")}</h3><div id="viz-objs"></div></div><svg class="viz-arrows" aria-hidden="true"></svg></div></div>`;
  root.insertAdjacentHTML("beforeend", `<footer class="viz-ctl"><div class="viz-btns">
      <button class="icon-btn" data-a="first" aria-label="${esc(t("viz_first"))}">${ico("first", "fill")}</button><button class="icon-btn" data-a="prev" aria-label="${esc(t("viz_prev"))}">${ico("prev", "fill")}</button>
      <button class="btn btn-primary viz-play" data-a="play"></button>
      <button class="icon-btn" data-a="next" aria-label="${esc(t("viz_next"))}">${ico("next", "fill")}</button><button class="icon-btn" data-a="last" aria-label="${esc(t("viz_last"))}">${ico("last", "fill")}</button></div>
    <input type="range" id="viz-slider" min="0" max="0" value="0" aria-label="${esc(t("viz_step", { n: "", total: "" }))}">
    <label class="viz-speed">${t("viz_speed")}<select class="select" id="viz-speed">${[0.5, 1, 2, 4].map(v => `<option value="${v}" ${v === 1 ? "selected" : ""}>${v}×</option>`).join("")}</select></label></footer>`);
  cm = CodeMirror($(".viz-code", root), { value: code, mode: "python", theme: "pl", readOnly: "nocursor", lineNumbers: true, lineWrapping: false });
  $$("[data-a]", root).forEach(b => {
    const a = b.dataset.a;
    if (a === "close") return;
    b.onclick = () => { if (a === "play") return play(); stop(); go({ first: 0, prev: i - 1, next: i + 1, last: steps.length - 1 }[a]); };
  });
  $("#viz-slider", root).oninput = e => { stop(); go(+e.target.value); };
  $("#viz-speed", root).onchange = e => { speed = +e.target.value; if (playing) { stop(); play(); } };
  new ResizeObserver(() => requestAnimationFrame(drawArrows)).observe($(".viz-state", root));
  $(".viz-state", root).addEventListener("scroll", drawArrows);
  setTimeout(() => { cm.refresh(); render(); }, 0);
}

window.Visualizer = { open, close };
})();
