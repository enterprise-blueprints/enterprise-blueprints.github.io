import { defineConfig } from 'astro/config';

// GitHub Pages serves an organization site from the root and a project site
// from /<repo>/. The deploy workflow passes the right base path in BASE_PATH,
// and every internal link goes through href() in src/lib/paths.ts.
export default defineConfig({
  site: process.env.SITE_URL || 'https://enterprise-blueprints.github.io',
  base: process.env.BASE_PATH || '/',
});
