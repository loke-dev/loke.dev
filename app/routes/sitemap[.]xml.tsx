import { getAllPublishedPosts } from '@/utils/sanity.queries'
import { getPostImageUrl } from '@/lib/sanity/helpers'

const DOMAIN = 'https://loke.dev'

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const loader = async () => {
  const posts = await getAllPublishedPosts()

  const blogUrls = posts
    .map((post) => {
      const imageUrl = getPostImageUrl(post, 1200)
      const imageTag = imageUrl
        ? `
      <image:image>
        <image:loc>${escapeXml(imageUrl)}</image:loc>
        <image:title>${escapeXml(post.title)}</image:title>
      </image:image>`
        : ''

      return `
    <url>
      <loc>${DOMAIN}/blog/${post.slug.current}</loc>
      <lastmod>${new Date(post.lastModified || post.date).toISOString()}</lastmod>${imageTag}
    </url>`
    })
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
      <loc>${DOMAIN}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <url>
      <loc>${DOMAIN}/blog</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <url>
      <loc>${DOMAIN}/about</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <url>
      <loc>${DOMAIN}/projects</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <url>
      <loc>${DOMAIN}/contact</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>${blogUrls}
  </urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
