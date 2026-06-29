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

// --- Portable Text -> array of paragraph HTML strings ---------------------
// Reviews are prose; we keep inline marks (bold/italic/links) and drop block
// styles (every block becomes a <p>, so the drop-cap CSS still applies).
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function bodyToParagraphs(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b && b._type === 'block')
    .map((block) => {
      const defs = block.markDefs || [];
      return (block.children || [])
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
    })
    .filter((html) => html.trim().length > 0);
}

// --- Fetch (build time) ----------------------------------------------------
const CATEGORY_Q = `*[_type=="category"]|order(order asc){
  "slug": slug.current, title, tagline, atmo, accent
}`;

const REVIEW_Q = `*[_type=="review" && defined(slug.current)]|order(publishedAt desc){
  "slug": slug.current,
  title, originalTitle, year, director, cast, runtime, country, genres,
  excerpt, publishedAt, highlight, trailer,
  "category": category->slug.current,
  "categoryAtmo": category->atmo,
  "posterUrl": poster.asset->url,
  atmo,
  ratings,
  body
}`;

const [rawCategories, rawReviews] = await Promise.all([
  client.fetch(CATEGORY_Q),
  client.fetch(REVIEW_Q),
]);

export const categories = (rawCategories || []).map((c) => ({
  slug: c.slug,
  title: c.title,
  tagline: c.tagline || '',
  atmo: c.atmo || DEFAULT_ATMO,
  accent: c.accent || null,
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
    body: bodyToParagraphs(r.body),
  };
});

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
