import { client } from '@/utils/sanity.client'

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  description: string
  date: string
  lastModified?: string
  tag: string
  published: boolean
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  imageAlt?: string
  body: unknown[]
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && published == true] | order(date desc) {
      _id,
      title,
      slug,
      description,
      date,
      lastModified,
      tag,
      published,
      image,
      imageAlt,
      body
    }`
  )
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      date,
      lastModified,
      tag,
      published,
      image,
      imageAlt,
      body
    }`,
    { slug }
  )
}

export async function getAllPostSlugs(): Promise<
  { slug: { current: string } }[]
> {
  return client.fetch(
    `*[_type == "post" && published == true] {
      slug
    }`
  )
}
