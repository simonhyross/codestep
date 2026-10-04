// node tests/tiers.test.mjs : the rows of the learning path, checked against the real curriculum
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
for (const f of ["lessons.js", "tiers.js"]) new Function("window", readFileSync(join(root, f), "utf8").replace(/^const py/m, "var py"))(globalThis.window);
const { UNITS, Tiers } = window;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : (fail++, console.log("FAIL:", m)); };

const g = Tiers.build(UNITS);                                   // throws on unknown prerequisites or cycles
ok(g.order.length === 24 && g.rows.flat().length === 24, "every lesson is in exactly one row");
ok(g.rows.every(r => r && r.length >= 1), "no empty rows");
ok(g.rows[0].length === 1 && g.rows[0][0] === "hello", "the path starts with Hello");
ok(Math.max(...g.rows.map(r => r.length)) <= 4, `rows are small enough to read as choices (widest: ${Math.max(...g.rows.map(r => r.length))})`);
ok(g.rows.length >= 8 && g.rows.length <= 12, `${g.rows.length} rows`);
ok(g.order.every(id => g.byId[id].needs.every(p => g.rowOf[p] < g.rowOf[id])), "everything a lesson needs is in an earlier row");
ok(g.rows.every(r => r.every(a => r.every(b => a === b || !g.byId[a].needs.includes(b)))), "lessons in the same row never depend on each other");

const bad = units => { try { Tiers.build(units); return false; } catch { return true; } };
const mk = (...ls) => [{ lessons: ls.map(([id, needs]) => ({ id, needs })) }];
ok(bad(mk(["a", ["nope"]])), "unknown prerequisite rejected");
ok(bad(mk(["a", ["b"]], ["b", ["a"]])), "cycle rejected");

ok(Tiers.nextUp(g, {}) === "hello", "a new learner is pointed at Hello");
ok(Tiers.isUnlocked(g, "numbers", {}) === false && Tiers.isUnlocked(g, "numbers", { hello: true }), "a lesson opens when its prerequisites are done");
const upToLoops = { hello: 1, numbers: 1, decisions: 1, loops: 1 };
ok(Tiers.isUnlocked(g, "functions", upToLoops) && Tiers.isUnlocked(g, "lists", upToLoops), "Functions and Lists open together (same row)");
ok(Tiers.nextUp(g, upToLoops) === "functions", "next up is the first open lesson");
ok(Tiers.nextUp(g, { ...upToLoops, functions: 1 }) === "lists", "finishing one still leaves its sibling open");
ok(Tiers.nextUp(g, Object.fromEntries(g.order.map(id => [id, 1]))) === null, "nothing to suggest when everything is done");
console.log(`${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
