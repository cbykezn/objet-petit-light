// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
const [owner, repository] = process.env.GITHUB_REPOSITORY?.split('/') ?? [];
const customSite = process.env.SITE_URL;
const githubSite = owner ? `https://${owner}.github.io` : 'http://localhost:4321';

export default defineConfig({
  site: customSite || githubSite,
  base: process.env.GITHUB_ACTIONS && repository && !customSite ? `/${repository}` : '',
});
