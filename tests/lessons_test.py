"""Validates the curriculum: python3 tests/lessons_test.py
- every coding step: the reference solution passes its tests and the starter does not
- every predict step: the stated answer is exactly what the code prints, and the code can be traced
- fill and order steps: the right blanks/order pass, wrong ones fail, distractors break the program
- every code sample with a "Watch it run" / "Try it" button runs without errors
- quiz answers are in range and every wrong option has a reason"""
import html, re
from _runtime import UNITS, EXAMPLES, run, trace, lint, T

t = T()
def hint_ok(s):
    h = s.get("hint")
    return bool(h) and (isinstance(h, str) or all(isinstance(x, str) and x for x in h))

for u in UNITS:
    for l in u["lessons"]:
        for i, s in enumerate(l["steps"]):
            where = f'{l["id"]}:{i}'
            if s["type"] == "code":
                r = run(s["solution"], s["tests"])
                t.check(r.get("passed"), f"{where} solution fails: {r.get('message') or r.get('error')}")
                t.check(not run(s["starter"], s["tests"]).get("passed"), f"{where} starter already passes")
                t.check(not [x for x in lint(s["solution"]) if x["severity"] != "info"], f"{where} solution has lint warnings")
                if s.get("mode") == "fix":
                    t.check(s["starter"].strip() != s["solution"].strip() and len(s["starter"]) > 20, f"{where} the buggy program must differ from the fix")
            elif s["type"] == "fill":
                parts = s["template"].split("___")
                t.check(len(parts) == len(s["blanks"]) + 1, f"{where} needs one answer per blank ({len(parts) - 1} blanks, {len(s['blanks'])} answers)")
                good = "".join(p + (s["blanks"][k] if k < len(s["blanks"]) else "") for k, p in enumerate(parts))
                r = run(good, s["tests"])
                t.check(r.get("passed"), f"{where} filled-in solution fails: {r.get('message') or r.get('error')}")
                t.check(not [x for x in lint(good) if x["severity"] != "info"], f"{where} filled-in solution has lint warnings")
                empty = "".join(p + ("0" if k < len(parts) - 1 else "") for k, p in enumerate(parts))
                t.check(not run(empty, s["tests"]).get("passed"), f"{where} passes with the wrong blanks")
                t.check(hint_ok(s), f"{where} needs hints")
            elif s["type"] == "order":
                pre = (s["given"].rstrip() + "\n") if s.get("given") else ""
                code = pre + "\n".join(s["lines"])
                r = run(code, s["tests"])
                t.check(r.get("passed"), f"{where} correct order fails: {r.get('message') or r.get('error')}")
                t.check(len(s["lines"]) >= 3, f"{where} too few lines to be a puzzle")
                t.check(not run(pre + "\n".join(s["lines"][1:] + s["lines"][:1]), s["tests"]).get("passed"), f"{where} still passes when the lines are rotated: order does not matter")
                for d in s.get("distractors", []):
                    t.check(not run(pre + "\n".join(s["lines"] + [d]), s["tests"]).get("passed"), f"{where} distractor {d!r} is harmless: it must break the program")
                t.check(hint_ok(s), f"{where} needs hints")
            elif s["type"] == "predict":
                r = run(s["code"])
                t.check(r["error"] is None and r["out"].rstrip("\n") == s["answer"], f"{where} answer {s['answer']!r} != output {r['out']!r}")
                tr = trace(s["code"])
                t.check(tr["error"] is None and len(tr["steps"]) >= 3, f"{where} cannot be traced")
            elif s["type"] == "quiz":
                t.check(0 <= s["answer"] < len(s["options"]), f"{where} answer index")
                t.check(len(s["why"]) == len(s["options"]) and s["why"][s["answer"]] is None and all(s["why"][k] for k in range(len(s["options"])) if k != s["answer"]), f"{where} missing wrong-answer reasons")
            elif s["type"] == "learn":
                for m in re.finditer(r"<pre data-(run|try)><code>(.*?)</code></pre>", s["html"], re.S):
                    code = html.unescape(m.group(2))
                    if m.group(1) == "run":
                        tr = trace(code)
                        t.check(tr["error"] is None and len(tr["steps"]) >= 2, f"{where} 'Watch it run' sample fails: {code[:40]!r}")
                    else:
                        t.check(run(code, profile=False)["error"] is None, f"{where} 'Try it' sample errors: {code[:40]!r}")
for e in EXAMPLES:
    t.check(run(e["code"], profile=False)["error"] is None or e["name"].startswith("Linter demo"), f"example {e['name']} errors")
t.done()
