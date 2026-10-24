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
  introDelay,
  stickyRun,
  onReady,
} from './core.js';
import { initMagnetic, initNav } from './interactions.js';

/* ---------- hero: WORK rises out of the intro, the reel plays inside the letters ---------- */
function initIntro() {
  const hero = document.querySelector('[data-intro]');
  if (!hero) return;
  const letters = gsap.utils.toArray('[data-intro-title] .hl');
  const reveals = gsap.utils.toArray('[data-intro] [data-reveal]');
  gsap
    .timeline({ defaults: { ease: 'expo.out' }, delay: introDelay() + 0.05 })
    .fromTo(letters, { yPercent: 104 }, { yPercent: 0, duration: 1.5, stagger: 0.07 })
    .to(reveals, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06 }, '-=1.1');
}

function initReel() {
  const video = document.querySelector('[data-wh-reel]');
  if (!video || reducedMotion || navigator.connection?.saveData) return;
  new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), {
    threshold: 0.02,
  }).observe(video);
}

/* the trade word rolls through every industry, in that site's accent */
function initRoll() {
  const words = gsap.utils.toArray('[data-roll-word]');
  if (words.length < 2) return;
  let i = 0;
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(words[0].parentElement);

  const step = () => {
    if (visible && !document.hidden) {
      const cur = words[i];
      i = (i + 1) % words.length;
      gsap.to(cur, { translate: '0 -110%', duration: 0.75, ease: 'expo.inOut' });
      gsap.fromTo(words[i], { translate: '0 110%' }, { translate: '0 0%', duration: 0.75, ease: 'expo.inOut' });
    }
    gsap.delayedCall(1.7, step);
  };
  gsap.delayedCall(introDelay() + 2.2, step);
}

