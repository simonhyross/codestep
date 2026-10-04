// Sends due practice reminders and weekly digests. Invoked every 15 minutes by pg_cron (see SETUP.md).
// Deploy: supabase functions deploy send-reminders --no-verify-jwt   (authenticated by x-cron-secret instead of a JWT)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.2";
import { renderEmail, safeEqual, signUnsub, type Kind } from "../_shared/mail.ts";

const env = (k: string) => { const v = Deno.env.get(k); if (!v) throw new Error(`missing env ${k}`); return v; };

Deno.serve(async req => {
  try {
    if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
    if (!safeEqual(req.headers.get("x-cron-secret") ?? "", env("CRON_SECRET"))) return new Response("unauthorized", { status: 401 });

    const supabaseUrl = env("SUPABASE_URL"), site = env("SITE_URL"), from = env("FROM_EMAIL"), resend = env("RESEND_API_KEY"), unsubSecret = env("UNSUBSCRIBE_SECRET");
    const admin = createClient(supabaseUrl, env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

    // Atomically claims due users (marks them as handled for today), so retries never double-send.
    const { data: due, error } = await admin.rpc("claim_due_emails");
    if (error) throw error;

    let sent = 0, skipped = 0, failed = 0;
    for (const u of due ?? []) {
      const { data: got } = await admin.auth.admin.getUserById(u.user_id);
      const email = got?.user?.email;
      if (!email || !got.user.email_confirmed_at) { skipped++; continue; }
      const kind = u.kind as Kind;
      const sig = await signUnsub(unsubSecret, u.user_id, kind);
      const unsubUrl = `${supabaseUrl}/functions/v1/unsubscribe?u=${u.user_id}&k=${kind}&s=${sig}`;
      const mail = renderEmail(kind, u, site, unsubUrl);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from, to: [email], subject: mail.subject, html: mail.html, text: mail.text,
          headers: { "List-Unsubscribe": `<${unsubUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        }),
      });
      if (res.ok) sent++; else { failed++; console.error("resend failed", res.status, await res.text()); }
    }
    return Response.json({ claimed: due?.length ?? 0, sent, skipped, failed });
  } catch (e) {
    console.error(e);
    return new Response("error", { status: 500 });
  }
});
