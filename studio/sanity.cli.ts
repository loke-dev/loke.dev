import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  deployment: {
    appId: 'pv66xlc2z82m3cr61t24jr0x',
  },
  api: {
    projectId:
      process.env.SANITY_PROJECT_ID ||
      process.env.VITE_SANITY_PROJECT_ID ||
      'l25uat4p',
    dataset:
      process.env.SANITY_DATASET ||
      process.env.VITE_SANITY_DATASET ||
      'production',
  },
  studioHost: 'loke-dev',
})
