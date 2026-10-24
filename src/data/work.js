/* Work page content. Media lives in src/assets/work/ (images) and public/media/work/ (films). */

export const coffee = [
  {
    id: 'kaiju',
    name: 'Kaiju Coffee Co.',
    line: 'Bad news for weak coffee.',
    kind: 'Studio brand',
    discipline: 'E-commerce',
    place: 'Dock 9 roastery',
    summary:
      'A loud, comic-book roaster with a kaiju mascot. Bags spin on a real 3D lazy susan, a rooftop searchlight re-lights in every roast’s colour, and a bean pit you can stomp.',
    moves: [
      'A tipped-back 3D turntable with momentum and a detent click per bag',
      'Halftone searchlight carousel that leans toward the cursor',
      'Matter.js bean pit: poke the kaiju and the pile goes flying',
      'Eight roast pages joined by cross-document View Transitions',
    ],
    palette: ['#0e0e0c', '#f1ebdf', '#c8f23a', '#ee3b2b', '#1fa39c'],
    type: ['Anton', 'Permanent Marker', 'DM Mono'],
    chips: ['Turntable physics', 'Searchlight beam'],
    stack: ['GSAP', 'Matter.js', 'View Transitions', 'Web Audio'],
    stat: { value: '0 ms', label: 'blocking time on desktop at 4× CPU' },
    url: 'https://kaiju.devstudiocraft.com',
  },
  {
    id: 'halfmoon',
    name: 'Half Moon Roasters',
    line: 'One moon at a time.',
    kind: 'Studio brand',
    discipline: 'E-commerce · 3D',
    place: 'Five roasts, five phases',
    summary:
      'A Swiss-grid roaster where the half-disc moon is the whole brand. Five roasts, one per lunar phase, and a live moon engine that recommends tonight’s coffee.',
    moves: [
      'A real astronomical moon phase picks tonight’s roast',
      'One WebGL canvas renders every 3D tin through scissor viewports',
      'A 27-second hand-built SVG motion graphic as the hero',
      'Tins morph between pages with View Transitions',
    ],
    palette: ['#2e3192', '#f28cab', '#ff6f2c', '#ffc533', '#5fd3a8'],
    type: ['Inter Tight', 'Instrument Serif'],
    chips: ['Live moon phase', 'WebGL tins'],
    stack: ['three.js', 'GSAP', 'Matter.js', 'SVG motion'],
    stat: { value: '60 fps', label: 'in every section on a 6× throttled phone' },
    url: 'https://halfmoon.devstudiocraft.com',
  },
  {
    id: 'basalt',
    name: 'Basalt Machines',
    line: 'Pressure. Heat. Time.',
    kind: 'Studio brand',
    discipline: 'B2B · 3D product',
    place: 'Reykjavík',
    summary:
      'Commercial espresso machines from a volcanic island. Four machines modelled part by part, a moving bento wall, and a live 3D viewer that takes each one apart on stage.',
    moves: [
      'Four machines modelled as hard-surface parts, lit by a studio HDR',
      'A staged take-apart viewer with spinning parts and click-to-focus labels',
      'Live finish configurator and a lease-priced quote flow',
      'A dotted earth with ember arcs to 13 service hubs',
    ],
    palette: ['#0c0c0b', '#32312e', '#8b877f', '#ece8df', '#ff5b1f'],
    type: ['Mona Sans', 'IBM Plex Mono'],
    chips: ['Take-apart viewer', 'Quote builder'],
    stack: ['three.js', 'Blender', 'glTF', 'GSAP'],
    stat: { value: '4', label: 'machines built in code, from bolt to badge' },
    url: 'https://basalt.devstudiocraft.com',
  },
  {
    id: 'poste',
    name: 'Poste',
    line: 'A café that writes to you.',
    kind: 'Studio brand',
    discipline: 'Hospitality',
    place: 'Vevey, est. 1924',
    summary:
      'Coffee and brunch in a lakeside post office. Every title is a line of a postcard, written live by a handwriting engine that inks each letter along its spine.',
    moves: [
      'A handwriting engine that strokes each glyph’s true centre line',
      'A reservation postcard that writes itself as you type',
      'A wordmark filled with the menu’s own photography',
      'Self-drawing line art of the old sorting room',
    ],
    palette: ['#f8f3ea', '#1c2541', '#c63d24', '#2c5a86', '#f0b54a'],
    type: ['Ms Madi', 'Fraunces', 'Barlow'],
    chips: ['Handwriting engine', 'Live postcard'],
    stack: ['opentype.js', 'SVG', 'GSAP', 'Python'],
    stat: { value: '57', label: 'glyphs on first paint, 135 on demand' },
    url: 'https://poste.devstudiocraft.com',
  },
  {
    id: 'grounds',
    name: 'Grounds Control',
    line: 'Cleared for extraction.',
    kind: 'Studio brand',
    discipline: 'Roastery · Campaign',
    place: 'Lisbon',
    summary:
      'A Lisbon roaster run like mission control. Every coffee is a flight from farm to cup: pictures acquire signal, roasts depart on a Solari board, cafés are drop zones.',
    moves: [
      'A quadtree depixelate “signal lock”, scrubbable both ways',
      'A split-flap departures board for the week’s roasts, on one canvas',
      'Farm-to-cup flight plan scrubbed by scroll',
      'A dot-matrix map of every café that pours it',
    ],
    palette: ['#0d0c0a', '#1a130f', '#efebe4', '#ff4f00', '#59f2a4'],
    type: ['Big Shoulders', 'Martian Mono', 'Hanken Grotesk'],
    chips: ['Signal lock', 'Solari board'],
    stack: ['Canvas 2D', 'GSAP', 'Web Audio', 'Video'],
    stat: { value: '57–60', label: 'fps on a 6× throttled phone' },
    url: 'https://groundscontrol.devstudiocraft.com',
  },
  {
    id: 'chicafe',
    name: 'Chi-Cafe',
    line: 'Die gesunde Art zu genießen.',
    kind: 'Redesign concept',
    discipline: 'D2C · 3D',
    place: 'Germany',
    summary:
      'A calm, premium redesign concept for a reishi coffee brand. The real tins in 3D, one particle field that breathes through the story, and a quiz that finds your blend.',
    moves: [
      'The brand’s tins rebuilt in 3D, labels unwrapped from packshots',
      'One particle field that morphs steam → 氣 → reishi → ensō',
      'A three-question quiz that matches each guest to a blend',
    ],
    palette: ['#140d09', '#241811', '#f4ede3', '#e0a06a', '#9cc46f'],
    type: ['Instrument Serif', 'Inter Tight'],
    chips: ['3D tins', 'Particle morph'],
    stack: ['Vite', 'three.js', 'GSAP', 'Lenis'],
    stat: { value: '6', label: 'blends, one quiz to find yours' },
    url: 'https://chicafe.devstudiocraft.com',
    note: 'Concept for chi-cafe.de, not the official site.',
  },

  /* Series II: the same five studies, rebuilt by a second team of ours, plus Common Hour */
  {
    id: 'afterhours',
    series: 2,
    name: 'Afterhours Coffee',
    line: 'Good coffee. Different hours.',
    kind: 'Studio brand',
    discipline: 'E-commerce',
    summary:
      'An ivory, charcoal and electric-violet roaster for the late ones: a theatrical product stage under a moon seal, torn-paper chapters and a cart that remembers your grind.',
    moves: [
      'A product carousel with depth, keyboard and swipe',
      'A scroll-driven horizontal concept timeline',
      'A local cart with grind, cadence and subscription preview',
    ],
    palette: ['#232321', '#f5f0e5', '#8054f5', '#b29aff'],
    type: ['Anton', 'Archivo', 'DM Mono'],
    stack: ['Vanilla JS', 'Matter.js', 'CSS motion'],
    url: 'https://afterhours.devstudiocraft.com',
  },
  {
    id: 'dayform',
    series: 2,
    name: 'Dayform Coffee',
    line: 'Good coffee. In every form.',
    kind: 'Studio brand',
    discipline: 'E-commerce',
    summary:
      'A bold, colour-blocked roaster: full-field hero scenes, a cascade mosaic of photo flips, packages built in CSS you can turn, and a family of geometric café marks.',
    moves: [
      'Four authored hero chapters, each a full field of colour',
      'Package models built in CSS that turn as you drag',
      'Coffee dialogs with tasting chips and matching recipes',
    ],
    palette: ['#254ce8', '#ed603e', '#f4d95b', '#c5b4e8', '#417c5e'],
    type: ['Georgia', 'Arial'],
    stack: ['Vanilla JS', 'CSS 3D', 'Dialogs'],
    url: 'https://dayform.devstudiocraft.com',
  },
  {
    id: 'velora',
    series: 2,
    name: 'Velora',
    line: 'Coffee, considered.',
    kind: 'Studio brand',
    discipline: 'B2B · 3D product',
    summary:
      'Professional coffee machines in a calm, cool key: a horizontal showroom of flip cards, a flagship story told in chapters, and a Three.js explorer that loads only when you ask.',
    moves: [
      'A horizontal showroom with slider, arrows and flip cards',
      'An on-demand Three.js machine explorer',
      'A coffee brief that points you to the right machine',
    ],
    palette: ['#111313', '#f4f3ed', '#bed5d8', '#ffffff'],
    type: ['Noto Sans'],
    stack: ['three.js', 'Import maps', 'Vanilla JS'],
    url: 'https://velora.devstudiocraft.com',
  },
  {
    id: 'commonhour',
    series: 2,
    name: 'Common Hour',
    line: 'Good coffee. Room for each other.',
    kind: 'Studio brand',
    discipline: 'Community · Shop',
    summary:
      'Coffee and conversation on a single screen of tiles. Every tile opens its own room, from the coffee shop to Take Five, a set of prompts with a five-minute timer.',
    moves: [
      'A tile board that reorders itself into a phone stack',
      'A 20-second animated brand interlude',
      'Conversation prompts with a five-minute timer',
    ],
    palette: ['#243ee8', '#f9f5e9', '#ffc39f', '#f8df7c', '#202315'],
    type: ['Bricolage Grotesque'],
    stack: ['Vanilla JS', 'Hash routing', 'CSS motion'],
    url: 'https://commonhour.devstudiocraft.com',
  },
  {
    id: 'lacune',
    series: 2,
    name: 'Lacune',
    line: 'Café & slow mornings.',
    kind: 'Studio brand',
    discipline: 'Hospitality',
    summary:
      'A lakeside café on oat paper and lake-green ink: food-filled lettering, handwriting drawn stroke by stroke, eight photographed dishes and booking with a real inline calendar.',
    moves: [
      'A wordmark filled with the menu’s own food photography',
      'Handwritten lettering drawn glyph by glyph',
      'An accessible inline calendar for reservations',
    ],
    palette: ['#f6f1e6', '#244a3b', '#dce1cf', '#e9ad81', '#617063'],
    type: ['Caveat'],
    stack: ['Vanilla JS', 'SVG strokes', 'Dialogs'],
    url: 'https://lacune.devstudiocraft.com',
  },
  {
    id: 'emberline',
    series: 2,
    name: 'Emberline Coffee',
    line: 'Find your daily fire.',
    kind: 'Studio brand',
    discipline: 'Roastery · Shop',
    summary:
      'Warm paper, charcoal and ember: three roasts with full detail pages, a bag that keeps every variant straight, a bean-to-brew story and brew guides with live timers.',
    moves: [
      'Roast, brew and flavour filters into full coffee details',
      'A five-stage bean-to-brew story with a reversible taste loop',
      'Brew guides with dose calculators and timers',
    ],
    palette: ['#171915', '#f0eee5', '#ff7950', '#777c6d'],
    type: ['Arial', 'Courier New'],
    stack: ['Vanilla JS', 'Dialogs', 'Local storage'],
    url: 'https://emberline.devstudiocraft.com',
  },
];

