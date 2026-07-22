/**
 * Email templates for /api/inquiry — bulletproof, table-based HTML that renders
 * in Gmail, Apple Mail and Outlook. Dark brand theme (acid #c9f24b on near-black).
 *
 * The client confirmation adapts to the chosen plan via PLANS; unknown plans
 * (incl. À la carte) degrade gracefully to a category-level then generic block.
 * The `_` filename prefix keeps this file off the Pages Functions route table —
 * it is import-only.
 */

export const escapeHtml = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

/* ---------------------------------------------------------------- brand ---- */

const C = {
  acid: '#c9f24b',
  ink: '#08080a',
  panel: '#101014',
  card: '#16161c',
  line: '#26262f',
  text: '#f4f1ea',
  soft: '#c8c4ba',
  muted: '#8f8c83',
  site: 'devstudiocraft.com',
};

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/* --------------------------------------------------------------- catalog ---- */
/* Mirror of src/components/Packages.astro. Keep in sync when plans change;
 * anything not listed here falls back to CATEGORY_TAG then a generic line.     */

const PLANS = {
  // Marketing
  Spark: {
    category: 'Marketing',
    tag: 'We take content off your plate — created, designed and published across three platforms.',
    includes: ['Content creation & publishing', 'Graphic design', 'Community management — 3 platforms'],
  },
  Engine: {
    category: 'Marketing',
    tag: 'Your full marketing department, outsourced — strategy, content, paid media and video.',
    includes: ['Everything in Spark', 'Growth strategy & KPI reporting', 'Paid media management', 'Video editing', 'All platforms moderated'],
  },
  Overdrive: {
    category: 'Marketing',
    tag: 'A dedicated creative team shooting real photography and full video for your brand.',
    includes: ['Everything in Engine', 'Brand photography', 'Full video production', 'Dedicated creative team', '20% off, billed annually'],
  },
  Command: {
    category: 'Marketing',
    tag: 'Marketing as mission-critical — website management, reputation cover and a dedicated account manager.',
    includes: ['Everything in Overdrive', 'Website management', 'Reputation & risk cover', 'Dedicated account manager'],
  },
  // Branding
  Mark: {
    category: 'Branding',
    tag: "One logo done properly — every mark and format you'll ever be asked for.",
    includes: ['1 logo — real revision rounds', 'Primary + secondary marks', 'Social media kit', 'SVG / PNG / PDF / JPEG delivery'],
  },
  System: {
    category: 'Branding',
    tag: 'Two logo directions refined to one winner — plus business card and letterhead.',
    includes: ['2 logo concepts', 'Business card + letterhead', 'Social media kit', 'Full source files'],
  },
  Legacy: {
    category: 'Branding',
    tag: 'A complete identity system your team can run without you in the room.',
    includes: ['2 logo concepts', 'Full brand guidelines', 'Email signature + letterhead', 'Every printable asset', 'Full ownership docs'],
  },
  // Technology
  Launch: {
    category: 'Technology',
    tag: 'A single conversion-obsessed landing page, hand-coded in a two-week sprint.',
    includes: ['UI/UX design', 'Hand-coded build', 'Conversion copy structure', 'Analytics wired in'],
  },
  Foundation: {
    category: 'Technology',
    tag: 'A security-hardened, search-visible site built to a 95+ Lighthouse bar.',
    includes: ['UI/UX design', 'Custom build + security hardening', 'SEO setup', '95+ Lighthouse target', '3 months support'],
  },
  Powerhouse: {
    category: 'Technology',
    tag: 'Full-stack infrastructure — custom features, integrations and performance under real load.',
    includes: ['Everything in Foundation', 'Full-stack development', 'Custom integrations', 'Performance engineering', '6 months support'],
  },
};

const CATEGORY_TAG = {
  Marketing: 'a marketing engine tuned to your goals',
  Branding: 'an identity built to last',
  Technology: 'a fast, hardened build that earns its keep',
  'À la carte': 'a focused, senior-led sprint',
};

