import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* Shared animation engine: every page boots from here. */

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- smooth scroll ---------- */
export function initLenis() {
  // touch scrolling is already native-smooth; Lenis only costs frames on phones
  if (window.matchMedia('(pointer: coarse)').matches) return null;
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

/* ---------- one-shot reveals ----------
   IntersectionObserver instead of a ScrollTrigger each: a reveal costs nothing per scroll frame.
   The bottom margin matches the old 'top 88%' / 'top 85%' starts. */
function onceVisible(els, play, bottom = '-12%') {
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        play(e.target);
      }),
    { rootMargin: `0px 0px ${bottom} 0px` }
  );
  els.forEach((el) => io.observe(el));
}

export function initReveals() {
  const els = gsap.utils.toArray('[data-reveal]').filter((el) => !el.closest('[data-intro]')); // the intro owns those
  onceVisible(els, (el) => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }));
}

/* ---------- split-line heading reveals ---------- */
export function initSplitHeadings() {
  const els = gsap.utils.toArray('[data-split-lines]');
  els.forEach((el) => {
    el._split = new SplitText(el, { type: 'lines', linesClass: 'line' });
    el.classList.add('split-mask');
    gsap.set(el._split.lines, { yPercent: 110 });
  });
  onceVisible(
    els,
    (el) => gsap.to(el._split.lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }),
    '-15%'
  );
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

/* ---------- horizontal run: a sticky panel inside a runway as tall as the travel ----------
   Same motion as a GSAP pin, without the switch to position: fixed that scores as layout shift. */
export function stickyRun(pin, track, media = '(min-width: 901px)') {
  if (!pin || !track) return;
  const mm = gsap.matchMedia();
  mm.add(media, () => {
    const runway = document.createElement('div');
    pin.before(runway);
    runway.append(pin);
    pin.style.position = 'sticky';
    pin.style.top = '0';
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const size = () => (runway.style.height = `${window.innerHeight + distance()}px`);
    size();
    ScrollTrigger.addEventListener('refreshInit', size);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: runway, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
    });
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', size);
      tween.scrollTrigger?.kill();
      gsap.set(track, { clearProps: 'x' });
      runway.before(pin);
      runway.remove();
      pin.style.position = '';
      pin.style.top = '';
    };
  });
}

/* seconds until the session intro (Preloader.astro) opens onto the page; 0 when it isn't playing */
export function introDelay() {
  if (!document.documentElement.classList.contains('pl-play')) return 0;
  const curtain = document.querySelector('.pl-curtain');
  const anim = curtain?.getAnimations?.()[0];
  if (!anim || anim.startTime == null) return 1.15;
  // the curtain starts opening at 1060 ms; the page rises just behind it
  const opens = anim.startTime + 1060 + 90;
  return Math.max(0, (opens - document.timeline.currentTime) / 1000);
}

export function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

export { gsap, ScrollTrigger, SplitText };
