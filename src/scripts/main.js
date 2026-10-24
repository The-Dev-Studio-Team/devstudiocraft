import {
  gsap,
  ScrollTrigger,
  SplitText,
  reducedMotion,
  initLenis,
  initReveals,
  initSplitHeadings,
  initWordmark,
  showAllReveals,
  refreshOnFonts,
  introDelay,
  stickyRun,
  onReady,
} from './core.js';
import { initMagnetic, initNav, initServicePreview, initAmbientVideos } from './interactions.js';

/* ---------- hero intro: the headline rises as the session intro opens ---------- */
function initIntro() {
  const lines = gsap.utils.toArray('[data-hero-title] .hl');
  const reveals = gsap.utils.toArray('.hero [data-reveal]');

  if (reducedMotion) {
    gsap.set(lines, { yPercent: 0 });
    gsap.set(reveals, { opacity: 1, y: 0 });
    return;
  }

  gsap
    .timeline({ defaults: { ease: 'expo.out' }, delay: introDelay() + 0.05 })
    .fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.09 })
    .to(reveals, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07 }, '-=0.8')
    .fromTo('[data-hero-screen]', { '--rise': 1 }, { '--rise': 0, duration: 1.6, ease: 'expo.out' }, 0.15);
}

/* ---------- the screen rises: tipped back at the foot of the hero, flat and full as you scroll ---------- */
function initHeroScreen() {
  const hero = document.querySelector('[data-hero]');
  const stage = document.querySelector('[data-hero-stage]');
  const copy = document.querySelector('[data-hero-copy]');
  if (!hero || !stage || !copy) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px) and (min-height: 641px)', () => {
    const tl = gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      .fromTo(stage, { '--sp': 1 }, { '--sp': 0, duration: 1 }, 0)
      .fromTo(copy, { '--hp': 0 }, { '--hp': 1, duration: 0.7 }, 0);
    return () => {
      tl.scrollTrigger?.kill();
      gsap.set([stage, copy], { clearProps: '--sp,--hp' });
    };
  });
}

/* ---------- the reel: plays while on screen, the caption names the site on screen ---------- */
function initReel() {
  const video = document.querySelector('[data-hero-video]');
  const data = document.querySelector('[data-reel-cuts]');
  if (!video || !data) return;
  const cuts = JSON.parse(data.textContent);
  const now = document.querySelector('[data-reel-now]');
  const link = document.querySelector('[data-reel-link]');
  const name = document.querySelector('[data-reel-name]');
  const meta = document.querySelector('[data-reel-meta]');
  const host = document.querySelector('[data-reel-host]');
  const stage = document.querySelector('[data-hero-stage]');
  const still = reducedMotion || navigator.connection?.saveData;
  let shown = 0;
  let raf = 0;

  const show = (i) => {
    if (i === shown) return;
    shown = i;
    const c = cuts[i];
    now.style.setProperty('--accent', c.accent);
    stage?.style.setProperty('--glow', c.accent);
    link.href = c.url;
    name.textContent = c.name;
    meta.textContent = `${c.trade} · ${c.place}`;
    host.textContent = new URL(c.url).host;
  };

  const tick = () => {
    const t = video.currentTime;
    let i = cuts.length - 1;
    while (i > 0 && cuts[i].at > t + 0.02) i--;
    show(i);
    raf = video.paused ? 0 : requestAnimationFrame(tick);
  };

  video.addEventListener('play', () => {
    if (!raf) raf = requestAnimationFrame(tick);
  });
  if (still) return;
  new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), {
    threshold: 0.05,
  }).observe(video);
}

