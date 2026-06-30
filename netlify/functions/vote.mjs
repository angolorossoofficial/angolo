// POST /api/vote — receive a public vote (0–10) for a review and write it to
// Sanity. The site computes "Pubblico X,X (N voti)" client-side from these.
// One-vote-per-device is enforced client-side via localStorage (no cookie).
import {writeClient, json, oneLine} from './_sanity.mjs'

export default async (req) => {
  if (req.method !== 'POST') return json({ok: false, error: 'method'}, 405)
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

  try {
    await writeClient.create({
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
