const FENCE_RE = /(```[\s\S]*?```)/g
const INLINE_CODE_RE = /(`[^`]*`)/g

const CLAUSE_SEMICOLON_RE =
  /(?<=[a-zA-Z.,!?)\]"'’‘])\s*;\s+(?=[a-zA-Z0-9"'‘’(])/g

export function mapMarkdownProse(
  markdown: string,
  fn: (prose: string) => string
): string {
  return markdown
    .split(FENCE_RE)
    .map((chunk) =>
      chunk.startsWith('```') ? chunk : mapInlineProseChunks(chunk, fn)
    )
    .join('')
}

function mapInlineProseChunks(chunk: string, fn: (prose: string) => string) {
  return chunk
    .split(INLINE_CODE_RE)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('')
}

export function stripEmDashesInProseText(text: string): string {
  let t = text.replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, '$1-$2')
  t = t.replace(/\s*[\u2013\u2014]\s*/g, ', ')
  t = t.replace(/[\u2013\u2014]/g, ', ')
  return t
}

function relaxClauseSemicolonsInProseText(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      if (/:\/\//.test(line)) return line
      return line.replace(CLAUSE_SEMICOLON_RE, '. ')
    })
    .join('\n')
}

export function stripEmDashesOutsideCodeFences(markdown: string): string {
  return mapMarkdownProse(markdown, stripEmDashesInProseText)
}

export function normalizeGeneratedBlogMarkdown(markdown: string): string {
  return mapMarkdownProse(markdown, (prose) =>
    stripEmDashesInProseText(relaxClauseSemicolonsInProseText(prose))
  )
}
