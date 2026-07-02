import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed to Netlify at the site root, custom domain angolorosso.com
// (client-owned). `site` drives absolute URLs (sitemap/canonical).
// Root by default; for a GitHub Pages PROJECT-site preview served from
// /<repo>/, build with: PAGES_BASE=/angolo/ npm run build
export default defineConfig({
  site: 'https://angolorosso.com',
  base: process.env.PAGES_BASE || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    // Excludes the JSON search index; keeps only real pages in the sitemap.
    sitemap({ filter: (page) => !page.includes('/search-index') }),
  ],
});
