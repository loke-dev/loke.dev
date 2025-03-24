import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/lib/mdx-components'
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
        // Explicitly provide custom components at the top level
        Callout,
        CodeBlock,
      }}
      options={{
        parseFrontmatter: false,
      }}
    />
  )
}
