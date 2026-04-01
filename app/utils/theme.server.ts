import * as cookie from 'cookie'
import { z } from 'zod'
import { getHints } from '@/utils/hints'

const cookieName = 'loke-dev-theme'

export const ThemeSchema = z.enum(['light', 'dark', 'system'])
export type Theme = z.infer<typeof ThemeSchema>

export function getTheme(request: Request): 'light' | 'dark' | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const parsed = cookie.parse(cookieHeader)[cookieName]
  if (parsed === 'light' || parsed === 'dark') return parsed
  return null
}

export function setTheme(theme: Theme): string {
  if (theme === 'system') {
    return cookie.serialize(cookieName, '', {
      path: '/',
      maxAge: -1,
      sameSite: 'lax',
    })
  }
  return cookie.serialize(cookieName, theme, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export function getEffectiveTheme(request: Request): 'light' | 'dark' {
  const theme = getTheme(request)
  if (theme) return theme
  const hints = getHints(request)
  return hints.theme === 'dark' ? 'dark' : 'light'
}
