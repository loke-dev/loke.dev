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
