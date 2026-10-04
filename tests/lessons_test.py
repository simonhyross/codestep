"""Validates the curriculum: python3 tests/lessons_test.py
- every coding step: the reference solution passes its tests and the starter does not
- every predict step: the stated answer is exactly what the code prints, and the code can be traced
- every code sample with a "Watch it run" button runs without errors
- quiz answers are in range and every wrong option has a reason"""
import html, re
from _runtime import UNITS, EXAMPLES, run, trace, lint, T

t = T()
for u in UNITS:
    for l in u["lessons"]:
        for i, s in enumerate(l["steps"]):
            where = f'{l["id"]}:{i}'
            if s["type"] == "code":
                r = run(s["solution"], s["tests"])
                t.check(r.get("passed"), f"{where} solution fails: {r.get('message') or r.get('error')}")
                t.check(not run(s["starter"], s["tests"]).get("passed"), f"{where} starter already passes")
                t.check(not [x for x in lint(s["solution"]) if x["severity"] != "info"], f"{where} solution has lint warnings")
            elif s["type"] == "predict":
                r = run(s["code"])
                t.check(r["error"] is None and r["out"].rstrip("\n") == s["answer"], f"{where} answer {s['answer']!r} != output {r['out']!r}")
                tr = trace(s["code"])
                t.check(tr["error"] is None and len(tr["steps"]) >= 3, f"{where} cannot be traced")
            elif s["type"] == "quiz":
                t.check(0 <= s["answer"] < len(s["options"]), f"{where} answer index")
                t.check(len(s["why"]) == len(s["options"]) and s["why"][s["answer"]] is None and all(s["why"][k] for k in range(len(s["options"])) if k != s["answer"]), f"{where} missing wrong-answer reasons")
            elif s["type"] == "learn":
                for m in re.finditer(r"<pre data-run><code>(.*?)</code></pre>", s["html"], re.S):
                    code = html.unescape(m.group(1))
                    tr = trace(code)
                    t.check(tr["error"] is None and len(tr["steps"]) >= 2, f"{where} 'Watch it run' sample fails: {code[:40]!r}")
for e in EXAMPLES:
    t.check(run(e["code"], profile=False)["error"] is None or e["name"].startswith("Linter demo"), f"example {e['name']} errors")
t.done()
