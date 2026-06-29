import { defineConfig } from 'astro/config';

// Deployed to Netlify at the site root, custom domain angolorosso.com
// (client-owned). `site` drives absolute URLs (sitemap/canonical).
// No `base`: the site serves from `/`.
export default defineConfig({
  site: 'https://angolorosso.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
