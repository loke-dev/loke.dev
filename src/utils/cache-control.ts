export const CACHE_CONTROL = {
  home: 'public, s-maxage=120, stale-while-revalidate=600',
  blogIndex: 'public, s-maxage=60, stale-while-revalidate=300',
  blogPost: 'public, s-maxage=3600, stale-while-revalidate=86400',
  staticPage: 'public, s-maxage=600, stale-while-revalidate=3600',
  contact: 'public, s-maxage=300, stale-while-revalidate=3600',
  xmlFeed: 'public, s-maxage=3600',
} as const
