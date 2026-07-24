import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId, useCdn } from './projectDetails'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})

export const freshClient = client.withConfig({ useCdn: false })

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})
