import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated mini-UI vignettes on the showcase cards.
 * Markup defaults are the composed final state (shown to reduced-motion
 * users); timelines reset to a start state, play the story, then end with
 * a designed fade-out → rebuild. No reverse, no hard cut.
 */
export function initVignettes() {
  const timelines = [buildShop(), buildLaunch(), buildBrand(), buildApp()].filter(Boolean);
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
    repeatDelay: 1.2,
    paused: true,
    defaults: { ease: 'expo.out' },
  });
}

const money = (v) => `$${v.toFixed(2)}`;

/* 001 — storefront: product in, Add pressed, cart +1, total counts, checkout, toast */
function buildShop() {
  const root = document.querySelector('[data-vig="shop"]');
  if (!root) return null;

  const prod = root.querySelector('[data-prod]');
  const add = root.querySelector('[data-prod-add]');
  const badge = root.querySelector('[data-cart-badge]');
  const total = root.querySelector('[data-shop-total]');
  const fill = root.querySelector('[data-cta-fill]');
  const cta = root.querySelector('[data-shop-cta]');
  const toast = root.querySelector('[data-shop-toast]');
  const sum = { v: 0 };

  const tl = baseTimeline();
  tl.set(prod, { opacity: 0, y: 14 })
    .set(badge, { scale: 0 })
    .set(fill, { scaleX: 0 })
    .set(cta, { color: 'rgba(242,239,232,0.75)' })
    .set(toast, { opacity: 0, y: 8 })
    .set(sum, { v: 0 })
    .call(() => {
      total.textContent = money(0);
    })
    .to(prod, { opacity: 1, y: 0, duration: 0.55 }, 0.25)
    // "Add" gets pressed
    .to(add, { scale: 0.82, duration: 0.12, ease: 'power2.in' }, 1.1)
    .to(add, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, 1.22)
    // cart badge pops, total counts up
    .to(badge, { scale: 1, duration: 0.45, ease: 'back.out(2.6)' }, 1.3)
    .to(
      sum,
      {
        v: 64,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          total.textContent = money(sum.v);
        },
      },
      1.35
    )
    // checkout fills
    .to(fill, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' }, 2.5)
    .to(cta, { color: 'var(--vc-ink)', duration: 0.2 }, 2.75)
    // order confirmed
    .to(toast, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 3.25)
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 5.4)
    .set(root, { opacity: 1 }, 5.9);
  return tl;
}

/* 002 — deploy console: steps tick, LIVE, visitors count, spark climbs */
function buildLaunch() {
  const root = document.querySelector('[data-vig="launch"]');
  if (!root) return null;

  const steps = [...root.querySelectorAll('[data-dep-step]')];
  const live = root.querySelector('[data-l-live]');
  const count = root.querySelector('[data-dep-count]');
  const spark = root.querySelector('[data-l-spark]');
  const len = spark.getTotalLength();
  const visitors = { v: 0 };

  const tl = baseTimeline();
  tl.set(live, { opacity: 0, scale: 0.5 })
    .set(spark, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
    .set(visitors, { v: 0 })
    .call(() => {
      steps.forEach((li) => li.classList.remove('is-done'));
      count.textContent = '0';
    });

  steps.forEach((li, i) => {
    const t = 0.4 + i * 0.55;
    tl.fromTo(li, { opacity: 0.45, x: -6 }, { opacity: 1, x: 0, duration: 0.4 }, t).call(
      () => li.classList.add('is-done'),
      null,
      t + 0.22
    );
  });

  tl.to(live, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' }, 2.25)
    .to(spark, { opacity: 1, duration: 0.2 }, 2.55)
    .to(spark, { strokeDashoffset: 0, duration: 0.95, ease: 'power2.inOut' }, 2.55)
    .to(
      visitors,
      {
        v: 1284,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          count.textContent = Math.round(visitors.v).toLocaleString('en-US');
        },
      },
      2.6
    )
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 5.6)
    .set(root, { opacity: 1 }, 6.1);
  return tl;
}

/* 003 — identity board: wordmark letters rise, swatches cascade, type reveals */
function buildBrand() {
  const root = document.querySelector('[data-vig="brand"]');
  if (!root) return null;

  const letters = root.querySelectorAll('[data-br-word] span');
  const tag = root.querySelector('[data-br-tag]');
  const swatches = root.querySelectorAll('[data-b-swatch]');
  const type = root.querySelector('[data-br-type]');

  const tl = baseTimeline();
  tl.set(letters, { yPercent: 120 })
    .set(tag, { opacity: 0 })
    .set(swatches, { opacity: 0, y: 12 })
    .set(type, { opacity: 0, y: 8 })
    .to(letters, { yPercent: 0, duration: 0.7, stagger: 0.07 }, 0.25)
    .to(tag, { opacity: 1, duration: 0.5 }, 0.9)
    .to(swatches, { opacity: 1, y: 0, duration: 0.5, stagger: 0.09 }, 1.25)
    .to(type, { opacity: 1, y: 0, duration: 0.5 }, 1.85)
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 4.7)
    .set(root, { opacity: 1 }, 5.2);
  return tl;
}

/* 004 — fintech app: balance counts, chart grows, swipe to activity, payment lands */
function buildApp() {
  const root = document.querySelector('[data-vig="app"]');
  if (!root) return null;

  const screens = root.querySelector('[data-ph-screens]');
  const dots = root.querySelectorAll('[data-ph-dot]');
  const balance = root.querySelector('[data-app-balance]');
  const bars = root.querySelectorAll('.scr-chart i');
  const rows = root.querySelectorAll('.act-row');
  const notif = root.querySelector('[data-app-notif]');
  const bal = { v: 0 };

  const setDot = (i) => () => {
    dots.forEach((d, j) => d.classList.toggle('is-on', i === j));
  };

  const tl = baseTimeline();
  tl.set(screens, { xPercent: 0 })
    .set(bars, { scaleY: 0 })
    .set(rows, { opacity: 0, x: 10 })
    .set(notif, { opacity: 0, y: -6 })
    .set(bal, { v: 0 })
    .call(setDot(0), null, 0)
    .call(() => {
      balance.textContent = '$0';
    })
    // balance counts up, chart grows
    .to(
      bal,
      {
        v: 8240,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          balance.textContent = `$${Math.round(bal.v).toLocaleString('en-US')}`;
        },
      },
      0.3
    )
    .to(bars, { scaleY: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.6)' }, 0.55)
    // swipe to activity
    .to(screens, { xPercent: -100, duration: 0.7, ease: 'power3.inOut' }, 2.3)
    .call(setDot(1), null, 2.65)
    .to(rows, { opacity: 1, x: 0, duration: 0.45, stagger: 0.12 }, 2.85)
    // payment notification lands
    .to(notif, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, 3.5)
    .to(root, { opacity: 0, duration: 0.45, ease: 'power2.in' }, 5.6)
    .set(screens, { xPercent: 0 }, 6.06)
    .call(setDot(0), null, 6.07)
    .set(notif, { opacity: 0 }, 6.07)
    .set(root, { opacity: 1 }, 6.1);
  return tl;
}