// Second step of "what happens next" — framed for the chosen discipline.
const STEP_TWO = {
  Marketing: 'Growth plan — we map the channels, cadence and the KPIs we will move.',
  Branding: 'Creative brief — we align on direction before a single pixel is designed.',
  Technology: 'Scope &amp; fixed quote — we lock the build plan, stack and timeline.',
  'À la carte': 'Tailored scope — a clear plan and a fixed quote, zero surprises.',
};

const GUARANTEES = ['First concept in 48h', 'You own everything', 'No lock-in', 'Reply within 24h'];

/** Resolve a plan record from the submitted package + category. */
const resolvePlan = (packageName, category) => {
  const known = PLANS[packageName];
  if (known) return known;
  const tag = CATEGORY_TAG[category] || 'a plan tailored to exactly what you need';
  return { category: category || 'Custom', tag: `We will shape ${tag} around your brief.`, includes: [] };
};

/* ----------------------------------------------------------- shared shell ---- */

const shell = ({ preheader, inner }) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>DevCraft Studio</title>
<style>
  @media (max-width:600px){
    .container{width:100% !important}
    .px{padding-left:24px !important;padding-right:24px !important}
    .h1{font-size:26px !important}
  }
  a{color:${C.acid}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.ink};">
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${C.panel};border:1px solid ${C.line};border-radius:18px;overflow:hidden;">
      ${inner}
    </table>
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
      <tr><td class="px" style="padding:20px 40px;text-align:center;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.muted};">
        DevCraft Studio · digital experiences that sell<br>
        <a href="https://${C.site}" style="color:${C.muted};text-decoration:underline;">${C.site}</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

// Brand header bar with acid glow (gradient degrades to solid ink in Outlook).
const header = () => `
  <tr><td class="px" style="background:${C.ink};background:linear-gradient(120deg,#0c0c0f 0%,#141410 55%,#1a2109 100%);padding:26px 40px;border-bottom:1px solid ${C.line};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:${FONT};font-size:15px;font-weight:700;letter-spacing:.14em;color:${C.text};">
        DEVCRAFT<span style="color:${C.acid};"> .</span>
      </td>
      <td align="right" style="font-family:${FONT};font-size:10px;letter-spacing:.22em;color:${C.acid};text-transform:uppercase;">Studio</td>
    </tr></table>
  </td></tr>`;

const eyebrow = (t) =>
  `<p style="margin:0 0 12px;font-family:${FONT};font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:${C.acid};">${t}</p>`;

/* -------------------------------------------------- client confirmation ---- */

