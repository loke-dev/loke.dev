import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/posts')

export interface PostMetadata {
  title: string
  slug: string
  date?: string
  excerpt?: string
}

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'))
}

export function getPostBySlug(slug: string): PostMetadata {
  const realSlug = slug.replace(/\.mdx$/, '')
  const filePath = path.join(postsDirectory, `${realSlug}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(fileContents)

  return {
    slug: realSlug,
    title: data.title || realSlug,
    date: data.date || null,
    excerpt: data.excerpt || null,
  }
}

export function getAllPosts(): PostMetadata[] {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => {
      if (!post1.date || !post2.date) return 0
      return new Date(post2.date).getTime() - new Date(post1.date).getTime()
    })

  return posts
}
