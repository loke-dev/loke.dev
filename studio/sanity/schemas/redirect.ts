import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    defineField({
      name: 'from',
      title: 'From path',
      type: 'string',
      description: 'A path beginning with /, for example /blog/old-slug.',
      validation: (Rule) =>
        Rule.required().custom(
          (value) =>
            value?.startsWith('/') || 'Redirect paths must begin with /.'
        ),
    }),
    defineField({
      name: 'to',
      title: 'To URL or path',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'note',
      title: 'Editorial note',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: { select: { title: 'from', subtitle: 'to' } },
})
