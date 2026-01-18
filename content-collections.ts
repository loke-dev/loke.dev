import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { rehypePrettyCode } from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

const posts = defineCollection({
  name: 'posts',
  directory: 'app/posts',
  include: '*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    lastModified: z.string().optional(),
    tag: z.string(),
    published: z.boolean(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: {
              dark: 'min-dark',
              light: 'catppuccin-latte',
            },
            keepBackground: true,
          },
        ],
      ],
    })

    const wordsPerMinute = 200
    const wordCount = document.content
      ? document.content.split(/\s+/).length
      : 0
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    return {
      ...document,
      body,
      readingTime,
      wordCount,
    }
  },
})

export default defineConfig({
  collections: [posts],
  concurrency: 5,
})
