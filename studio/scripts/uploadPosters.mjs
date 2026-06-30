// Upload official TMDB posters to Sanity + set poster/cover on each doc.
// Run: npx sanity exec scripts/uploadPosters.mjs --with-user-token
// Posters used within each film's own review (diritto di critica/recensione,
// art. 70 L.633/1941) + TMDB attribution shown in the site footer.
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-01-01'})

const TMDB = 'https://image.tmdb.org/t/p/w780'
const items = [
  {id: 'review-obsession',                     field: 'poster', path: '/rFz5RCSx8SILVDs0Q2OYdMYVtRC.jpg', title: 'Obsession'},
  {id: 'review-whistle',                        field: 'poster', path: '/pR7XylwnqSMUABoXVi9yhXOlhOg.jpg', title: 'Whistle'},
  {id: 'review-finche-morte-2',                 field: 'poster', path: '/fro6xA6STLdHJRyoleRGIerwKC.jpg', title: 'Ready or Not 2'},
  {id: 'news-kill-bill-whole-bloody-affair',    field: 'cover',  path: '/nSOJfWJCdVFZQwXQA7RXn7FIIiY.jpg', title: 'Kill Bill TWBA'},
]

for (const it of items) {
  const url = TMDB + it.path
  process.stdout.write(`↓ ${it.title} … `)
  const res = await fetch(url)
  if (!res.ok) { console.log(`FAIL fetch ${res.status}`); continue }
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {
    filename: `poster-${it.id}.jpg`,
    contentType: 'image/jpeg',
  })
  await client
    .patch(it.id)
    .set({[it.field]: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}})
    .commit()
  console.log(`OK → ${it.field} (${asset._id})`)
}
console.log('Done.')
