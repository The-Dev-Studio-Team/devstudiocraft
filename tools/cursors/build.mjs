#!/usr/bin/env node
/**
 * DevStudioCraft cursor set — generates src/styles/cursor.css.
 * Ported from the Pilot 100 cursor family (same glyphs and drawing model),
 * rebranded to the DSC palette.
 *
 *   npm run cursors                            regenerate src/styles/cursor.css
 *   npm run cursors -- --preview <file.html>   also write a contact sheet
 *
 * Every glyph is drawn once on a 24-unit grid and emitted per surface: the
 * site is dark, so the default set is a paper-ink body on a near-black edge;
 * light surfaces (acid panels, paper cards) opt into the inverse set with
 * `.on-light`. The pressed pointer adds acid tap rays, errors use a coral
 * red. Rendered at 26 CSS px (hands at 30 px on a 28-unit grid) with a soft
 * shadow.
 *
 * Drawing model: a glyph is a stack of layers; each layer paints all of its
 * parts' edges first, then all of their bodies. Parts in one layer therefore
 * merge into one silhouette (gaps between bodies show the edge colour — the
 * hand's fingers), while a later layer sits on top with its own outline (the
 * badges, the fist's thumb).
 */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { KEYWORD_TOKENS } = require('./keywords.cjs');

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../src/styles/cursor.css');

const SIZE = 26; // rendered CSS px
const GRID = 24; // drawing units
const EDGE = 1.2; // outline width around every body, in drawing units

// DSC palette: paper ink #f2efe8, near-black #0b0b0e, acid #c9f24b.
const THEMES = {
  dark: {
    body: ['#f2efe8', '#d9d5ca'],
    accent: ['#c9f24b', '#a6d12a'],
    edge: '#0b0b0e',
    badge: '#c9f24b',
    glyph: '#0c0e04',
    danger: '#ff6b5e',
    shadow: 0.55,
  },
  light: {
    body: ['#1d1d25', '#0b0b0e'],
    accent: ['#1d1d25', '#0b0b0e'],
    edge: '#f2efe8',
    badge: '#0b0b0e',
    glyph: '#c9f24b',
    danger: '#c42b1c',
    shadow: 0.3,
  },
};

// ---------------------------------------------------------------- geometry --

const ARROW = 'M3 3 18.2 8.4 11.8 11.8 8.4 18.2Z';
const TIP = [2.7, 2.7];
const CENTER = [12, 12];
const BADGE = { cx: 18.3, cy: 18.3 };

const IBEAM =
  'M8.9 3.7C10.9 3.7 12 4.6 12 6.4V17.6C12 19.4 13.1 20.3 15.1 20.3' +
  'M15.1 3.7C13.1 3.7 12 4.6 12 6.4M12 17.6C12 19.4 10.9 20.3 8.9 20.3';

const ring = (cx, cy, r) =>
  `M${cx} ${cy - r}A${r} ${r} 0 1 1 ${cx} ${cy + r}A${r} ${r} 0 1 1 ${cx} ${cy - r}Z`;

/** Arc from 12 o'clock, clockwise by `degrees`. */
const arc = (cx, cy, r, degrees) => {
  const rad = ((degrees - 90) * Math.PI) / 180;
  const x = +(cx + r * Math.cos(rad)).toFixed(2);
  const y = +(cy + r * Math.sin(rad)).toFixed(2);
  return `M${cx} ${cy - r}A${r} ${r} 0 ${degrees > 180 ? 1 : 0} 1 ${x} ${y}`;
};

const fill = (d, paint = 'body', w = 1.8) => ({ kind: 'fill', d, paint, w });
const stroke = (d, w, paint = 'body', extra = {}) => ({ kind: 'stroke', d, w, paint, ...extra });
const disc = (cx, cy, r, paint, extra = {}) => ({ kind: 'disc', cx, cy, r, paint, ...extra });

const arrow = (paint = 'body') => [fill(ARROW, paint)];

/** Arrow plus a round badge in the empty lower-right quadrant. */
const badged = (plate, contents) => [arrow(), [disc(BADGE.cx, BADGE.cy, 3.9, plate)], contents];

const doubleArrow = [
  [
    stroke('M6 12H18', 1.6),
    fill('M2.6 12 6.6 8.5V15.5Z', 'body', 1.1),
    fill('M21.4 12 17.4 15.5V8.5Z', 'body', 1.1),
  ],
];

