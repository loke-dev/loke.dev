import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { GenerateContentAction } from './sanity/actions/generateContentAction'
import { SyncSchedulesAction } from './sanity/actions/syncSchedulesAction'
import { useUnpublishAction } from './sanity/actions/unpublishAction'
import { singletonTypes, structure } from './sanity/deskStructure'
import { schemaTypes } from './sanity/schemas'

const projectId =
  process.env.SANITY_PROJECT_ID ??
  process.env.VITE_SANITY_PROJECT_ID ??
  'l25uat4p'
const dataset =
  process.env.SANITY_DATASET ?? process.env.VITE_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'default',
  title: 'loke.dev',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletonTypes.has(template.id)),
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'contentTopic') {
        return [...prev, GenerateContentAction, SyncSchedulesAction]
      }
      if (['post', 'project'].includes(context.schemaType)) {
        return [...prev, useUnpublishAction]
      }
      if (singletonTypes.has(context.schemaType)) {
        return prev.filter(
          (action) =>
            action.action !== 'delete' && action.action !== 'duplicate'
        )
      }
      return prev
    },
  },
})
