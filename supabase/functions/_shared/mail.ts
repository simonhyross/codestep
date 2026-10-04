// Pure helpers shared by the email functions. No Deno-specific APIs, so they can be unit-tested in Node.

export type Kind = "reminder" | "digest";
export type Lang = "en" | "es" | "de" | "fr" | "sv";

const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
}

/** Signs "<user>:<kind>" so an unsubscribe link can only be used for the user and list it was issued for. */
export const signUnsub = (secret: string, user: string, kind: Kind) => hmac(secret, `${user}:${kind}`);

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
export async function verifyUnsub(secret: string, user: string, kind: string, sig: string): Promise<boolean> {
  if (kind !== "reminder" && kind !== "digest") return false;
  if (!/^[0-9a-f-]{36}$/i.test(user) || !/^[0-9a-f]{64}$/.test(sig)) return false;
  return safeEqual(await signUnsub(secret, user, kind), sig);
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const T: Record<Lang, { rs: string; rh: (n: string, s: number) => string; rb: string; ds: string; dh: (n: string) => string; db: (xp: number, s: number) => string; cta: string; unsub: string; why: string }> = {
  en: { rs: "Time for your Python practice 🐍", rh: (n, s) => `Hi ${n}, ready for today's lesson?${s > 0 ? ` Don't lose your ${s}-day streak!` : ""}`, rb: "It only takes a few minutes.", ds: "Your week in Codestep", dh: n => `Hi ${n}, here's your week`, db: (xp, s) => `You earned ${xp} XP this week. Current streak: ${s} day${s === 1 ? "" : "s"}.`, cta: "Open Codestep", unsub: "Unsubscribe", why: "You're receiving this because you turned on this email in Codestep settings." },
  es: { rs: "Hora de practicar Python 🐍", rh: (n, s) => `Hola ${n}, ¿listo para la lección de hoy?${s > 0 ? ` ¡No pierdas tu racha de ${s} días!` : ""}`, rb: "Solo lleva unos minutos.", ds: "Tu semana en Codestep", dh: n => `Hola ${n}, este es tu resumen`, db: (xp, s) => `Ganaste ${xp} XP esta semana. Racha actual: ${s} ${s === 1 ? "día" : "días"}.`, cta: "Abrir Codestep", unsub: "Darme de baja", why: "Recibes esto porque activaste este correo en los ajustes de Codestep." },
  de: { rs: "Zeit für dein Python-Training 🐍", rh: (n, s) => `Hi ${n}, bereit für die heutige Lektion?${s > 0 ? ` Verliere nicht deine ${s}-Tage-Serie!` : ""}`, rb: "Es dauert nur ein paar Minuten.", ds: "Deine Woche in Codestep", dh: n => `Hi ${n}, hier ist deine Woche`, db: (xp, s) => `Du hast diese Woche ${xp} XP gesammelt. Aktuelle Serie: ${s} ${s === 1 ? "Tag" : "Tage"}.`, cta: "Codestep öffnen", unsub: "Abbestellen", why: "Du erhältst dies, weil du diese E-Mail in den Codestep-Einstellungen aktiviert hast." },
  fr: { rs: "C'est l'heure de pratiquer Python 🐍", rh: (n, s) => `Salut ${n}, prêt pour la leçon du jour ?${s > 0 ? ` Ne perds pas ta série de ${s} jours !` : ""}`, rb: "Ça ne prend que quelques minutes.", ds: "Ta semaine sur Codestep", dh: n => `Salut ${n}, voici ta semaine`, db: (xp, s) => `Tu as gagné ${xp} XP cette semaine. Série actuelle : ${s} ${s > 1 ? "jours" : "jour"}.`, cta: "Ouvrir Codestep", unsub: "Se désabonner", why: "Tu reçois cet e-mail car tu l'as activé dans les réglages de Codestep." },
  sv: { rs: "Dags att öva Python 🐍", rh: (n, s) => `Hej ${n}, redo för dagens lektion?${s > 0 ? ` Tappa inte din ${s}-dagars svit!` : ""}`, rb: "Det tar bara några minuter.", ds: "Din vecka i Codestep", dh: n => `Hej ${n}, här är din vecka`, db: (xp, s) => `Du tjänade ${xp} XP den här veckan. Nuvarande svit: ${s} ${s === 1 ? "dag" : "dagar"}.`, cta: "Öppna Codestep", unsub: "Avsluta prenumeration", why: "Du får det här för att du slog på mejlet i Codesteps inställningar." },
};

export function renderEmail(kind: Kind, p: { username: string; language: string; streak: number; week_xp: number }, siteUrl: string, unsubUrl: string) {
  const L = T[(p.language as Lang) in T ? (p.language as Lang) : "en"];
  const name = p.username;
  const subject = kind === "reminder" ? L.rs : L.ds;
  const head = kind === "reminder" ? L.rh(name, p.streak) : L.dh(name);
  const body = kind === "reminder" ? L.rb : L.db(p.week_xp, p.streak);
  const text = `${head}\n\n${body}\n\n${L.cta}: ${siteUrl}\n\n--\n${L.why}\n${L.unsub}: ${unsubUrl}\n`;
  const html = `<!doctype html><html><body style="margin:0;background:#fbf7ec;font-family:Arial,Helvetica,sans-serif;color:#0b1b3a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 16px">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:2px solid #e6dfc9;border-radius:20px">
<tr><td style="padding:28px">
<div style="font-size:22px;font-weight:800;letter-spacing:-.5px;margin-bottom:14px">codestep</div>
<h1 style="font-size:22px;line-height:1.25;margin:0 0 10px">${escapeHtml(head)}</h1>
<p style="font-size:16px;line-height:1.5;color:#4b5a7c;margin:0 0 22px">${escapeHtml(body)}</p>
<a href="${escapeHtml(siteUrl)}" style="display:inline-block;background:#2f6bff;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:12px">${escapeHtml(L.cta)}</a>
</td></tr></table>
<p style="font-size:12px;color:#8591ae;max-width:440px;line-height:1.5;margin:16px 0 0">${escapeHtml(L.why)} <a href="${escapeHtml(unsubUrl)}" style="color:#8591ae">${escapeHtml(L.unsub)}</a></p>
</td></tr></table></body></html>`;
  return { subject, text, html };
}
