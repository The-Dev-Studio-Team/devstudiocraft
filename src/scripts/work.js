import {
  gsap,
  ScrollTrigger,
  reducedMotion,
  initLenis,
  initReveals,
  initSplitHeadings,
  initWordmark,
  showAllReveals,
  refreshOnFonts,
  onReady,
} from './core.js';
import { initCursor, initMagnetic, initNav } from './interactions.js';

/* ---------- hero intro: title lines rise, then the rest ---------- */
function initIntro() {
  const lines = gsap.utils.toArray('[data-intro-title] .hl');
  const reveals = gsap.utils.toArray('[data-intro] [data-reveal]');
  gsap
    .timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
    .fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.09 })
    .to(reveals, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, '-=0.8');
}

/* ---------- hero wall: pause the drift once it's off screen ---------- */
function initHeroWall() {
  const hero = document.querySelector('[data-work-hero]');
  if (!hero) return;
  new IntersectionObserver(([e]) => hero.classList.toggle('is-paused', !e.isIntersecting)).observe(hero);

  // a slow push-in as the hero leaves
  if (reducedMotion) return;
  gsap.to(hero.querySelector('.wall-plane'), {
    scale: 1.12,
    yPercent: 6,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ---------- films: play only while visible and on top ---------- */
function initFilms() {
  if (reducedMotion || navigator.connection?.saveData) return;

  const films = document.querySelectorAll('video[data-film]');
  const visible = new Set();
  const playing = new Set();

  // the acid bar under each browser tracks its film
  const tick = () => {
    playing.forEach((v) => {
      const bar = v.parentElement.querySelector('[data-progress]');
      if (bar && v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
    });
    if (playing.size) requestAnimationFrame(tick);
  };

  const sync = (video) => {
    const buried = video.closest('.is-behind');
    if (visible.has(video) && !buried) {
      video
        .play()
        .then(() => {
          video.classList.add('is-playing');
          if (!playing.size) requestAnimationFrame(tick);
          playing.add(video);
        })
        .catch(() => {});
    } else {
      playing.delete(video);
      if (!video.paused) video.pause();
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
        sync(e.target);
      });
    },
    { threshold: 0.25 }
  );
  films.forEach((v) => io.observe(v));

  // the deck re-syncs when a card is buried or uncovered
  window.addEventListener('work:deck', () => films.forEach(sync));
}

/* ---------- case rigs: tilt in on scroll, follow the pointer, catch the light ---------- */
function initRigs() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  gsap.utils.toArray('[data-stage]').forEach((stage) => {
    const rig = stage.querySelector('[data-rig]');

    // arrives tipped back and settles flat as the card comes up
    gsap.fromTo(
      rig,
      { '--sx': '16deg', '--ss': 0.92 },
      {
        '--sx': '0deg',
        '--ss': 1,
        ease: 'none',
        scrollTrigger: { trigger: stage.closest('[data-case]'), start: 'top 95%', end: 'top 35%', scrub: true },
      }
    );

    if (!fine) return;
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rig.style.setProperty('--ry', `${nx * 10}deg`);
      rig.style.setProperty('--rx', `${ny * -8}deg`);
      rig.style.setProperty('--gx', `${(nx + 0.5) * 100}%`);
      rig.style.setProperty('--gy', `${(ny + 0.5) * 100}%`);
    });
    stage.addEventListener('pointerleave', () => {
      rig.style.setProperty('--ry', '0deg');
      rig.style.setProperty('--rx', '0deg');
    });
  });
}

/* ---------- coffee deck: each card slides over and buries the last ---------- */
function initDeck() {
  const cases = gsap.utils.toArray('[data-case]');
  if (cases.length < 2) return;

  // measure cards where they sit in the flow, not where they happen to be stuck
  const unstick = () => cases.forEach((c) => (c.style.position = 'relative'));
  const restick = () => cases.forEach((c) => (c.style.position = ''));
  ScrollTrigger.addEventListener('refreshInit', unstick);
  ScrollTrigger.addEventListener('refresh', restick);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
    const triggers = cases.slice(0, -1).map((c, i) => {
      const card = c.querySelector('[data-case-card]');
      const next = cases[i + 1];
      return ScrollTrigger.create({
        trigger: next,
        start: 'top bottom',
        // done once the next card reaches its own sticky top
        end: () => `top ${parseFloat(getComputedStyle(next).top)}px`,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(card, { scale: 1 - p * 0.06, '--dim': p * 0.7 });
          const behind = p > 0.55;
          if (c.classList.contains('is-behind') !== behind) {
            c.classList.toggle('is-behind', behind);
            window.dispatchEvent(new Event('work:deck'));
          }
        },
      });
    });
    return () => {
      triggers.forEach((t) => t.kill());
      cases.forEach((c) => {
        c.classList.remove('is-behind');
        gsap.set(c.querySelector('[data-case-card]'), { clearProps: 'all' });
      });
    };
  });
}

/* ---------- depth: phones drift against the page ---------- */
function initParallax() {
  gsap.utils.toArray('[data-phone]').forEach((phone) => {
    gsap.fromTo(
      phone,
      { yPercent: 12 },
      {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: phone.closest('[data-case], [data-flight]'), start: 'top bottom', end: 'top top', scrub: true },
      }
    );
  });

  // aviation phones fan open as the panel arrives
  gsap.utils.toArray('[data-phones]').forEach((group) => {
    const phones = group.querySelectorAll('[data-phone-fan]');
    gsap.from(phones, {
      x: (i, el) => -Number(el.dataset.phoneFan) * 60,
      yPercent: 18,
      rotate: (i, el) => -Number(el.dataset.phoneFan) * 9,
      ease: 'none',
      scrollTrigger: { trigger: group.closest('[data-flight]'), start: 'top 85%', end: 'center 55%', scrub: true },
    });
  });

  // the sky behind each flight panel moves slower than the panel
  gsap.utils.toArray('[data-flight-sky]').forEach((sky) => {
    gsap.fromTo(
      sky,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: sky.closest('[data-flight]'), start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

/* ---------- brand boards: pinned horizontal wall (desktop) ---------- */
function initBoards() {
  const pin = document.querySelector('[data-hscroll-pin]');
  const track = document.querySelector('[data-hscroll-track]');
  if (!pin || !track) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    return () => tween.scrollTrigger?.kill();
  });
}

/* ---------- chapter rail: shows the chapter in view ---------- */
function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const links = rail.querySelectorAll('[data-rail-link]');

  gsap.utils.toArray('[data-chapter]').forEach((chapter) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        links.forEach((l) => l.classList.toggle('is-active', l.dataset.railLink === chapter.dataset.chapter));
      },
    });
  });

  ScrollTrigger.create({
    trigger: '[data-chapter="coffee"]',
    start: 'top 60%',
    endTrigger: '[data-chapter="identity"]',
    end: 'bottom 40%',
    onToggle: (self) => rail.classList.toggle('is-on', self.isActive),
  });
}

/* ---------- boot ---------- */
function boot() {
  initNav();
  initHeroWall();

  if (reducedMotion) {
    showAllReveals();
    initRail();
    return;
  }

  initLenis();
  initCursor();
  initMagnetic();
  initIntro();
  initReveals();
  initSplitHeadings();
  initFilms();
  initDeck();
  initRigs();
  initParallax();
  initBoards();
  initRail();
  initWordmark();

  refreshOnFonts();
}

onReady(boot);
