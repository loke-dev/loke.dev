import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { rehypePrettyCode } from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

const posts = defineCollection({
  name: 'posts',
  directory: 'app/posts',
  include: '*.mdx',
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tag: z.string(),
    published: z.boolean(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrettyCode],
    })
    return {
      ...document,
      body,
    }
  },
})

export default defineConfig({
  collections: [posts],
})
