/**
 * Receives enquiries from the site.
 *
 * Runs with the service-role key so it can write the enquiry, its items and its
 * attachments in one place — but every field is re-validated here. The browser
 * is never trusted, and the anon-key insert policy is only a backstop.
 *
 * Secrets (set with `supabase secrets set`):
 *   RESEND_API_KEY, ENQUIRY_NOTIFY_TO, ENQUIRY_FROM_EMAIL,
 *   ENQUIRY_SEND_CLIENT_COPY, TURNSTILE_SECRET_KEY
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((o) => o.trim()).filter(Boolean);

const ROOMS = [
  "terrace", "lounge", "corridor", "washroom", "bedroom",
  "office", "study", "stairway", "kitchen", "dining", "foyer",
];
const CATEGORIES = ["art", "mirror", "decor"];

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX = 3;

function corsHeaders(origin: string | null): Record<string, string> {
  const allow =
    ALLOWED_ORIGINS.length === 0 || (origin && ALLOWED_ORIGINS.includes(origin))
      ? origin ?? "*"
      : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionalNumber(value: unknown, max: number): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > max) return null;
  return n;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return true; // Not configured yet — don't block real enquiries.
  if (!token) return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const result = (await res.json()) as { success?: boolean };
  return Boolean(result.success);
}

async function sendEmail(payload: Record<string, unknown>): Promise<void> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // An email failure must never lose the lead — it's already persisted.
    console.error("Resend failed", res.status, await res.text());
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400, origin);
  }

  // Honeypot: silently accept so bots don't learn anything.
  if (str(body.company, 200)) {
    return json({ reference: "RECEIVED" }, 200, origin);
  }

  const name = str(body.name, 120);
  const email = str(body.email, 200).toLowerCase();
  const message = str(body.message, 4000);

  if (name.length < 2) return json({ error: "Please tell us your name." }, 400, origin);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "That email address doesn't look right." }, 400, origin);
  }
  if (message.length < 10) {
    return json({ error: "Please add a sentence or two about the room." }, 400, origin);
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  if (!(await verifyTurnstile(str(body.turnstileToken, 3000), ip))) {
    return json({ error: "We couldn't verify that request. Please try again." }, 400, origin);
  }

  const db = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  // Rate limit per email address.
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await db
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", since);

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return json(
      { error: "We've already received your enquiry. We'll be in touch shortly." },
      429,
      origin,
    );
  }

  const rooms = Array.isArray(body.rooms)
    ? (body.rooms as unknown[]).map((r) => str(r, 20)).filter((r) => ROOMS.includes(r))
    : [];
  const category = CATEGORIES.includes(str(body.category, 20)) ? str(body.category, 20) : null;
  const serviceId = /^[0-9a-f-]{36}$/i.test(str(body.serviceId, 40)) ? str(body.serviceId, 40) : null;

  const { data: enquiry, error } = await db
    .from("enquiries")
    .insert({
      name,
      email,
      phone: str(body.phone, 32) || null,
      whatsapp_opt_in: Boolean(body.whatsappOptIn),
      service_id: serviceId,
      category,
      rooms,
      budget_band: str(body.budgetBand, 60) || null,
      timeline: str(body.timeline, 60) || null,
      area: str(body.area, 120) || null,
      wall_width_cm: optionalNumber(body.wallWidthCm, 2000),
      wall_height_cm: optionalNumber(body.wallHeightCm, 2000),
      message,
      source: str(body.source, 60) || null,
      utm: typeof body.utm === "object" && body.utm !== null ? body.utm : {},
      referrer: str(body.referrer, 500) || null,
      user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    })
    .select("id, reference")
    .single();

  if (error || !enquiry) {
    console.error("Insert failed", error);
    return json({ error: "We couldn't save that. Please try again." }, 500, origin);
  }

  const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 5) : [];
  if (attachments.length) {
    await db.from("enquiry_attachments").insert(
      attachments.map((file) => {
        const a = file as Record<string, unknown>;
        return {
          enquiry_id: enquiry.id,
          storage_path: str(a.path, 300),
          file_name: str(a.name, 200) || null,
          content_type: str(a.contentType, 100) || null,
          byte_size: optionalNumber(a.size, 20_000_000),
        };
      }),
    );
  }

  const notifyTo = Deno.env.get("ENQUIRY_NOTIFY_TO");
  const from = Deno.env.get("ENQUIRY_FROM_EMAIL") ?? "JECMWA <onboarding@resend.dev>";

  const summary = [
    ["Reference", enquiry.reference],
    ["Name", name],
    ["Email", email],
    ["Phone", str(body.phone, 32) || "—"],
    ["WhatsApp", body.whatsappOptIn ? "Yes" : "No"],
    ["Category", category ?? "—"],
    ["Rooms", rooms.length ? rooms.join(", ") : "—"],
    ["Budget", str(body.budgetBand, 60) || "—"],
    ["Timeline", str(body.timeline, 60) || "—"],
    ["Area", str(body.area, 120) || "—"],
    ["Wall", `${optionalNumber(body.wallWidthCm, 2000) ?? "?"} × ${optionalNumber(body.wallHeightCm, 2000) ?? "?"} cm`],
    ["Found us via", str(body.source, 60) || "—"],
    ["Photos", String(attachments.length)],
  ];

  if (notifyTo) {
    await sendEmail({
      from,
      to: [notifyTo],
      reply_to: email,
      subject: `New enquiry ${enquiry.reference} — ${name}`,
      html: `
        <h2 style="font-family:Georgia,serif;font-weight:400">New enquiry</h2>
        <table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">
          ${summary
            .map(
              ([label, value]) =>
                `<tr><td style="color:#777">${escapeHtml(label)}</td><td><strong>${escapeHtml(String(value))}</strong></td></tr>`,
            )
            .join("")}
        </table>
        <h3 style="font-family:Georgia,serif;font-weight:400">Message</h3>
        <p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-line">${escapeHtml(message)}</p>
      `,
    });
  }

  // Client confirmations need a domain verified in Resend — gated until then.
  if (Deno.env.get("ENQUIRY_SEND_CLIENT_COPY") === "true") {
    await sendEmail({
      from,
      to: [email],
      subject: `We've received your enquiry — ${enquiry.reference}`,
      html: `
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.7">Hello ${escapeHtml(name)},</p>
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.7">
          Thank you for writing to JECMWA. We've received your enquiry
          (reference <strong>${escapeHtml(enquiry.reference)}</strong>) and will reply personally,
          usually within a working day.
        </p>
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.7">— The JECMWA studio</p>
      `,
    });
  }

  return json({ reference: enquiry.reference }, 200, origin);
});
