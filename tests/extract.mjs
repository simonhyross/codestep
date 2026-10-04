// Prints the Python runtime source and the lesson data as JSON, so Python tests can load them.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
for (const f of ["pyruntime.js", "lessons.js"]) new Function("window", readFileSync(join(root, f), "utf8").replace(/^const py/m, "var py"))(globalThis.window);
process.stdout.write(JSON.stringify({ runtime: window.PY_RUNTIME, units: window.UNITS, examples: window.EXAMPLES }));
