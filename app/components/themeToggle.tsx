import { parseWithZod } from '@conform-to/zod'
import {
  useFetcher,
  useFetchers,
  useLocation,
  useMatches,
} from '@remix-run/react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { z } from 'zod'
import { type Theme } from '@/utils/theme.server'
import { Button } from '@/components/ui/button'

const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  redirectTo: z.string().optional(),
})

type RootLoaderData = {
  theme: Theme
  systemTheme: 'light' | 'dark'
  effectiveTheme: 'light' | 'dark'
}

function useOptimisticThemeMode() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find(
    (f: { formAction?: string }) => f.formAction === '/resources/theme-switch'
  )

  if (themeFetcher && themeFetcher.formData) {
    const submission = parseWithZod(themeFetcher.formData, {
      schema: ThemeFormSchema,
    })

    if (submission.status === 'success') {
      return submission.value.theme
    }
  }
}

export function ThemeToggle() {
  const matches = useMatches()
  const rootMatch = matches.find((match) => match.id === 'root')
  const data = rootMatch?.data as RootLoaderData | undefined
  const theme = data?.theme || 'system'
  const systemTheme = data?.systemTheme || 'light'

  const fetcher = useFetcher()
  const location = useLocation()
  const optimisticMode = useOptimisticThemeMode()
  const mode = optimisticMode ?? theme

  let displayTheme = mode
  if (mode === 'system') {
    displayTheme = systemTheme
  }

  const icons = {
    light: <Sun className="h-[1.2rem] w-[1.2rem]" />,
    dark: <Moon className="h-[1.2rem] w-[1.2rem]" />,
    system: <Monitor className="h-[1.2rem] w-[1.2rem]" />,
  }

  const nextTheme: Record<Theme, Theme> = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  }

  return (
    <fetcher.Form
      method="POST"
      action="/resources/theme-switch"
      preventScrollReset
    >
      <input type="hidden" name="theme" value={nextTheme[mode]} />
      <input type="hidden" name="redirectTo" value={location.pathname} />
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Switch to ${nextTheme[mode]} theme`}
      >
        {mode === 'system'
          ? icons.system
          : icons[displayTheme as 'light' | 'dark']}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </fetcher.Form>
  )
}
