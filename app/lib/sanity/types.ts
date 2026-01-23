import type { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

// Base post type for list views (no body content)
export interface PostListItem {
  _id: string
  title: string
  slug: { current: string }
  description: string
  date: string
  lastModified?: string
  tag: string
  image?: SanityImage
  imageAlt?: string
  // Optional: only available when calculated from body
  readingTime?: number
}

// Full post type with body content (for detail pages)
export interface Post extends PostListItem {
  body: PortableTextBlock[]
  readingTime?: number
  wordCount?: number
}

export type PostSlug = { slug: { current: string } }

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  description: string
  technologies: string[]
  image?: SanityImage
  url?: string
  github?: string
  featured: boolean
  year: number
  order?: number
}

export type ProjectSlug = { slug: { current: string } }
