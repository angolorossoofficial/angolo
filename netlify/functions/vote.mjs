// POST /api/vote — receive a public vote (0–10) for a review and write it to
// Sanity. The site computes "Pubblico X,X (N voti)" client-side from these.
// Abuse controls: origin check, slug must be a real review, and a deterministic
// per-(review,IP) _id via createIfNotExists so one device/IP counts once even if
// localStorage is cleared or the endpoint is hit raw.
import {writeClient, json, oneLine, originAllowed, reviewExists, voteDedupeId} from './_sanity.mjs'

export default async (req) => {
  if (req.method !== 'POST') return json({ok: false, error: 'method'}, 405)
  if (!originAllowed(req)) return json({ok: false, error: 'origin'}, 403)
  if (!process.env.SANITY_WRITE_TOKEN) return json({ok: false, error: 'config'}, 500)

  let data
  try {
    data = await req.json()
  } catch {
    return json({ok: false, error: 'bad-json'}, 400)
  }

  const value = Number(data.value)
  const reviewSlug = oneLine(data.reviewSlug, 120)
  const reviewTitle = oneLine(data.reviewTitle, 200)

  if (!Number.isInteger(value) || value < 0 || value > 10) return json({ok: false, error: 'value'}, 422)
  if (!reviewSlug) return json({ok: false, error: 'review'}, 422)
  if (!(await reviewExists(reviewSlug))) return json({ok: false, error: 'review'}, 422)

  try {
    // createIfNotExists = idempotent per device/IP: a repeat vote is a no-op,
    // so a single client can't inflate the tally.
    await writeClient.createIfNotExists({
      _id: voteDedupeId(req, reviewSlug),
      _type: 'vote',
      value,
      reviewSlug,
      reviewTitle,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('vote write failed', err?.message || err)
    return json({ok: false, error: 'write'}, 502)
  }

  return json({ok: true})
}

export const config = {path: '/api/vote'}
