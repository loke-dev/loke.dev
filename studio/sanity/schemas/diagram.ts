import { defineField, defineType } from 'sanity'
import { validatePublicCopy, voiceDescription } from '../lib/content-voice'

export default defineType({
  name: 'diagram',
  title: 'Article diagram',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Diagram',
      type: 'string',
      options: {
        list: [
          { title: 'Sanity revalidation flow', value: 'revalidation-flow' },
          { title: 'Immutable headers flow', value: 'immutable-headers-flow' },
          {
            title: 'Content cache architecture',
            value: 'content-cache-architecture',
          },
          {
            title: 'Next.js params comparison',
            value: 'next-params-comparison',
          },
          { title: 'Next.js CSS diagnostic', value: 'next-css-diagnostic' },
          {
            title: 'Pages Router migration map',
            value: 'next-router-migration-map',
          },
          {
            title: 'Server and Client boundary',
            value: 'next-rendering-boundary',
          },
          {
            title: 'Next.js cache decision',
            value: 'next-cache-decision',
          },
          {
            title: 'App Router rollout',
            value: 'next-migration-rollout',
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  validation: (Rule) => Rule.custom(validatePublicCopy),
  description: voiceDescription,
  preview: {
    select: { title: 'kind', subtitle: 'caption' },
  },
})
