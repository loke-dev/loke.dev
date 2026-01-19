import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'l25uat4p',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: import.meta.env.PROD,
  apiVersion: '2024-01-01',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: unknown) {
  return builder.image(source)
}
