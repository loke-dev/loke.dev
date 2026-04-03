import type { APIRoute } from 'astro'
import { CACHE_CONTROL } from '@/utils/cache-control'
import {
  AUTHOR_NAME,
  SITE_CONTACT_EMAIL,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_RSS_DESCRIPTION,
} from '@/utils/meta'
import { getAllPublishedPosts } from '@/utils/sanity.queries'
import { getSanityImageUrl } from '@/lib/sanity/helpers'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const GET: APIRoute = async () => {
  const allPosts = await getAllPublishedPosts()
  const posts = allPosts.slice(0, 20)

  const items = posts
    .map((post) => {
      const postUrl = `${SITE_DOMAIN}/blog/${post.slug.current}`
      const pubDate = new Date(post.date).toUTCString()
      const imageUrl = getSanityImageUrl(post.image, 1200)
      const safePostUrl = escapeXml(postUrl)
      const safeImageUrl = imageUrl ? escapeXml(imageUrl) : ''
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description ?? '')}</description>
      <link>${safePostUrl}</link>
      <guid isPermaLink="true">${safePostUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(`${SITE_CONTACT_EMAIL} (${AUTHOR_NAME})`)}</author>
      ${safeImageUrl ? `<enclosure url="${safeImageUrl}" type="image/jpeg" length="0" />` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <description>${escapeXml(SITE_RSS_DESCRIPTION)}</description>
    <link>${escapeXml(SITE_DOMAIN)}</link>
    <language>en-us</language>
    <ttl>60</ttl>
    <atom:link href="${escapeXml(`${SITE_DOMAIN}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': CACHE_CONTROL.xmlFeed,
    },
  })
}
