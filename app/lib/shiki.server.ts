import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null

// Simple in-memory cache for highlighted snippets
// Keyed by `${lang}::${hash(code)}`
const highlightCache = new Map<string, string>()
const MAX_CACHE_ENTRIES = 500

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

  const key = `${lang}::${simpleHash(code)}`
  const cached = highlightCache.get(key)
  if (cached) return cached

  const html = hl.codeToHtml(code, {
    lang,
    themes: {
      light: 'catppuccin-latte',
      dark: 'min-dark',
    },
  })

  // Simple LRU-ish behavior: if over capacity, delete oldest
  if (highlightCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = highlightCache.keys().next().value
    if (firstKey) highlightCache.delete(firstKey)
  }
  highlightCache.set(key, html)
  return html
}

function simpleHash(input: string): number {
  // djb2
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return hash >>> 0
}

// Optional: allow preloading at server start to avoid first-request cost
export async function preloadHighlighter() {
  await getHighlighter()
}
