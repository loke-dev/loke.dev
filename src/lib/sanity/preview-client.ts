import { client } from './client'
import { getPreviewPerspective } from './draft-mode'

export function getRequestSanityClient(request: Request) {
  const perspective = getPreviewPerspective(request)
  if (!perspective) return { client, isPreview: false }

  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) {
    throw new Error('SANITY_API_READ_TOKEN is required for Studio preview.')
  }

  return {
    client: client.withConfig({
      perspective,
      token,
      useCdn: false,
    }),
    isPreview: true,
  }
}
