import { data, redirect, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { setTheme, ThemeSchema } from '@/utils/theme.server'

const ThemeFormSchema = z.object({
  theme: ThemeSchema,
  redirectTo: z.string().optional(),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const theme = formData.get('theme')
  const redirectTo = formData.get('redirectTo')

  const result = ThemeFormSchema.safeParse({
    theme,
    redirectTo: redirectTo ? String(redirectTo) : undefined,
  })

  if (!result.success) {
    return data(
      { success: false, error: 'Invalid theme value' },
      { status: 400 }
    )
  }

  const { theme: parsedTheme, redirectTo: parsedRedirectTo } = result.data

  const cookie = await setTheme(parsedTheme)
  const responseInit = {
    headers: { 'Set-Cookie': cookie },
  }

  if (parsedRedirectTo && typeof parsedRedirectTo === 'string') {
    return redirect(parsedRedirectTo, responseInit)
  }

  return data({ success: true }, responseInit)
}
