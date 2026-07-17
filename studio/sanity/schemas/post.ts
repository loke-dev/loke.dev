import { defineArrayMember, defineField, defineType } from 'sanity'
import { validatePublicCopy, voiceDescription } from '../lib/content-voice'

const sourceFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'url',
    title: 'URL',
    type: 'url',
    validation: (Rule) => Rule.required(),
  }),
  defineField({ name: 'publisher', title: 'Publisher', type: 'string' }),
]

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: () => '📝',
  description: voiceDescription,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .min(20)
          .warning('Use a clear, specific title.')
          .max(70)
          .warning('Keep the title concise for search results.'),
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
      title: 'Search description',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .min(80)
          .warning('Describe the problem and outcome.')
          .max(170)
          .warning('Keep this concise for search results.'),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'topic' }] })],
      validation: (Rule) => Rule.required().min(1).max(2),
    }),
    defineField({
      name: 'date',
      title: 'Published date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastModified',
      title: 'Last verified or updated',
      type: 'date',
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Hero image alt text',
      type: 'string',
      validation: (Rule) => Rule.required().min(10),
    }),
    defineField({
      name: 'versionScope',
      title: 'Version and test scope',
      type: 'object',
      fields: [
        defineField({ name: 'testedAt', title: 'Verified on', type: 'date' }),
        defineField({
          name: 'environment',
          title: 'Environment',
          type: 'string',
        }),
        defineField({
          name: 'versions',
          title: 'Versions',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'technology',
                  title: 'Technology',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'version',
                  title: 'Version',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Article',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
            ],
          },
        },
        { type: 'code', title: 'Code block' },
        {
          type: 'image',
          title: 'Inline image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
        { type: 'callout', title: 'Callout' },
        { type: 'diagram', title: 'Article diagram' },
      ],
    }),
    defineField({
      name: 'sources',
      title: 'Sources and further reading',
      type: 'array',
      of: [defineArrayMember({ type: 'object', fields: sourceFields })],
      validation: (Rule) =>
        Rule.required().min(2).warning('Use primary sources when possible.'),
    }),
    defineField({
      name: 'reproduction',
      title: 'Reproduction or code example',
      type: 'object',
      fields: [
        defineField({
          name: 'repository',
          title: 'Repository URL',
          type: 'url',
        }),
        defineField({
          name: 'ref',
          title: 'Branch, tag, or commit',
          type: 'string',
        }),
        defineField({
          name: 'setupCommand',
          title: 'Setup command',
          type: 'string',
        }),
        defineField({
          name: 'verificationCommand',
          title: 'Verification command',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'editorial',
      title: 'Editorial review',
      type: 'object',
      fields: [
        defineField({
          name: 'status',
          title: 'Status',
          type: 'string',
          options: {
            list: [
              { title: 'Research', value: 'research' },
              { title: 'Draft', value: 'draft' },
              { title: 'Review', value: 'review' },
              { title: 'Approved', value: 'approved' },
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'readerProblem',
          title: 'Reader problem',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'uniqueValue',
          title: 'Why this is worth publishing',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'reviewedAt', title: 'Reviewed on', type: 'date' }),
      ],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((document) => {
      if (!document) return true
      const voiceValidation = validatePublicCopy(document)
      if (voiceValidation !== true) return voiceValidation
      if (!document.author || !document.topics?.length)
        return 'Add an author and at least one topic before publishing.'
      if (!document.sources || document.sources.length < 2)
        return 'Add at least two sources before publishing.'
      return true
    }),
  orderings: [
    {
      title: 'Published (newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Last verified',
      name: 'lastModifiedDesc',
      by: [{ field: 'lastModified', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      author: 'author.name',
      media: 'image',
    },
    prepare({ title, date, author, media }) {
      return {
        title,
        subtitle: `${author ?? 'No author'} · ${date ?? 'No date'}`,
        media,
      }
    },
  },
})
