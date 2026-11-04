import { defineConfig } from 'astro/config';

// The editor is only there with `pnpm editor`, so it's never in a build.
const editing = Boolean(process.env.SITE_EDITOR);

// GitHub Pages serves an organization site from the root and a project site
// from /<repo>/. The deploy workflow passes the right base path in BASE_PATH,
// and every internal link goes through href() in src/lib/paths.ts.
export default defineConfig({
  site: process.env.SITE_URL || 'https://enterprise-blueprints.github.io',
  base: process.env.BASE_PATH || '/',
  // CI builds a second copy under a test base path into another folder.
  outDir: process.env.OUT_DIR || 'dist',
  integrations: editing ? [(await import('./editor/server.ts')).default()] : [],
  devToolbar: { enabled: !editing },
  // Fail when the port is taken instead of quietly moving to the next one,
  // so a second dev or preview server can't pile up unnoticed.
  vite: {
    server: { strictPort: true },
    preview: { strictPort: true },
  },
});
