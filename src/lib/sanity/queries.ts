const TAGS_PROJECTION = `"tags": select(defined(tags) && count(tags) > 0 => tags, defined(tag) => [tag], [])`

const PLAIN_BODY = `"plainBody": pt::text(body)`

const POST_LIST_BODY = `_id,
  title,
  slug,
  description,
  date,
  lastModified,
  _updatedAt,
  ${TAGS_PROJECTION},
  image,
  imageAlt`

export const POST_LIST_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc) {
  ${POST_LIST_BODY},
  ${PLAIN_BODY}
}`

export const POST_PAGINATED_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc) [$start...$end] {
  ${POST_LIST_BODY},
  ${PLAIN_BODY}
}`

export const POST_COUNT_QUERY = `count(*[_type == "post" && !(_id in path("drafts.**"))])`

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  date,
  lastModified,
  _updatedAt,
  ${TAGS_PROJECTION},
  image,
  imageAlt,
  body,
  resources
}`

export const POST_SLUGS_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] {
  slug
}`

export const RELATED_POSTS_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && _id != $excludeId && (count(coalesce(tags, [])[@ in $tags]) > 0 || (defined(tag) && tag in $tags))] | order(date desc) [0...$limit] {
  _id,
  title,
  slug,
  description,
  date,
  lastModified,
  _updatedAt,
  ${TAGS_PROJECTION},
  image,
  imageAlt,
  ${PLAIN_BODY}
}`

const ADJACENT_POST_FIELDS = `_id,
  title,
  slug,
  description,
  date,
  lastModified,
  _updatedAt,
  ${TAGS_PROJECTION},
  image,
  imageAlt`

export const POST_PREV_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && date < $date] | order(date desc) [0] {
  ${ADJACENT_POST_FIELDS}
}`

export const POST_NEXT_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && date > $date] | order(date asc) [0] {
  ${ADJACENT_POST_FIELDS}
}`

export const PROJECTS_QUERY = `*[_type == "project"] | order(order asc, year desc) {
  _id,
  title,
  slug,
  description,
  technologies,
  image,
  url,
  github,
  featured,
  year,
  order
}`

export const FEATURED_PROJECTS_QUERY = `*[_type == "project" && featured == true] | order(order asc, year desc) {
  _id,
  title,
  slug,
  description,
  technologies,
  image,
  url,
  github,
  featured,
  year,
  order
}`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  technologies,
  image,
  url,
  github,
  featured,
  year,
  order
}`

export const PROJECT_SLUGS_QUERY = `*[_type == "project"] {
  slug
}`

export const HOME_PAGE_QUERY = `*[_type == "homePage" && _id == "homePage"][0] {
  heroTitle,
  heroDescription,
  technologiesSectionTitle,
  technologies,
  blogSectionTitle,
  blogSectionDescription,
  ctaTitle,
  ctaDescription,
  ctaButtonText
}`

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0] {
  title,
  intro,
  sections[] {
    _key,
    title,
    content
  }
}`

export const BLOG_PAGE_QUERY = `*[_type == "blogPage" && _id == "blogPage"][0] {
  title,
  description,
  emptyStateTitle,
  emptyStateDescription
}`

export const PROJECTS_PAGE_QUERY = `*[_type == "projectsPage" && _id == "projectsPage"][0] {
  title,
  description,
  featuredSectionTitle,
  otherSectionTitle
}`

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage" && _id == "contactPage"][0] {
  title,
  description,
  alternativeContactTitle,
  alternativeContactDescription
}`

export const SEARCH_POSTS_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && (lower(title) match $pattern || lower(description) match $pattern || lower(coalesce(pt::text(body), "")) match $pattern)] | order(date desc) [0...10] {
  title,
  "slug": slug.current,
  description,
  date
}`

export const SEARCH_PROJECTS_QUERY = `*[_type == "project" && (lower(title) match $pattern || lower(description) match $pattern || count(coalesce(technologies, [])[lower(@) match $pattern]) > 0)] | order(order asc, year desc) [0...10] {
  title,
  description,
  url,
  github
}`
