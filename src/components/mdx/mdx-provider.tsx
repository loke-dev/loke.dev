import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/lib/mdx-components'
import { Callout } from '@/components/mdx/callout'
import { CodeBlock } from '@/components/mdx/code-block'
import rehypePrettyCode from 'rehype-pretty-code'

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
          remarkPlugins: [],
          rehypePlugins: [[rehypePrettyCode, { theme: 'nord', keepBackground: false }]],
        },
      }}
    />
  )
}
