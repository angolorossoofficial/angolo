import {defineCliConfig} from 'sanity/cli'

// studioHost => the studio deploys to https://angolo-rosso.sanity.studio
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Asset/base URL for the built bundle — must match basePath in sanity.config.ts.
  // The studio is self-hosted at angolorosso.com/studio (built into dist/studio
  // by the Netlify build, see netlify.toml).
  project: {
    basePath: '/studio',
  },
  studioHost: 'angolo-rosso',
  deployment: {
    appId: 'dcdztze0ytetchm1znmmgww4',
  },
  autoUpdates: true,
})
