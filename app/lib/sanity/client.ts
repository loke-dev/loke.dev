import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId, useCdn } from './projectDetails'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
})
