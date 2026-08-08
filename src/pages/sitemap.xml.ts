import type { APIRoute } from 'astro'
import { CACHE_CONTROL } from '@/utils/cache-control'
import { latestIsoDate, toIsoDate } from '@/utils/date'
import { SITE_DOMAIN } from '@/utils/meta'
import {
  getAboutPage,
  getAllAuthors,
  getAllProjects,
  getAllPublishedPosts,
  getAllTopics,
  getBlogPage,
  getBlogTotalPages,
  getContactPage,
  getHomePage,
  getNowPage,
  getProjectsPage,
} from '@/utils/sanity.queries'
import { escapeXml } from '@/utils/xml'
import { toolPages } from '@/data/tool-pages'
import { freshClient } from '@/lib/sanity/client'

export const prerender = false

function latestDate(values: Array<string | undefined>): string | undefined {
  return latestIsoDate(values)
}

export const GET: APIRoute = async () => {
  const queryResults = await Promise.all([
    getAllPublishedPosts(freshClient),
    getAllProjects(freshClient),
    getBlogPage(freshClient),
    getProjectsPage(freshClient),
    getBlogTotalPages(freshClient),
    getAllTopics(freshClient),
    getAllAuthors(freshClient),
    getHomePage(freshClient),
    getNowPage(freshClient),
    getAboutPage(freshClient),
    getContactPage(freshClient),
  ]).catch(() => null)

  if (!queryResults) {
    return new Response('Sitemap temporarily unavailable.\n', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }

  const [
    posts,
    projects,
    blogPage,
    projectsPage,
    totalPages,
    topics,
    authors,
    homePage,
    nowPage,
    aboutPage,
    contactPage,
  ] = queryResults

  const staticUrls = [
    '/',
    '/blog',
    '/guides',
    '/topics',
    '/changelog',
    '/about',
    '/brand',
    '/now',
    '/services',
    '/tools',
    ...toolPages.map(({ href }) => href),
    '/apps/flexithyme/privacy',
    '/apps/flexithyme/support',
    '/affiliate-disclosure',
    '/privacy',
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
  const latestPostUpdate = latestDate([
    blogPage._updatedAt,
    ...posts.flatMap((post) => [post.lastModified, post._updatedAt, post.date]),
  ])
  const latestProjectUpdate = latestDate([
    projectsPage._updatedAt,
    ...projects.map((project) => project._updatedAt),
  ])
  const pageLastModified: Record<string, string | undefined> = {
    '/': homePage?._updatedAt,
    '/blog': latestPostUpdate,
    '/guides': latestPostUpdate,
    '/topics': latestDate(topics.map((topic) => topic._updatedAt)),
    '/now': nowPage?._updatedAt,
    '/about': aboutPage?._updatedAt,
    '/projects': latestProjectUpdate,
    '/contact': contactPage?._updatedAt,
  }
  const staticUrlEntries = [...staticUrls, ...blogPageUrls].map((url) => {
    const lastModified =
      pageLastModified[url] ??
      (url.startsWith('/blog/page/') ? latestPostUpdate : undefined)
    const normalizedLastModified = toIsoDate(lastModified)
    return `  <url><loc>${escapeXml(`${SITE_DOMAIN}${url}`)}</loc>${normalizedLastModified ? `<lastmod>${normalizedLastModified}</lastmod>` : ''}</url>`
  })
  const postUrlEntries = posts.map((post) => {
    const lastModified = latestDate([
      post.lastModified,
      post._updatedAt,
      post.date,
    ])
    return `  <url><loc>${escapeXml(`${SITE_DOMAIN}/blog/${post.slug.current}`)}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}</url>`
  })
  const topicUrlEntries = topics.map((topic) => {
    const relatedPostDates = posts
      .filter((post) =>
        post.topics.some(
          (postTopic) => postTopic.slug.current === topic.slug.current
        )
      )
      .flatMap((post) => [post.lastModified, post._updatedAt, post.date])
    const lastModified = latestDate([topic._updatedAt, ...relatedPostDates])
    return `  <url><loc>${escapeXml(`${SITE_DOMAIN}/topics/${topic.slug.current}`)}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}</url>`
  })
  const authorUrlEntries = authors.map((author) => {
    const relatedPostDates = posts
      .filter((post) => post.author?.slug.current === author.slug.current)
      .flatMap((post) => [post.lastModified, post._updatedAt, post.date])
    const lastModified = latestDate([author._updatedAt, ...relatedPostDates])
    return `  <url><loc>${escapeXml(`${SITE_DOMAIN}/authors/${author.slug.current}`)}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}</url>`
  })

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
