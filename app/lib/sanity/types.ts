import type { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  description: string
  date: string
  lastModified?: string
  tag: string
  published: boolean
  image?: SanityImage
  imageAlt?: string
  body: PortableTextBlock[]
  readingTime?: number
  wordCount?: number
}

export type PostSlug = { slug: { current: string } }
