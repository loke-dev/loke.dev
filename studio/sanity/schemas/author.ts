import { defineField, defineType } from 'sanity'
import { validatePublicCopy, voiceDescription } from '../lib/content-voice'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.required().min(40).warning('Add a useful, specific bio.'),
    }),
    defineField({
      name: 'image',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'sameAs',
      title: 'Profile links',
      type: 'array',
      of: [{ type: 'url' }],
      description:
        'GitHub, LinkedIn, or other profiles that establish authorship.',
    }),
  ],
  validation: (Rule) => Rule.custom(validatePublicCopy),
  description: voiceDescription,
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})
