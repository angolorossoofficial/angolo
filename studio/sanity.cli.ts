import {defineCliConfig} from 'sanity/cli'

// studioHost => the studio deploys to https://angolo-rosso.sanity.studio
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: 'angolo-rosso',
  deployment: {
    appId: 'dcdztze0ytetchm1znmmgww4',
  },
  autoUpdates: true,
})
