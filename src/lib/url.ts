// Join the configured base path (e.g. /angolo-rosso) with an internal path,
// so links work on GitHub Pages project sites and on a custom domain alike.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith('#')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}` || '/';
}
