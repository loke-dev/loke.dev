import type { StructureBuilder } from 'sanity/structure'

// Singleton document IDs
const SINGLETON_TYPES = [
  'homePage',
  'aboutPage',
  'blogPage',
  'projectsPage',
  'contactPage',
] as const

// Helper to create singleton list items
const singletonListItem = (
  S: StructureBuilder,
  typeName: (typeof SINGLETON_TYPES)[number],
  title: string,
  icon: string
) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .icon(() => icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Pages section
      S.listItem()
        .title('Pages')
        .id('pages')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Pages')
            .items([
              singletonListItem(S, 'homePage', 'Home', '🏠'),
              singletonListItem(S, 'aboutPage', 'About', '👤'),
              singletonListItem(S, 'blogPage', 'Blog', '📰'),
              singletonListItem(S, 'projectsPage', 'Projects', '🚀'),
              singletonListItem(S, 'contactPage', 'Contact', '✉️'),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Topics')
        .id('topics')
        .icon(() => '✦')
        .child(
          S.documentTypeList('topic')
            .title('Topics')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      S.listItem()
        .title('Authors')
        .id('authors')
        .icon(() => '✍️')
        .child(S.documentTypeList('author').title('Authors')),

      S.divider(),

      // Posts with custom ordering
      S.listItem()
        .title('Posts')
        .id('posts')
        .icon(() => '📝')
        .child(
          S.documentTypeList('post')
            .title('Posts')
            .defaultOrdering([{ field: 'date', direction: 'desc' }])
        ),

      S.listItem()
        .title('Redirects')
        .id('redirects')
        .icon(() => '↪️')
        .child(S.documentTypeList('redirect').title('Redirects')),

      // Projects
      S.listItem()
        .title('Projects')
        .id('projects-list')
        .icon(() => '🚀')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
    ])

// Filter out singleton types from the default document list
export const singletonTypes = new Set<string>(SINGLETON_TYPES)
