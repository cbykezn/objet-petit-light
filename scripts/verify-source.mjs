import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const roots = ['src'];
const files = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes:true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (['.astro', '.ts', '.tsx'].includes(extname(path))) files.push(path);
  }
};
roots.forEach(walk);

const failures = [];
const home = readFileSync('src/data/framer-home.html', 'utf8');
if (/<script\b|data-framer-hydrate-v2|\son[a-z]+=/i.test(home)) failures.push('Homepage snapshot must not include Framer hydration or executable scripts');
if (/>\s*\n\s*</.test(home)) failures.push('Homepage snapshot: added whitespace between tags changes Framer pre-wrap typography');
for (const id of ['top', 'about', 'projects', 'services', 'selected', 'contact']) {
  if (!home.includes(`id="${id}"`)) failures.push(`Homepage snapshot: missing ${id} anchor`);
}
if ((home.match(/data-framer-name="CMS Interactive Work Row"/g) ?? []).length !== 5) failures.push('Homepage snapshot: expected five Selected/Upcoming rows');
const homeCss = readFileSync('src/styles/framer-home.css', 'utf8');
for (const edge of ['666.98px', '667px', '810px', '1000px', '1200px']) {
  if (!homeCss.includes(edge)) failures.push(`Homepage CSS: missing original ${edge} breakpoint`);
}
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  if (/href=["']\/(?!\/)/.test(source)) failures.push(`${file}: root-relative href bypasses GitHub Pages base path`);
  if (/src=["']\/(?!\/)/.test(source)) failures.push(`${file}: root-relative src bypasses GitHub Pages base path`);
}

const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
if (workflow.includes('\\${{')) failures.push('.github/workflows/deploy.yml: escaped GitHub expression');

const projectData = readFileSync('src/data/projects.ts', 'utf8');
const records = (projectData.match(/"enabled":/g) ?? []).length;
if (records !== 44) failures.push(`src/data/projects.ts: expected 44 CMS records, found ${records}`);
const jsonMatch = projectData.match(/export const projects: Project\[\] = (\[[\s\S]*?\]);\s*export const activeProjects/);
if (!jsonMatch) failures.push('src/data/projects.ts: cannot parse CMS data');
else {
  const projects = JSON.parse(jsonMatch[1]);
  const active = projects.filter((project) => project.enabled);
  const slugs = active.map((project) => project.slug);
  if (new Set(slugs).size !== slugs.length) failures.push('src/data/projects.ts: active project slugs must be unique');
  if (active.some((project) => !project.title || !project.slug || !project.seoTitle || !project.seoDescription)) failures.push('src/data/projects.ts: active projects require title, slug and SEO fields');
  if (active.filter((project) => project.showOnLanding).length !== 4) failures.push('src/data/projects.ts: landing must contain exactly four active projects');
  if (!active.some((project) => project.selectedUpcoming === 'Selected')) failures.push('src/data/projects.ts: at least one Selected project is required');
  if (!active.some((project) => project.selectedUpcoming === 'Upcoming')) failures.push('src/data/projects.ts: at least one Upcoming project is required');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Verified ${files.length} source files, ${records} CMS records and the Framer homepage snapshot.`);
