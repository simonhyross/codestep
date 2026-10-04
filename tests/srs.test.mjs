// node tests/srs.test.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
globalThis.window = {};
new Function("window", readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "srs.js"), "utf8"))(globalThis.window);
const { next, addDays, daysBetween, pick, weak, stats, upcoming, seed, isDue, isMastered } = window.Srs;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : (fail++, console.log("FAIL:", m)); };
const T0 = "2026-10-04";

ok(addDays("2026-10-30", 3) === "2026-11-02" && addDays("2026-12-30", 3) === "2027-01-02" && addDays("2026-03-01", -1) === "2026-02-28", "addDays crosses month and year ends");
ok(daysBetween("2026-10-01", "2026-10-04") === 3 && daysBetween("2026-10-04", "2026-10-01") === -3, "daysBetween");

// a perfect learner: gaps grow 1, 3, ~8, ~20, ...
let it = null, today = T0, gaps = [];
for (let n = 0; n < 6; n++) { it = next(it, "good", today); gaps.push(it.interval); today = it.due; }
ok(gaps[0] === 1 && gaps[1] === 3 && gaps[2] > gaps[1] && gaps[3] > gaps[2] && gaps[5] <= 180, `gaps grow and are capped: ${gaps}`);
ok(it.ease > 2.5 && it.ease <= 3, "ease rises with success and is capped");

// a mistake resets the gap and makes the item harder
const lapsed = next(it, "again", today);
ok(lapsed.reps === 0 && lapsed.interval === 1 && lapsed.lapses === 1 && lapsed.ease < it.ease && lapsed.due === addDays(today, 1), "again resets the schedule");
ok(Math.abs(next({ reps: 5, interval: 10, ease: 1.3, lapses: 0 }, "again", T0).ease - 1.3) < 1e-9, "ease never drops below 1.3");

// hard grows slowly
const h = next({ reps: 3, interval: 10, ease: 2.5, lapses: 0 }, "hard", T0);
ok(h.interval === 12 && h.ease < 2.5, "hard grows the gap by 20% and lowers ease");
ok(next(null, "hard", T0).interval === 1, "first hard review is due tomorrow");
const input = { reps: 1, interval: 1, ease: 2.5, lapses: 0, due: T0 };
next(input, "good", T0); ok(input.reps === 1, "next() does not mutate its input");

// due selection
const items = {
  "a:1": { ...input, due: "2026-10-01", ease: 2.5 }, "b:1": { ...input, due: "2026-10-04", ease: 2.5 }, "c:1": { ...input, due: "2026-10-05" },
  "d:2": { ...input, due: "2026-09-20" }, "e:2": { ...input, due: "2026-09-21" }, "f:2": { ...input, due: "2026-09-22" }, "g:2": { ...input, due: "2026-09-23" },
};
const kindOf = k => (k.endsWith(":2") ? "code" : "quiz");
const picked = pick(items, T0, { max: 10, maxCode: 2, kindOf });
ok(!picked.includes("c:1"), "future items are not picked");
ok(picked[0] === "d:2" && picked.indexOf("d:2") < picked.indexOf("a:1"), "most overdue first");
ok(picked.filter(k => kindOf(k) === "code").length === 2, "code exercises are capped per session");
ok(pick(items, T0, { max: 2, kindOf }).length === 2, "session size is capped");
ok(pick({}, T0).length === 0, "nothing to pick when there are no items");
ok(isDue(items["b:1"], T0) && !isDue(items["c:1"], T0), "due today counts as due");

// weak spots: lapses and low ease first
const w = weak({ x: { ...input, lapses: 0, ease: 2.5 }, y: { ...input, lapses: 2, ease: 1.7 }, z: { ...input, lapses: 0, ease: 1.5 } }, { max: 2 });
ok(w[0] === "y" && w[1] === "z", `weakest first: ${w}`);

// stats and upcoming
const st = stats({ a: { ...input, due: T0, interval: 30 }, b: { ...input, due: "2026-10-09", interval: 3 }, c: { ...input, due: "2026-09-01", interval: 1 } }, T0);
ok(st.total === 3 && st.due === 2 && st.mastered === 1 && st.learning === 2, `stats ${JSON.stringify(st)}`);
ok(isMastered({ interval: 21 }) && !isMastered({ interval: 20 }), "mastered at a 21 day gap");
const up = upcoming({ a: { ...input, due: "2026-09-01" }, b: { ...input, due: T0 }, c: { ...input, due: "2026-10-06" }, d: { ...input, due: "2026-11-30" } }, T0, 7);
ok(up[0] === 2 && up[2] === 1 && up.reduce((x, y) => x + y) === 3, `upcoming ${up}`);

// seeding spreads items out
const s = seed(["k1", "k2", "k3", "k4"], T0);
ok(Object.keys(s).length === 4 && s.k1.due === addDays(T0, 1) && s.k2.due === addDays(T0, 2) && s.k3.due === addDays(T0, 3) && s.k4.due === addDays(T0, 1), "seeded items are spread over three days");
console.log(`${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
