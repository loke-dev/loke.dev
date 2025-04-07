import { ReactNode } from 'react'
import { defaultTheme, ThemeOptions } from './theme'
import { ThemeContext } from './theme-context-core'

export function ThemeProvider({
  children,
  theme = defaultTheme,
}: {
  children: ReactNode
  theme?: ThemeOptions
}) {
  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  )
}
