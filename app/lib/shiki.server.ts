import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'html',
  'css',
  'json',
  'markdown',
  'bash',
  'shell',
  'python',
  'go',
  'rust',
  'sql',
  'yaml',
  'text',
] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['min-dark', 'catppuccin-latte'],
      langs: [...SUPPORTED_LANGUAGES],
    })
  }
  return highlighter
}

function normalizeLanguage(lang: string | undefined): SupportedLanguage {
  if (!lang) return 'text'

  const normalized = lang.toLowerCase()

  // Map common aliases
  const aliases: Record<string, SupportedLanguage> = {
    js: 'javascript',
    ts: 'typescript',
    sh: 'bash',
    zsh: 'bash',
    fish: 'bash',
    yml: 'yaml',
    md: 'markdown',
  }

  if (aliases[normalized]) {
    return aliases[normalized]
  }

  if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage
  }

  return 'text'
}

export async function highlightCode(
  code: string,
  language?: string
): Promise<string> {
  const hl = await getHighlighter()
  const lang = normalizeLanguage(language)

  return hl.codeToHtml(code, {
    lang,
    themes: {
      light: 'catppuccin-latte',
      dark: 'min-dark',
    },
  })
}
