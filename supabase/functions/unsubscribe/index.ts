// One-click unsubscribe for reminder and digest emails.
// Deploy: supabase functions deploy unsubscribe --no-verify-jwt
// GET shows a confirmation button (so link scanners that prefetch URLs can't unsubscribe anyone);
// POST performs the change (this is also what mail clients use for List-Unsubscribe-Post one-click).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.2";
import { escapeHtml, verifyUnsub } from "../_shared/mail.ts";

const page = (title: string, body: string) => new Response(
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>
<body style="font-family:Arial,sans-serif;background:#fbf7ec;color:#0b1b3a;display:grid;place-items:center;min-height:100vh;margin:0"><main style="background:#fff;border:2px solid #e6dfc9;border-radius:20px;padding:28px;max-width:420px;text-align:center">
<h1 style="font-size:22px;margin:0 0 10px">${escapeHtml(title)}</h1>${body}</main></body>`,
  { headers: { "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer" } });

Deno.serve(async req => {
  const url = new URL(req.url), u = url.searchParams.get("u") ?? "", k = url.searchParams.get("k") ?? "", s = url.searchParams.get("s") ?? "";
  if (!(await verifyUnsub(Deno.env.get("UNSUBSCRIBE_SECRET") ?? "", u, k, s))) return page("Invalid link", "<p>This unsubscribe link is not valid.</p>");
  if (req.method === "POST") {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const { error } = await admin.rpc("set_email_pref", { p_user: u, p_kind: k, p_value: false });
    if (error) { console.error(error); return page("Something went wrong", "<p>Please try again later.</p>"); }
    return page("You're unsubscribed", "<p>You won't get these emails any more. You can turn them back on in Pythonic settings.</p>");
  }
  if (req.method === "GET") return page("Unsubscribe?", `<p>Stop receiving ${k === "digest" ? "weekly summary" : "daily reminder"} emails?</p><form method="POST"><button style="background:#2f6bff;color:#fff;border:0;border-radius:12px;padding:12px 22px;font-weight:700;font-size:15px;cursor:pointer">Unsubscribe</button></form>`);
  return new Response("method not allowed", { status: 405 });
});
