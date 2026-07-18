import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import { withoutSecretSearchParams } from '@sanity/preview-url-secret/without-secret-search-params'
import { sanityWriteClient } from '@/lib/sanity/client'

export const prerender = false

export async function GET({ request }: { request: Request }) {
  if (!process.env.SANITY_API_READ_TOKEN) {
    return new Response('Studio preview is not configured.', { status: 503 })
  }

  const previewClient = sanityWriteClient.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  })
  const { isValid, redirectTo, studioPreviewPerspective } =
    await validatePreviewUrl(previewClient, request.url)

  if (!isValid) {
    return new Response('Invalid or expired preview secret.', { status: 401 })
  }

  const requestUrl = new URL(request.url)
  const candidate = redirectTo
    ? withoutSecretSearchParams(new URL(redirectTo, request.url))
    : new URL('/', request.url)
  const safeRedirect =
    candidate.origin === requestUrl.origin
      ? `${candidate.pathname}${candidate.search}${candidate.hash}`
      : '/'

  const headers = new Headers({
    'Cache-Control': 'no-store',
    Location: safeRedirect,
  })
  headers.append(
    'Set-Cookie',
    [
      `${perspectiveCookieName}=${encodeURIComponent(studioPreviewPerspective || 'drafts')}`,
      'Path=/',
      'HttpOnly',
      'Secure',
      'SameSite=None',
      'Max-Age=3600',
    ].join('; ')
  )

  return new Response(null, { status: 307, headers })
}
