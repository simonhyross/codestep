/* Python-side runtime: code runner, test harness, profiler and linter.
   Kept as a raw string so it can be shipped into the Pyodide web worker. */
window.PY_RUNTIME = String.raw`
import sys, io, ast, json, re, time, types, builtins, traceback, tracemalloc

# ---------------------------------------------------------------- running
HINTS = {
    "NameError": "A name was used before it was defined. Check spelling and order.",
    "TypeError": "An operation got a value of the wrong type.",
    "IndexError": "You asked for a position that does not exist in the list.",
    "KeyError": "That key is not in the dictionary.",
    "ZeroDivisionError": "You divided by zero.",
    "IndentationError": "Python uses indentation to group code. Check your spaces.",
    "SyntaxError": "Python could not understand this line. Check colons, quotes and brackets.",
    "RecursionError": "A function kept calling itself. Does it have a base case?",
    "ValueError": "The value has the right type but an unsuitable content.",
    "AttributeError": "That object has no such attribute or method.",
}

def _input(prompt=""):
    raise RuntimeError("input() is not available in this playground. Assign a value to a variable instead.")

def _format_exc(e):
    line = None
    if isinstance(e, SyntaxError):
        line = e.lineno
        msg = e.msg
    else:
        msg = str(e)
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == "<main>":
                line = fr.lineno
    name = type(e).__name__
    return {"type": name, "msg": msg, "line": line, "hint": HINTS.get(name)}

def _make_run_with(code):
    tree = ast.parse(code)
    def run_with(**kw):
        body = []
        for node in tree.body:
            if (isinstance(node, ast.Assign) and len(node.targets) == 1
                    and isinstance(node.targets[0], ast.Name) and node.targets[0].id in kw):
                continue
            body.append(node)
        mod = ast.Module(body=body, type_ignores=[])
        ns2 = {"__name__": "__main__", "input": _input}
        ns2.update(kw)
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        try:
            exec(compile(mod, "<main>", "exec"), ns2)
        finally:
            sys.stdout = old
        return types.SimpleNamespace(out=buf.getvalue(), vars=ns2)
    return run_with

def _timed(fn, *args, **kw):
    t = time.perf_counter()
    r = fn(*args, **kw)
    return r, time.perf_counter() - t

def run_code(code, tests=None, profile=False):
    ns = {"__name__": "__main__", "input": _input}
    out = io.StringIO()
    real = (sys.stdout, sys.stderr)
    sys.stdout = sys.stderr = out
    err = None
    prof = None
    try:
        if profile:
            tracemalloc.start()
        t0 = time.perf_counter()
        try:
            exec(compile(code, "<main>", "exec"), ns)
        except BaseException as e:
            err = _format_exc(e)
        dt = time.perf_counter() - t0
        if profile:
            _, peak = tracemalloc.get_traced_memory()
            tracemalloc.stop()
            prof = {"ms": dt * 1000, "peak_kb": peak / 1024}
    finally:
        sys.stdout, sys.stderr = real
    text = out.getvalue()
    res = {"out": text, "error": err, "profile": prof}
    if tests is not None:
        if err is not None:
            res["passed"] = False
            res["message"] = "Fix the error above first, then check again."
        else:
            ns["output"] = text
            ns["source"] = code
            ns["run_with"] = _make_run_with(code)
            ns["timed"] = _timed
            sys.stdout = sys.stderr = io.StringIO()
            try:
                exec(compile(tests, "<tests>", "exec"), ns)
                res["passed"] = True
            except AssertionError as e:
                res["passed"] = False
                res["message"] = str(e) or "Not quite right yet. Re-read the task."
            except NameError as e:
                res["passed"] = False
                res["message"] = "I could not find " + (repr(e.name) if getattr(e, "name", None) else "a name") + ". Did you define it with the exact name from the task?"
            except BaseException as e:
                res["passed"] = False
                res["message"] = "Your code raised " + type(e).__name__ + ": " + str(e) + " while being tested."
            finally:
                sys.stdout, sys.stderr = real
    return json.dumps(res)

# ---------------------------------------------------------------- linting
_BUILTINS = set(dir(builtins))
_SHADOW = {"list", "dict", "set", "str", "int", "float", "bool", "tuple", "sum", "max", "min",
           "len", "sorted", "input", "type", "id", "all", "any", "map", "filter", "next",
           "iter", "range", "print", "format", "hash", "object", "round", "abs", "zip", "bytes"}
_SNAKE = re.compile(r"^_{0,2}[a-z][a-z0-9_]*$|^__[a-z0-9_]+__$|^_$")
_CAPS = re.compile(r"^_?[A-Z][A-Za-z0-9]*$")

def _walk_scope(nodes):
    """Walk nodes but do not descend into nested function/class scopes."""
    stack = list(nodes)
    while stack:
        n = stack.pop()
        yield n
        for c in ast.iter_child_nodes(n):
            if not isinstance(c, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.Lambda)):
                stack.append(c)

def lint(code):
    issues = []
    def add(line, col, sev, rule, msg):
        issues.append({"line": line, "col": col, "severity": sev, "rule": rule, "message": msg})

    lines = code.split("\n")
    for i, ln in enumerate(lines, 1):
        if ln != ln.rstrip():
            add(i, len(ln.rstrip()), "info", "W291", "Trailing whitespace")
        if "\t" in ln[: len(ln) - len(ln.lstrip())]:
            add(i, 0, "info", "W191", "Use 4 spaces for indentation, not tabs")
        if len(ln) > 88:
            add(i, 88, "info", "E501", "Line too long (%d > 88 characters)" % len(ln))

    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        add(e.lineno or 1, max((e.offset or 1) - 1, 0), "error", "E999", "Syntax error: %s" % e.msg)
        return json.dumps(issues)

    bound, loaded, imports = set(), set(), []
    for n in ast.walk(tree):
        if isinstance(n, ast.Name):
            if isinstance(n.ctx, ast.Load):
                loaded.add(n.id)
            else:
                bound.add(n.id)
        elif isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            bound.add(n.name)
        elif isinstance(n, ast.arg):
            bound.add(n.arg)
        elif isinstance(n, ast.ExceptHandler) and n.name:
            bound.add(n.name)
        elif isinstance(n, (ast.Import, ast.ImportFrom)):
            for a in n.names:
                nm = a.asname or a.name.split(".")[0]
                if nm == "*":
                    continue
                bound.add(nm)
                imports.append((nm, n.lineno, n.col_offset))
        elif isinstance(n, (ast.Global, ast.Nonlocal)):
            bound.update(n.names)
        else:
            for attr in ("name", "rest"):
                v = getattr(n, attr, None)
                if isinstance(v, str) and type(n).__name__.startswith("Match"):
                    bound.add(v)

    star = any(isinstance(n, ast.ImportFrom) and any(a.name == "*" for a in n.names) for n in ast.walk(tree))
    known = bound | _BUILTINS | {"__name__", "__file__", "__doc__"}
    seen = set()
    for n in ast.walk(tree):
        if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Load) and n.id not in known and not star:
            if (n.id, n.lineno) not in seen:
                seen.add((n.id, n.lineno))
                add(n.lineno, n.col_offset, "error", "F821", "Undefined name '%s'" % n.id)

    for nm, ln, col in imports:
        if nm not in loaded:
            add(ln, col, "warning", "F401", "'%s' is imported but never used" % nm)

    funcs = [n for n in ast.walk(tree) if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
    for f in funcs:
        used = {n.id for n in ast.walk(f) if isinstance(n, ast.Name) and isinstance(n.ctx, ast.Load)}
        declared = set()
        for n in _walk_scope(f.body):
            if isinstance(n, (ast.Global, ast.Nonlocal)):
                declared.update(n.names)
        for n in _walk_scope(f.body):
            if isinstance(n, ast.Assign):
                for t in n.targets:
                    if isinstance(t, ast.Name) and t.id not in used and t.id not in declared and not t.id.startswith("_"):
                        add(t.lineno, t.col_offset, "warning", "F841",
                            "Variable '%s' is assigned but never used" % t.id)
        for d in f.args.defaults + [d for d in f.args.kw_defaults if d is not None]:
            if isinstance(d, (ast.List, ast.Dict, ast.Set)) or (
                    isinstance(d, ast.Call) and isinstance(d.func, ast.Name) and d.func.id in ("list", "dict", "set")):
                add(d.lineno, d.col_offset, "warning", "B006",
                    "Mutable default argument is shared between calls. Use None and create it inside.")

    for n in ast.walk(tree):
        if isinstance(n, ast.FunctionDef) and not _SNAKE.match(n.name):
            add(n.lineno, n.col_offset, "info", "N802", "Function name '%s' should be snake_case" % n.name)
        elif isinstance(n, ast.ClassDef) and not _CAPS.match(n.name):
            add(n.lineno, n.col_offset, "info", "N801", "Class name '%s' should be CapWords" % n.name)
        elif isinstance(n, ast.ExceptHandler) and n.type is None:
            add(n.lineno, n.col_offset, "warning", "E722", "Bare 'except' hides bugs. Catch a specific exception.")
        elif isinstance(n, ast.Compare):
            for op, comp in zip(n.ops, n.comparators):
                if isinstance(op, (ast.Eq, ast.NotEq)) and isinstance(comp, ast.Constant):
                    if comp.value is None:
                        add(n.lineno, n.col_offset, "warning", "E711", "Compare to None with 'is' or 'is not'")
                    elif comp.value is True or comp.value is False:
                        add(n.lineno, n.col_offset, "warning", "E712", "Don't compare to True/False. Use the value directly.")
                if isinstance(op, (ast.Is, ast.IsNot)) and isinstance(comp, ast.Constant) \
                        and isinstance(comp.value, (str, bytes, int, float)) and not isinstance(comp.value, bool):
                    add(n.lineno, n.col_offset, "warning", "F632", "Use '==' to compare with a literal, not 'is'")
        elif isinstance(n, ast.Name) and isinstance(n.ctx, ast.Store) and n.id in _SHADOW:
            add(n.lineno, n.col_offset, "info", "A001", "'%s' shadows a built-in. Pick another name." % n.id)
        elif isinstance(n, ast.arg) and n.arg in _SHADOW:
            add(n.lineno, n.col_offset, "info", "A002", "Argument '%s' shadows a built-in." % n.arg)

    for n in ast.walk(tree):
        for field in ("body", "orelse", "finalbody"):
            body = getattr(n, field, None)
            if isinstance(body, list):
                for a, b in zip(body, body[1:]):
                    if isinstance(a, (ast.Return, ast.Raise, ast.Break, ast.Continue)) and isinstance(b, ast.stmt):
                        add(b.lineno, b.col_offset, "warning", "W0101", "Unreachable code after '%s'" % type(a).__name__.lower())

    for n in tree.body[1:]:
        if isinstance(n, (ast.FunctionDef, ast.ClassDef, ast.AsyncFunctionDef)):
            first = min([n.lineno] + [d.lineno for d in n.decorator_list])
            j = first - 2
            while j >= 0 and lines[j].lstrip().startswith("#"):
                j -= 1
            blanks = 0
            while j >= 0 and not lines[j].strip():
                blanks += 1
                j -= 1
            if j >= 0 and blanks < 2:
                add(first, 0, "info", "E302", "Expected 2 blank lines before a top-level definition")

    issues.sort(key=lambda d: (d["line"], d["col"]))
    return json.dumps(issues)
`;
