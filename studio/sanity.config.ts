import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// projectId/dataset are read from env so no secrets live in git.
// Set them in studio/.env after accepting the Sanity invite (see studio/README.md).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID mancante. Copia studio/.env.example in studio/.env e inserisci il Project ID da https://www.sanity.io/manage',
  )
}

export default defineConfig({
  name: 'angolo-rosso',
  title: 'Angolo Rosso — Redazione',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool()],
  schema: {types: schemaTypes},
})
