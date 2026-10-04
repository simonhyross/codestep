#!/bin/sh
# Fast checks (no npm install needed). Used by .githooks/pre-commit; run it by hand any time.
cd "$(dirname "$0")/.." || exit 1
python3 tests/lessons_test.py && python3 tests/tracer_test.py && node tests/srs.test.mjs && node tests/tiers.test.mjs
