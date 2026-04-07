import { generateKey } from './gemini'

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
  const parts = text.split(/(\s*\*\*.*?\*\*|__.*?__|`.*?`|\s*\[.*?\]\(.*?\))/g)
  const children: PortableTextSpan[] = []
  const markDefs: unknown[] = []

  for (const part of parts) {
    if (!part) continue

    const linkMatch = part.match(/^\s*\[(.*?)\]\((.*?)\)\s*$/)
    if (linkMatch) {
      const linkKey = generateKey()
      const href = linkMatch[2]
      const blank = /^https?:\/\//i.test(href)
      markDefs.push({
        _type: 'link',
        _key: linkKey,
        href,
        ...(blank ? { blank: true } : {}),
      })
      children.push({
        _key: generateKey(),
        _type: 'span',
        text: linkMatch[1],
        marks: [linkKey],
      })
      continue
    }

    const trimmed = part.replace(/^\s+/, '')
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      children.push({
        _key: generateKey(),
        _type: 'span',
        text: trimmed.slice(2, -2),
        marks: ['strong'],
      })
    } else if (trimmed.startsWith('__') && trimmed.endsWith('__')) {
      children.push({
        _key: generateKey(),
        _type: 'span',
        text: trimmed.slice(2, -2),
        marks: ['strong'],
      })
    } else if (
      trimmed.startsWith('`') &&
      trimmed.endsWith('`') &&
      trimmed.length > 2
    ) {
      children.push({
        _key: generateKey(),
        _type: 'span',
        text: trimmed.slice(1, -1),
        marks: ['code'],
      })
    } else {
      children.push({
        _key: generateKey(),
        _type: 'span',
        text: part,
        marks: [],
      })
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
    const text = currentParagraph.join('\n').trim()
    if (text) blocks.push(createTextBlock(text, 'normal'))
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
