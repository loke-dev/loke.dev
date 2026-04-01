import { data, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { getHints } from '@/utils/hints'
import { setTheme, ThemeSchema } from '@/utils/theme.server'

const ThemeFormSchema = z.object({
  theme: ThemeSchema,
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const theme = formData.get('theme')

  const result = ThemeFormSchema.safeParse({ theme })

  if (!result.success) {
    return data(
      { success: false, error: 'Invalid theme value' },
      { status: 400 }
    )
  }

  const newTheme = result.data.theme
  const hints = getHints(request)
  const effectiveTheme: 'light' | 'dark' =
    newTheme === 'system'
      ? hints.theme === 'dark'
        ? 'dark'
        : 'light'
      : newTheme === 'dark'
        ? 'dark'
        : 'light'

  const cookie = await setTheme(newTheme)

  return data(
    { success: true, effectiveTheme },
    { headers: { 'Set-Cookie': cookie } }
  )
}
