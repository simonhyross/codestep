// node --experimental-strip-types supabase/tests/mail.test.mjs
import { signUnsub, verifyUnsub, renderEmail, escapeHtml, safeEqual } from "../functions/_shared/mail.ts";
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : (fail++, console.log("  FAIL:", m)); };
const U = "5a44f3e0-797a-493c-ae39-623e45f21977", S = "secret-value";
const sig = await signUnsub(S, U, "reminder");
ok(/^[0-9a-f]{64}$/.test(sig), "signature is 64 hex chars");
ok(await verifyUnsub(S, U, "reminder", sig), "valid signature verifies");
ok(!(await verifyUnsub(S, U, "digest", sig)), "signature is bound to the list kind");
ok(!(await verifyUnsub(S, "6a44f3e0-797a-493c-ae39-623e45f21977", "reminder", sig)), "signature is bound to the user");
ok(!(await verifyUnsub("other-secret", U, "reminder", sig)), "wrong secret fails");
ok(!(await verifyUnsub(S, U, "reminder", sig.slice(0, 63) + (sig.endsWith("0") ? "1" : "0"))), "tampered signature fails");
ok(!(await verifyUnsub(S, U, "admin", sig)), "unknown kind rejected");
ok(!(await verifyUnsub(S, "x' or 1=1", "reminder", sig)), "malformed user id rejected");
ok(safeEqual("abc", "abc") && !safeEqual("abc", "abd") && !safeEqual("abc", "ab"), "safeEqual");
for (const lang of ["en", "es", "de", "fr", "sv", "xx"]) {
  const m = renderEmail("reminder", { username: "Ada<script>", language: lang, streak: 3, week_xp: 40 }, "https://x.io/app/", "https://x.io/u?a=1&b=2");
  ok(m.subject.length > 5 && m.text.includes("https://x.io/u?a=1&b=2") && m.html.includes("&lt;script&gt;") && !m.html.includes("<script>"), `reminder renders & escapes (${lang})`);
  const d = renderEmail("digest", { username: "Ada", language: lang, streak: 1, week_xp: 40 }, "https://x.io/app/", "https://x.io/u");
  ok(d.text.includes("40") && d.html.includes("https://x.io/u"), `digest renders (${lang})`);
}
ok(escapeHtml(`<a href="x">&'`) === "&lt;a href=&quot;x&quot;&gt;&amp;&#39;", "escapeHtml");
console.log(`${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