const splitArrow = [
  [
    stroke('M10.5 7V17M13.5 7V17', 1.5),
    stroke('M5.4 12H8.6M15.4 12H18.6', 1.5),
    fill('M2.4 12 5.9 9V15Z', 'body', 1),
    fill('M21.6 12 18.1 15V9Z', 'body', 1),
  ],
];

const lens = (sign) => [
  [
    disc(10, 10, 5.6, 'edge'),
    stroke(ring(10, 10, 5.6), 1.8),
    stroke('M14.3 14.3 19.6 19.6', 2.8),
  ],
  [stroke(sign, 1.5)],
];

// Hands share one skeleton on a 28-unit grid (rendered at 30px) so the
// pointer, its pressed state and the grab pair line up: same palm, thumb and
// finger columns, only the finger heights change. The pointer leaves headroom
// above the fingertip for the tap rays, so pressing never moves the hand.
const HAND = { grid: 28, size: 30 };
const PALM = 'M9.9 16.8H23.55V20C23.55 23 21.3 25.4 18.2 25.4H15.2C12.2 25.4 9.9 23.1 9.9 20.2Z';
const FINGERS = [
  { x: 11.4, w: 3 }, // index
  { x: 15.05, w: 2.8 }, // middle
  { x: 18.6, w: 2.8 }, // ring
  { x: 22.15, w: 2.8 }, // pinky
];
const FINGERTIP = [11.4, 7.6];
const PALM_CENTER = [16.7, 18.2];

/** Palm, thumb and four fingers; `tops` are the finger cap centres (index..pinky). */
const hand = (tops, thumb) => [
  fill(PALM, 'body', 1),
  stroke(thumb, 2.8),
  ...FINGERS.map(({ x, w }, i) => stroke(`M${x} ${i === 3 ? 18.4 : 18}V${tops[i]}`, w)),
];

const POINTING = hand([8.5, 14.2, 14.9, 16.2], 'M10.6 21 7.2 17.8');
const TAP_RAYS = stroke('M11.4 4.3V1.9M8.5 5.3 6.8 3.6M14.3 5.3 16 3.6M7.6 7.8H5.2M15.2 7.8H17.6', 1.35, 'accent');

