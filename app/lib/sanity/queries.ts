export const POST_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc) {
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
