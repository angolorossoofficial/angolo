import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://xerocool36.github.io/angolo-rosso/
// When a custom domain is added later, set site to the domain and base to '/'.
export default defineConfig({
  site: 'https://xerocool36.github.io',
  base: '/angolo-rosso',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
