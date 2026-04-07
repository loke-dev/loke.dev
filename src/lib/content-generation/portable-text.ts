import { generateKey } from './gemini'
import {
  normalizeExternalHref,
  segmentPlainTextWithLinks,
} from './markdown-link-utils'

type PortableTextSpan = {
  _key: string
  _type: 'span'
  text: string
  marks: string[]
}

type PortableTextBlock = {
  _key: string
  _type: 'block' | 'code'
  style?: string
  children?: PortableTextSpan[]
  markDefs?: unknown[]
  language?: string
  code?: string
}

const INLINE_TOKEN_RE = /(\*\*[\s\S]*?\*\*|__[\s\S]*?__|`[^`]*`)/g

function createTextBlock(text: string, style: string): PortableTextBlock {
  const { children, markDefs } = parseInlineFormatting(text)
  return {
    _key: generateKey(),
    _type: 'block',
    style,
    children,
    markDefs,
  }
}

function parseInlineFormatting(text: string): {
  children: PortableTextSpan[]
  markDefs: unknown[]
} {
  const children: PortableTextSpan[] = []
  const markDefs: unknown[] = []

  const pushLeadingWhitespace = (raw: string) => {
    const leadingWs = raw.match(/^(\s+)/)
    if (leadingWs && raw.length > leadingWs[1].length) {
      children.push({
        _key: generateKey(),
        _type: 'span',
        text: leadingWs[1],
        marks: [],
      })
      return raw.slice(leadingWs[1].length)
    }
    return raw
  }

  const emitTextRemainder = (remainder: string, extraMarks: string[]) => {
    if (!remainder) return
    children.push({
      _key: generateKey(),
      _type: 'span',
      text: remainder,
      marks: extraMarks,
    })
  }

  const emitPlain = (plain: string, extraMarks: string[]) => {
    for (const piece of segmentPlainTextWithLinks(plain)) {
      if (piece.kind === 'text') {
        const remainder = pushLeadingWhitespace(piece.text)
        emitTextRemainder(remainder, extraMarks)
      } else {
        const linkKey = generateKey()
        const href = normalizeExternalHref(piece.rawUrl)
        const blank = /^https?:\/\//i.test(href)
        markDefs.push({
          _type: 'link',
          _key: linkKey,
          href,
          ...(blank ? { blank: true } : {}),
        })
        let labelRest = pushLeadingWhitespace(piece.label)
        if (!labelRest) labelRest = href
        emitTextRemainder(labelRest, [...extraMarks, linkKey])
      }
    }
  }

  for (const part of text.split(INLINE_TOKEN_RE)) {
    if (!part) continue
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      emitPlain(part.slice(2, -2), ['strong'])
    } else if (
      part.startsWith('__') &&
      part.endsWith('__') &&
      part.length > 4
    ) {
      emitPlain(part.slice(2, -2), ['strong'])
    } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const inner = part.slice(1, -1)
      const remainder = pushLeadingWhitespace(inner)
      emitTextRemainder(remainder, ['code'])
    } else {
      emitPlain(part, [])
    }
  }

  return {
    children:
      children.length > 0
        ? children
        : [{ _key: generateKey(), _type: 'span', text, marks: [] }],
    markDefs,
  }
}

export function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []
  const lines = markdown.split('\n')
  let currentParagraph: string[] = []
  let inCodeBlock = false
  let codeContent: string[] = []
  let codeLang = ''

  const flushParagraph = () => {
    if (currentParagraph.length === 0) return
    const paraText = currentParagraph.join('\n').trim()
    if (paraText) blocks.push(createTextBlock(paraText, 'normal'))
    currentParagraph = []
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph()
        inCodeBlock = true
        codeLang = line.slice(3).trim() || 'javascript'
        codeContent = []
      } else {
        blocks.push({
          _key: generateKey(),
          _type: 'code',
          language: codeLang,
          code: codeContent.join('\n'),
        })
        inCodeBlock = false
        codeContent = []
        codeLang = ''
      }
      continue
    }

    if (inCodeBlock) {
      codeContent.push(line)
      continue
    }

    if (line.startsWith('#### ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.slice(5), 'h4'))
    } else if (line.startsWith('### ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.slice(4), 'h3'))
    } else if (line.startsWith('## ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.slice(3), 'h2'))
    } else if (line.startsWith('# ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.slice(2), 'h1'))
    } else if (line.startsWith('> ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.slice(2), 'blockquote'))
    } else if (line.trim() === '') {
      flushParagraph()
    } else {
      currentParagraph.push(line)
    }
  }

  flushParagraph()
  return blocks
}
