import type { Post } from '@/lib/sanity/types'
import { highlightCode } from '@/lib/shiki.server'

type PostBody = Post['body']

interface CodeBlock {
  _type: 'code'
  _key: string
  code: string
  language?: string
  filename?: string
}

function isCodeBlock(block: unknown): block is CodeBlock {
  return (
    typeof block === 'object' &&
    block !== null &&
    '_type' in block &&
    block._type === 'code' &&
    'code' in block
  )
}

export async function processBodyWithHighlighting(
  body: PostBody
): Promise<PostBody> {
  const processedBlocks = await Promise.all(
    body.map(async (block) => {
      if (isCodeBlock(block)) {
        const highlightedHtml = await highlightCode(block.code, block.language)
        return {
          ...block,
          highlightedHtml,
        }
      }
      return block
    })
  )

  return processedBlocks as PostBody
}
