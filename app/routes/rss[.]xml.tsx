import { allPosts } from 'content-collections'

const DOMAIN = 'https://loke.dev'
const SITE_TITLE = 'Loke.dev'
const SITE_DESCRIPTION =
  'Articles, guides, and thoughts on web development and technology'
const AUTHOR_NAME = 'Loke Carlsson'
const AUTHOR_EMAIL = 'hello@loke.dev'

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const loader = async () => {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)

  const items = posts
    .map((post) => {
      const postUrl = `${DOMAIN}/blog/${post._meta.path}`
      const pubDate = new Date(post.date).toUTCString()

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.description)}</description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
      ${post.image ? `<enclosure url="${DOMAIN}${post.image}" type="image/png" />` : ''}
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(SITE_TITLE)}</title>
      <description>${escapeXml(SITE_DESCRIPTION)}</description>
      <link>${DOMAIN}</link>
      <language>en-us</language>
      <ttl>60</ttl>
      <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml" />
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
    </channel>
  </rss>`

  return new Response(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
