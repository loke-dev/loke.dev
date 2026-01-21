import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { dataset, projectId } from './app/lib/sanity/projectDetails'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'loke.dev',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
