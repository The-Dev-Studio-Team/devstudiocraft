import gsap from 'gsap';

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

/** Hover list (services, work index): floating image preview that follows the cursor. */
export function initServicePreview({
  list: listSel = '[data-services-list]',
  preview: previewSel = '[data-service-preview]',
  row: rowSel = '[data-service]',
} = {}) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (!window.matchMedia('(min-width: 901px)').matches) return;

  const list = document.querySelector(listSel);
  const preview = document.querySelector(previewSel);
  if (!list || !preview) return;

  const imgs = preview.querySelectorAll('[data-preview-img]');
  const rows = list.querySelectorAll(rowSel);
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
