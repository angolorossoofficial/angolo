import type { APIRoute } from 'astro';
import { reviews, getCategory } from '../data/sample.js';

// Static JSON index consumed by the header search overlay for live,
// typo-tolerant title suggestions. Built once at build time.
export const GET: APIRoute = () => {
  const idx = reviews.map((r: any) => ({
    slug: r.slug,
    title: r.title,
    orig: r.originalTitle,
    director: r.director,
    year: r.year,
    cat: r.categories.map((s: string) => getCategory(s)?.title).filter(Boolean).join(' · '),
    poster: r.shareImage || null,
  }));
  return new Response(JSON.stringify(idx), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
