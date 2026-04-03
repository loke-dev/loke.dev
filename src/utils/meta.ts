const SITE_NAME = 'Loke.dev'
const DEFAULT_SEPARATOR = ' - '
const SITE_DOMAIN = 'https://loke.dev'
const DEFAULT_IMAGE = `${SITE_DOMAIN}/loke_clay.png`
const TWITTER_HANDLE = '@loke_dev'
const AUTHOR_NAME = 'Loke'

export type MetaTagsOptions = {
  title: string
  description: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  keywords?: string | string[]
}

export function createTitle(title?: string): string {
  if (!title) return SITE_NAME
  return `${title}${DEFAULT_SEPARATOR}${SITE_NAME}`
}

export { SITE_NAME, SITE_DOMAIN, AUTHOR_NAME, DEFAULT_IMAGE, TWITTER_HANDLE }
