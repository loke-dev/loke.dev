// Lightweight query for list views (no body content)
export const POST_LIST_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc) {
  _id,
  title,
  slug,
  description,
  date,
  lastModified,
  tag,
  image,
  imageAlt
}`

// Paginated query for blog index
export const POST_PAGINATED_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc) [$start...$end] {
  _id,
  title,
  slug,
  description,
  date,
  lastModified,
  tag,
  image,
  imageAlt
}`

// Count query for pagination metadata
export const POST_COUNT_QUERY = `count(*[_type == "post" && !(_id in path("drafts.**"))])`

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  date,
  lastModified,
  tag,
  image,
  imageAlt,
  body
}`

export const POST_SLUGS_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] {
  slug
}`

// Optimized query for related posts - fetches only what's needed
export const RELATED_POSTS_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && tag == $postTag && slug.current != $currentSlug] | order(date desc) [0...$limit] {
  _id,
  title,
  slug,
  description,
  date,
  tag,
  image,
  imageAlt
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

// Page singleton queries
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
