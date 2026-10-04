// node tests/graph.test.mjs : the skill map's logic, checked against the real curriculum
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
for (const f of ["lessons.js", "graph.js"]) new Function("window", readFileSync(join(root, f), "utf8").replace(/^const py/m, "var py"))(globalThis.window);
const { UNITS, GOALS, Graph } = window;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : (fail++, console.log("FAIL:", m)); };

const g = Graph.build(UNITS, GOALS);                      // throws on unknown prerequisites, goal targets or cycles
ok(g.nodes.length === 24 && g.edges.length >= 24, `24 lessons, ${g.edges.length} prerequisite links`);
ok(g.byId.hello.needs.length === 0 && Graph.nextUp(g, {}) === "hello", "a new learner starts at Hello");
ok(g.nodes.every(n => n.x >= 0 && n.y >= 0 && n.x <= g.width && n.y <= g.height), "every node sits inside the canvas");
const pos = new Set(g.nodes.map(n => `${n.x},${n.y}`)); ok(pos.size === 24, "no two nodes overlap");
ok(g.nodes.filter(n => n.needs.length === 0).length === 1, "exactly one starting point");

// a broken curriculum is rejected loudly
const bad = (units, goals = []) => { try { Graph.build(units, goals); return false; } catch { return true; } };
const mk = (...ls) => [{ lessons: ls.map(([id, needs]) => ({ id, needs })) }];
ok(bad(mk(["a", ["zzz"]])), "unknown prerequisite rejected");
ok(bad(mk(["a", ["b"]], ["b", ["a"]])), "cycle rejected");
ok(bad(mk(["a", []]), [{ id: "g", targets: ["nope"] }]), "goal with unknown target rejected");

// status
const items = (...xs) => xs.map(([interval, due]) => ({ interval, due }));
const today = "2026-10-04";
const done = { hello: true, numbers: true, decisions: true };
ok(Graph.status(g, "loops", done, [], today) === "ready", "all prerequisites done -> ready");
ok(Graph.status(g, "recursion", done, [], today) === "fog", "missing prerequisites -> fog");
ok(Graph.status(g, "hello", done, [], today) === "learning", "finished without review data -> learning");
ok(Graph.status(g, "hello", done, items([30, "2026-11-01"], [25, "2026-10-30"]), today) === "strong", "long gaps and nothing due -> strong");
ok(Graph.status(g, "hello", done, items([30, "2026-11-01"], [3, "2026-10-04"]), today) === "fading", "anything due -> fading");
ok(Graph.status(g, "hello", done, items([30, "2026-11-01"], [3, "2026-10-09"]), today) === "learning", "mixed gaps, nothing due -> learning");

// routes
const r = Graph.route(g, ["merge"], {});
ok(r.includes("hello") && r.includes("recursion") && r.includes("sorting") && r.at(-1) === "merge", `route to Merge Sort: ${r.join(" > ")}`);
ok(r.every((id, i) => g.byId[id].needs.every(p => r.indexOf(p) < i)), "every route step comes after its prerequisites");
ok(!Graph.route(g, ["merge"], { hello: true, numbers: true }).some(id => id === "hello" || id === "numbers"), "finished lessons are not in the route");
ok(Graph.route(g, ["loops"], { hello: true, numbers: true, decisions: true, loops: true }).length === 0, "reached goals have an empty route");
for (const goal of GOALS) {
  const rt = Graph.route(g, goal.targets, {});
  ok(rt.length > 0 && goal.targets.every(t => rt.includes(t)), `goal "${goal.id}" has a route`);
}
ok(Graph.nextUp(g, { hello: true }, Graph.route(g, ["merge"], { hello: true })) === "numbers", "next up within a route");
ok(Graph.nextUp(g, Object.fromEntries(g.order.map(id => [id, true]))) === null, "nothing left to suggest when everything is done");
console.log(`${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
