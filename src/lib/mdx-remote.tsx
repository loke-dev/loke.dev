import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from './mdx-components'
import { transformerNotationDiff } from '@shikijs/transformers'
import rehypePrettyCode from 'rehype-pretty-code'

export const MdxRemote = ({ content }: { content: string }) => {
  return (
    <MDXRemote
      source={content}
      components={{
        ...mdxComponents,
      }}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: 'nord',
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
