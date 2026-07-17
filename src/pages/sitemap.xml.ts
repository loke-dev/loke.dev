import type { APIRoute } from 'astro'
import { CACHE_CONTROL } from '@/utils/cache-control'
import { SITE_DOMAIN } from '@/utils/meta'
import {
  getAllAuthors,
  getAllPublishedPosts,
  getAllTopics,
  getBlogTotalPages,
} from '@/utils/sanity.queries'

export const prerender = false

export const GET: APIRoute = async () => {
  const [posts, totalPages, topics, authors] = await Promise.all([
    getAllPublishedPosts(),
    getBlogTotalPages(),
    getAllTopics(),
    getAllAuthors(),
  ])

  const staticUrls = [
    '/',
    '/blog',
    '/changelog',
    '/about',
    '/projects',
    '/contact',
  ]
  const blogPageUrls =
    totalPages > 1
      ? Array.from(
          { length: totalPages - 1 },
          (_, index) => `/blog/page/${index + 2}`
        )
      : []
  const staticUrlEntries = [...staticUrls, ...blogPageUrls].map(
    (url) => `  <url><loc>${SITE_DOMAIN}${url}</loc></url>`
  )
  const postUrlEntries = posts.map((post) => {
    const lastModified = post.lastModified ?? post._updatedAt ?? post.date
    return `  <url><loc>${SITE_DOMAIN}/blog/${post.slug.current}</loc><lastmod>${lastModified}</lastmod></url>`
  })
  const topicUrlEntries = topics.map(
    (topic) =>
      `  <url><loc>${SITE_DOMAIN}/topics/${topic.slug.current}</loc></url>`
  )
  const authorUrlEntries = authors.map(
    (author) =>
      `  <url><loc>${SITE_DOMAIN}/authors/${author.slug.current}</loc></url>`
  )

  const urlset = [
    ...staticUrlEntries,
    ...postUrlEntries,
    ...topicUrlEntries,
    ...authorUrlEntries,
  ].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': CACHE_CONTROL.xmlFeed,
    },
  })
}
