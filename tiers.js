/* Splits the curriculum into rows. A lesson sits one row below the deepest lesson it builds on, so everything in a
   row depends only on earlier rows and can be done in any order. Pure functions, no DOM or storage (unit-tested). */
(() => {
function build(units) {
  const byId = {}, order = [];
  units.forEach((u, unit) => u.lessons.forEach(l => { byId[l.id] = { id: l.id, unit, needs: l.needs || [] }; order.push(l.id); }));
  for (const n of Object.values(byId)) for (const p of n.needs) if (!byId[p]) throw new Error(`${n.id} needs unknown lesson ${p}`);

  const row = {}, state = {};
  const depth = id => {
    if (state[id] === 2) return row[id];
    if (state[id] === 1) throw new Error(`prerequisite cycle through ${id}`);
    state[id] = 1;
    row[id] = byId[id].needs.length ? 1 + Math.max(...byId[id].needs.map(depth)) : 0;
    state[id] = 2;
    return row[id];
  };
  order.forEach(depth);

  const rows = [];
  order.forEach(id => (rows[row[id]] = rows[row[id]] || []).push(id));      // curriculum order inside a row
  return { byId, order, rows, rowOf: row };
}

/** A lesson is open once everything it builds on is done. */
const isUnlocked = (g, id, done) => g.byId[id].needs.every(p => done[p]);

/** The lesson to suggest: the first open, unfinished one in curriculum order. */
const nextUp = (g, done) => g.order.find(id => !done[id] && isUnlocked(g, id, done)) || null;

window.Tiers = { build, isUnlocked, nextUp };
})();
