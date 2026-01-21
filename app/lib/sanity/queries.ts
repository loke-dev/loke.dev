export const POST_QUERY = `*[_type == "post" && published == true] | order(date desc) {
  _id,
  title,
  slug,
  description,
  date,
  lastModified,
  tag,
  published,
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
  published,
  image,
  imageAlt,
  body
}`

export const POST_SLUGS_QUERY = `*[_type == "post" && published == true] {
  slug
}`
