import { createHighlighter, makeSingletonHighlighter } from 'shiki'
import { bundledLanguages } from 'shiki/bundle/web'
import { selectedThemes, SHIKI_THEMES } from './shiki-themes'

const getHighlighter = makeSingletonHighlighter(createHighlighter)

export const codeToHtml = async ({
  code,
  language,
}: {
  code: string
  language: string
}) => {
  const highlighter = await getHighlighter({
    themes: SHIKI_THEMES,
    langs: [...Object.keys(bundledLanguages)],
  })

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: selectedThemes,
  })
}
