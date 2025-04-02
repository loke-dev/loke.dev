import { useFetcher, useLocation, useMatches } from '@remix-run/react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { type Theme } from '@/lib/theme.server'
import { Button } from '@/components/ui/button'

type RootLoaderData = {
  theme: Theme
  systemTheme: 'light' | 'dark'
  effectiveTheme: 'light' | 'dark'
}

export function ThemeToggle() {
  const matches = useMatches()
  const rootMatch = matches.find((match) => match.id === 'root')
  const data = rootMatch?.data as RootLoaderData | undefined
  const theme = data?.theme || 'system'
  const systemTheme = data?.systemTheme || 'light'

  const fetcher = useFetcher()
  const location = useLocation()

  let displayTheme = theme
  if (theme === 'system') {
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
    <fetcher.Form method="POST" action="/resources/theme-switch">
      <input type="hidden" name="theme" value={nextTheme[theme]} />
      <input type="hidden" name="redirectTo" value={location.pathname} />
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Switch to ${nextTheme[theme]} theme`}
      >
        {theme === 'system'
          ? icons.system
          : icons[displayTheme as 'light' | 'dark']}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </fetcher.Form>
  )
}
