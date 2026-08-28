import type { APIRoute } from 'astro';
import { sitePath } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(sitePath('/sitemap.xml').replace(/^\//, ''), site!).href;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, { headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
};
