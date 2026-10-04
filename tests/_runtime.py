"""Loads the Python runtime (pyruntime.js) and the lesson data via Node, for the tests."""
import json, subprocess, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
_data = json.loads(subprocess.run(["node", str(ROOT / "tests" / "extract.mjs")], capture_output=True, text=True, check=True).stdout)
UNITS, EXAMPLES = _data["units"], _data["examples"]
G = {}
exec(_data["runtime"], G)

def run(code, tests=None, **kw): return json.loads(G["run_code"](code, tests, **kw))
def trace(code, **kw): return json.loads(G["trace_code"](code, **kw))
def lint(code): return json.loads(G["lint"](code))

class T:
    def __init__(self): self.ok = self.bad = 0
    def check(self, cond, msg):
        if cond: self.ok += 1
        else: self.bad += 1; print("FAIL:", msg)
    def done(self):
        print(f"{self.ok} passed, {self.bad} failed")
        raise SystemExit(1 if self.bad else 0)