/* ---------- trade theatre: scroll walks the list, the screen follows ---------- */
function initTheatre(lenis) {
  const root = document.querySelector('[data-theatre]');
  if (!root) return;
  const items = [...root.querySelectorAll('[data-th-item]')];
  const shots = [...root.querySelectorAll('[data-th-shot]')];
  const infos = [...root.querySelectorAll('[data-th-info]')];
  const urls = [...root.querySelectorAll('[data-th-url]')];
  const films = shots.map((s) => s.querySelector('video'));
  const stage = root.querySelector('.th-stage');
  const bar = root.querySelector('[data-th-progress]');
  const n = items.length;
  const still = reducedMotion || navigator.connection?.saveData;
  let active = 0;
  let onScreen = false;
  let raf = 0;

  const tick = () => {
    const v = films[active];
    if (v && v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`;
    raf = onScreen ? requestAnimationFrame(tick) : 0;
  };

  const syncFilms = () => {
    films.forEach((v, k) => {
      if (k === active && onScreen && !still) {
        v.play()
          .then(() => v.classList.add('is-playing'))
          .catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
    if (onScreen && !raf && !still) raf = requestAnimationFrame(tick);
  };

  const setActive = (i) => {
    if (i === active) return;
    active = i;
    items.forEach((el, k) => el.classList.toggle('is-active', k === i));
    shots.forEach((el, k) => {
      el.classList.toggle('is-active', k === i);
      el.classList.toggle('is-before', k < i);
    });
    infos.forEach((el, k) => {
      el.classList.toggle('is-active', k === i);
      el.inert = k !== i;
    });
    urls.forEach((el, k) => el.classList.toggle('is-active', k === i));
    stage.style.setProperty('--glow', items[i].style.getPropertyValue('--accent'));
    bar.style.transform = 'scaleX(0)';
    syncFilms();
  };
  stage.style.setProperty('--glow', items[0].style.getPropertyValue('--accent'));

  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
  });

  new IntersectionObserver(
    ([e]) => {
      onScreen = e.isIntersecting;
      syncFilms();
    },
    { threshold: 0.3 }
  ).observe(root.querySelector('[data-th-screen]'));

  // a name jumps to its slot on the runway
  items.forEach((el, i) => {
    el.addEventListener('click', () => {
      const top = root.getBoundingClientRect().top + window.scrollY;
      const y = top + ((i + 0.5) / n) * (root.offsetHeight - window.innerHeight);
      if (lenis) lenis.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });
}

/* ---------- index: filter by industry, mirrored in ?industry= ---------- */
function initIndex(lenis) {
  const grid = document.querySelector('[data-wi-grid]');
  if (!grid) return;
  const chips = [...document.querySelectorAll('[data-wi-filter]')];
  const cards = [...grid.querySelectorAll('[data-wi-card]')];
  const status = document.querySelector('[data-wi-status]');
  const keys = new Set(chips.map((c) => c.dataset.wiFilter));
  const label = (key) => chips.find((c) => c.dataset.wiFilter === key)?.firstChild.textContent.trim();

  const apply = (key) => {
    let shown = 0;
    cards.forEach((c) => {
      const on = key === 'all' || c.dataset.industry === key;
      c.hidden = !on;
      if (on) shown++;
    });
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.wiFilter === key)));
    status.textContent =
      key === 'all' ? 'Showing every project' : `${shown} ${shown === 1 ? 'project' : 'projects'} in ${label(key)}`;
  };

  const choose = (key) => {
    if (!keys.has(key)) key = 'all';
    const url = new URL(window.location.href);
    if (key === 'all') url.searchParams.delete('industry');
    else url.searchParams.set('industry', key);
    history.replaceState(history.state, '', url);

    if (document.startViewTransition && !reducedMotion) {
      const root = document.documentElement;
      root.classList.add('wi-filtering');
      const t = document.startViewTransition(() => apply(key));
      t.finished.finally(() => {
        root.classList.remove('wi-filtering');
        ScrollTrigger.refresh();
      });
    } else {
      apply(key);
      ScrollTrigger.refresh();
    }
  };

  chips.forEach((c) => c.addEventListener('click', () => choose(c.dataset.wiFilter)));

  // hero shortcuts filter in place and glide down to the grid
  document.querySelectorAll('[data-filter-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      choose(a.dataset.filterLink);
      const target = document.getElementById('index');
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.4 });
      else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  // deep links from the home page: /work/?industry=hair#index
  const initial = new URLSearchParams(window.location.search).get('industry');
  if (initial && keys.has(initial)) apply(initial);

  // films load only when a card is hovered
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion) return;
  grid.querySelectorAll('[data-film-src]').forEach((slot) => {
    const link = slot.closest('a');
    let video = null;
    link.addEventListener('pointerenter', () => {
      if (!video) {
        const id = slot.dataset.filmSrc;
        video = document.createElement('video');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('aria-hidden', 'true');
        video.innerHTML = `<source src="/media/work/film-${id}.webm" type="video/webm"><source src="/media/work/film-${id}.mp4" type="video/mp4">`;
        slot.replaceWith(video);
      }
      video
        .play()
        .then(() => video.classList.add('is-playing'))
        .catch(() => {});
    });
    link.addEventListener('pointerleave', () => video?.pause());
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
    const glare = stage.querySelector('[data-glare]');
    new IntersectionObserver(([e]) => stage.classList.toggle('is-near', e.isIntersecting), { rootMargin: '10% 0px' }).observe(stage);
    // one transform string per frame: no inherited custom properties, so the rig's subtree never restyles
    const s = { sx: 16, ss: 0.92, rx: 0, ry: 0 };
    const write = () => {
      rig.style.transform = `rotateX(${s.rx + s.sx}deg) rotateY(${s.ry}deg) scale(${s.ss})`;
    };

    // arrives tipped back and settles flat as the card comes up
    gsap.to(s, {
      sx: 0,
      ss: 1,
      ease: 'none',
      onUpdate: write,
      scrollTrigger: { trigger: stage.closest('[data-case]'), start: 'top 95%', end: 'top 35%', scrub: true },
    });

    if (!fine) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      raf = 0;
      s.ry = nx * 10;
      s.rx = ny * -8;
      write();
      if (glare) glare.style.transform = `translate3d(${(nx - 0.2) * 50}%, ${(ny - 0.3) * 50}%, 0)`;
    };
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      nx = (e.clientX - r.left) / r.width - 0.5;
      ny = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    stage.addEventListener('pointerleave', () => {
      nx = 0;
      ny = 0;
      if (!raf) raf = requestAnimationFrame(apply);
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
      const dim = card.querySelector('.case-dim');
      const next = cases[i + 1];
      return ScrollTrigger.create({
        trigger: next,
        start: 'top bottom',
        // done once the next card reaches its own sticky top
        end: () => `top ${parseFloat(getComputedStyle(next).top)}px`,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(card, { scale: 1 - p * 0.06 });
          gsap.set(dim, { opacity: p * 0.7 });
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
        gsap.set(c.querySelector('.case-dim'), { clearProps: 'opacity' });
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
        scrollTrigger: { trigger: phone.closest('[data-case], [data-flight], [data-pour]'), start: 'top bottom', end: 'top top', scrub: true },
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
  stickyRun(document.querySelector('[data-hscroll-pin]'), document.querySelector('[data-hscroll-track]'));
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
    trigger: '[data-chapter="trades"]',
    start: 'top 60%',
    endTrigger: '[data-chapter="identity"]',
    end: 'bottom 40%',
    onToggle: (self) => rail.classList.toggle('is-on', self.isActive),
  });
}

/* ---------- boot ---------- */
function boot() {
  initNav();

  if (reducedMotion) {
    showAllReveals();
    initTheatre(null);
    initIndex(null);
    initRail();
    return;
  }

  const lenis = initLenis();
  initMagnetic();
  initIntro();
  initReel();
  initRoll();
  initReveals();
  initSplitHeadings();
  initTheatre(lenis);
  initIndex(lenis);
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
