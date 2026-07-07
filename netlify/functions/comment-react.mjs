// POST /api/comment-react — like/dislike an approved comment. The site reads
// per-comment counts client-side and orders comments by likes.
// Abuse controls mirror /api/vote: origin check, the comment must exist and be
// approved, and a deterministic per-(comment,IP) _id makes reactions idempotent
// server-side (one reaction per device/IP per comment, like OR dislike).
import {writeClient, json, oneLine, originAllowed, approvedCommentSlug, reactionDedupeId} from './_sanity.mjs'

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

  const commentId = oneLine(data.commentId, 120)
  const reaction = data.reaction === 'like' ? 'like' : data.reaction === 'dislike' ? 'dislike' : null

  if (!reaction) return json({ok: false, error: 'reaction'}, 422)
  if (!commentId) return json({ok: false, error: 'comment'}, 422)
  const reviewSlug = await approvedCommentSlug(commentId)
  if (!reviewSlug) return json({ok: false, error: 'comment'}, 422)

  try {
    // Deterministic per-(comment,IP) _id: a repeat reaction conflicts (409) and
    // is treated as success below, so one device/IP counts once per comment.
    await writeClient.create({
      _id: reactionDedupeId(req, commentId),
      _type: 'commentReaction',
      reaction,
      commentId,
      reviewSlug,
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    // Already reacted from this device/IP — idempotent, not an error.
    if (err?.statusCode === 409 || /already exists|conflict/i.test(err?.message || '')) {
      return json({ok: true, status: 'already-reacted'})
    }
    console.error('comment-react write failed', err?.message || err)
    return json({ok: false, error: 'write'}, 502)
  }

  return json({ok: true})
}

export const config = {path: '/api/comment-react'}
