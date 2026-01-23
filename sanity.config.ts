import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './app/lib/sanity/projectDetails'
import { useUnpublishAction } from './sanity/actions/unpublishAction'
import { structure } from './sanity/deskStructure'
import { schemaTypes } from './sanity/schemas'

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
  },
  document: {
    actions: (prev, context) => {
      // Add unpublish action for post and project documents
      if (['post', 'project'].includes(context.schemaType)) {
        return [...prev, useUnpublishAction]
      }
      return prev
    },
  },
})
