/* Spaced repetition. A small SM-2 style scheduler: every exercise you have done becomes a review item that comes
   back after a growing gap (1 day, 3 days, about a week, ...). Getting one wrong resets its gap.
   Pure functions only (no DOM, no storage) so they can be unit-tested. Days are local "YYYY-MM-DD" strings. */
(() => {
const DAY = 864e5;
const MIN_EASE = 1.3, MAX_EASE = 3, MAX_INTERVAL = 180, MASTERED_AT = 21;

const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (day, n) => { const [y, m, d] = day.split("-").map(Number); return dayKey(new Date(y, m - 1, d + n)); };
const daysBetween = (a, b) => { const p = s => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); }; return Math.round((p(b) - p(a)) / DAY); };
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/** quality: "again" (got it wrong), "hard" (needed a retry or a hint), "good" (first try). Returns the new item. */
function next(item, quality, today) {
  const it = item ? { ...item } : { reps: 0, interval: 0, ease: 2.5, lapses: 0 };
  if (quality === "again") {
    it.reps = 0; it.lapses += 1; it.interval = 1; it.ease = Math.max(MIN_EASE, it.ease - 0.2);
  } else if (quality === "hard") {
    it.reps += 1; it.interval = clamp(Math.round(Math.max(it.interval, 1) * 1.2), 1, MAX_INTERVAL); it.ease = Math.max(MIN_EASE, it.ease - 0.15);
  } else {
    it.reps += 1;
    it.interval = it.reps === 1 ? 1 : it.reps === 2 ? 3 : clamp(Math.round(it.interval * it.ease), 1, MAX_INTERVAL);
    it.ease = Math.min(MAX_EASE, it.ease + 0.05);
  }
  it.ease = Math.round(it.ease * 100) / 100;
  it.due = addDays(today, it.interval);
  it.last = today;
  return it;
}

const isDue = (it, today) => it.due <= today;
const isMastered = it => it.interval >= MASTERED_AT;

/** Items due today, most overdue first, at most `max`; no more than `maxCode` slow coding exercises. */
function pick(items, today, { max = 10, maxCode = 3, kindOf = () => "quiz" } = {}) {
  const due = Object.entries(items).filter(([, it]) => isDue(it, today))
    .sort((a, b) => daysBetween(b[1].due, today) - daysBetween(a[1].due, today) || a[1].ease - b[1].ease || a[0].localeCompare(b[0]));
  return take(due.map(([k]) => k), max, maxCode, kindOf);
}

/** Weakest items regardless of due date (for extra practice). */
function weak(items, { max = 8, maxCode = 2, kindOf = () => "quiz" } = {}) {
  const ranked = Object.entries(items).sort((a, b) => b[1].lapses - a[1].lapses || a[1].ease - b[1].ease || a[1].interval - b[1].interval || a[0].localeCompare(b[0]));
  return take(ranked.map(([k]) => k), max, maxCode, kindOf);
}

function take(keys, max, maxCode, kindOf) {
  const out = []; let code = 0;
  for (const k of keys) {
    if (out.length >= max) break;
    if (kindOf(k) === "code") { if (code >= maxCode) continue; code++; }
    out.push(k);
  }
  return out;
}

function stats(items, today) {
  const all = Object.values(items);
  const due = all.filter(it => isDue(it, today)).length, mastered = all.filter(isMastered).length;
  return { total: all.length, due, mastered, learning: all.length - mastered };
}

/** How many items fall due on each of the next `n` days (index 0 = today, overdue items count as today). */
function upcoming(items, today, n = 7) {
  const out = Array(n).fill(0);
  for (const it of Object.values(items)) { const d = Math.max(0, daysBetween(today, it.due)); if (d < n) out[d]++; }
  return out;
}

/** Starter items for exercises done before reviews existed. Spread over the next 3 days so they don't all land at once. */
function seed(keys, today) {
  const out = {};
  keys.forEach((k, n) => { const gap = 1 + (n % 3); out[k] = { reps: 1, interval: gap, ease: 2.5, lapses: 0, due: addDays(today, gap), last: today }; });
  return out;
}

window.Srs = { dayKey, addDays, daysBetween, next, isDue, isMastered, pick, weak, stats, upcoming, seed };
})();
