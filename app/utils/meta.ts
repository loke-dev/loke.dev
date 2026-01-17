const SITE_NAME = 'Loke.dev'
const DEFAULT_SEPARATOR = ' - '

type TitleOptions = {
  title?: string
  separator?: string
  includesSiteName?: boolean
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

export function createMetaTags(
  title: string,
  description: string
): Array<{ title?: string; name?: string; content?: string }> {
  return [
    { title: createTitle({ title }) },
    { name: 'description', content: description },
  ]
}

export { SITE_NAME }
