import { createHighlighter, makeSingletonHighlighter } from 'shiki'
import { bundledLanguages } from 'shiki/bundle/web'

const getHighlighter = makeSingletonHighlighter(createHighlighter)

export const codeToHtml = async ({ code, language }: { code: string; language: string }) => {
  const highlighter = await getHighlighter({
    themes: ['nord'],
    langs: [...Object.keys(bundledLanguages)],
  })

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: {
      dark: 'nord',
      light: 'nord',
    },
  })
}
