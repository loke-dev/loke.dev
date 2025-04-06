import { createContext } from 'react'
import { defaultTheme, ThemeOptions } from './theme'

type ThemeContextType = {
  theme: ThemeOptions
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
})
