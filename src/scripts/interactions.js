import gsap from 'gsap';

/** Custom cursor: dot follows instantly, ring lerps behind. */
export function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');
  if (!cursor || !dot || !ring || !label) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

  window.addEventListener('pointermove', (e) => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
  });

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      label.textContent = el.getAttribute('data-cursor') || '';
      cursor.classList.add('is-hover');
    });
    el.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-hover');
    });
  });
}

/** Magnetic pull on buttons: element drifts toward pointer, snaps back on leave. */
export function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const STRENGTH = 0.35;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      xTo(relX * STRENGTH);
      yTo(relY * STRENGTH);
    });

    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/** Services list: floating image preview that follows the cursor. */
export function initServicePreview() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (!window.matchMedia('(min-width: 901px)').matches) return;

  const list = document.querySelector('[data-services-list]');
  const preview = document.querySelector('[data-service-preview]');
  if (!list || !preview) return;

  const imgs = preview.querySelectorAll('[data-preview-img]');
  const rows = list.querySelectorAll('[data-service]');
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3.out' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3.out' });

  gsap.set(preview, { scale: 0.85, rotate: -4 });

  list.addEventListener('pointermove', (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  rows.forEach((row, i) => {
    row.addEventListener('pointerenter', (e) => {
      imgs.forEach((img, j) => img.classList.toggle('is-active', j === i));
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(preview, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  });

  list.addEventListener('pointerleave', () => {
    gsap.to(preview, {
      opacity: 0,
      scale: 0.85,
      rotate: -4,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  });
}

/** Hero background video: desktop + motion-ok only, pause off-screen. */
export function initHeroVideo() {
  const hero = document.querySelector('[data-hero]');
  const video = document.querySelector('[data-hero-video]');
  if (!hero || !video) return;
  if (!window.matchMedia('(min-width: 761px)').matches) return;

  video.addEventListener('playing', () => hero.classList.add('has-video'), { once: true });

  const tryPlay = () => video.play().catch(() => {});
  tryPlay();

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) tryPlay();
      else video.pause();
    },
    { threshold: 0.05 }
  );
  observer.observe(hero);
}

/** Hero media: slow pointer parallax for depth (desktop only). */
export function initHeroParallax() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const hero = document.querySelector('[data-hero]');
  const media = document.querySelector('[data-hero-media]');
  if (!hero || !media) return;

  const xTo = gsap.quickTo(media, 'x', { duration: 1.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(media, 'y', { duration: 1.4, ease: 'power3.out' });
  gsap.set(media, { scale: 1.06 });

  hero.addEventListener('pointermove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    xTo(nx * -18);
    yTo(ny * -12);
  });
}

/** Ambient section videos: lazy play/pause on visibility (desktop only). */
export function initAmbientVideos() {
  if (!window.matchMedia('(min-width: 761px)').matches) return;

  document.querySelectorAll('video[data-ambient-video]').forEach((video) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(video);
  });
}

/** Nav background on scroll. */
export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
