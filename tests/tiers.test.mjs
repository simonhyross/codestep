// node tests/tiers.test.mjs : the rows of the learning path, checked against the real curriculum
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
for (const f of ["lessons.js", "tiers.js"]) new Function("window", readFileSync(join(root, f), "utf8").replace(/^const py/m, "var py"))(globalThis.window);
const { UNITS, Tiers } = window;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : (fail++, console.log("FAIL:", m)); };

const g = Tiers.build(UNITS);
const lvl = id => UNITS.flatMap(u => u.lessons).find(l => l.id === id).level;                                   // throws on unknown prerequisites or cycles
ok(g.order.length === 58 && g.rows.flat().length === 58, "every lesson is in exactly one row");
ok(g.rows.every(r => r && r.length >= 1), "no empty rows");
ok(UNITS.every(u => u.lessons.every(l => [1, 2, 3, 4].includes(l.level))), "every lesson has a difficulty level 1-4");
ok(UNITS.every(u => u.lessons.every(l => !l.needs.length || l.needs.every(p => g.byId[p] && lvl(p) <= l.level + 1))), "a lesson never builds on something two or more levels harder");
ok(g.rows[0].length === 1 && g.rows[0][0] === "hello", "the path starts with Hello");
ok(Math.max(...g.rows.map(r => r.length)) <= 14, `rows are small enough to read as choices (widest: ${Math.max(...g.rows.map(r => r.length))})`);
ok(g.rows.length >= 8 && g.rows.length <= 16, `${g.rows.length} rows`);
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
ok(g.byId.tipcalc.project && Tiers.isUnlocked(g, "tipcalc", upToLoops), "a mini-project is open once its prerequisites are done");
ok(Tiers.nextUp(g, { ...upToLoops, functions: 1 }) === "lists", "finishing one still leaves its sibling open");
ok(Tiers.nextUp(g, Object.fromEntries(g.order.map(id => [id, 1]))) === null, "nothing to suggest when everything is done");
ok(g.rows[g.rows.length - 1].length === 1 && g.rows[g.rows.length - 1][0] === "gradebook", "the path ends at one goal: the Gradebook project");
console.log(`${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
