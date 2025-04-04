import { createCookieSessionStorage } from '@remix-run/node'
import { z } from 'zod'
import { getHints } from '@/utils/hints'

export const ThemeSchema = z.enum(['system', 'light', 'dark'])
export type Theme = z.infer<typeof ThemeSchema>

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'loke-dev-theme',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['theme-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
})

const THEME_KEY = 'theme'

export async function getTheme(request: Request): Promise<Theme> {
  const cookieSession = await themeStorage.getSession(
    request.headers.get('Cookie')
  )
  const themeValue = cookieSession.get(THEME_KEY)

  if (themeValue) {
    const result = ThemeSchema.safeParse(themeValue)
    if (result.success) return result.data
  }

  return 'system'
}

export async function setTheme(theme: Theme) {
  const cookieSession = await themeStorage.getSession()
  cookieSession.set(THEME_KEY, theme)

  return themeStorage.commitSession(cookieSession)
}

export async function getEffectiveTheme(
  request: Request
): Promise<'light' | 'dark'> {
  const theme = await getTheme(request)
  const hints = getHints(request)

  if (theme === 'system') {
    return hints.theme === 'dark' ? 'dark' : 'light'
  }

  return theme === 'dark' ? 'dark' : 'light'
}
