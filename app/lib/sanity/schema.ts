import { AUTHOR_NAME, DEFAULT_IMAGE, SITE_DOMAIN } from '@/utils/meta'
import { getPostImageUrl } from './helpers'
import type { Post } from './types'

export function createArticleSchema(post: Post) {
  const imageUrl = getPostImageUrl(post, 1200, 630) || DEFAULT_IMAGE

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
    keywords: post.tag,
    wordCount: post.wordCount || 0,
    timeRequired: `PT${post.readingTime || 0}M`,
  }
}

export function createBreadcrumbSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_DOMAIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_DOMAIN}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_DOMAIN}/blog/${post.slug.current}`,
      },
    ],
  }
}
