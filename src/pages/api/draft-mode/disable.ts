import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'

export const prerender = false

export function GET() {
  const headers = new Headers({
    'Cache-Control': 'no-store',
    Location: '/',
  })
  headers.append(
    'Set-Cookie',
    [
      `${perspectiveCookieName}=`,
      'Path=/',
      'HttpOnly',
      'Secure',
      'SameSite=None',
      'Max-Age=0',
    ].join('; ')
  )

  return new Response(null, { status: 307, headers })
}
