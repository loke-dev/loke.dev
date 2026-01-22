import type { StructureBuilder } from 'sanity/structure'
import { Dashboard } from './components/Dashboard'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Dashboard as the first item
      S.listItem()
        .title('Dashboard')
        .id('dashboard')
        .icon(() => '📊')
        .child(S.component(Dashboard).id('dashboard').title('Dashboard')),

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

      // Projects
      S.listItem()
        .title('Projects')
        .id('projects')
        .icon(() => '🚀')
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),
    ])
