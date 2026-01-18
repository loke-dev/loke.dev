import { buildImageUrl } from '@/utils/image-helpers'

const SITE_NAME = 'Loke.dev'
const DEFAULT_SEPARATOR = ' - '
const SITE_DOMAIN = 'https://loke.dev'
const DEFAULT_IMAGE = `${SITE_DOMAIN}${buildImageUrl('/loke_clay.png', {
  width: 1200,
  height: 630,
  quality: 90,
  format: 'webp',
  fit: 'cover',
})}`
const TWITTER_HANDLE = '@loke_dev'
const AUTHOR_NAME = 'Loke'

type TitleOptions = {
  title?: string
  separator?: string
  includesSiteName?: boolean
}

type MetaTagsOptions = {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  keywords?: string
}

export function createTitle(options: TitleOptions = {}): string {
  const {
    title,
    separator = DEFAULT_SEPARATOR,
    includesSiteName = true,
  } = options

  if (!title) {
    return SITE_NAME
  }

  if (!includesSiteName) {
    return title
  }

  return `${title}${separator}${SITE_NAME}`
}

export function createMetaTags(options: MetaTagsOptions) {
  const {
    title,
    description,
    url = SITE_DOMAIN,
    image = DEFAULT_IMAGE,
    type = 'website',
    author = AUTHOR_NAME,
    publishedTime,
    keywords,
  } = options

  const fullTitle = createTitle({ title })
  const metaTags: Array<{
    title?: string
    name?: string
    property?: string
    content?: string
    tagName?: string
    rel?: string
    href?: string
  }> = [
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'author', content: author },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:site_name', content: SITE_NAME },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:creator', content: TWITTER_HANDLE },
  ]

  if (keywords) {
    metaTags.push({ name: 'keywords', content: keywords })
  }

  if (type === 'article' && publishedTime) {
    metaTags.push(
      { property: 'article:published_time', content: publishedTime },
      { property: 'article:author', content: author }
    )
    if (keywords) {
      metaTags.push({ property: 'article:tag', content: keywords })
    }
  }

  return metaTags
}

export { SITE_NAME, SITE_DOMAIN, AUTHOR_NAME, DEFAULT_IMAGE }
