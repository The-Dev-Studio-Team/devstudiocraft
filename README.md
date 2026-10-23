# DevStudioCraft — devstudiocraft.com

Award-level animated landing page for DevStudioCraft: websites, e-commerce,
landing pages and mobile apps built to sell.

## Stack

- [Astro 5](https://astro.build) — static output, zero framework runtime
- [GSAP 3](https://gsap.com) + ScrollTrigger + SplitText — scroll animations, split-text reveals, pinned horizontal showcase
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling
- Self-hosted fonts: Clash Display, Satoshi (Fontshare), Instrument Serif italic (Google)
- Deployed on Cloudflare Pages

## Commands

| Command           | Action                                          |
| ----------------- | ----------------------------------------------- |
| `npm install`     | Install dependencies                            |
| `npm run dev`     | Dev server at `localhost:4321`                  |
| `npm run build`   | Production build to `./dist/`                   |
| `npm run preview` | Preview the production build locally            |
| `npm run deploy`  | Build + deploy to Cloudflare Pages via Wrangler |

## Deploy

```bash
npm run deploy
```

Requires `wrangler login` once. First deploy creates the `devstudiocraft`
Pages project; then attach the custom domain in
Cloudflare Dashboard → Workers & Pages → devstudiocraft → Custom domains →
add `devstudiocraft.com` (and `www.devstudiocraft.com`).

Since the domain was bought at Hostinger, either:

1. **Recommended:** move DNS to Cloudflare (add site in Cloudflare, copy the
   two nameservers into Hostinger → Domains → Nameservers), then the custom
   domain attaches with one click; or
2. Keep Hostinger DNS and add a `CNAME` record pointing
   `devstudiocraft.com` → `<project>.pages.dev`.

## Structure

```
src/
├── layouts/Base.astro        # head, meta, OG, JSON-LD, fonts
├── pages/index.astro         # section composition
├── components/               # one section per file
├── scripts/main.js           # GSAP/Lenis animation engine
├── scripts/interactions.js   # cursor, magnetic buttons, nav
└── styles/global.css         # design tokens + base styles
public/
├── fonts/                    # self-hosted woff2
├── _headers                  # security + cache headers (Cloudflare Pages)
└── og.jpg                    # social share image (1200×630)
```

## Editing content

- Copy lives directly in the section components (`src/components/*.astro`).
- Design tokens (colors, type scale, spacing) in `src/styles/global.css` `:root`.
- Contact email: search for `contact@devstudiocraft.com`.
- Phone / WhatsApp: `+49 1522 2002210` in `CTA.astro`, `Footer.astro` and the JSON-LD in `Base.astro`.

## Inquiry emails (Resend)

The Packages section posts to `/api/inquiry` (a Cloudflare Pages Function in
`functions/api/inquiry.js`) which sends two emails via Resend: a notification
to the studio inbox and a branded confirmation to the client. If the function
is unreachable or unconfigured, the form falls back to `mailto:`.

Both emails are built in `functions/api/_email-templates.js` (import-only —
the `_` prefix keeps it off the route table). They are bulletproof, table-based
HTML for Gmail/Apple Mail/Outlook. The client confirmation **adapts to the plan
chosen** — its tagline, "what your plan includes" checklist and next-step copy
come from a catalog mirroring `src/components/Packages.astro`; unknown plans and
À la carte items degrade to a category-level then generic block.

Recipient and sender are **env-driven**, so switching from testing to production
is a config change — no code edit:

| Var | Testing | Production |
|-----|---------|------------|
| `RESEND_API_KEY` | your Resend API key | same |
| `STUDIO_EMAIL` | a test inbox (e.g. a gmail) | `contact@devstudiocraft.com` |
| `RESEND_FROM` | `DevStudioCraft <noreply@m2a-fm.com>` (a verified domain) | `DevStudioCraft <inquiries@devstudiocraft.com>` |

When the vars are unset, the code falls back to the production values.
`RESEND_FROM` must use a domain **verified in Resend** — sends from an
unverified domain are rejected.

Local testing:

1. Put the three vars in `.dev.vars` (gitignored — never commit it).
2. `npm run build && npx wrangler pages dev dist`
3. Submit the form (or `POST /api/inquiry`). Both emails land in `STUDIO_EMAIL`
   when you use that address as the form's email too.

Production activation:

1. Verify `devstudiocraft.com` in Resend (add the DNS records in Cloudflare DNS).
2. Store the key as a Pages secret, and set the recipient/sender vars on the
   Pages project (dashboard → Settings → Environment variables, or via wrangler):
   `npx wrangler pages secret put RESEND_API_KEY --project-name=devstudiocraft`
3. Redeploy (`npm run deploy`). Until the key exists the endpoint answers 503
   and the form quietly uses the mailto fallback.

## Generated media assets

- Art direction: cinematic photoreal — black volcanic terrain, acid `#c9f24b`
  light veins, per-card theme colors. Style anchor: `src/assets/gen/hero-vista.jpg`.
- `src/assets/gen/` — hero still + 4 showcase cards + 6 service hover previews.
  Astro converts them to WebP at build.
- `public/media/hero-vista-loop.{mp4,webm}` — 10s TRUE seamless loop (~420KB /
  ~130KB): generated image-to-video with the SAME image as start frame and end
  frame (seedance-2 `startFrame` + `endFrame`), so the boundary frames match —
  no ping-pong/reverse trick. Muted, no audio track, 1600px, desktop-only;
  mobile and reduced-motion users get the static still (`Hero.astro` + `initHeroVideo`).
- Encode recipe after regenerating:
  `ffmpeg -i raw.mp4 -vf "fps=24,scale=1600:-2" -an -c:v libx264 -crf 25 -preset slow -movflags +faststart hero-vista-loop.mp4`
  and same with `-c:v libvpx-vp9 -crf 40 -b:v 0` for the webm.
