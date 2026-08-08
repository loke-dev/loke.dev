import { defineField, defineType } from 'sanity'
import { validatePublicCopy, voiceDescription } from '../lib/content-voice'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: () => '🏠',
  fields: [
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'focusAreas',
      title: 'What I Build Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      name: 'technologiesSectionTitle',
      title: 'Technologies Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blogSectionTitle',
      title: 'Blog Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blogSectionDescription',
      title: 'Blog Section Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaDescription',
      title: 'CTA Section Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  validation: (Rule) => Rule.custom(validatePublicCopy),
  description: voiceDescription,
  preview: {
    prepare() {
      return {
        title: 'Home Page',
      }
    },
  },
})
