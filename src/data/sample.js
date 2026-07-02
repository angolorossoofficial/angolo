// Content layer — Phase 2.
// Replaces the prototype seed: data now comes from Sanity (project angolorosso,
// dataset `production`, public read so no token needed at build time).
// Kept at this path/filename so the components/pages that import it are unchanged.
//
// Exports the SAME shape the prototype used, so the UI keeps working:
//   categories     [{ slug, title, tagline, atmo }]
//   reviews        [{ slug, title, originalTitle, category(slug), year, director,
//                     cast[], runtime, country, genres[], excerpt, publishedAt,
//                     highlight, trailer, ratings{...axes, finale}, atmo, body[] }]
//   RATING_AXES, getCategory(slug), reviewsByDate(), featuredReviews()
//
// `atmo` is a CSS `background` value that drives every card/hero. It resolves to,
// in order: the review poster image -> a per-review gradient -> the category
// gradient -> a default. So reviews render with or without a poster.

import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || '82x61wc7';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2021-10-21',
  useCdn: false, // build-time fetch: read fresh so a publish->rebuild shows immediately
});

const DEFAULT_ATMO = 'linear-gradient(180deg,#14151b,#0a0b10)';

// Turn a Sanity poster image URL into a CSS background, sized for the web.
const posterBg = (url) =>
  url ? `#0a0b10 url("${url}?w=1400&q=72&auto=format") center/cover no-repeat` : null;