export const aviation = [
  {
    id: 'pilot100',
    name: 'Pilot 100',
    logo: '/work/logos/pilot100.svg',
    line: 'Pass first time.',
    sector: 'Aviation training · EASA ATPL(A)',
    summary:
      'The complete ATPL theory ecosystem, built in Germany: a question bank, theory books, a study planner, an LMS for flight schools and an iPhone and iPad app, wrapped in an identity that lives above the clouds.',
    delivered: ['Brand identity', 'Marketing site', 'Web app', 'iOS & iPadOS app', 'School LMS'],
    stats: [
      { value: '27,000+', label: 'ECQB-aligned questions' },
      { value: '13', label: 'theory books' },
      { value: '12', label: 'aviation ranks to climb' },
      { value: 'iOS', label: 'iPhone & iPad app' },
    ],
    url: 'https://pilot100atpl.com',
    host: 'pilot100atpl.com',
    accent: '#5eead4',
    phones: ['home', 'question', 'result'],
  },
  {
    id: 'airyona',
    name: 'Airyona',
    logo: '/work/logos/airyona.svg',
    line: 'Room on board.',
    sector: 'Aviation · Flight sharing',
    summary:
      'A flight-sharing platform that pairs passengers with licensed private pilots: sightseeing loops, island hops and weekend escapes from the local airfield, for the price of a train ticket.',
    delivered: ['Brand identity v2', 'Launch site', 'Product UI', 'Brand films'],
    stats: [
      { value: '120+', label: 'airfields mapped' },
      { value: '9', label: 'launch countries' },
      { value: '€49', label: 'seats from, cost-shared' },
      { value: 'Dec ’26', label: 'public launch' },
    ],
    url: 'https://www.airyona.com',
    host: 'airyona.com',
    accent: '#7c9bff',
    phones: ['home', 'flight', 'request'],
  },
];

