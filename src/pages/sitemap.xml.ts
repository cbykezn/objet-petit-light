import type { APIRoute } from 'astro';
import { activeProjects, categories } from '../data/projects';
import { sitePath } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  const staticPaths = ['/', '/works', '/services', '/profile-cv', '/contact', '/services/theater-dance', '/services/space-lighting', '/services/exhibition', '/services/events'];
  const paths = [
    ...staticPaths,
    ...categories.map((category) => `/works/${category.slug}`),
    ...activeProjects.map((project) => `/projects/${project.slug}`),
  ];
  const urls = paths.map((path) => `<url><loc>${new URL(sitePath(path).replace(/^\//, ''), site!).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers:{ 'Content-Type':'application/xml; charset=utf-8' } });
};