export function renderClientEmail({ name, packageName, category, studioEmail }) {
  const firstName = escapeHtml(String(name).split(' ')[0] || name);
  const pkg = escapeHtml(packageName);
  const plan = resolvePlan(packageName, category);
  const cat = escapeHtml(plan.category);
  const reply = escapeHtml(studioEmail);

  const includesBlock = plan.includes.length
    ? `
      <p style="margin:22px 0 10px;font-family:${FONT};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${C.muted};">What your plan includes</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${plan.includes
          .map(
            (it) => `<tr>
          <td width="24" valign="top" style="padding:5px 0;font-family:${FONT};color:${C.acid};font-size:13px;">✓</td>
          <td style="padding:5px 0;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.text};">${escapeHtml(it)}</td>
        </tr>`,
          )
          .join('')}
      </table>`
    : '';

  const step2 = STEP_TWO[plan.category] || STEP_TWO['À la carte'];
  const steps = [
    ['1', 'Discovery call', 'A free 15-minute call to understand your goals — no pitch, no pressure.'],
    ['2', step2.split(' — ')[0], step2.split(' — ')[1] || step2],
    ['3', 'Kickoff', 'You approve, we start. First concept lands within 48 hours.'],
  ];

  const stepsBlock = steps
    .map(
      ([n, title, body]) => `<tr>
      <td width="40" valign="top" style="padding:9px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="28" height="28" align="center" valign="middle"
          style="width:28px;height:28px;background:${C.acid};border-radius:50%;font-family:${FONT};font-size:13px;font-weight:700;color:${C.ink};">${n}</td></tr></table>
      </td>
      <td valign="top" style="padding:9px 0 9px 6px;font-family:${FONT};">
        <div style="font-size:14px;font-weight:700;color:${C.text};">${title}</div>
        <div style="font-size:13px;line-height:1.55;color:${C.soft};margin-top:2px;">${body}</div>
      </td>
    </tr>`,
    )
    .join('');

  const chips = GUARANTEES.map(
    (g) =>
      `<span style="display:inline-block;margin:0 8px 8px 0;padding:7px 12px;border:1px solid ${C.line};border-radius:999px;font-family:${FONT};font-size:11px;letter-spacing:.02em;color:${C.soft};">${g}</span>`,
  ).join('');

  const inner = `
  ${header()}
  <tr><td class="px" style="padding:38px 40px 8px;">
    ${eyebrow('Inquiry received')}
    <h1 class="h1" style="margin:0;font-family:${FONT};font-size:30px;line-height:1.15;font-weight:700;letter-spacing:-.02em;color:${C.text};">
      Got it, ${firstName} —<br>you're on our radar.
    </h1>
    <p style="margin:16px 0 0;font-family:${FONT};font-size:15px;line-height:1.65;color:${C.soft};">
      Your inquiry for <b style="color:${C.text};">${pkg}</b> just landed in our inbox. A real
      person — not an autoresponder — will reply within <b style="color:${C.text};">24 hours</b>
      to book your free 15-minute discovery call.
    </p>
  </td></tr>

  <tr><td class="px" style="padding:24px 40px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border:1px solid ${C.line};border-radius:14px;">
      <tr><td style="padding:22px 24px;font-family:${FONT};">
        <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:${C.acid};">${cat}</div>
        <div style="font-size:22px;font-weight:700;color:${C.text};margin:6px 0 8px;">${pkg}</div>
        <div style="font-size:14px;line-height:1.6;color:${C.soft};">${escapeHtml(plan.tag)}</div>
        ${includesBlock}
      </td></tr>
    </table>
  </td></tr>

  <tr><td class="px" style="padding:30px 40px 0;">
    ${eyebrow('What happens next')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stepsBlock}</table>
  </td></tr>

  <tr><td class="px" style="padding:26px 40px 4px;">
    <div style="border-top:1px solid ${C.line};padding-top:22px;">${chips}</div>
  </td></tr>

  <tr><td class="px" style="padding:6px 40px 40px;">
    <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.65;color:${C.soft};">
      Want to get us started faster? Just reply to this email with anything useful —
      links, deadlines or examples you love. It goes straight to
      <a href="mailto:${reply}" style="color:${C.acid};text-decoration:none;">${reply}</a>.
    </p>
  </td></tr>`;

  return shell({
    preheader: `Got it, ${firstName} — your ${packageName} inquiry is in. A human replies within 24 hours.`,
    inner,
  });
}

export const clientText = ({ name, packageName, studioEmail }) => {
  const firstName = String(name).split(' ')[0] || name;
  return [
    `Got it, ${firstName} — you're on our radar.`,
    '',
    `Your inquiry for ${packageName} just landed in our inbox. A real person will reply`,
    `within 24 hours to book your free 15-minute discovery call.`,
    '',
    'What happens next:',
    '  1. Discovery call — a free 15-minute call to understand your goals.',
    '  2. A tailored scope and a fixed quote, with no surprises.',
    '  3. Kickoff — first concept within 48 hours.',
    '',
    `Reply to this email (${studioEmail}) with links, deadlines or examples anytime.`,
    '',
    `— DevCraft Studio · ${C.site}`,
  ].join('\n');
};

/* --------------------------------------------------- studio notification ---- */

