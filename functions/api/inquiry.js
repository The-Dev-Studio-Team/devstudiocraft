/**
 * POST /api/inquiry — package inquiry handler.
 * Sends two emails via Resend: a notification to the studio inbox and a
 * confirmation to the client. Requires the RESEND_API_KEY project secret;
 * without it the endpoint answers 503 and the frontend falls back to mailto.
 */

import {
  renderClientEmail,
  renderStudioEmail,
  clientText,
  studioText,
} from './_email-templates.js';

// Recipient + sender are env-driven so test → prod is a config flip, not a code
// edit. Fallbacks are the production values; override locally via .dev.vars or
// in Cloudflare via Pages env vars (STUDIO_EMAIL, RESEND_FROM).
const STUDIO_EMAIL_DEFAULT = 'contact@devstudiocraft.com';
const FROM_DEFAULT = 'DevStudioCraft <noreply@devstudiocraft.com>';
const MAX_LEN = 600;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const clean = (v) => String(v ?? '').trim().slice(0, MAX_LEN);

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function sendEmail(apiKey, payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`resend_${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }

  // Honeypot: bots fill the hidden field; pretend success and drop it.
  if (clean(data.website)) return json({ ok: true });

  const name = clean(data.name);
  const email = clean(data.email);
  const phone = clean(data.phone);
  const industry = clean(data.industry);
  const packageName = clean(data.packageName);
  const category = clean(data.category);
  const message = clean(data.message);

  if (!name || !email || !phone || !industry || !packageName) {
    return json({ ok: false, error: 'missing_fields' }, 400);
  }
  if (!isEmail(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }
  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const studioEmail = env.STUDIO_EMAIL || STUDIO_EMAIL_DEFAULT;
  const from = env.RESEND_FROM || FROM_DEFAULT;

  const fields = { name, email, phone, industry, packageName, category, message };

  try {
    // 1) Notification to the studio — reply-to points at the client.
    await sendEmail(env.RESEND_API_KEY, {
      from,
      to: [studioEmail],
      reply_to: email,
      subject: `New inquiry — ${packageName} (${category})`,
      html: renderStudioEmail(fields),
      text: studioText(fields),
    });

    // 2) Branded, plan-tailored confirmation to the client (non-fatal if it fails).
    try {
      await sendEmail(env.RESEND_API_KEY, {
        from,
        to: [email],
        reply_to: studioEmail,
        subject: `We got your inquiry — ${packageName} · DevStudioCraft`,
        html: renderClientEmail({ ...fields, studioEmail }),
        text: clientText({ ...fields, studioEmail }),
      });
    } catch {
      // Client confirmation failing should not fail the inquiry itself.
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'send_failed' }, 502);
  }
}
