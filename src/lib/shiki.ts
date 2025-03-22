import { createHighlighter, codeToHtml } from 'shiki'

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

export async function getShikiHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: [
        'javascript',
        'typescript',
        'css',
        'html',
        'jsx',
        'tsx',
        'bash',
        'json',
      ],
    })
  }

  return highlighterPromise
}

export async function highlightCode(code: string, lang: string) {
  const highlighter = await getShikiHighlighter()

  const loadedLanguages = (await highlighter).getLoadedLanguages()
  const validLang = loadedLanguages.includes(
    lang as unknown as (typeof loadedLanguages)[number]
  )
    ? lang
    : 'text'

  const html = (await highlighter).codeToHtml(code, {
    lang: validLang,
    theme: 'github-dark',
    transformers: [
      {
        pre(node) {
          node.properties.style = `
          background-color: #0d1117;
          border-radius: 0.375rem;
          padding: 1rem;
          overflow-x: auto;
        `
          return node
        },
        code(node) {
          node.properties.style = `
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          tab-size: 2;
        `
          return node
        },
      },
    ],
  })

  return html
}

export async function directHighlight(code: string, lang: string) {
  return codeToHtml(code, {
    lang,
    theme: 'github-dark',
    transformers: [
      {
        pre(node) {
          node.properties.style = `
          background-color: #0d1117;
          border-radius: 0.375rem;
          padding: 1rem;
          overflow-x: auto;
        `
          return node
        },
        code(node) {
          node.properties.style = `
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          tab-size: 2;
        `
          return node
        },
      },
    ],
  })
}
