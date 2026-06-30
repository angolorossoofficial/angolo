import { defineConfig } from 'astro/config';

// Deployed to Netlify at the site root, custom domain angolorosso.com
// (client-owned). `site` drives absolute URLs (sitemap/canonical).
// Root by default; for a GitHub Pages PROJECT-site preview served from
// /<repo>/, build with: PAGES_BASE=/angolo/ npm run build
export default defineConfig({
  site: 'https://angolorosso.com',
  base: process.env.PAGES_BASE || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
