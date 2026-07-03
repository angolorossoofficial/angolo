// Shared server-side Sanity write client + small helpers for the public
// engagement functions (comments, votes). The write token lives ONLY in the
// Netlify environment (SANITY_WRITE_TOKEN) and is never exposed to the browser.
import {createClient} from '@sanity/client'
import {createHash} from 'node:crypto'

// Canonical project/dataset: match the build-side vars (PUBLIC_*) so moving the
// project by setting only those doesn't silently keep writing to the old default.
const PROJECT_ID =
  process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || '82x61wc7'
const DATASET =
  process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production'

export const writeClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2021-10-21',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// --- abuse controls -------------------------------------------------------
// Browser cross-site POSTs carry an Origin header; reject any that isn't ours.
// (Absent Origin is allowed: same-origin navigations/no-cors edge cases. Scripted
// curl abuse is additionally bounded by slug validation + per-IP vote dedup.)
const ALLOWED_HOSTS = new Set(['angolorosso.com', 'www.angolorosso.com'])
export const originAllowed = (req) => {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    const h = new URL(origin).hostname
    return ALLOWED_HOSTS.has(h) || h === 'localhost' || h.endsWith('.netlify.app')
  } catch {
    return false
  }
}

// Reject votes/comments for slugs that don't map to a real published review.
export const reviewExists = async (slug) => {
  if (!slug) return false
  try {
    const n = await writeClient.fetch('count(*[_type=="review" && slug.current==$slug])', {slug})
    return n > 0
  } catch {
    return false
  }
}

// Deterministic vote _id per (review, client-IP) → createIfNotExists makes votes
// idempotent server-side: one vote per device/IP survives even if localStorage is
// cleared or the endpoint is hit raw. Only a salted hash of the IP is used (no raw
// IP stored); tune the salt via VOTE_SALT.
export const voteDedupeId = (req, slug) => {
  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  const salt = process.env.VOTE_SALT || 'ar-vote-v1'
  const h = createHash('sha256').update(`${salt}|${ip}|${slug}`).digest('hex').slice(0, 24)
  return `vote.${slug}.${h}`.replace(/[^a-zA-Z0-9._-]/g, '-')
}

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {'content-type': 'application/json; charset=utf-8'},
  })

// Control-char strippers (built from escaped strings so no raw control bytes
// live in this source file). CTRL = all C0 + DEL; CTRL_NL keeps newline (0x0a).
const CTRL = new RegExp('[\\u0000-\\u001f\\u007f]+', 'g')
const CTRL_NL = new RegExp('[\\u0000-\\u0009\\u000b-\\u001f\\u007f]+', 'g')

// Single-line field: strip all control chars, collapse whitespace, trim, cap.
export const oneLine = (s, max) =>
  String(s ?? '')
    .replace(CTRL, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)

// Multi-line field: keep newlines, strip other control chars, collapse runs of
// spaces/tabs and 3+ blank lines, trim, cap length.
export const multiLine = (s, max) =>
  String(s ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(CTRL_NL, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max)
