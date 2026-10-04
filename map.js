/* The skill map: every lesson is a place, prerequisites are roads, colour shows how well you remember it.
   Nothing is locked. Fog only means "better to do other skills first". Pick a goal to see the route to it.
   All app state comes in through the context object passed to render(), so this file stays self-contained. */
(() => {
const { R } = Graph;
let vb = null, graph = null, fitBox = null;           // view box survives re-renders so the map doesn't jump

function edgePath(a, b) {
  if (Math.abs(b.x - a.x) < 80) {                      // same column: bulge to the right
    const down = b.y > a.y, y1 = a.y + (down ? R : -R), y2 = b.y + (down ? -R : R), bulge = 62;
    return `M${a.x} ${y1} C${a.x + bulge} ${y1 + (down ? 22 : -22)}, ${b.x + bulge} ${y2 + (down ? -22 : 22)}, ${b.x} ${y2}`;
  }
  const dir = b.x > a.x ? 1 : -1, x1 = a.x + dir * R, x2 = b.x - dir * (R + 4), dx = Math.max(50, Math.abs(x2 - x1) / 2);
  return `M${x1} ${a.y} C${x1 + dir * dx} ${a.y}, ${x2 - dir * dx} ${b.y}, ${x2} ${b.y}`;
}

function render(host, ctx) {
  const { units, goals, S, t, tn, esc, icons, lessonIcon, mascot, today } = ctx;
  graph = Graph.build(units, goals);
  const g = graph;
  let sel = null;

  const itemsOf = id => ctx.keysOf(id).map(k => S.srs[k]).filter(Boolean);
  const statusOf = id => Graph.status(g, id, S.done, itemsOf(id), today);
  const goal = () => goals.find(x => x.id === S.dest)
    || (S.dest && S.dest.startsWith("node:") && g.byId[S.dest.slice(5)] ? { id: S.dest, title: lesson(S.dest.slice(5)).title, desc: "", targets: [S.dest.slice(5)] } : null);
  const routeOf = () => (goal() ? Graph.route(g, goal().targets, S.done) : null);
  const lesson = id => units[g.byId[id].unit].lessons.find(l => l.id === id);

  host.innerHTML = `<div class="map-card">
    <div class="map-bar"><div class="goal-chips" role="group" aria-label="${esc(t("map_goal"))}"><button data-goal="" class="gchip">${t("map_explore")}</button>${goals.map(x => `<button data-goal="${x.id}" class="gchip">${esc(x.title)}</button>`).join("")}</div>
    </div>
    <div class="goalstrip" hidden></div>
    <div class="map-stage"><div class="map-tools"><button class="icon-btn" data-z="out" aria-label="${esc(t("map_zoom_out"))}">${ctx.ico("minus")}</button><button class="icon-btn" data-z="in" aria-label="${esc(t("map_zoom_in"))}">${ctx.ico("plus")}</button><button class="icon-btn" data-z="fit" aria-label="${esc(t("map_fit"))}">${ctx.ico("fit")}</button></div><svg class="map-svg" role="group" aria-label="${esc(t("map_title"))}"></svg></div><div class="map-panel" hidden></div>
    <div class="map-legend">${["strong", "learning", "fading", "ready", "fog"].map(k => `<span><i class="lg st-${k}"></i>${t("st_" + k)}</span>`).join("")}<span class="hint">${t("map_hint")}</span></div></div>`;
  const svg = host.querySelector(".map-svg"), stage = host.querySelector(".map-stage"), panel = host.querySelector(".map-panel"), strip = host.querySelector(".goalstrip");

  /* ---------------------------------------------------------------- drawing */
  function draw() {
    const route = routeOf(), inRoute = route && new Set(route), nxt = Graph.nextUp(g, S.done, route || undefined);
    const st = Object.fromEntries(g.nodes.map(n => [n.id, statusOf(n.id)]));
    const targets = new Set(goal() ? goal().targets : []);
    const regions = units.map((u, i) => `<g class="region u-${u.color}"><rect x="${Graph.COL_W * i + 10}" y="30" width="200" height="${g.height - 50}" rx="24"/><text x="${Graph.COL_W * i + 28}" y="62">${esc(u.title).split(" &amp; ").map((p, k, a) => `<tspan x="${Graph.COL_W * i + 28}" dy="${k ? 17 : 0}">${p}${k < a.length - 1 ? " &amp;" : ""}</tspan>`).join("")}</text></g>`).join("");
    const edges = g.edges.map(e => {
      const a = g.byId[e.from], b = g.byId[e.to];
      const hi = route && inRoute.has(e.to) && (inRoute.has(e.from) || S.done[e.from]);
      const hl = !hi && sel && (e.from === sel || e.to === sel), dim = route && !hi && !hl;
      return `<path class="edge${hi ? " hi" : ""}${hl ? " hl" : ""}${dim ? " dim" : ""}${sel && !hi && !hl ? " quiet" : ""}" d="${edgePath(a, b)}" marker-end="url(#${hi ? "ah-hi" : hl ? "ah-hl" : "ah"})"/>`;
    }).join("");
    const nodes = g.nodes.map(n => {
      const dim = route && !inRoute.has(n.id) ? (S.done[n.id] ? "dim soft" : "dim") : "", l = lesson(n.id), icon = icons[lessonIcon[n.id]] || icons.sparkle;
      const extra = (n.id === nxt ? `<foreignObject x="${-R - 62}" y="${-R - 8}" width="58" height="62" class="guide">${mascot("happy", 50)}</foreignObject><g class="starttag" transform="translate(0 ${-R - 24})"><rect x="-34" y="-12" width="68" height="22" rx="8"/><text y="4" text-anchor="middle">${t("start")}</text></g>` : "")
        + (targets.has(n.id) ? `<path class="flag" d="M${R - 4} ${-R - 2}v-22M${R - 4} ${-R - 24}h16l-5 6 5 6h-16" />` : "");
      return `<g class="mnode st-${st[n.id]}${n.id === sel ? " sel" : ""}${dim ? " " + dim : ""}${n.id === nxt ? " next" : ""}" transform="translate(${n.x} ${n.y})" data-id="${n.id}" tabindex="0" role="button" aria-label="${esc(l.title)}: ${esc(t("st_" + st[n.id]))}">
        <circle class="halo" r="${R + 9}"/><circle class="mc" r="${R}"/><svg class="mico" x="-13" y="-13" width="26" height="26" viewBox="0 0 24 24">${icon}</svg>
        <text class="mlabel" y="${R + 20}" text-anchor="middle">${esc(l.title)}</text>${extra}</g>`;
    }).join("");
    svg.innerHTML = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z"/></marker><marker id="ah-hi" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z"/></marker><marker id="ah-hl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>${regions}<g>${edges}</g><g>${nodes}</g>`;
    $$(".gchip", host).forEach(b => b.classList.toggle("on", (b.dataset.goal || "") === (S.dest || "")));
    // goal strip
    const gl = goal();
    strip.hidden = !gl;
    if (gl) {
      const left = route.length;
      strip.innerHTML = `${ctx.ico("flag")}<div><b>${esc(gl.title)}</b>${gl.desc ? `<span>${esc(gl.desc)}</span>` : ""}</div><em>${left ? tn("map_goal_left", left) : t("map_goal_done")}</em>${nxt && left ? `<button class="btn btn-primary btn-sm" data-pick="${nxt}">${t("map_next", { name: esc(lesson(nxt).title) })}</button>` : ""}`;
    }
    return { st, nxt };
  }
  const $$ = (s, r = host) => [...r.querySelectorAll(s)];

  /* ---------------------------------------------------------------- details card */
  function showPanel(id, st) {
    if (!id) { panel.hidden = true; return; }
    const l = lesson(id), s = st[id], n = g.byId[id], counts = {};
    l.steps.forEach(x => (counts[x.type] = (counts[x.type] || 0) + 1));
    const due = itemsOf(id).filter(it => it.due <= today).length;
    const note = s === "fading" ? tn("review_due", due) : t("st_" + s + "_note");
    const missing = n.needs.filter(p => !S.done[p]);
    const primary = s === "fading" ? { label: t("map_revive"), href: "#/review/start" }
      : S.done[id] ? { label: t("practice_again"), href: "#/lesson/" + id }
      : { label: t(s === "fog" ? "map_peek" : "start_lesson"), href: "#/lesson/" + id };
    panel.hidden = false;
    panel.className = "map-panel st-" + s;
    panel.innerHTML = `<button class="pclose" data-close aria-label="${esc(t("quit"))}">${ctx.ico("x")}</button>
      <div class="pmain"><div class="ph"><span class="badge-st st-${s}">${t("st_" + s)}</span><h3>${esc(l.title)}</h3></div><p>${esc(l.blurb)}</p>
      <div class="pnote">${esc(note)}</div>
      ${s === "fog" && missing.length ? `<div class="pneeds">${t("map_needs")} ${missing.map(p => `<button class="chip" data-pick="${p}">${esc(lesson(p).title)}</button>`).join("")}</div>` : ""}
      <div class="pchips">${["learn", "quiz", "predict", "code"].filter(k => counts[k]).map(k => `<span class="chip">${t("q_" + k)} ×${counts[k]}</span>`).join("")}<span class="chip">+${ctx.lessonXp(l)} XP</span></div></div>
      <div class="pbtns"><a class="btn ${s === "fog" ? "btn-ghost" : "btn-primary"} btn-sm" href="${primary.href}">${primary.label}</a>
      <button class="btn btn-ghost btn-sm" data-setgoal="${id}">${ctx.ico("flag")} ${t(S.dest === "node:" + id ? "map_clear_goal" : "map_set_goal")}</button></div>`;
  }

  /* ---------------------------------------------------------------- view box: pan, zoom, focus */
  const aspect = () => stage.clientHeight / Math.max(1, stage.clientWidth);
  const apply = () => svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  function fit() {
    const a = aspect(), w = Math.max(g.width, g.height / a);
    fitBox = { w, h: w * a };
    return { x: (g.width - w) / 2, y: (g.height - w * a) / 2 + 10, w, h: w * a };
  }
  function focusBox(id, w) {
    const a = aspect(), n = g.byId[id];
    return { x: n.x - w / 2, y: n.y - (w * a) / 2 + 30, w, h: w * a };
  }
  let tween = 0;
  function moveTo(target) {
    cancelAnimationFrame(tween);
    const from = { ...vb }, t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / 280), e = 1 - Math.pow(1 - k, 3);
      vb = { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e, w: from.w + (target.w - from.w) * e, h: from.h + (target.h - from.h) * e };
      apply(); if (k < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  }
  function zoom(f, cx, cy) {
    cancelAnimationFrame(tween);
    const r = svg.getBoundingClientRect(), px = (cx ?? r.left + r.width / 2), py = (cy ?? r.top + r.height / 2);
    const fx = (px - r.left) / r.width, fy = (py - r.top) / r.height;
    const w = Math.min(fitBox.w * 1.1, Math.max(fitBox.w / 3, vb.w / f)), h = w * aspect();
    vb = { x: vb.x + vb.w * fx - w * fx, y: vb.y + vb.h * fy - h * fy, w, h }; apply();
  }

  /* ---------------------------------------------------------------- interaction */
  let info = draw();
  function select(id, { move = false } = {}) {
    sel = id; info = draw(); showPanel(id, info.st);
    if (move && id) moveTo(focusBox(id, Math.min(vb.w, 640)));
  }
  host.addEventListener("click", e => {
    const pick = e.target.closest("[data-pick]"); if (pick) { select(pick.dataset.pick, { move: true }); return; }
    const node = e.target.closest(".mnode"); if (node && !dragged) { select(node.dataset.id); return; }
    if (e.target.closest("[data-close]")) { select(null); return; }
    const sg = e.target.closest("[data-setgoal]");
    if (sg) { ctx.setDest(S.dest === "node:" + sg.dataset.setgoal ? "" : "node:" + sg.dataset.setgoal); return; }
    const gc = e.target.closest(".gchip"); if (gc) { ctx.setDest(gc.dataset.goal); return; }
    const z = e.target.closest("[data-z]");
    if (z) { z.dataset.z === "fit" ? moveTo(fit()) : zoom(z.dataset.z === "in" ? 1.3 : 1 / 1.3); }
  });
  svg.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.closest(".mnode")) { e.preventDefault(); select(e.target.closest(".mnode").dataset.id); } });
  svg.addEventListener("wheel", e => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, { passive: false });

  let dragged = false; const pts = new Map(); let start = null;
  svg.addEventListener("pointerdown", e => {
    if (e.target.closest(".mnode")) return;
    svg.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); dragged = false;
    start = { x: e.clientX, y: e.clientY, vb: { ...vb }, dist: null };
    if (pts.size === 2) { const [a, b] = [...pts.values()]; start.dist = Math.hypot(a.x - b.x, a.y - b.y); start.vb = { ...vb }; }
  });
  svg.addEventListener("pointermove", e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2 && start.dist) {                    // pinch
      const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      vb = { ...start.vb }; zoom(d / start.dist, (a.x + b.x) / 2, (a.y + b.y) / 2); start.dist = d; start.vb = { ...vb }; dragged = true; return;
    }
    const k = vb.w / svg.clientWidth, dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragged = true;
    if (dragged) { cancelAnimationFrame(tween); vb = { ...vb, x: start.vb.x - dx * k, y: start.vb.y - dy * k }; apply(); }
  });
  const end = e => { pts.delete(e.pointerId); setTimeout(() => { if (!pts.size) dragged = false; }, 0); };
  svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);

  /* ---------------------------------------------------------------- first paint */
  const narrow = stage.clientWidth < 720;
  if (!vb) { vb = fit(); if (narrow && info.nxt) vb = focusBox(info.nxt, 560); } else fit();
  apply();
  const first = sel || info.nxt || null;
  if (first) select(first);
}

window.LearnMap = { render };
})();