export const spaces = [
  {
    id: 'tour',
    name: 'APT-01',
    title: 'The Park Residence',
    line: 'Step inside.',
    sector: 'Real estate · Interactive tour',
    summary:
      'A private, room-by-room walkthrough of a three-bedroom residence on the park. A cinematic film opens the door, glowing markers walk you through every room, a floor plan tracks where you stand, and a 360° mode lets you turn and look around each space.',
    delivered: ['Interactive tour', '360° walkthrough', 'Floor-plan navigation', 'Hero film', 'Extended panoramas'],
    stats: [
      { value: '17', label: 'stops, from the street to the last room' },
      { value: '118°', label: 'look-around in most rooms' },
      { value: '2', label: 'tour modes, classic and 360°' },
      { value: '3', label: 'bedrooms, park-facing' },
    ],
    url: 'https://tour.devstudiocraft.com',
    url360: 'https://tour.devstudiocraft.com/360/',
    host: 'tour.devstudiocraft.com',
  },
];

export const identities = [
  {
    id: 'p100',
    name: 'Pilot 100',
    idea: 'Aim for 100.',
    sector: 'Aviation training',
    logo: '/work/logos/pilot100.svg',
    contents: ['54-page brand book', '33 logo masters', '26-slide guidelines deck', '7 brand films', 'Print-ready stationery'],
  },
  {
    id: 'ary',
    name: 'Airyona',
    idea: 'Room on board.',
    sector: 'Flight sharing',
    logo: '/work/logos/airyona.svg',
    contents: ['50-page brand book', '15 logo masters', '25-slide guidelines deck', '7 brand films', 'Social template kit'],
  },
  {
    id: 'm2a',
    name: 'M2A Facility Management',
    idea: 'In bester Ordnung.',
    sector: 'Facility management · Bremen',
    logo: '/work/logos/m2a.svg',
    contents: ['50-page brand book', '17 logo masters', '25-slide guidelines deck', '7 brand films', 'Van livery & ID badge'],
  },
];

