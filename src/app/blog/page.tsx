import { getAllPosts } from '@/lib/mdx'
import { BlogClient } from './blog-client'

export default async function BlogPage() {
  const posts = await getAllPosts()
  return <BlogClient posts={posts} />
}
