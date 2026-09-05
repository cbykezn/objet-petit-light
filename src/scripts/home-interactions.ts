type HomeRow = { title: string; href: string; cover: string; selected: boolean };
const rows: HomeRow[] = JSON.parse(document.body.dataset.homeRows || '[]');
const base = document.body.dataset.homeBase || './';
const sizeBleed = () => document.documentElement.style.setProperty('--scrollbar-width', `${Math.max(0, window.innerWidth - document.documentElement.clientWidth)}px`);
sizeBleed();
window.addEventListener('resize', sizeBleed);
const menuItems = [
  ['Theatre', 'STAGE / LIGHT', 'theater'], ['Dance', 'BODY / RHYTHM', 'dance'],
  ['Architecture & Spatial', 'SPACE / LIGHT', 'architecture-landscape'],
  ['Exhibition & Branding Event', 'CROWD / LIGHT', 'exhib.-event'],
];
document.querySelectorAll<HTMLButtonElement>('button[aria-controls="works-category-menu"]').forEach((button, index) => {
  const root = button.parentElement!;
  const panel = document.createElement('nav');
  panel.id = `home-works-menu-${index}`; panel.className = 'home-works-menu';
  panel.setAttribute('aria-label', 'Works categories'); panel.hidden = true;
  const heading = document.createElement('p'); heading.textContent = 'WORK INDEX /'; panel.append(heading);
  for (const [title, caption, path] of menuItems) {
    const link = document.createElement('a'); link.href = `${base}${path}`;
    const label = document.createElement('span'); label.textContent = title;
    const small = document.createElement('small'); small.textContent = caption;
    link.append(label, small); panel.append(link);
  }
  root.append(panel); button.setAttribute('aria-controls', panel.id);
  const close = () => {
    panel.hidden = true; button.setAttribute('aria-expanded', 'false');
    (button.lastElementChild as HTMLElement).style.transform = 'rotate(0deg)';
  };
  button.addEventListener('click', () => {
    if (!panel.hidden) { document.getElementById('projects')?.scrollIntoView({ behavior:'smooth' }); return; }
    panel.classList.toggle('compact', parseFloat(getComputedStyle(button.firstElementChild!).fontSize) <= 12);
    panel.hidden = false; button.setAttribute('aria-expanded', 'true');
    (button.lastElementChild as HTMLElement).style.transform = 'rotate(45deg)';
  });
  document.addEventListener('pointerdown', (event) => { if (!root.contains(event.target as Node)) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { const hadFocus = panel.contains(document.activeElement); close(); if (hadFocus) button.focus(); } });
});

document.querySelectorAll<HTMLElement>('[data-framer-name="CMS Interactive Work Row"] article').forEach((article) => {
  const label = article.getAttribute('aria-label') || '';
  const project = rows.find((row) => label.endsWith(`: ${row.title}`));
  const heading = article.children[0] as HTMLElement;
  const content = article.children[1] as HTMLElement;
  const visual = content.children[0] as HTMLElement;
  const caption = content.children[1] as HTMLElement;
  const fill = article.style.background;
  let active = false;
  let compact = false;
  const render = () => {
    const closedHeight = compact ? 92 : 72;
    const hasCover = Boolean(project?.cover);
    article.classList.toggle('compact', compact);
    if (project?.selected) article.setAttribute('aria-expanded', String(active));
    content.style.display = active ? 'block' : 'none';
    content.style.padding = hasCover ? (compact ? '0 14px 14px' : '0 24px 24px') : (compact ? '2px 0 6px' : '4px 0 10px');
    article.style.background = active && !hasCover ? 'transparent' : fill;
    article.style.border = active && !hasCover ? 'none' : '1px solid #153F73';
    article.style.boxShadow = active ? '0 18px 40px rgba(21,63,115,.12)' : 'none';
    heading.style.border = active && !hasCover ? '1px solid #153F73' : 'none';
    const borderHeight = active && !hasCover ? 0 : 2;
    article.style.height = active ? (compact ? `${closedHeight + content.getBoundingClientRect().height + borderHeight}px` : '520px') : `${closedHeight}px`;
    if (!hasCover && visual.firstElementChild) (visual.firstElementChild as HTMLElement).style.backgroundSize = compact ? '18px 18px' : '24px 24px';
    caption.style.left = compact ? '28px' : '40px'; caption.style.bottom = compact ? '28px' : '40px';
  };
  if (project?.cover) {
    const img = document.createElement('img'); img.src = project.cover; img.alt = project.title;
    img.loading = 'lazy'; img.decoding = 'async'; img.className = 'home-row-image';
    visual.replaceChildren(img); visual.style.background = '#101820';
    const overlay = document.createElement('div'); overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:absolute;inset:0;pointer-events:none;background:radial-gradient(82% 125% at 100% 48%,rgba(64,159,210,.22),transparent 72%)';
    visual.append(overlay);
  }
  const activate = () => { active = true; render(); };
  const openProject = () => { if (!active) activate(); else if (project?.selected) window.location.assign(project.href); };
  article.addEventListener('mouseenter', activate);
  article.addEventListener('mouseleave', () => { if (!compact) { active = false; render(); } });
  article.addEventListener('focus', activate);
  article.addEventListener('click', (event) => { if (!(event.target as Element).closest('a')) openProject(); });
  article.addEventListener('keydown', (event) => { if (event.target === article && ['Enter', ' '].includes(event.key)) { event.preventDefault(); openProject(); } });
  new ResizeObserver(() => { compact = window.innerWidth < 700 || article.offsetWidth < 700; render(); }).observe(article.parentElement!);
  compact = window.innerWidth < 700 || article.offsetWidth < 700; render();
});
document.querySelectorAll<HTMLFormElement>('form').forEach((form) => {
  const subject = document.createElement('input'); subject.type = 'hidden'; subject.name = '_subject'; subject.value = 'Objet Petit L 網站新訊息'; form.append(subject);
  form.addEventListener('keydown', (event) => { if (event.key === 'Enter' && (event.target as HTMLElement).tagName === 'INPUT') event.preventDefault(); });
});
document.querySelectorAll<HTMLElement>('[data-framer-name="View Works"], [data-framer-name="Option 02 Works"]').forEach((node) => node.setAttribute('data-home-glow', ''));