const GLYPHS = {
  arrow: { hotspot: TIP, layers: [arrow()] },
  pointer: { ...HAND, hotspot: FINGERTIP, layers: [POINTING] },
  pointerPress: { ...HAND, hotspot: FINGERTIP, layers: [POINTING, [TAP_RAYS]] },
  text: { hotspot: CENTER, layers: [[stroke(IBEAM, 1.6)]] },
  verticalText: { hotspot: CENTER, rotate: 90, layers: [[stroke(IBEAM, 1.6)]] },
  crosshair: {
    hotspot: CENTER,
    layers: [[stroke('M12 3.4V9.3M12 14.7V20.6M3.4 12H9.3M14.7 12H20.6', 1.5), disc(12, 12, 0.95, 'body')]],
  },
  cell: {
    hotspot: CENTER,
    layers: [[fill('M10.1 4.9H13.9V10.1H19.1V13.9H13.9V19.1H10.1V13.9H4.9V10.1H10.1Z', 'body', 1.2)]],
  },
  move: {
    hotspot: CENTER,
    layers: [
      [
        stroke('M12 5.6V18.4M5.6 12H18.4', 1.6),
        fill('M12 2.8 15 6.1H9Z', 'body', 1.1),
        fill('M12 21.2 9 17.9H15Z', 'body', 1.1),
        fill('M2.8 12 6.1 9V15Z', 'body', 1.1),
        fill('M21.2 12 17.9 15V9Z', 'body', 1.1),
      ],
    ],
  },
  ewResize: { hotspot: CENTER, layers: doubleArrow },
  nsResize: { hotspot: CENTER, rotate: 90, layers: doubleArrow },
  neswResize: { hotspot: CENTER, rotate: -45, layers: doubleArrow },
  nwseResize: { hotspot: CENTER, rotate: 45, layers: doubleArrow },
  colResize: { hotspot: CENTER, layers: splitArrow },
  rowResize: { hotspot: CENTER, rotate: 90, layers: splitArrow },
  grab: { ...HAND, hotspot: PALM_CENTER, layers: [hand([9.8, 8.4, 9.2, 11.6], 'M10.6 21 6.6 17')] },
  grabbing: { ...HAND, hotspot: PALM_CENTER, layers: [hand([14.6, 13.9, 14.4, 15.6], 'M10.8 21.2 8.1 19.1')] },
  zoomIn: { hotspot: [10, 10], layers: lens('M10 7.6V12.4M7.6 10H12.4') },
  zoomOut: { hotspot: [10, 10], layers: lens('M7.6 10H12.4') },
  wait: {
    hotspot: CENTER,
    layers: [
      [stroke(ring(12, 12, 6.4), 2.4, 'body', { opacity: 0.28 })],
      [stroke(arc(12, 12, 6.4, 120), 2.4, 'accent', { edge: false })],
    ],
  },
  progress: {
    hotspot: TIP,
    layers: badged('edge', [
      stroke(ring(BADGE.cx, BADGE.cy, 2.5), 1.3, 'body', { opacity: 0.28, edge: false }),
      stroke(arc(BADGE.cx, BADGE.cy, 2.5, 120), 1.3, 'accent', { edge: false }),
    ]),
  },
  notAllowed: {
    hotspot: TIP,
    layers: badged('edge', [
      stroke(ring(BADGE.cx, BADGE.cy, 2.9), 1.4, 'danger', { edge: false }),
      stroke('M16.25 16.25 20.35 20.35', 1.4, 'danger', { edge: false }),
    ]),
  },
  help: {
    hotspot: TIP,
    layers: badged('badge', [
      stroke(
        'M16.95 17.25C16.95 16.45 17.55 15.9 18.3 15.9C19.05 15.9 19.65 16.4 19.65 17.1' +
          'C19.65 17.7 19.3 18 18.8 18.3C18.45 18.5 18.3 18.8 18.3 19.25',
        1.15,
        'glyph',
        { edge: false },
      ),
      disc(18.3, 20.55, 0.62, 'glyph', { edge: false }),
    ]),
  },
  copy: {
    hotspot: TIP,
    layers: badged('badge', [stroke('M18.3 16.3V20.3M16.3 18.3H20.3', 1.3, 'glyph', { edge: false })]),
  },
  alias: {
    hotspot: TIP,
    layers: badged('badge', [
      stroke('M16.4 20.2V19.3C16.4 17.9 17.3 17.1 18.7 17.1H20.1', 1.15, 'glyph', { edge: false }),
      stroke('M19 15.8 20.3 17.1 19 18.4', 1.15, 'glyph', { edge: false }),
    ]),
  },
  contextMenu: {
    hotspot: TIP,
    layers: badged('badge', [stroke('M16.5 16.9H20.1M16.5 18.3H20.1M16.5 19.7H20.1', 0.9, 'glyph', { edge: false })]),
  },
};

/** Token -> glyph + the native keyword it falls back to. */
const CURSORS = [
  ['--dsc-cursor', 'arrow', 'default'],
  ['--dsc-cursor-pointer', 'pointer', 'pointer'],
  // Not a CSS keyword: the plugin gives every `cursor: pointer` rule an
  // `:active` twin that uses this, so holding the button shows the tap rays.
  ['--dsc-cursor-pointer-press', 'pointerPress', 'pointer'],
  ['--dsc-cursor-text', 'text', 'text'],
  ['--dsc-cursor-vertical-text', 'verticalText', 'vertical-text'],
  ['--dsc-cursor-not-allowed', 'notAllowed', 'not-allowed'],
  ['--dsc-cursor-help', 'help', 'help'],
  ['--dsc-cursor-progress', 'progress', 'progress'],
  ['--dsc-cursor-wait', 'wait', 'wait'],
  ['--dsc-cursor-crosshair', 'crosshair', 'crosshair'],
  ['--dsc-cursor-cell', 'cell', 'cell'],
  ['--dsc-cursor-move', 'move', 'move'],
  ['--dsc-cursor-grab', 'grab', 'grab'],
  ['--dsc-cursor-grabbing', 'grabbing', 'grabbing'],
  ['--dsc-cursor-col-resize', 'colResize', 'col-resize'],
  ['--dsc-cursor-row-resize', 'rowResize', 'row-resize'],
  ['--dsc-cursor-ew-resize', 'ewResize', 'ew-resize'],
  ['--dsc-cursor-ns-resize', 'nsResize', 'ns-resize'],
  ['--dsc-cursor-nesw-resize', 'neswResize', 'nesw-resize'],
  ['--dsc-cursor-nwse-resize', 'nwseResize', 'nwse-resize'],
  ['--dsc-cursor-zoom-in', 'zoomIn', 'zoom-in'],
  ['--dsc-cursor-zoom-out', 'zoomOut', 'zoom-out'],
  ['--dsc-cursor-copy', 'copy', 'copy'],
  ['--dsc-cursor-alias', 'alias', 'alias'],
  ['--dsc-cursor-context-menu', 'contextMenu', 'context-menu'],
];

