import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const html = readFileSync('dist/index.html', 'utf8');
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
assert(canonical, 'Homepage canonical is required');
const site = new URL(canonical);
let checked = 0;
const services = JSON.parse(readFileSync('src/data/framer-services.json', 'utf8'));
const pages = [{ path: '', html }, ...services.map(({ slug }) => ({ path: `services/${slug}/`, html: readFileSync(`dist/services/${slug}/index.html`, 'utf8') }))];
for (const page of pages) {
assert(!/(?:src|href)="[^\"]*(?:framerusercontent.com\/sites|events.framer.com)/.test(page.html), `Unexpected Framer runtime: ${page.path}`);
for (const match of page.html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const raw = match[1].replaceAll('&amp;', '&');
  if (/^(?:mailto:|tel:|data:|#)/.test(raw)) continue;
  assert(!raw.startsWith('https://objetpetitlight.framer.website/'), 'Internal link points to Framer');
  const target = new URL(raw, new URL(page.path, site));
  if (target.origin !== site.origin) continue;
  assert(target.pathname.startsWith(site.pathname), `Missing Pages base: ${raw}`);
  const relative = decodeURIComponent(target.pathname.slice(site.pathname.length));
  assert(existsSync(join('dist', relative, 'index.html')) || existsSync(join('dist', relative)), `Missing local destination: ${raw}`);
  if (target.pathname === site.pathname && target.hash) assert(html.includes(`id="${target.hash.slice(1)}"`), `Missing anchor: ${raw}`);
  checked++;
}
}
assert(!/(?:src|href)="[^\"]*(?:framerusercontent.com\/sites|events.framer.com)/.test(html), 'Unexpected Framer runtime');
assert(html.includes('name="google-site-verification"'), 'Search Console metadata must be retained');
assert(html.includes('method="POST"'), 'Contact form needs a submission method');
console.log(`Verified ${checked} built homepage/service links/assets at ${site.href}`);
