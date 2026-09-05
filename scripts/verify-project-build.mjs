import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const source = readFileSync('src/data/projects.ts', 'utf8');
const projects = JSON.parse(source.match(/export const projects: Project\[\] = (\[[\s\S]*?\]);\s*export const activeProjects/)[1]).filter(p => p.enabled);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
let photographs = 0;
for (const p of projects) {
  const html = readFileSync(join('dist/projects', p.slug, 'index.html'), 'utf8');
  assert(!/__PROJECT_TITLE__|__COMPANY__|__VENUE__|__ARCHIVE_HREF__|__GALLERY_SLOT__|__CREDITS_SLOT__/.test(html), `${p.slug}: unresolved template token`);
  assert(html.includes(escape(p.title)), `${p.slug}: missing CMS title`);
  assert((html.match(/<dialog\b/g) ?? []).length === 1, `${p.slug}: requires one fullscreen viewer`);
  assert(html.includes('data-gallery-close'), `${p.slug}: viewer needs close control`);
  const images = p.gallery.length ? p.gallery : [p.cover];
  const expected = new Set(images.filter(Boolean)).size;
  const actual = (html.match(/data-gallery-thumb(?:\s|=)/g) ?? []).length;
  assert.equal(actual, expected, `${p.slug}: gallery order/count must follow CMS`);
  photographs += actual;
  if (actual > 1) assert(html.includes('data-gallery-next') && html.includes('data-gallery-previous'), `${p.slug}: missing slide navigation`);
  const canonical = new URL(html.match(/<link rel="canonical" href="([^"]+)"/)[1]);
  const base = canonical.pathname.split('/projects/')[0] + '/';
  for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(#|data:|mailto:|tel:)/.test(raw)) continue;
    assert(!/(?:framerusercontent.com\/sites|objetpetitlight.framer.website)/.test(raw), `${p.slug}: unexpected Framer runtime/link`);
    const url = new URL(raw.replaceAll('&amp;', '&'), canonical);
    if (url.origin !== canonical.origin) continue;
    assert(url.pathname.startsWith(base), `${p.slug}: missing repository base ${raw}`);
    const relative = decodeURIComponent(url.pathname.slice(base.length));
    assert(existsSync(join('dist', relative, 'index.html')) || existsSync(join('dist', relative)), `${p.slug}: broken local link ${raw}`);
  }
}
console.log(`Verified ${projects.length} project pages and ${photographs} gallery images, fullscreen controls and Pages paths.`);