// --- Portable Text -> array of { style, html } blocks ---------------------
// Reviews are prose; we keep inline marks (bold/italic/links) AND the block
// style. A `normal` block renders as <p> (drop-cap applies to the first one);
// any heading style (h2/h3/...) renders as a white bold "question" lead-in the
// redazione can place before a paragraph — editable in the Studio, no redeploy.
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function bodyToBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b && b._type === 'block')
    .map((block) => {
      const defs = block.markDefs || [];
      const html = (block.children || [])
        .map((span) => {
          let t = esc(span.text || '');
          for (const mark of span.marks || []) {
            if (mark === 'strong') t = `<strong>${t}</strong>`;
            else if (mark === 'em') t = `<em>${t}</em>`;
            else if (mark === 'underline') t = `<u>${t}</u>`;
            else {
              const def = defs.find((d) => d._key === mark);
              if (def && def._type === 'link' && def.href) {
                t = `<a href="${esc(def.href)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
              }
            }
          }
          return t;
        })
        .join('');
      return { style: block.style || 'normal', html };
    })
    .filter((b) => b.html.trim().length > 0);
}

// --- Fetch (build time) ----------------------------------------------------
const CATEGORY_Q = `*[_type=="category"]|order(order asc){
  "slug": slug.current, title, tagline, atmo, accent,
  "coverUrl": cover.asset->url
}`;

const REVIEW_Q = `*[_type=="review" && defined(slug.current)]|order(publishedAt desc){
  "slug": slug.current,
  title, originalTitle, year, director, cast, runtime, country, genres,
  excerpt, publishedAt, highlight, trailer,
  "category": category->slug.current,
  "categoryAtmo": category->atmo,
  "posterUrl": poster.asset->url,
  "galleryUrls": gallery[].asset->url,
  atmo,
  ratings,
  body
}`;

const NEWS_Q = `*[_type=="news" && defined(slug.current)]|order(publishedAt desc){
  "slug": slug.current,
  title, kicker, author, excerpt, publishedAt,
  "coverUrl": cover.asset->url,
  atmo,
  body
}`;

// Active ad banners for the rotating pubblicità slot.
const SPONSOR_Q = `*[_type=="sponsor" && active==true]|order(_createdAt asc){
  _id, name, url, alt,
  "desktop": imageDesktop.asset->url,
  "mobile": imageMobile.asset->url
}`;

const [rawCategories, rawReviews, rawNews, rawSponsors] = await Promise.all([
  client.fetch(CATEGORY_Q),
  client.fetch(REVIEW_Q),
  client.fetch(NEWS_Q),
  client.fetch(SPONSOR_Q),
]);

// Brand atmospheric backdrop used as the category cover when no dedicated cover
// image is uploaded in Sanity. NOT a film poster — it's the site's neon-rain art.
// BASE_URL keeps the path correct under a GitHub Pages sub-path deploy too.
const BRAND_COVER = `#07070a url("${import.meta.env.BASE_URL}img/hero-bg.webp") center/cover no-repeat`;

const hexToRgba = (hex, a) => {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(String(hex || ''));
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
// Per-category colour wash (from the category accent) layered over the shared
// backdrop, so each card reads as a distinct colour without using film posters.
const accentWash = (accent) => {
  const strong = hexToRgba(accent, 0.78) || 'rgba(225,6,0,0.7)';
  const mid = hexToRgba(accent, 0.34) || 'rgba(225,6,0,0.3)';
  return `linear-gradient(150deg, ${strong} 0%, ${mid} 48%, transparent 82%)`;
};

export const categories = (rawCategories || []).map((c) => ({
  slug: c.slug,
  title: c.title,
  tagline: c.tagline || '',
  atmo: c.atmo || DEFAULT_ATMO,
  // cover resolves in order: uploaded Sanity cover -> brand atmospheric backdrop.
  cover: posterBg(c.coverUrl) || BRAND_COVER,
  // accent-coloured wash layered over the cover in the UI to keep cards distinct.
  tint: accentWash(c.accent),
  accent: c.accent || null,
  // true when the client uploaded a real cover photo -> the UI drops the heavy
  // accent wash so the photo shows through (the wash only exists to differentiate
  // the plain brand backdrop when no photo is set).
  hasCover: !!c.coverUrl,
}));

export const reviews = (rawReviews || []).map((r) => {
  const ratings = { ...(r.ratings || {}) };
  // Schema names the final score `votoFinale`; the UI reads `finale`.
  ratings.finale = ratings.votoFinale ?? ratings.finale ?? 0;

  const atmo = posterBg(r.posterUrl) || r.atmo || r.categoryAtmo || DEFAULT_ATMO;

  return {
    slug: r.slug,
    title: r.title,
    originalTitle: r.originalTitle || r.title,
    category: r.category || null,
    year: r.year ?? null,
    director: r.director || '',
    cast: r.cast || [],
    runtime: r.runtime ?? null,
    country: r.country || '',
    genres: r.genres || [],
    excerpt: r.excerpt || '',
    publishedAt: r.publishedAt || '',
    highlight: r.highlight || null,
    trailer: r.trailer || null,
    ratings,
    atmo,
    shareImage: r.posterUrl || null,
    gallery: (r.galleryUrls || []).filter(Boolean),
    body: bodyToBlocks(r.body),
  };
});

const DEFAULT_NEWS_ATMO = 'linear-gradient(160deg,#1c0a0a,#120a0c 55%,#0a0709)';

export const news = (rawNews || []).map((n) => ({
  slug: n.slug,
  title: n.title,
  kicker: n.kicker || 'Approfondimento',
  author: n.author || '',
  excerpt: n.excerpt || '',
  publishedAt: n.publishedAt || '',
  atmo: posterBg(n.coverUrl) || n.atmo || DEFAULT_NEWS_ATMO,
  shareImage: n.coverUrl || null,
  body: bodyToBlocks(n.body),
}));

export const newsByDate = () =>
  [...news].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

// Active ad banners (need at least a desktop image to render).
export const sponsors = (rawSponsors || [])
  .filter((s) => s.desktop)
  .map((s) => ({
    id: s._id,
    url: s.url,
    alt: s.alt || 'Pubblicità',
    desktop: s.desktop,
    mobile: s.mobile || null,
  }));

export const RATING_AXES = [
  { key: 'jumpscare', label: 'Jumpscare' },
  { key: 'splatter', label: 'Splatter' },
  { key: 'musiche', label: 'Musiche' },
  { key: 'trucco', label: 'Trucco' },
  { key: 'effetti', label: 'Effetti' },
  { key: 'costumi', label: 'Costumi' },
];

export const getCategory = (slug) => categories.find((c) => c.slug === slug);
export const reviewsByDate = () =>
  [...reviews].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
export const featuredReviews = () => reviews.filter((r) => r.highlight);
