import { data, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
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

  const cookie = await setTheme(result.data.theme)

  return data({ success: true }, { headers: { 'Set-Cookie': cookie } })
}
