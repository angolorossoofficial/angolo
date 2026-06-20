# Angolo Rosso

Blog di recensioni di cinema horror — identità nero/rosso, navigazione semplice.
First paying client of the agency.

**Stack:** Astro (SSG) · self-hosted fonts (Anton / Archivo / Spectral) · GSAP + Lenis.
CMS (Sanity) and dynamic features (Supabase: comments + public voting) land in later phases.

**Hosting:** GitHub Pages (Astro is fully static; Supabase calls are client-side).

## Status — Phase 1: design prototype

Static prototype with sample data (`src/data/sample.js`) for client sign-off on the look.
No backend yet. Real reviews, posters and copy come from the client.

| Phase | Scope |
|---|---|
| 1 (this) | Identity · home · single review · category · archive (filters) · search UI |
| 2 | Sanity CMS (publish panel) · live content · Pagefind search · auto-rebuild on publish |
| 3 | Comments · public voting (redazione vs pubblico) · ad slots |

## Develop

```bash
npm install
npm run dev      # http://localhost:4321/angolo-rosso
npm run build    # -> dist/
npm run preview
```

## Deploy

Push to `main` → GitHub Action builds and publishes to Pages
(`https://xerocool36.github.io/angolo-rosso/`). When a custom domain is added,
set `site`/`base` in `astro.config.mjs` accordingly.

## Notes

- Category atmospheres and posters are CSS stand-ins until the client supplies licensed imagery.
- Rating axes (Jumpscare · Splatter · Musiche · Trucco · Effetti · Costumi · Voto finale)
  and the 0–10 scale are placeholders pending client confirmation.
