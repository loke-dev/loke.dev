import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import {
  bundledLanguages,
  createHighlighter,
  HighlighterCoreOptions,
} from 'shiki'
import { mdxComponents } from '@/lib/mdx-components'
import { Callout } from '@/components/mdx/callout'
import { CodeBlock } from '@/components/mdx/code-block'
import { selectedThemes, SHIKI_THEMES } from './shiki-themes'

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
                theme: selectedThemes,
                keepBackground: true,
                getHighlighter: (options: HighlighterCoreOptions) =>
                  createHighlighter({
                    ...options,
                    themes: SHIKI_THEMES,
                    langs: [...Object.keys(bundledLanguages)],
                  }),
              },
            ],
          ],
        },
      }}
    />
  )
}
