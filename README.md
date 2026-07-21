# DevCraft Studio — devstudiocraft.com

Award-level animated landing page for DevCraft Studio: websites, e-commerce,
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
└── og.png                    # social share image
```

## Editing content

- Copy lives directly in the section components (`src/components/*.astro`).
- Design tokens (colors, type scale, spacing) in `src/styles/global.css` `:root`.
- Contact email: search for `contact@devstudiocraft.com`.
- WhatsApp link: `CTA.astro` (`wa.me/...` — replace with the real number).

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
