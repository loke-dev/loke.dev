import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/posts')

export interface PostMetadata {
  title: string
  slug: string
  date?: string
  excerpt?: string
}

export async function getPostSlugs(): Promise<string[]> {
  const files = await readdir(postsDirectory)
  return files.filter((file) => file.endsWith('.mdx'))
}

export async function getPostBySlug(slug: string): Promise<PostMetadata> {
  const realSlug = slug.replace(/\.mdx$/, '')
  const filePath = path.join(postsDirectory, `${realSlug}.mdx`)
  const fileContents = await readFile(filePath, 'utf8')
  const { data } = matter(fileContents)

  return {
    slug: realSlug,
    title: data.title || realSlug,
    date: data.date || null,
    excerpt: data.excerpt || null,
  }
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  return posts.sort((post1, post2) => {
    if (!post1.date || !post2.date) return 0
    return new Date(post2.date).getTime() - new Date(post1.date).getTime()
  })
}
