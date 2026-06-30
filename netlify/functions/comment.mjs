// POST /api/comment — receive a public comment, validate, and write it to
// Sanity UNapproved. The redazione approves it in the Studio before it shows on
// the site. Email is stored privately (moderation/reply) and never rendered.
import {writeClient, json, oneLine, multiLine} from './_sanity.mjs'

export default async (req) => {
  if (req.method !== 'POST') return json({ok: false, error: 'method'}, 405)
  if (!process.env.SANITY_WRITE_TOKEN) return json({ok: false, error: 'config'}, 500)

  let data
  try {
    data = await req.json()
  } catch {
    return json({ok: false, error: 'bad-json'}, 400)
  }

  // Honeypot: bots fill the hidden `website` field. Humans never see it.
  // Pretend success and write nothing.
  if (oneLine(data.website, 100)) return json({ok: true, status: 'pending'})

  const name = oneLine(data.name, 60)
  const email = oneLine(data.email, 120).toLowerCase()
  const message = multiLine(data.message, 2000)
  const reviewSlug = oneLine(data.reviewSlug, 120)
  const reviewTitle = oneLine(data.reviewTitle, 200)

  if (name.length < 2) return json({ok: false, error: 'name'}, 422)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ok: false, error: 'email'}, 422)
  if (message.length < 3) return json({ok: false, error: 'message'}, 422)
  if (!reviewSlug) return json({ok: false, error: 'review'}, 422)

  try {
    await writeClient.create({
      _type: 'comment',
      name,
      email,
      message,
      reviewSlug,
      reviewTitle,
      approved: false,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('comment write failed', err?.message || err)
    return json({ok: false, error: 'write'}, 502)
  }

  return json({ok: true, status: 'pending'})
}

export const config = {path: '/api/comment'}
