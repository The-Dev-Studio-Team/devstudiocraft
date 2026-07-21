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
