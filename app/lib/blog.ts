import { promises as fs } from 'fs'
import path from 'path'
import { type LoaderFunctionArgs } from '@remix-run/node'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  content: string
  frontmatter: {
    title: string
    description: string
    date: string
    published: boolean
    [key: string]: unknown
  }
}

const BLOG_PATH = path.join(process.cwd(), 'app', 'posts')

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(BLOG_PATH)
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'))

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, '')
        const filePath = path.join(BLOG_PATH, file)
        const source = await fs.readFile(filePath, 'utf8')

        const { data: frontmatter, content } = matter(source)

        return {
          slug,
          content: await marked.parse(content),
          frontmatter: frontmatter as BlogPost['frontmatter'],
          title: frontmatter.title as string,
          description: frontmatter.description as string,
          date: frontmatter.date as string,
        }
      })
    )

    return posts
      .filter((post) => post.frontmatter.published !== false)
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
    const htmlContent = await marked.parse(content)

    return {
      slug,
      content: htmlContent,
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
