"""Tests for the code visualizer's tracer: python3 tests/tracer_test.py"""
import sys, time
from _runtime import trace, run, T

t = T()
r = trace("total = 0\nfor i in range(3):\n    total += i\nprint(total)\n")
t.check([s["ln"] for s in r["steps"] if s["ev"] == "line"] == [1, 2, 3, 2, 3, 2, 3, 2, 4], "loop line order")
t.check(r["out"] == "3\n" and r["error"] is None and not r["truncated"], "loop output")
last = r["steps"][-1]; gv = dict(last["s"][0]["v"])
t.check(last["ev"] == "end" and gv["total"] == {"p": "3"} and gv["i"] == {"p": "2"}, "final state")

r = trace("def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\nprint(fact(3))\n")
t.check(max(len(s["s"]) for s in r["steps"]) == 4, "recursion depth")
t.check([s["ret"] for s in r["steps"] if s["ev"] == "return"] == [{"p": "1"}, {"p": "2"}, {"p": "6"}], "return values")

r = trace("a = [1, 2]\nb = a\nb.append(3)\nc = [1, 2]\n")
s = r["steps"][-1]; v = dict(s["s"][0]["v"])
t.check(v["a"] == v["b"] and v["a"] != v["c"], "aliasing shares one object")
t.check(s["h"][str(v["a"]["r"])]["i"] == [{"p": "1"}, {"p": "2"}, {"p": "3"}], "list contents")

r = trace("class Dog:\n    def __init__(self, name):\n        self.name = name\nd = Dog('Rex')\n")
s = r["steps"][-1]; v = dict(s["s"][0]["v"]); obj = s["h"][str(v["d"]["r"])]
t.check(obj == {"k": "obj", "n": "Dog", "i": [["name", {"p": "'Rex'"}]], "m": 0}, "instance attributes")
t.check(s["h"][str(v["Dog"]["r"])]["k"] == "class", "class object")

r = trace("x = 1\ny = x / 0\nprint('never')\n")
t.check(r["error"]["type"] == "ZeroDivisionError" and r["error"]["line"] == 2, "error info")
t.check(sum(s["ev"] == "exception" for s in r["steps"]) == 1 and r["steps"][-1]["ev"] == "exception", "one exception step, nothing after it")

start = time.time(); r = trace("i = 0\nwhile True:\n    i += 1\n", max_steps=300)
t.check(r["truncated"] and len(r["steps"]) == 300 and time.time() - start < 2 and r["error"] is None, "runaway loop is truncated, not an error")

r = trace("def f(:\n  pass"); t.check(r["steps"] == [] and r["error"]["type"] == "SyntaxError", "syntax error")
t.check(trace("name = input('x')\n")["error"]["type"] == "RuntimeError", "input() is unsupported")
t.check([n for n, _ in trace("import math\nx = math.sqrt(16)\n")["steps"][-1]["s"][0]["v"]] == ["x"], "modules are hidden")
r = trace("big = list(range(100))\ns = 'a' * 200\n"); s = r["steps"][-1]; v = dict(s["s"][0]["v"]); h = s["h"][str(v["big"]["r"])]
t.check(len(h["i"]) == 24 and h["m"] == 76 and len(v["s"]["p"]) <= 44, "long values are truncated")
t.check([x["o"] for x in trace("x = 1\nprint('hi')\nprint('there')\n")["steps"]] == [0, 0, 3, 9], "output offsets per step")
r = trace("def g():\n    yield 1\n    yield 2\nprint(list(g()))\n"); t.check(r["error"] is None and r["out"] == "[1, 2]\n", "generators trace")
run("print(1)"); t.check(sys.gettrace() is None, "tracing is switched off afterwards")
t.done()
