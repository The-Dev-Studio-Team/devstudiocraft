import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Shared animation engine: every page boots from here. */

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- smooth scroll ---------- */
export function initLenis() {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  // modals pause smooth scroll so wheel stays inside them
  window.addEventListener('lenis:stop', () => lenis.stop());
  window.addEventListener('lenis:start', () => lenis.start());
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // anchor links route through lenis for smooth in-page jumps
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id && id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
    });
  });
  return lenis;
}

/* ---------- generic scroll reveals ---------- */
export function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    if (el.closest('[data-intro]')) return; // the page intro timeline owns these
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
}

/* ---------- split-line heading reveals ---------- */
export function initSplitHeadings() {
  gsap.utils.toArray('[data-split-lines]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'line' });
    el.classList.add('split-mask');
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}

/* ---------- footer wordmark slide-up ---------- */
export function initWordmark() {
  const el = document.querySelector('[data-wordmark]');
  if (!el) return;

  gsap.from(el, {
    yPercent: 42,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.8,
    },
  });
}

/* ---------- reduced motion: show everything at rest ---------- */
export function showAllReveals() {
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/* fonts shift line metrics — recalc pin distances once loaded */
export function refreshOnFonts() {
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

export { gsap, ScrollTrigger, SplitText };
