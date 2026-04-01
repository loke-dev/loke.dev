import { data, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { setTheme, ThemeSchema } from '@/utils/theme.server'

const ThemeFormSchema = z.object({
  theme: ThemeSchema,
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const result = ThemeFormSchema.safeParse({ theme: formData.get('theme') })

  if (!result.success) {
    return data({ success: false }, { status: 400 })
  }

  return data(
    { success: true },
    { headers: { 'set-cookie': setTheme(result.data.theme) } }
  )
}