/* What a kit ships with, in delivery order. */
export const kitParts = [
  'Logo masters',
  'Colour tokens',
  'Typography',
  'Graphic language',
  'UI expression',
  'Social kit',
  'Stationery',
  'Motion films',
  'Guidelines deck',
  'Brand boards',
];

/* ---------------------------------------------------------------------------
   Industries: the trades we build for. `trade: true` marks the local-business
   categories the studio sells to (the home page picker lists those).
--------------------------------------------------------------------------- */
export const industries = [
  { key: 'hair', label: 'Barbers & hair', short: 'Barbers', trade: true },
  { key: 'nails', label: 'Nails & beauty', short: 'Nails', trade: true },
  { key: 'detailing', label: 'Car detailing', short: 'Detailing', trade: true },
  { key: 'gym', label: 'Gyms & fitness', short: 'Gyms', trade: true },
  { key: 'physio', label: 'Physio & rehab', short: 'Physio', trade: true },
  { key: 'massage', label: 'Massage & spa', short: 'Massage', trade: true },
  { key: 'dental', label: 'Dental clinics', short: 'Dental', trade: true },
  { key: 'events', label: 'Events & catering', short: 'Events', trade: true },
  { key: 'restaurant', label: 'Restaurants', short: 'Restaurants', trade: true },
  { key: 'cafe', label: 'Cafés & coffee', short: 'Cafés', trade: true },
  { key: 'aviation', label: 'Aviation', short: 'Aviation' },
  { key: 'realestate', label: 'Real estate', short: 'Real estate' },
  { key: 'keepsakes', label: 'Weddings & keepsakes', short: 'Weddings' },
  { key: 'identity', label: 'Brand identity', short: 'Identity' },
];

