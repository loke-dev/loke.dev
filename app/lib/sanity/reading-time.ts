type PortableTextBlock = {
  _type?: string
  children?: Array<{ text?: string }>
  content?: unknown[]
}

export function calculateReadingTime(body: unknown[]): {
  readingTime: number
  wordCount: number
} {
  const wordsPerMinute = 200
  let wordCount = 0

  function countWordsInBlocks(blocks: unknown[]): void {
    blocks.forEach((block) => {
      const typedBlock = block as PortableTextBlock
      if (typedBlock._type === 'block' && typedBlock.children) {
        typedBlock.children.forEach((child) => {
          if (child.text) {
            wordCount += child.text.split(/\s+/).length
          }
        })
      } else if (typedBlock._type === 'callout' && typedBlock.content) {
        countWordsInBlocks(typedBlock.content)
      }
    })
  }

  countWordsInBlocks(body)
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return { readingTime, wordCount }
}
