export const CACHE_CONTROL = {
  home: 'public, s-maxage=3600, stale-while-revalidate=86400',
  blogIndex: 'public, s-maxage=1800, stale-while-revalidate=86400',
  blogPost: 'public, s-maxage=86400, stale-while-revalidate=604800',
  staticPage: 'public, s-maxage=3600, stale-while-revalidate=86400',
  contact: 'public, s-maxage=3600, stale-while-revalidate=86400',
  changelog: 'public, s-maxage=3600, stale-while-revalidate=86400',
  xmlFeed: 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const
