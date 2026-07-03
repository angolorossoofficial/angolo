// Upload the X3RO ad banners (2 sets: cyan + violet) to Sanity as `sponsor`
// docs. Each set has a 970x120 desktop + 320x100 mobile image in
// ./banners/<set>/{desktop,mobile}.png. Both are set active -> they rotate in
// the AdSlot. Deterministic _id (`sponsor-x3ro-<set>`) => re-runnable.
// Run: npx sanity exec scripts/uploadSponsors.mjs --with-user-token
import {getCliClient} from 'sanity/cli'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const client = getCliClient({apiVersion: '2024-01-01'})
const here = dirname(fileURLToPath(import.meta.url))
const BANNERS = join(here, 'banners')

const SETS = [
  {key: 'cyan', name: 'X3RO Automations — cyan'},
  {key: 'violet', name: 'X3RO Automations — violet'},
]
const URL = 'https://x3roautomations.it'
const ALT = 'X3RO Automations — automazioni AI per aziende'

const uploadImg = async (set, kind, filename) => {
  const buf = readFileSync(join(BANNERS, set, `${kind}.png`))
  const asset = await client.assets.upload('image', buf, {filename, contentType: 'image/png'})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

for (const {key, name} of SETS) {
  process.stdout.write(`↑ ${key} … `)
  const imageDesktop = await uploadImg(key, 'desktop', `x3ro-${key}-970x120.png`)
  const imageMobile = await uploadImg(key, 'mobile', `x3ro-${key}-320x100.png`)
  const id = `sponsor-x3ro-${key}`
  await client.createOrReplace({
    _id: id,
    _type: 'sponsor',
    name,
    active: true,
    url: URL,
    imageDesktop,
    imageMobile,
    alt: ALT,
  })
  console.log(`OK → ${id}`)
}
console.log('Done. Both sponsors active — they rotate in the ad slot.')