export function renderStudioEmail({ name, email, phone, industry, packageName, category, message }) {
  const wa = String(phone).replace(/[^0-9]/g, '');
  const firstName = escapeHtml(String(name).split(' ')[0] || name);
  const rows = [
    ['Name', escapeHtml(name)],
    ['Email', `<a href="mailto:${escapeHtml(email)}" style="color:${C.acid};text-decoration:none;">${escapeHtml(email)}</a>`],
    ['Phone', `<a href="tel:${escapeHtml(phone)}" style="color:${C.acid};text-decoration:none;">${escapeHtml(phone)}</a>`],
    ['Industry', escapeHtml(industry)],
  ];

  const rowsBlock = rows
    .map(
      ([k, v], i) => `<tr>
      <td style="padding:12px 20px;border-top:${i ? `1px solid ${C.line}` : '0'};font-family:${FONT};font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${C.muted};width:110px;vertical-align:top;">${k}</td>
      <td style="padding:12px 20px 12px 0;border-top:${i ? `1px solid ${C.line}` : '0'};font-family:${FONT};font-size:14px;color:${C.text};vertical-align:top;">${v}</td>
    </tr>`,
    )
    .join('');

  const messageBlock = message
    ? `<tr><td class="px" style="padding:0 40px 4px;">
        <p style="margin:22px 0 8px;font-family:${FONT};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${C.muted};">Their brief</p>
        <div style="font-family:${FONT};font-size:14px;line-height:1.65;color:${C.soft};background:${C.card};border:1px solid ${C.line};border-left:3px solid ${C.acid};border-radius:10px;padding:16px 18px;white-space:pre-wrap;">${escapeHtml(message)}</div>
      </td></tr>`
    : '';

  const primary = (href, label) =>
    `<a href="${href}" style="display:inline-block;margin:0 10px 10px 0;padding:12px 20px;background:${C.acid};color:${C.ink};font-family:${FONT};font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;">${label}</a>`;
  const ghost = (href, label) =>
    `<a href="${href}" style="display:inline-block;margin:0 10px 10px 0;padding:12px 20px;border:1px solid ${C.line};color:${C.text};font-family:${FONT};font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;">${label}</a>`;

  const inner = `
  ${header()}
  <tr><td class="px" style="padding:34px 40px 6px;">
    ${eyebrow('New inquiry')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:${FONT};font-size:26px;font-weight:700;letter-spacing:-.02em;color:${C.text};">${escapeHtml(packageName)}</td>
      <td align="right" valign="top">
        <span style="display:inline-block;padding:6px 12px;background:rgba(201,242,75,.12);border:1px solid ${C.acid};border-radius:999px;font-family:${FONT};font-size:11px;letter-spacing:.06em;color:${C.acid};">${escapeHtml(category)}</span>
      </td>
    </tr></table>
  </td></tr>

  <tr><td class="px" style="padding:18px 40px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.card};border:1px solid ${C.line};border-radius:14px;">
      ${rowsBlock}
    </table>
  </td></tr>

  ${messageBlock}

  <tr><td class="px" style="padding:26px 40px 40px;">
    <div style="border-top:1px solid ${C.line};padding-top:22px;">
      ${primary(`mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Re: your ${packageName} inquiry — DevCraft Studio`)}`, `Reply to ${firstName} &rarr;`)}
      ${wa ? ghost(`https://wa.me/${wa}`, 'WhatsApp') : ''}
    </div>
    <p style="margin:10px 0 0;font-family:${FONT};font-size:12px;color:${C.muted};">Sent from ${C.site}/#packages</p>
  </td></tr>`;

  return shell({
    preheader: `${name} · ${packageName} (${category}) · ${email}`,
    inner,
  });
}

export const studioText = ({ name, email, phone, industry, packageName, category, message }) =>
  [
    `New inquiry — ${packageName} (${category})`,
    '',
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Phone:    ${phone}`,
    `Industry: ${industry}`,
    `Message:  ${message || '—'}`,
    '',
    'Sent from devstudiocraft.com/#packages',
  ].join('\n');
