// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  site: process.env.SITE_URL || 'https://example.github.io',
  base: process.env.GITHUB_ACTIONS && repository ? `/${repository}` : '',
});
