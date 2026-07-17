import { defineField, defineType } from 'sanity'
import { validatePublicCopy, voiceDescription } from '../lib/content-voice'

export default defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Success', value: 'success' },
          { title: 'Error', value: 'error' },
        ],
      },
      initialValue: 'info',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  validation: (Rule) => Rule.custom(validatePublicCopy),
  description: voiceDescription,
  preview: {
    select: {
      type: 'tone',
      title: 'text',
    },
    prepare({ type, title }) {
      return {
        title: title || `Callout (${type || 'info'})`,
        subtitle: `Tone: ${type || 'info'}`,
      }
    },
  },
})