// --------------------------------------------------------------- rendering --

function paintOf(theme, paint) {
  if (paint === 'body') return 'url(#b)';
  if (paint === 'accent') return 'url(#a)';
  return theme[paint] ?? paint;
}

function edgeOf(part, theme) {
  if (part.edge === false) return '';
  const e = theme.edge;
  if (part.kind === 'disc') return `<circle cx='${part.cx}' cy='${part.cy}' r='${+(part.r + EDGE).toFixed(2)}' fill='${e}'/>`;
  const w = +(part.w + EDGE * 2).toFixed(2);
  const filled = part.kind === 'fill' ? `fill='${e}'` : `fill='none'`;
  return `<path d='${part.d}' ${filled} stroke='${e}' stroke-width='${w}'/>`;
}

function bodyOf(part, theme) {
  const p = paintOf(theme, part.paint);
  const opacity = part.opacity ? ` opacity='${part.opacity}'` : '';
  if (part.kind === 'disc') return `<circle cx='${part.cx}' cy='${part.cy}' r='${part.r}' fill='${p}'${opacity}/>`;
  const filled = part.kind === 'fill' ? `fill='${p}'` : `fill='none'`;
  return `<path d='${part.d}' ${filled} stroke='${p}' stroke-width='${part.w}'${opacity}/>`;
}

const gridOf = (glyph) => glyph.grid ?? GRID;
const sizeOf = (glyph) => glyph.size ?? SIZE;

function svgFor(glyph, theme) {
  const grid = gridOf(glyph);
  const layers = glyph.layers
    .map((parts) => parts.map((p) => edgeOf(p, theme)).join('') + parts.map((p) => bodyOf(p, theme)).join(''))
    .join('');
  const inner = glyph.rotate ? `<g transform='rotate(${glyph.rotate} ${grid / 2} ${grid / 2})'>${layers}</g>` : layers;
  const grad = (id, [a, b]) =>
    layers.includes(`url(#${id})`)
      ? `<linearGradient id='${id}' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='${grid}' y2='${grid}'>` +
        `<stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient>`
      : '';
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' width='${sizeOf(glyph)}' height='${sizeOf(glyph)}' viewBox='0 0 ${grid} ${grid}'>` +
    `<defs>` +
    `<filter id='s' filterUnits='userSpaceOnUse' x='-2' y='-2' width='${grid + 4}' height='${grid + 4}' color-interpolation-filters='sRGB'>` +
    `<feDropShadow dx='0' dy='0.9' stdDeviation='0.85' flood-color='#000' flood-opacity='${theme.shadow}'/></filter>` +
    grad('b', theme.body) +
    grad('a', theme.accent) +
    `</defs>` +
    `<g filter='url(#s)' stroke-linejoin='round' stroke-linecap='round'>${inner}</g>` +
    `</svg>`
  );
}

const dataUri = (svg) =>
  'data:image/svg+xml,' +
  svg.replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E');

/** Hotspot in rendered CSS px, rounded — the drawing grid differs per glyph. */
const hotspot = (glyph) => {
  const [x, y] = glyph.hotspot;
  const k = sizeOf(glyph) / gridOf(glyph);
  return `${Math.round(x * k)} ${Math.round(y * k)}`;
};

function declarations(themeName) {
  const theme = THEMES[themeName];
  return CURSORS.map(([token, name, keyword]) => {
    const glyph = GLYPHS[name];
    return `  ${token}: url("${dataUri(svgFor(glyph, theme))}") ${hotspot(glyph)}, ${keyword};`;
  }).join('\n');
}

function assertCoverage() {
  const defined = new Set(CURSORS.map(([token]) => token));
  const missing = [...new Set(Object.values(KEYWORD_TOKENS))].filter((t) => !defined.has(t));
  if (missing.length) throw new Error(`keywords.cjs maps to undefined cursor tokens: ${missing.join(', ')}`);
}

// --------------------------------------------------------------------- css --

