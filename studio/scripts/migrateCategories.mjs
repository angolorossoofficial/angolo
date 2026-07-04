// One-off migration: review.category (single reference) -> review.categories
// (array of references). Run AFTER the site code that reads both shapes is
// deployed, and BEFORE `sanity deploy` publishes the new Studio schema:
//
//   npx sanity exec scripts/migrateCategories.mjs --with-user-token
//
// Idempotent: docs already migrated (or without `category`) are skipped.
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2021-10-21'})

// Include drafts too, so an open unsaved edit doesn't resurrect the old field.
const docs = await client.fetch(
  `*[_type == "review" && defined(category)]{_id, category, categories}`,
)

if (!docs.length) {
  console.log('Nothing to migrate — no review has the old `category` field.')
  process.exit(0)
}

for (const doc of docs) {
  const patch = client.patch(doc._id).unset(['category'])
  if (!doc.categories?.length) {
    patch.set({categories: [{...doc.category, _key: 'cat-0'}]})
  }
  await patch.commit()
  console.log(`migrated ${doc._id}`)
}
console.log(`Done: ${docs.length} review(s) migrated.`)
