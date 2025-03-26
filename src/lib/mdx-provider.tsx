import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/lib/mdx-components'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { transformerNotationDiff } from '@shikijs/transformers'
import { Callout } from '@/components/mdx/callout'
import { CodeBlock } from '@/components/mdx/code-block'

interface MDXProviderProps {
  content: string
}

export async function MDXProvider({ content }: MDXProviderProps) {
  return (
    <MDXRemote
      source={content}
      components={{
        ...mdxComponents,
        Callout,
        CodeBlock,
      }}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: 'github-dark',
                keepBackground: false,
                transformers: [transformerNotationDiff()],
              },
            ],
          ],
        },
      }}
    />
  )
}
