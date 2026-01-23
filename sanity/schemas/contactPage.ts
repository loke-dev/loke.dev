import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: () => '✉️',
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
      name: 'alternativeContactTitle',
      title: 'Alternative Contact Section Title',
      type: 'string',
    }),
    defineField({
      name: 'alternativeContactDescription',
      title: 'Alternative Contact Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
      }
    },
  },
})
