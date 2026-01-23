import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: unknown) {
  return builder.image(source as Parameters<typeof builder.image>[0])
}
