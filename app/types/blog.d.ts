export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  published: boolean
  content: string
  compiledContent: string
  frontmatter?: {
    title: string
    description: string
    date: string
    published: boolean
    [key: string]: unknown
  }
}
