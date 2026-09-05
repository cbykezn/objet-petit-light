document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((root) => {
  const thumbs = [...root.querySelectorAll<HTMLButtonElement>('[data-gallery-thumb]')];
  const images = thumbs.map((thumb) => thumb.dataset.fullImage!);
  const main = root.querySelector<HTMLImageElement>('[data-gallery-image]')!;
  const large = root.querySelector<HTMLImageElement>('[data-gallery-full-image]')!;
  const dialog = root.querySelector<HTMLDialogElement>('[data-gallery-dialog]')!;
  const open = root.querySelector<HTMLButtonElement>('[data-gallery-open]')!;
  const status = root.querySelector<HTMLElement>('[data-gallery-status]')!;
  const title = main.alt.replace(/ 劇照 1$/, '');
  let index = 0;
  let previousOverflow = '';
  let previousGutter = '';
  let openingFocus: HTMLElement | null = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = (next: number, revealThumb = true) => {
    if (!images.length) return;
    index = (next + images.length) % images.length;
    main.src = images[index]; main.alt = `${title} 劇照 ${index + 1}`;
    if (dialog.open) { large.src = images[index]; large.alt = main.alt; }
    thumbs.forEach((thumb, i) => { if (i === index) thumb.setAttribute('aria-current', 'true'); else thumb.removeAttribute('aria-current'); });
    status.textContent = `第 ${index + 1} 張，共 ${images.length} 張`;
    if (revealThumb && !dialog.open) {
      const rail = thumbs[index].parentElement!;
      rail.scrollTo({ left: thumbs[index].offsetLeft - (rail.clientWidth - thumbs[index].offsetWidth) / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
    if (!reducedMotion.matches) main.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease' });
    if (dialog.open && images.length > 1) { const nextImage = new Image(); nextImage.decoding = 'async'; nextImage.src = images[(index + 1) % images.length]; }
  };
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => update(i)));
  root.querySelectorAll('[data-gallery-previous]').forEach((button) => button.addEventListener('click', () => update(index - 1)));
  root.querySelectorAll('[data-gallery-next]').forEach((button) => button.addEventListener('click', () => update(index + 1)));
  open.addEventListener('click', () => {
    openingFocus = document.activeElement as HTMLElement;
    previousOverflow = document.documentElement.style.overflow;
    previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = 'auto';
    document.documentElement.style.overflow = 'hidden';
    large.src = images[index]; large.alt = main.alt;
    dialog.style.width = window.innerWidth + 'px';
    dialog.showModal();
  });
  window.addEventListener('resize', () => { if (dialog.open) dialog.style.width = window.innerWidth + 'px'; });
  root.querySelector('[data-gallery-close]')!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    document.documentElement.style.scrollbarGutter = previousGutter;
    openingFocus?.focus({ preventScroll: true });
  });
  root.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); update(index + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  // Touch swipes change the current still; vertical page scrolling and pinch zoom remain available.
  for (const surface of [open, large]) {
    let start: { x: number; y: number } | null = null;
    let swiped = false;
    surface.addEventListener('pointerdown', (event) => { start = event.pointerType === 'touch' ? { x: event.clientX, y: event.clientY } : null; swiped = false; });
    surface.addEventListener('pointerup', (event) => {
      if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped = true; update(index + (dx < 0 ? 1 : -1)); }
      start = null;
    });
    surface.addEventListener('pointercancel', () => { start = null; swiped = false; });
    surface.addEventListener('click', (event) => { if (swiped) { event.preventDefault(); event.stopImmediatePropagation(); swiped = false; } }, true);
  }
});
