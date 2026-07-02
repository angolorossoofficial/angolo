// Upload the client's category cover photos to Sanity + set `cover` on each
// category. Images live in ./covers/<slug>.jpg (client assets, neon-noir set).
// Re-runnable (idempotent-ish: re-uploads + re-points). Run:
//   npx sanity exec scripts/uploadCategoryCovers.mjs --with-user-token
import {getCliClient} from 'sanity/cli'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const client = getCliClient({apiVersion: '2024-01-01'})
const here = dirname(fileURLToPath(import.meta.url))
const COVERS = join(here, 'covers')

// slug order confirmed against Sanity: _id === `category-<slug>`
const slugs = ['psicologici', 'occulto', 'dark-comedy', 'classici', 'indipendenti', 'splatter']

for (const slug of slugs) {
  const id = `category-${slug}`
  process.stdout.write(`↑ ${slug} … `)
  const buf = readFileSync(join(COVERS, `${slug}.jpg`))
  const asset = await client.assets.upload('image', buf, {
    filename: `cover-${slug}.jpg`,
    contentType: 'image/jpeg',
  })
  await client
    .patch(id)
    .set({cover: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}})
    .commit()
  console.log(`OK → ${id} (${asset._id})`)
}
console.log('Done.')