/* ---------- trade picker: the trade's film follows the pointer down the list ---------- */
function initTradePicker() {
  const list = document.querySelector('[data-tp-list]');
  const preview = document.querySelector('[data-tp-preview]');
  if (!list || !preview) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches) return;

  const rows = list.querySelectorAll('[data-tp-row]');
  const imgs = preview.querySelectorAll('[data-tp-img]');
  const video = preview.querySelector('[data-tp-video]');
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });
  let film = '';
  let timer = 0;

  gsap.set(preview, { scale: 0.86, rotate: -3 });
  list.addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  rows.forEach((row, i) => {
    row.addEventListener('pointerenter', (e) => {
      imgs.forEach((img, k) => img.classList.toggle('is-active', k === i));
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(preview, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });

      // the film only loads once the pointer rests on a row
      clearTimeout(timer);
      video.classList.remove('is-playing');
      video.pause();
      timer = setTimeout(() => {
        const id = row.dataset.film;
        if (id !== film) {
          film = id;
          video.innerHTML = `<source src="/media/work/film-${id}.webm" type="video/webm"><source src="/media/work/film-${id}.mp4" type="video/mp4">`;
          video.load();
        }
        video
          .play()
          .then(() => video.classList.add('is-playing'))
          .catch(() => {});
      }, 180);
    });
  });

  list.addEventListener('pointerleave', () => {
    clearTimeout(timer);
    video.pause();
    gsap.to(preview, { opacity: 0, scale: 0.86, rotate: -3, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
  });
}

/* ---------- manifesto word scrub ---------- */
function initManifesto() {
  const el = document.querySelector('[data-manifesto]');
  if (!el) return;

  // the words stay real text, so no aria-label on the paragraph (axe: aria-prohibited-attr)
  const split = new SplitText(el, { type: 'words', wordsClass: 'w', aria: 'none' });
  gsap.fromTo(
    split.words,
    { opacity: 0.14 },
    {
      opacity: 1,
      stagger: 0.04,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        end: 'bottom 45%',
        scrub: 0.6,
      },
    }
  );
}

/* ---------- pinned horizontal showcase (desktop only) ---------- */
function initShowcase() {
  stickyRun(document.querySelector('[data-showcase-pin]'), document.querySelector('[data-showcase-track]'));
}

/* ---------- edge speed-race demo loop ---------- */
function initSpeedRace() {
  const root = document.querySelector('[data-race]');
  if (!root) return;

  const els = root.querySelectorAll('[data-race-el]');
  const sale = root.querySelector('[data-race-sale]');
  const leave = root.querySelector('[data-race-leave]');
  const timer = root.querySelector('[data-race-timer]');
  const spin = root.querySelector('[data-race-spin]');
  const clock = { v: 0 };

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.6,
    paused: true,
    defaults: { ease: 'expo.out' },
  });

  tl.set(els, { opacity: 0, y: 10, scale: 0.94 })
    .set([sale, leave], { opacity: 0, scale: 0.6, y: 4 })
    .set(spin, { opacity: 1 })
    .set(clock, { v: 0 })
    // your site: content pops in almost immediately
    .to(els, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07 }, 0.35)
    // competitor: the clock just keeps running
    .to(
      clock,
      {
        v: 6,
        duration: 6,
        ease: 'none',
        onUpdate: () => {
          timer.textContent = `${clock.v.toFixed(1)}s`;
        },
      },
      0
    )
    // first order lands while the other side still shows bones
    .to(sale, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.4)' }, 1.5)
    // a second order pulse
    .to(sale, { scale: 1.1, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 4.4)
    // competitor's visitor walks
    .to(leave, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 3.4)
    .to(spin, { opacity: 0.22, duration: 0.4 }, 3.4)
    // reset beat
    .to(root, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 7.0)
    .set(els, { opacity: 0 })
    .set([sale, leave], { opacity: 0, scale: 0.6 })
    .to(root, { opacity: 1, duration: 0.3 }, 7.5);

  ScrollTrigger.create({
    trigger: root,
    start: 'top 88%',
    onEnter: () => tl.play(),
    onLeave: () => tl.pause(),
    onEnterBack: () => tl.play(),
    onLeaveBack: () => tl.pause(),
  });
}

/* ---------- boot ---------- */
function boot() {
  initNav();
  initIntro();
  initReel();

  if (reducedMotion) {
    showAllReveals();
    return;
  }

  initLenis();
  initMagnetic();
  initHeroScreen();
  initAmbientVideos();
  initTradePicker();
  initServicePreview();
  initReveals();
  initSplitHeadings();
  initManifesto();
  initShowcase();
  initSpeedRace();
  initWordmark();

  refreshOnFonts();
}

onReady(boot);