/* ---------------------------------------------------------------------------
   The trade series: one flagship site per local trade, each for a brand we
   invented and built end to end (brand, photography, film, code).
   Add a site: one entry here, film-<id>.{webm,mp4} in public/media/work/,
   films/<id>.jpg and phones/<id>.jpg in src/assets/work/.
--------------------------------------------------------------------------- */
export const trades = [
  {
    id: 'bluehour',
    name: 'Blue Hour Barbers',
    industry: 'hair',
    city: 'Chicago',
    line: 'Sit down tired, stand up sharp.',
    summary:
      'Five late-opening barbershops written like a fashion magazine: cobalt spreads that rise over each other, serif headlines that turn italic mid-sentence and a booking app you can tilt.',
    moves: ['Sections rise over each other like magazine spreads', 'Five location pages from one data file', 'A tilting phone with the real booking app'],
    palette: ['#2b3df5', '#0b0d1a', '#f3f1ea', '#6474ff'],
    accent: '#6474ff',
    stat: { value: '9', label: 'pages, five shops' },
    url: 'https://bluehour.devstudiocraft.com',
  },
  {
    id: 'vernis',
    name: 'Maison Vernis',
    industry: 'nails',
    city: 'Montréal',
    line: 'Lacquer, laid in quiet coats.',
    summary:
      'A lacquer house for nails and head spa. Glossy slats close over the hero film as you scroll, every arch tightens as it rises, and a shade picker re-lacquers the whole site.',
    moves: ['Lacquer slats that coat the hero as you scroll', 'A shade picker that recolours the site', 'Four-step booking and a live gift-card builder'],
    palette: ['#7a2630', '#f2ece4', '#c4a57a', '#2e1b1e'],
    accent: '#d4a07a',
    stat: { value: '8', label: 'pages, booking to gift card' },
    url: 'https://vernis.devstudiocraft.com',
  },
  {
    id: 'kelvin',
    name: 'KELVIN',
    industry: 'detailing',
    city: 'Detroit',
    line: 'Haze out. Depth back.',
    summary:
      'A paint-correction studio with one dark bay, one car and one light you hold. A real 911 Turbo S turns in 3D, the lamp’s colour temperature follows your pointer, and a garage swaps the car.',
    moves: ['A 3D studio bay with a real Porsche 911 Turbo S', 'The lamp’s 1800–6500 K temperature follows the pointer', 'Garage swap: 911, G 63 or our own Kelvin GT'],
    palette: ['#07080a', '#e8ecef', '#ff9a4a', '#9fd0ff'],
    accent: '#ff9a4a',
    stat: { value: '3', label: 'cars in one 3D bay' },
    url: 'https://kelvin.devstudiocraft.com',
  },
  {
    id: 'ferro',
    name: 'FERRO Clubs',
    industry: 'gym',
    city: 'Milano · Torino · Verona',
    line: 'Strike while it’s hot.',
    summary:
      'Gyms in restored iron foundries. Molten type bands over film, a forged 3D plate, clubs open 05:30 to 23:00, and class names taken from the forge: Anvil, Bellows, Temper, Quench.',
    moves: ['Molten type bands that roll over the films', 'A forged plate modelled in Blender', 'Club finder and class timetable'],
    palette: ['#ff5b1a', '#140b07', '#f6ede6', '#ffd8c2'],
    accent: '#ff5b1a',
    stat: { value: '05:30', label: 'to 23:00, every day of the year' },
    url: 'https://ferro.devstudiocraft.com',
  },
  {
    id: 'firn',
    name: 'Firn Dental',
    industry: 'dental',
    city: 'Innsbruck',
    line: 'Dentistry with the patience of ice.',
    summary:
      'An implant and aesthetic clinic in the Alps. You scroll through a flight over the peaks into a white-out, a sea of dots gathers into a globe of patients’ home countries, and one switch turns day into night.',
    moves: ['A scroll flight over the Alps into a white-out', 'Dots that gather into a globe of patient countries', 'A day/night switch and an implant viewer built in code'],
    palette: ['#e8ecee', '#0b2a3c', '#1a6e91', '#f4f7f8'],
    accent: '#5fb6d9',
    stat: { value: '2', label: 'worlds: dental by day, aesthetics by night' },
    url: 'https://firn.devstudiocraft.com',
  },
  {
    id: 'loadtheory',
    name: 'Load Theory',
    industry: 'physio',
    city: 'Melbourne',
    line: 'Load it right. Come back stronger.',
    summary:
      'A sports physio and rehab lab laid out like a lab report: poster-sized type, a big-type proof wall, sticky “how it works” cards and buttons that decode as you hover.',
    moves: ['A big-type proof wall with scrubbed fills', 'Sticky “how it works” cards', 'Four service pages from one template'],
    palette: ['#2e3bff', '#141414', '#f2f2f0', '#8c95ff'],
    accent: '#8c95ff',
    stat: { value: '11', label: 'pages from one source' },
    url: 'https://loadtheory.devstudiocraft.com',
  },
  {
    id: 'salus',
    name: 'Salus',
    industry: 'massage',
    city: 'Bath & massage house',
    line: 'An unhurried hour.',
    summary:
      'A Mediterranean hammam and massage house told as a threshold: a curtain parts, the S a l u S wordmark breathes out, photo doors open into the menu and a doorway grows until you stand in the lobby.',
    moves: ['Photo doors that part into the treatment menu', 'A doorway that scales until you step inside', 'Twelve ritual pages with a pinned booking bar'],
    palette: ['#8f4630', '#e3d5bf', '#5e4433', '#efe5d4'],
    accent: '#d98a6a',
    stat: { value: '12', label: 'rituals, each with its own page' },
    url: 'https://salus.devstudiocraft.com',
  },
  {
    id: 'longtable',
    name: 'Longtable',
    industry: 'events',
    city: 'Lisbon · Copenhagen',
    line: 'Pull up a chair.',
    summary:
      'Events, feasts and hospitality. Coral light falls over a long table, film plays inside the headline, counters roll, a city list turns over a globe, and twelve case pages sit behind a filter.',
    moves: ['Coral light wedges over the long table', 'Film inside the headline, pixel-exact', 'Twelve case pages with a filter overlay'],
    palette: ['#f28b6e', '#f4eee6', '#ffe17d', '#c7381d'],
    accent: '#f28b6e',
    stat: { value: '12', label: 'case pages behind one filter' },
    url: 'https://longtable.devstudiocraft.com',
  },
  {
    id: 'namjim',
    name: 'NAMJIM',
    industry: 'restaurant',
    city: 'London + 5 cities',
    line: 'Every plate comes with its sauce.',
    summary:
      'Thai street kitchens in six cities. A film reel opens the house, the logo letters rise and fly into the header, each restaurant has its own page, and a booking drawer opens from every Book button.',
    moves: ['A film reel with a logo that flies into the header', 'Eight restaurant pages and an HTML menu', 'Hand-engraved illustrations that sway'],
    palette: ['#ff62a8', '#1d1748', '#d7ff3a', '#fff4e4'],
    accent: '#ff62a8',
    stat: { value: '8', label: 'restaurants, one booking drawer' },
    url: 'https://namjim.devstudiocraft.com',
  },
  {
    id: 'knip',
    name: 'KNIP',
    industry: 'hair',
    city: 'Rotterdam',
    line: 'The city blurs. The cut doesn’t.',
    summary:
      'A Rotterdam barbershop in harbour orange and concrete. The menu scales the whole page into the corner, an index drops a tilted photo per link, and stepped full-screen sections cut like a fade.',
    moves: ['A menu that scales the page into the corner', 'An index that drops a tilted photo per link', 'Price grid, school and careers pages'],
    palette: ['#ff5a1f', '#0e0e0d', '#e7e6e1', '#f1f0ec'],
    accent: '#ff5a1f',
    stat: { value: '8', label: 'pages, shop to school' },
    url: 'https://knip.devstudiocraft.com',
  },
];

