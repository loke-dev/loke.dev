import { promises as fs } from 'fs'
import path from 'path'
import { compile } from '@mdx-js/mdx'
import { type LoaderFunctionArgs } from '@remix-run/node'
import matter from 'gray-matter'
import { rehypePrettyCode } from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { BlogPost } from '@/types/blog'

const BLOG_PATH = path.join(process.cwd(), 'app', 'posts')

export interface BlogPostListing {
  slug: string
  title: string
  description: string
  date: string
  published: boolean
}

export async function getBlogPosts(): Promise<BlogPostListing[]> {
  try {
    const files = await fs.readdir(BLOG_PATH)
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'))

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, '')
        const filePath = path.join(BLOG_PATH, file)
        const source = await fs.readFile(filePath, 'utf8')
        const { data: frontmatter } = matter(source)

        return {
          slug,
          title: frontmatter.title as string,
          description: frontmatter.description as string,
          date: frontmatter.date as string,
          published: frontmatter.published !== false,
        }
      })
    )

    return posts
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error getting blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_PATH, `${slug}.mdx`)
    const source = await fs.readFile(filePath, 'utf8')

    const { data: frontmatter, content } = matter(source)

    const result = await compile(content, {
      outputFormat: 'function-body',
      jsxImportSource: 'react',
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
          },
        ],
      ],
    })

    const processedContent = String(result)

    return {
      slug,
      content: processedContent,
      frontmatter: frontmatter as BlogPost['frontmatter'],
      title: frontmatter.title as string,
      description: frontmatter.description as string,
      date: frontmatter.date as string,
    }
  } catch (error) {
    console.error(`Error getting blog post ${slug}:`, error)
    return null
  }
}

export function validateBlogSlug(params: LoaderFunctionArgs['params']) {
  if (!params.slug) {
    throw new Response('Not found', { status: 404 })
  }

  return params.slug
}

export function createMDXRoute(slug: string) {
  return `/blog/${slug}`
}
