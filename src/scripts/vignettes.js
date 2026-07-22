import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated mini-UI vignettes on the showcase cards.
 * Each loop ends with a designed fade-out → rebuild (no reverse, no hard cut).
 */
export function initVignettes() {
  const timelines = [
    buildShop(),
    buildLaunch(),
    buildBrand(),
    buildApp(),
  ].filter(Boolean);

  if (!timelines.length) return;

  const section = document.querySelector('.showcase');
  if (!section) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => timelines.forEach((tl) => tl.play()),
    onLeave: () => timelines.forEach((tl) => tl.pause()),
    onEnterBack: () => timelines.forEach((tl) => tl.play()),
    onLeaveBack: () => timelines.forEach((tl) => tl.pause()),
  });
}

function baseTimeline() {
  return gsap.timeline({
    repeat: -1,
    repeatDelay: 1.1,
    paused: true,
    defaults: { ease: 'expo.out' },
  });
}

/* 001 — storefront: products in, cart fills, checkout, order toast */
function buildShop() {
  const root = document.querySelector('[data-vig="shop"]');
  if (!root) return null;

  const products = root.querySelectorAll('[data-sp]');
  const badge = root.querySelector('[data-cart-badge]');
  const fill = root.querySelector('[data-cta-fill]');
  const cta = root.querySelector('[data-shop-cta]');
  const toast = root.querySelector('[data-shop-toast]');

  const setCount = (n) => () => {
    badge.textContent = String(n);
  };

  const tl = baseTimeline();
  tl.set(products, { opacity: 0, y: 14 })
    .set(badge, { scale: 0 })
    .set(fill, { scaleX: 0 })
    .set(cta, { color: 'rgba(242,239,232,0.75)' })
    .set(toast, { opacity: 0, y: 8 })
    .to(products, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0.2)
    .call(setCount(1), null, 1.0)
    .to(badge, { scale: 1, duration: 0.4, ease: 'back.out(2.6)' }, 1.0)
    .call(setCount(2), null, 1.45)
    .to(badge, { scale: 1.25, duration: 0.14, yoyo: true, repeat: 1 }, 1.45)
    .call(setCount(3), null, 1.9)
    .to(badge, { scale: 1.25, duration: 0.14, yoyo: true, repeat: 1 }, 1.9)
    .to(fill, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, 2.5)
    .to(cta, { color: 'var(--vc-ink)', duration: 0.2 }, 2.75)
    .to(toast, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 3.2)
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 5.2)
    .set(root, { opacity: 1 }, 5.7);
  return tl;
}

/* 002 — launch: countdown, page rises, LIVE, analytics climb */
function buildLaunch() {
  const root = document.querySelector('[data-vig="launch"]');
  if (!root) return null;

  const count = root.querySelector('[data-l-count]');
  const page = root.querySelector('[data-l-page]');
  const live = root.querySelector('[data-l-live]');
  const spark = root.querySelector('[data-l-spark]');
  const len = spark.getTotalLength();

  const setCount = (n) => () => {
    count.textContent = String(n);
  };

  const tl = baseTimeline();
  tl.set(page, { yPercent: 118 })
    .set(live, { opacity: 0, scale: 0.5 })
    .set(count, { opacity: 0 })
    .set(spark, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });

  [3, 2, 1].forEach((n, i) => {
    tl.call(setCount(n), null, 0.2 + i * 0.55).fromTo(
      count,
      { opacity: 1, scale: 1.5 },
      { scale: 1, duration: 0.4, ease: 'power3.out' },
      0.2 + i * 0.55
    );
  });

  tl.to(count, { opacity: 0, scale: 0.6, duration: 0.25, ease: 'power2.in' }, 1.9)
    .to(page, { yPercent: 0, duration: 0.8, ease: 'back.out(1.4)' }, 2.05)
    .to(live, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, 2.75)
    .to(spark, { opacity: 1, duration: 0.2 }, 3.0)
    .to(spark, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 3.0)
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 5.6)
    .set(root, { opacity: 1 }, 6.1);
  return tl;
}

/* 003 — identity: mark draws, swatches cascade, type settles */
function buildBrand() {
  const root = document.querySelector('[data-vig="brand"]');
  if (!root) return null;

  const marks = root.querySelectorAll('[data-b-mark]');
  const swatches = root.querySelectorAll('[data-b-swatch]');
  const aa = root.querySelector('[data-b-aa]');
  const lines = root.querySelectorAll('[data-b-line]');
  const lengths = [...marks].map((p) => p.getTotalLength());

  const tl = baseTimeline();
  marks.forEach((p, i) => {
    tl.set(p, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] }, 0);
  });
  tl.set(swatches, { opacity: 0, y: 10 }, 0)
    .set(aa, { opacity: 0, y: 8 }, 0)
    .set(lines, { scaleX: 0 }, 0);

  marks.forEach((p, i) => {
    tl.to(p, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut' }, 0.2 + i * 0.25);
  });

  tl.to(swatches, { opacity: 1, y: 0, duration: 0.45, stagger: 0.09 }, 1.3)
    .to(aa, { opacity: 1, y: 0, duration: 0.45 }, 1.75)
    .to(lines, { scaleX: 1, duration: 0.55, stagger: 0.1, ease: 'power3.out' }, 1.9)
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 4.6)
    .set(root, { opacity: 1 }, 5.1);
  return tl;
}

/* 004 — product: app screens swipe, dots sync, rating chip */
function buildApp() {
  const root = document.querySelector('[data-vig="app"]');
  if (!root) return null;

  const screens = root.querySelector('[data-ph-screens]');
  const dots = root.querySelectorAll('[data-ph-dot]');
  const notif = root.querySelector('[data-app-notif]');

  const setDot = (i) => () => {
    dots.forEach((d, j) => d.classList.toggle('is-on', i === j));
  };

  const tl = baseTimeline();
  tl.set(screens, { xPercent: 0 })
    .set(notif, { opacity: 0, y: -6 })
    .call(setDot(0), null, 0)
    .to(screens, { xPercent: -100, duration: 0.65, ease: 'power3.inOut' }, 1.1)
    .call(setDot(1), null, 1.35)
    .to(notif, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, 1.9)
    .to(screens, { xPercent: -200, duration: 0.65, ease: 'power3.inOut' }, 2.7)
    .call(setDot(2), null, 2.95)
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 4.9)
    .set(screens, { xPercent: 0 }, 5.36)
    .call(setDot(0), null, 5.37)
    .set(notif, { opacity: 0 }, 5.37)
    .set(root, { opacity: 1 }, 5.4);
  return tl;
}
