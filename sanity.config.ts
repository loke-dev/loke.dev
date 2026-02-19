import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './app/lib/sanity/projectDetails'
import { GenerateContentAction } from './sanity/actions/generateContentAction'
import { useUnpublishAction } from './sanity/actions/unpublishAction'
import { singletonTypes, structure } from './sanity/deskStructure'
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
    // Filter out singleton types from the global "New document" menu
    templates: (templates) =>
      templates.filter((template) => !singletonTypes.has(template.id)),
  },
  document: {
    actions: (prev, context) => {
      // Add generate action for contentTopic documents
      if (context.schemaType === 'contentTopic') {
        return [...prev, GenerateContentAction]
      }
      // Add unpublish action for post and project documents
      if (['post', 'project'].includes(context.schemaType)) {
        return [...prev, useUnpublishAction]
      }
      // Disable "delete" and "duplicate" for singleton pages
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
