import bash from '@shikijs/langs/bash'
import css from '@shikijs/langs/css'
import go from '@shikijs/langs/go'
import html from '@shikijs/langs/html'
import javascript from '@shikijs/langs/javascript'
import json from '@shikijs/langs/json'
import jsx from '@shikijs/langs/jsx'
import markdown from '@shikijs/langs/markdown'
import python from '@shikijs/langs/python'
import rust from '@shikijs/langs/rust'
import shell from '@shikijs/langs/shell'
import sql from '@shikijs/langs/sql'
import tsx from '@shikijs/langs/tsx'
import typescript from '@shikijs/langs/typescript'
import yaml from '@shikijs/langs/yaml'
import catppuccinLatte from '@shikijs/themes/catppuccin-latte'
import minDark from '@shikijs/themes/min-dark'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let highlighter: HighlighterCore | null = null

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
] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number] | 'text'

async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighter) {
    highlighter = await createHighlighterCore({
      themes: [minDark, catppuccinLatte],
      langs: [
        javascript,
        typescript,
        jsx,
        tsx,
        html,
        css,
        json,
        markdown,
        bash,
        shell,
        python,
        go,
        rust,
        sql,
        yaml,
      ],
      engine: createJavaScriptRegexEngine(),
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

  if (
    SUPPORTED_LANGUAGES.includes(
      normalized as (typeof SUPPORTED_LANGUAGES)[number]
    )
  ) {
    return normalized as (typeof SUPPORTED_LANGUAGES)[number]
  }

  return 'text'
}

export async function highlightCode(
  code: string,
  language?: string
): Promise<string> {
  const lang = normalizeLanguage(language)

  const key = `${lang}::${simpleHash(code)}`
  const cached = highlightCache.get(key)
  if (cached) return cached

  const html =
    lang === 'text'
      ? renderPlainTextCode(code)
      : (await getHighlighter()).codeToHtml(code, {
          lang,
          themes: {
            light: 'catppuccin-latte',
            dark: 'min-dark',
          },
        })

  if (highlightCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = highlightCache.keys().next().value
    if (firstKey) highlightCache.delete(firstKey)
  }
  highlightCache.set(key, html)
  return html
}

function renderPlainTextCode(code: string): string {
  const escapedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

  return `<pre class="shiki" style="background-color:#1e1e1e;color:#d4d4d4"><code>${escapedCode}</code></pre>`
}

function simpleHash(input: string): number {
  // djb2
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return hash >>> 0
}

export async function preloadHighlighter() {
  await getHighlighter()
}
