import { getAllPublishedPosts } from '@/utils/sanity.queries'
import { getPostImageUrl } from '@/lib/sanity/helpers'

const DOMAIN = 'https://loke.dev'
const NOW = new Date().toISOString()

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlEntry({
  loc,
  lastmod,
  priority,
  changefreq,
  imageBlock = '',
}: {
  loc: string
  lastmod: string
  priority: string
  changefreq: string
  imageBlock?: string
}) {
  return `
    <url>
      <loc>${loc}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>${imageBlock}
    </url>`
}

export const loader = async () => {
  const posts = await getAllPublishedPosts()

  const blogUrls = posts
    .map((post) => {
      const imageUrl = getPostImageUrl(post, 1200)
      const imageBlock = imageUrl
        ? `
      <image:image>
        <image:loc>${escapeXml(imageUrl)}</image:loc>
        <image:title>${escapeXml(post.title)}</image:title>
      </image:image>`
        : ''
      return urlEntry({
        loc: `${DOMAIN}/blog/${post.slug.current}`,
        lastmod: new Date(post.lastModified || post.date).toISOString(),
        priority: '0.8',
        changefreq: 'monthly',
        imageBlock,
      })
    })
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urlEntry({ loc: DOMAIN, lastmod: NOW, priority: '1.0', changefreq: 'weekly' })}
    ${urlEntry({ loc: `${DOMAIN}/blog`, lastmod: NOW, priority: '0.9', changefreq: 'daily' })}
    ${urlEntry({ loc: `${DOMAIN}/about`, lastmod: NOW, priority: '0.5', changefreq: 'yearly' })}
    ${urlEntry({ loc: `${DOMAIN}/projects`, lastmod: NOW, priority: '0.7', changefreq: 'monthly' })}
    ${urlEntry({ loc: `${DOMAIN}/contact`, lastmod: NOW, priority: '0.5', changefreq: 'yearly' })}${blogUrls}
  </urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600',
    },
  })
}
