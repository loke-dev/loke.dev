import type { PortableTextBlock } from '@portabletext/types'

export interface PostSource {
  _key?: string
  title: string
  url: string
  publisher?: string
}

export interface Topic {
  _id: string
  _updatedAt?: string
  title: string
  slug: { current: string }
  description: string
}

export interface Author {
  _id: string
  _updatedAt?: string
  name: string
  slug: { current: string }
  role?: string
  bio?: string
  image?: SanityImage
  sameAs?: string[]
}

export interface PostReproduction {
  repository?: string
  ref?: string
  setupCommand?: string
  verificationCommand?: string
}

export interface VersionScope {
  testedAt?: string
  environment?: string
  versions?: Array<{ _key?: string; technology: string; version: string }>
}

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
  _createdAt: string
  title: string
  slug: { current: string }
  description: string
  date: string
  lastModified?: string
  _updatedAt?: string
  author?: Author
  topics: Topic[]
  image?: SanityImage
  imageAlt?: string
  readingTime?: number
}

export interface Post extends PostListItem {
  body: PortableTextBlock[]
  readingTime?: number
  wordCount?: number
  sources?: PostSource[]
  reproduction?: PostReproduction
  versionScope?: VersionScope
}

export interface Project {
  _id: string
  _updatedAt?: string
  title: string
  slug: { current: string }
  description: string
  technologies: string[]
  image?: SanityImage
  imageAlt?: string
  url?: string
  github?: string
  featured: boolean
  kind?: 'project' | 'template'
  year: number
  order?: number
}

export type ProjectSlug = { slug: { current: string } }

// Page singleton types
export interface HomePage {
  _updatedAt?: string
  heroDescription: string
  focusAreas?: Array<{
    _key?: string
    title: string
    description: string
  }>
  technologiesSectionTitle: string
  technologies: string[]
  blogSectionTitle: string
  blogSectionDescription: string
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
}

export interface NowPage {
  _updatedAt?: string
  period: string
  title: string
  intro: string
  items: Array<{ _key?: string; label: string; copy: string }>
  note: string
  ctaText: string
}

export interface AboutPageSection {
  _key: string
  title: string
  content: PortableTextBlock[]
}

export interface AboutPage {
  _updatedAt?: string
  title: string
  intro: string
  sections?: AboutPageSection[]
}

export interface BlogPage {
  _updatedAt?: string
  title: string
  description: string
  emptyStateTitle?: string
  emptyStateDescription?: string
}

export interface ProjectsPage {
  _updatedAt?: string
  title: string
  description: string
  featuredSectionTitle: string
  otherSectionTitle: string
  templatesSectionTitle?: string
}

export interface ContactPage {
  _updatedAt?: string
  title: string
  description: string
  alternativeContactTitle?: string
  alternativeContactDescription?: string
}
