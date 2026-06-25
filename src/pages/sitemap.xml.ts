import type { APIRoute } from 'astro'
import { CACHE_CONTROL } from '@/utils/cache-control'
import { SITE_DOMAIN } from '@/utils/meta'
import { getAllPublishedPosts, getBlogTotalPages } from '@/utils/sanity.queries'

export const prerender = true

export const GET: APIRoute = async () => {
  const posts = await getAllPublishedPosts()
  const totalPages = await getBlogTotalPages()

  const staticUrls = [
    '/',
    '/blog',
    '/changelog',
    '/about',
    '/projects',
    '/search',
    '/contact',
  ]
  const blogPageUrls =
    totalPages > 1
      ? Array.from(
          { length: totalPages - 1 },
          (_, index) => `/blog/page/${index + 2}`
        )
      : []
  const postUrls = posts.map((p) => `/blog/${p.slug.current}`)

  const allUrls = [...staticUrls, ...blogPageUrls, ...postUrls]

  const urlset = allUrls
    .map((url) => `  <url><loc>${SITE_DOMAIN}${url}</loc></url>`)
    .join('\n')

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
