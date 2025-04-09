import { promises as fs } from 'fs'
import path from 'path'
import { compile, type CompileOptions } from '@mdx-js/mdx'
import { type LoaderFunctionArgs } from '@remix-run/node'
import matter from 'gray-matter'
import { LRUCache } from 'lru-cache'
import { rehypePrettyCode } from 'rehype-pretty-code'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { BlogPost } from '@/types/blog'

const BLOG_PATH = path.join(process.cwd(), 'app', 'posts')

const blogListingsCache = new LRUCache<
  string,
  { posts: BlogPostListing[]; timestamp: number }
>({
  max: 1,
  ttl: 1000 * 60 * 5, // Cache for 5 minutes
})

const MDX_COMPILE_OPTIONS: CompileOptions = {
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
} as const

async function compileMdx(source: string): Promise<string> {
  try {
    const result = await compile(source, MDX_COMPILE_OPTIONS)
    return String(result.value)
  } catch (error) {
    console.error('MDX Compilation Error:', error)
    throw new Error('Failed to compile MDX content')
  }
}

export interface BlogPostListing {
  slug: string
  title: string
  description: string
  date: string
  published: boolean
}

export async function getBlogPosts(): Promise<BlogPostListing[]> {
  try {
    const cached = blogListingsCache.get('listings')
    const stats = await fs.stat(BLOG_PATH)

    if (cached && cached.timestamp >= stats.mtimeMs) {
      return cached.posts
    }

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

    const sortedPosts = posts
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    blogListingsCache.set('listings', {
      posts: sortedPosts,
      timestamp: stats.mtimeMs,
    })

    return sortedPosts
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

    return {
      slug,
      content,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      published: frontmatter.published !== false,
      compiledContent: await compileMdx(content),
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
