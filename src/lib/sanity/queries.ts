const AUTHOR_PROJECTION = `"author": author->{ _id, name, slug, role }`
const TOPICS_PROJECTION = `"topics": topics[]->{ _id, title, slug, description }`
const PLAIN_BODY = `"plainBody": pt::text(body)`

const POST_LIST_BODY = `_id, _createdAt, title, slug, description, date, lastModified, _updatedAt,
  ${AUTHOR_PROJECTION}, ${TOPICS_PROJECTION}, image, imageAlt`

export const POST_LIST_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc, _createdAt desc) { ${POST_LIST_BODY}, ${PLAIN_BODY} }`
export const POST_PAGINATED_QUERY = `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc, _createdAt desc) [$start...$end] { ${POST_LIST_BODY}, ${PLAIN_BODY} }`
export const POST_COUNT_QUERY = `count(*[_type == "post" && !(_id in path("drafts.**"))])`
export const POST_BY_SLUG_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && slug.current == $slug][0] { ${POST_LIST_BODY}, body, sources, reproduction, versionScope }`
export const REDIRECT_BY_FROM_QUERY = `*[_type == "redirect" && from == $from][0] { to, permanent }`
export const RELATED_POSTS_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && _id != $excludeId && count(topics[@._ref in $topicIds]) > 0] | order(date desc) [0...$limit] { ${POST_LIST_BODY}, ${PLAIN_BODY} }`
const ADJACENT_POST_FIELDS = POST_LIST_BODY
export const POST_PREV_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && (date < $date || (date == $date && _createdAt < $createdAt))] | order(date desc, _createdAt desc) [0] { ${ADJACENT_POST_FIELDS} }`
export const POST_NEXT_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && (date > $date || (date == $date && _createdAt > $createdAt))] | order(date asc, _createdAt asc) [0] { ${ADJACENT_POST_FIELDS} }`

export const TOPIC_BY_SLUG_QUERY = `*[_type == "topic" && !(_id in path("drafts.**")) && slug.current == $slug][0] { _id, title, slug, description, _updatedAt }`
export const POSTS_BY_TOPIC_SLUG_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && references(*[_type == "topic" && slug.current == $slug][0]._id)] | order(date desc) { ${POST_LIST_BODY}, ${PLAIN_BODY} }`
export const ALL_TOPICS_QUERY = `*[_type == "topic" && !(_id in path("drafts.**")) && count(*[_type == "post" && !(_id in path("drafts.**")) && references(^._id)]) > 0] | order(title asc) { _id, title, slug, description, _updatedAt }`
export const AUTHOR_BY_SLUG_QUERY = `*[_type == "author" && !(_id in path("drafts.**")) && slug.current == $slug][0] { _id, name, slug, role, bio, image, sameAs, _updatedAt }`
export const POSTS_BY_AUTHOR_SLUG_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && author->slug.current == $slug] | order(date desc) { ${POST_LIST_BODY}, ${PLAIN_BODY} }`
export const ALL_AUTHORS_QUERY = `*[_type == "author" && !(_id in path("drafts.**")) && count(*[_type == "post" && !(_id in path("drafts.**")) && references(^._id)]) > 0] { _id, name, slug, role, bio, image, sameAs, _updatedAt }`

export const PROJECTS_QUERY = `*[_type == "project" && !(_id in path("drafts.**"))] | order(order asc, year desc) { _id, _updatedAt, title, slug, description, technologies, image, imageAlt, url, github, featured, kind, year, order }`
export const HOME_PAGE_QUERY = `*[_type == "homePage" && _id == "homePage"][0] { _updatedAt, heroDescription, focusAreas[] { _key, title, description }, technologiesSectionTitle, technologies, blogSectionTitle, blogSectionDescription, ctaTitle, ctaDescription, ctaButtonText }`
export const NOW_PAGE_QUERY = `*[_type == "nowPage" && _id == "nowPage"][0] { _updatedAt, period, title, intro, items[] { _key, label, copy }, note, ctaText }`
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0] { _updatedAt, title, intro, sections[] { _key, title, content } }`
export const BLOG_PAGE_QUERY = `*[_type == "blogPage" && _id == "blogPage"][0] { _updatedAt, title, description, emptyStateTitle, emptyStateDescription }`
export const PROJECTS_PAGE_QUERY = `*[_type == "projectsPage" && _id == "projectsPage"][0] { _updatedAt, title, description, featuredSectionTitle, otherSectionTitle, templatesSectionTitle }`
export const CONTACT_PAGE_QUERY = `*[_type == "contactPage" && _id == "contactPage"][0] { _updatedAt, title, description, alternativeContactTitle, alternativeContactDescription }`
export const SEARCH_POSTS_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && (lower(title) match $pattern || lower(description) match $pattern || lower(coalesce(pt::text(body), "")) match $pattern)] | order(date desc) [0...10] { title, "slug": slug.current, description, date }`
export const SEARCH_PROJECTS_QUERY = `*[_type == "project" && !(_id in path("drafts.**")) && (lower(title) match $pattern || lower(description) match $pattern || count(coalesce(technologies, [])[lower(@) match $pattern]) > 0)] | order(order asc, year desc) [0...10] { title, description, url, github }`