function css() {
  const fallbacks = CURSORS.map(([token, , keyword]) => `    ${token}: ${keyword};`).join('\n');
  return `/* =============================================== */
/* CURSORS — generated by tools/cursors/build.mjs  */
/* Do not edit by hand: run \`npm run cursors\`.     */
/* =============================================== */
/*
 * The DSC cursor family (ported from Pilot 100): a slim, rounded nav arrow,
 * a pointing hand that shows acid tap rays while the button is held, and
 * matching I-beam, grab, resize, zoom and status cursors. The dark site gets
 * a paper body on a near-black edge; \`.on-light\` surfaces get the inverse,
 * so every cursor reads on any surface. Native CSS cursors, drawn by the OS:
 * no lag, and the inline data URIs mean no flash on first use.
 *
 * Coverage: tools/cursors/postcss-plugin.cjs rewrites every
 * \`cursor: <keyword>\` in the build (global CSS and every Astro component
 * style) to var(--dsc-cursor-<keyword>, <keyword>) and gives each pointer
 * rule an :active twin on --dsc-cursor-pointer-press. JS and inline styles
 * bypass the plugin: use the tokens directly, e.g.
 * el.style.cursor = 'var(--dsc-cursor-grab, grab)'.
 */
:root {
${declarations('dark')}
}

.on-light {
${declarations('light')}
}

/* cursor inherits as a resolved value, so each surface re-declares its own */
html,
.on-light {
  cursor: var(--dsc-cursor);
}

/* Elements whose UA default is the native arrow (Chromium hard-codes it on
   label and the button-type inputs). Zero specificity, so any author cursor
   still wins. */
:where(
  label,
  select,
  button,
  summary,
  input:is([type='button'], [type='submit'], [type='reset'], [type='checkbox'], [type='radio'], [type='range'], [type='color'], [type='file']),
  input:is([type='date'], [type='time'], [type='datetime-local'], [type='month'], [type='week'])
) {
  cursor: var(--dsc-cursor);
}

/* Editable text gets the I-beam — the inherited arrow would otherwise win. */
:where(
  input:not([type='button'], [type='submit'], [type='reset'], [type='checkbox'], [type='radio'], [type='range'], [type='color'], [type='file'], [type='image'], [type='hidden'], [type='date'], [type='time'], [type='datetime-local'], [type='month'], [type='week']),
  textarea,
  [contenteditable]:not([contenteditable='false'])
) {
  cursor: var(--dsc-cursor-text);
}

/* Forced colors (Windows high contrast): every token falls back to the OS. */
@media (forced-colors: active) {
  :root,
  .on-light {
${fallbacks}
  }

  html,
  .on-light {
    cursor: auto;
  }
}
`;
}

// -------------------------------------------------------------- preview ----

function preview() {
  const rows = CURSORS.map(([token, name, keyword]) => {
    const cells = Object.entries(THEMES)
      .map(([themeName, theme]) => {
        const uri = dataUri(svgFor(GLYPHS[name], theme));
        const bg = themeName === 'light' ? '#c9f24b' : '#0b0b0e';
        const px = sizeOf(GLYPHS[name]);
        const imgs = [1, 2, 4].map((z) => `<img src="${uri}" width="${px * z}" height="${px * z}" alt="">`).join('');
        return `<td style="background:${bg};cursor:url(&quot;${uri}&quot;) ${hotspot(GLYPHS[name])}, ${keyword}">${imgs}</td>`;
      })
      .join('');
    return `<tr><th>${keyword}<small>${token}</small></th>${cells}</tr>`;
  }).join('');
  return (
    '<!doctype html><meta charset="utf-8"><title>DSC cursors</title>' +
    '<style>body{margin:0;font:12px system-ui;background:#fff;color:#333}table{border-collapse:collapse}' +
    'th{text-align:left;padding:6px 14px;font-weight:600;white-space:nowrap}th small{display:block;color:#999;font-weight:400}' +
    'td{padding:8px 16px}td img{vertical-align:middle;margin-right:14px}</style>' +
    `<table>${rows}</table>`
  );
}

// ------------------------------------------------------------------- main --

assertCoverage();
writeFileSync(OUT, css());
console.log(`cursors: wrote ${CURSORS.length} cursors x ${Object.keys(THEMES).length} themes -> ${OUT}`);

const previewAt = process.argv.indexOf('--preview');
if (previewAt !== -1) {
  const file = resolve(process.argv[previewAt + 1] ?? 'cursor-preview.html');
  writeFileSync(file, preview());
  console.log(`cursors: preview -> ${file}`);
}
