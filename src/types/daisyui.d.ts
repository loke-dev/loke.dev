import { PluginAPI } from 'tailwindcss/types/config'

declare module 'daisyui' {
  const daisyui: PluginAPI
  export default daisyui
}

// DaisyUI theme type definition
type DaisyUIThemeColors = {
  primary?: string
  'primary-content'?: string
  secondary?: string
  'secondary-content'?: string
  accent?: string
  'accent-content'?: string
  neutral?: string
  'neutral-content'?: string
  'base-100'?: string
  'base-200'?: string
  'base-300'?: string
  'base-content'?: string
  info?: string
  'info-content'?: string
  success?: string
  'success-content'?: string
  warning?: string
  'warning-content'?: string
  error?: string
  'error-content'?: string
  [key: string]: string | undefined
}

type DaisyUITheme = Record<string, DaisyUIThemeColors>

declare module 'tailwindcss/types/config' {
  interface Config {
    daisyui?: {
      themes?: boolean | string[] | DaisyUITheme[]
      darkTheme?: string
      base?: boolean
      styled?: boolean
      utils?: boolean
      prefix?: string
      logs?: boolean
      themeRoot?: string
    }
  }
}
