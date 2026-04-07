export interface SearchPostHit {
  title: string
  slug: string
  description: string
  date: string
}

export interface SearchProjectHit {
  title: string
  description: string
  url?: string
  github?: string
}

export interface SearchPayload {
  query: string
  posts: SearchPostHit[]
  projects: SearchProjectHit[]
}
