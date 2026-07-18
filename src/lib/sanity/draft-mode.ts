import { validateApiPerspective, type ClientPerspective } from '@sanity/client'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'

const previewCookiePattern = new RegExp(
  `${perspectiveCookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]+)`
)

export function getPreviewPerspective(
  request: Request
): ClientPerspective | null {
  const value = request.headers.get('Cookie')?.match(previewCookiePattern)?.[1]
  if (!value) return null

  const perspective = decodeURIComponent(value)
  const candidate = perspective.includes(',')
    ? perspective.split(',')
    : perspective

  try {
    validateApiPerspective(candidate)
    return candidate === 'raw' ? 'drafts' : candidate
  } catch {
    return null
  }
}

export { perspectiveCookieName }
