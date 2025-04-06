import { useContext } from 'react'
import { ThemeOptions } from './theme'
import { ThemeContext } from './theme-context-core'

export function useTheme(): { theme: ThemeOptions } {
  return useContext(ThemeContext)
}
