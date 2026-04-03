import { AUTHOR_NAME, SITE_DOMAIN } from '@/utils/meta'
import { getPostImageUrl } from './helpers'
import type { Post, Project } from './types'

export function createArticleSchema(post: Post, fallbackImageUrl: string) {
  const imageUrl = getPostImageUrl(post, 1200, 630) || fallbackImageUrl

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: imageUrl,
    datePublished: new Date(post.date).toISOString(),
    dateModified: post.lastModified
      ? new Date(post.lastModified).toISOString()
      : new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_DOMAIN,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_DOMAIN,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_DOMAIN}/blog/${post.slug.current}`,
    },
    keywords: post.tags.join(', '),
    wordCount: post.wordCount || 0,
    timeRequired: `PT${post.readingTime || 0}M`,
  }
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function createProjectSchema(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: project.url || `${SITE_DOMAIN}/projects`,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_DOMAIN,
    },
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
  }
}
