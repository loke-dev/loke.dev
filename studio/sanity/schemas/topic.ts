import { defineField, defineType } from 'sanity'
import { validatePublicCopy, voiceDescription } from '../lib/content-voice'

export default defineType({
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(40),
    }),
  ],
  validation: (Rule) => Rule.custom(validatePublicCopy),
  description: voiceDescription,
  preview: { select: { title: 'title', subtitle: 'description' } },
})
