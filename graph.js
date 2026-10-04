/* The skill map's logic: which lessons depend on which, where they sit, how well each is remembered,
   and the route to a goal. Pure functions (no DOM, no storage) so they can be unit-tested. */
(() => {
const COL_W = 215, ROW_H = 100, PAD_X = 110, PAD_Y = 150, R = 30;

/** Nodes are lessons; edges are prerequisites. Units become columns ("regions") of the map. */
function build(units, goals = []) {
  const nodes = [], byId = {};
  units.forEach((u, col) => u.lessons.forEach((l, row) => {
    const n = { id: l.id, unit: col, row, needs: l.needs || [], x: PAD_X + col * COL_W + (row % 2 ? 24 : -24), y: PAD_Y + row * ROW_H };
    nodes.push(n); byId[n.id] = n;
  }));
  const edges = [];
  for (const n of nodes) for (const p of n.needs) {
    if (!byId[p]) throw new Error(`${n.id} needs unknown lesson ${p}`);
    edges.push({ from: p, to: n.id });
  }
  const state = {};                                   // cycle check (depth first)
  const visit = id => {
    if (state[id] === 2) return;
    if (state[id] === 1) throw new Error(`prerequisite cycle through ${id}`);
    state[id] = 1; byId[id].needs.forEach(visit); state[id] = 2;
  };
  nodes.forEach(n => visit(n.id));
  for (const g of goals) for (const id of g.targets) if (!byId[id]) throw new Error(`goal ${g.id} targets unknown lesson ${id}`);
  const rows = Math.max(...units.map(u => u.lessons.length));
  return { nodes, byId, edges, goals, order: nodes.map(n => n.id), width: PAD_X * 2 + (units.length - 1) * COL_W, height: PAD_Y + (rows - 1) * ROW_H + 90 };
}

const isReady = (g, id, done) => g.byId[id].needs.every(p => done[p]);

/** Lessons still to do for a goal, in an order that always respects prerequisites. */
function route(g, targets, done) {
  const need = new Set();
  const visit = id => { if (need.has(id) || done[id]) return; need.add(id); g.byId[id].needs.forEach(visit); };
  targets.forEach(visit);
  const out = [], left = new Set(need);
  while (left.size) {                                  // Kahn: repeatedly take what is ready (curriculum order breaks ties)
    const next = g.order.find(id => left.has(id) && g.byId[id].needs.every(p => !left.has(p)));
    out.push(next); left.delete(next);
  }
  return out;
}

/** The lesson to suggest next: the first ready, unfinished lesson (within `within` if given). */
function nextUp(g, done, within) {
  return (within || g.order).find(id => !done[id] && isReady(g, id, done)) || null;
}

/**
 * strong / learning / fading (finished lessons, from review data), ready / fog (not finished yet).
 * `items` are the lesson's review items; fading means at least one is due.
 */
function status(g, id, done, items, today, masteredAt = 21) {
  if (!done[id]) return isReady(g, id, done) ? "ready" : "fog";
  if (!items.length) return "learning";
  if (items.some(it => it.due <= today)) return "fading";
  return items.filter(it => it.interval >= masteredAt).length / items.length >= 0.7 ? "strong" : "learning";
}

window.Graph = { COL_W, ROW_H, R, build, isReady, route, nextUp, status };
})();