/* ---------------------------------------------------------------------------
   Keepsakes: personal sites made as a gift, one person at a time.
--------------------------------------------------------------------------- */
export const keepsakes = [
  {
    id: 'letter',
    name: 'A Letter for Mia',
    place: 'Wedding thank-you letter',
    line: 'Thank you for marrying me.',
    summary:
      'A “thank you for marrying me” letter built as a website. A sealed envelope starts your song, a note waits on her phone, then the screen dives into eleven chapters of your story.',
    palette: ['#93b3e4', '#fbf1ee', '#c3182b', '#2b3754'],
    accent: '#f26b7e',
    url: 'https://letter.devstudiocraft.com',
  },
];

const hostOf = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

/* the most colourful palette swatch that still reads as small text on the page (WCAG AA on #0b0b0e) */
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const sat = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(...c) - Math.min(...c);
};
const readable = (palette) =>
  palette
    .filter((c) => (lum(c) + 0.05) / (lum('#0b0b0e') + 0.05) >= 4.6 && sat(c) > 40)
    .sort((a, b) => sat(b) - sat(a))[0] ?? '#c9f24b';

/* Every project as one flat, filterable list (the /work index and the home picker read this). */
export const allWork = [
  ...trades.map((t) => ({
    id: t.id,
    name: t.name,
    industry: t.industry,
    place: t.city,
    line: t.line,
    accent: t.accent,
    url: t.url,
    host: hostOf(t.url),
    poster: `films/${t.id}.jpg`,
    film: t.id,
    series: 'Trade series',
  })),
  ...coffee.map((c) => ({
    id: c.id,
    name: c.name,
    industry: 'cafe',
    place: c.place ?? c.discipline,
    line: c.line,
    accent: readable(c.palette),
    url: c.url,
    host: hostOf(c.url),
    poster: `films/${c.id}.jpg`,
    film: c.id,
    series: c.series === 2 ? 'Coffee · Series II' : 'Coffee series',
  })),
  ...aviation.map((a) => ({
    id: a.id,
    name: a.name,
    industry: 'aviation',
    place: a.sector,
    line: a.line,
    accent: a.accent,
    url: a.url,
    host: a.host,
    poster: `films/${a.id}.jpg`,
    film: a.id,
    series: 'Aviation',
  })),
  ...spaces.map((s) => ({
    id: s.id,
    name: `${s.name} · ${s.title}`,
    industry: 'realestate',
    place: s.sector,
    line: s.line,
    accent: '#d9c6a5',
    url: s.url,
    host: s.host,
    poster: `films/${s.id}.jpg`,
    film: s.id,
    series: 'Spaces',
  })),
  ...keepsakes.map((k) => ({
    id: k.id,
    name: k.name,
    industry: 'keepsakes',
    place: k.place,
    line: k.line,
    accent: k.accent,
    url: k.url,
    host: hostOf(k.url),
    poster: `films/${k.id}.jpg`,
    film: k.id,
    series: 'Keepsakes',
  })),
  ...identities.map((b) => ({
    id: `id-${b.id}`,
    name: b.name,
    industry: 'identity',
    place: b.sector,
    line: b.idea,
    accent: { p100: '#5eead4', ary: '#7c9bff', m2a: '#6f93ff' }[b.id],
    url: '#identity',
    poster: { p100: 'brand/board-p100-aurora.jpg', ary: 'brand/board-ary-bluehour.jpg', m2a: 'brand/board-m2a-weser.jpg' }[b.id],
    series: 'Identity system',
  })),
];

/* industries that actually have work, with counts, in taxonomy order */
export const industryCounts = industries
  .map((i) => ({ ...i, count: allWork.filter((w) => w.industry === i.key).length }))
  .filter((i) => i.count > 0);

/* The studio reel (public/media/work/reel*.{webm,mp4}): which site is on screen from which second.
   Cut by work-page/tools/make_reel.py: 28 frames per site at 24 fps. */
export const reelCuts = ['kelvin', 'ferro', 'namjim', 'bluehour', 'salus', 'longtable', 'firn', 'knip', 'vernis', 'loadtheory', 'kaiju', 'pilot100'].map(
  (id, i) => {
    const w = allWork.find((p) => p.id === id);
    const trade = industries.find((x) => x.key === w.industry);
    return { id, at: (i * 28) / 24, name: w.name, trade: trade.label, place: w.place, accent: w.accent, url: w.url };
  }
);
