import { allPosts } from 'content-collections'

const DOMAIN = 'https://loke.dev'

export const loader = async () => {
  const posts = allPosts.filter((post) => post.published)

  const blogUrls = posts
    .map((post) => {
      const imageTag = post.image
        ? `
      <image:image>
        <image:loc>${DOMAIN}${post.image}</image:loc>
        <image:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
      </image:image>`
        : ''

      return `
    <url>
      <loc>${DOMAIN}/blog/${post._meta.path}</loc>
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
