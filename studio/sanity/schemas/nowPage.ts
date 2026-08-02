import { defineArrayMember, defineField, defineType } from 'sanity'
import { validatePublicCopy, voiceDescription } from '../lib/content-voice'

export default defineType({
  name: 'nowPage',
  title: 'Now Page',
  type: 'document',
  icon: () => '📍',
  fields: [
    defineField({
      name: 'period',
      title: 'Period',
      type: 'string',
      description: 'For example: August 2026',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'What I am up to',
      type: 'array',
      validation: (Rule) => Rule.required().min(1).max(4),
      of: [
        defineArrayMember({
          name: 'nowItem',
          title: 'Now item',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'copy',
              title: 'Copy',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'copy' },
          },
        }),
      ],
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaText',
      title: 'Contact link text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  validation: (Rule) => Rule.custom(validatePublicCopy),
  description: voiceDescription,
  preview: {
    prepare() {
      return { title: 'Now Page' }
    },
  },
})
