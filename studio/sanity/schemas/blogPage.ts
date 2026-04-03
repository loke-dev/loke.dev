import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      rows: 2,
      description: 'Shown below the title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emptyStateTitle',
      title: 'Empty State Title',
      type: 'string',
      description: 'Shown when there are no posts',
    }),
    defineField({
      name: 'emptyStateDescription',
      title: 'Empty State Description',
      type: 'text',
      rows: 2,
      description: 'Shown when there are no posts',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Blog Page',
      }
    },
  },
})
