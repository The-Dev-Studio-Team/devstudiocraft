import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import {
  initCursor,
  initMagnetic,
  initNav,
  initServicePreview,
  initHeroVideo,
  initHeroParallax,
  initAmbientVideos,
} from './interactions.js';
import { initVignettes } from './vignettes.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- smooth scroll ---------- */
function initLenis() {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
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
}

/* ---------- preloader + hero intro ---------- */
function initIntro() {
  const preloader = document.getElementById('preloader');
  const count = document.getElementById('preloader-count');
  const heroLines = gsap.utils.toArray('[data-hero-title] .hl');
  const heroReveals = gsap.utils.toArray('.hero [data-reveal]');

  const showHero = (withMotion) => {
    if (!withMotion) {
      gsap.set(heroLines, { yPercent: 0 });
      gsap.set(heroReveals, { opacity: 1, y: 0 });
      return;
    }
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(
        heroLines,
        { yPercent: 115 },
        { yPercent: 0, duration: 1.3, stagger: 0.09 }
      )
      .to(heroReveals, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, '-=0.7');
  };

  if (!preloader || !count || reducedMotion) {
    if (preloader) preloader.remove();
    showHero(false);
    return;
  }

  gsap.set(heroLines, { yPercent: 115 });

  const counter = { v: 0 };
  gsap
    .timeline()
    .to(counter, {
      v: 100,
      duration: 1.6,
      ease: 'power3.inOut',
      onUpdate: () => {
        count.textContent = String(Math.round(counter.v));
      },
    })
    .to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'expo.inOut',
      onComplete: () => preloader.remove(),
    })
    .add(() => showHero(true), '-=0.45');
}

/* ---------- generic scroll reveals ---------- */
function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    if (el.closest('.hero')) return; // hero handled by intro timeline
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
function initSplitHeadings() {
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

/* ---------- manifesto word scrub ---------- */
function initManifesto() {
  const el = document.querySelector('[data-manifesto]');
  if (!el) return;

  const split = new SplitText(el, { type: 'words', wordsClass: 'w' });
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
  const pin = document.querySelector('[data-showcase-pin]');
  const track = document.querySelector('[data-showcase-track]');
  if (!pin || !track) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const getDistance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${getDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    return () => tween.scrollTrigger?.kill();
  });
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

/* ---------- footer wordmark slide-up ---------- */
function initWordmark() {
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

/* ---------- boot ---------- */
function boot() {
  initNav();

  if (reducedMotion) {
    initIntro(); // clears preloader + shows hero without motion
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  initLenis();
  initCursor();
  initMagnetic();
  initIntro();
  initHeroVideo();
  initHeroParallax();
  initAmbientVideos();
  initServicePreview();
  initReveals();
  initSplitHeadings();
  initManifesto();
  initShowcase();
  initSpeedRace();
  initVignettes();
  initWordmark();

  // fonts shift line metrics — recalc pin distances once loaded
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
