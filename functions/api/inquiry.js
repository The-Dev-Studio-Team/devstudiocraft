/**
 * POST /api/inquiry — package inquiry handler.
 * Sends two emails via Resend: a notification to the studio inbox and a
 * confirmation to the client. Requires the RESEND_API_KEY project secret;
 * without it the endpoint answers 503 and the frontend falls back to mailto.
 */

const STUDIO_EMAIL = 'contact@devstudiocraft.com';
const FROM = 'DevCraft Studio <inquiries@devstudiocraft.com>';
const MAX_LEN = 600;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const clean = (v) => String(v ?? '').trim().slice(0, MAX_LEN);

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const escapeHtml = (v) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

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

  const lines = [
    `Package:  ${packageName} (${category})`,
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Phone:    ${phone}`,
    `Industry: ${industry}`,
    `Message:  ${message || '—'}`,
    '',
    'Sent from devstudiocraft.com/#packages',
  ].join('\n');

  const safeName = escapeHtml(name.split(' ')[0] || name);
  const safePackage = escapeHtml(packageName);

  const confirmationHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0b0b0e;color:#f2efe8;padding:36px 28px;border-radius:14px;max-width:520px;margin:0 auto">
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;color:#c9f24b;text-transform:uppercase">DevCraft Studio</p>
      <h1 style="margin:0 0 14px;font-size:24px;line-height:1.2">Got it, ${safeName} — you're on our radar.</h1>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:rgba(242,239,232,.72)">
        Your inquiry for <b style="color:#f2efe8">${safePackage}</b> just landed in our inbox.
        A real human will reply within 24 hours — usually much faster — to book your free
        15-minute discovery call.
      </p>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:rgba(242,239,232,.72)">
        In the meantime, feel free to reply to this email with anything that helps us prepare:
        links, deadlines, examples you love.
      </p>
      <p style="margin:24px 0 0;font-size:12px;color:rgba(242,239,232,.4)">
        DevCraft Studio — digital experiences that sell · devstudiocraft.com
      </p>
    </div>`;

  try {
    // 1) Notification to the studio.
    await sendEmail(env.RESEND_API_KEY, {
      from: FROM,
      to: [STUDIO_EMAIL],
      reply_to: email,
      subject: `New inquiry — ${packageName} (${category})`,
      text: lines,
    });

    // 2) Confirmation to the client (non-fatal if it fails).
    try {
      await sendEmail(env.RESEND_API_KEY, {
        from: FROM,
        to: [email],
        reply_to: STUDIO_EMAIL,
        subject: `We got your inquiry — ${packageName} · DevCraft Studio`,
        html: confirmationHtml,
        text: `Got it, ${name} — your inquiry for ${packageName} is in. We reply within 24 hours to book your free discovery call.\n\n— DevCraft Studio · devstudiocraft.com`,
      });
    } catch {
      // Client confirmation failing should not fail the inquiry itself.
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'send_failed' }, 502);
  }
}
