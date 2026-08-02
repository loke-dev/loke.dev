const STUDIO_HOST = 'loke-dev.sanity.studio'

export function getStudioRedirect(request: Request): Response | null {
  const url = new URL(request.url)
  if (url.pathname !== '/studio' && !url.pathname.startsWith('/studio/')) {
    return null
  }

  const studioPath = url.pathname.slice('/studio'.length) || '/'
  const studioUrl = new URL(`https://${STUDIO_HOST}${studioPath}`)
  studioUrl.search = url.search

  return Response.redirect(studioUrl, 302)
}
