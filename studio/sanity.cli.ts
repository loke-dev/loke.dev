import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId:
      process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || '',
    dataset:
      process.env.SANITY_DATASET ||
      process.env.VITE_SANITY_DATASET ||
      'production',
  },
  studioHost: 'loke-dev',
})
