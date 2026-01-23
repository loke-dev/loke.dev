import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  icon: () => '🚀',
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
      name: 'featuredSectionTitle',
      title: 'Featured Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'otherSectionTitle',
      title: 'Other Projects Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Projects Page',
      }
    },
  },
})
