import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contentTopic',
  title: 'Content Topic',
  type: 'document',
  icon: () => '✦',
  fields: [
    // Identity
    defineField({
      name: 'name',
      title: 'Topic Name',
      type: 'string',
      description: 'Display name for this content topic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'What kind of content does this topic generate?',
      rows: 3,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this topic is active for scheduled generation',
      initialValue: true,
    }),

    // Content Settings
    defineField({
      name: 'topic',
      title: 'Subject Matter',
      type: 'string',
      description:
        'The subject matter scope for content generation (e.g., "React, hooks, performance")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tone',
      title: 'Writing Tone',
      type: 'string',
      description: 'The tone and style of the generated content',
      initialValue: 'Professional yet witty',
    }),

    // Schedule
    defineField({
      name: 'cronSchedule',
      title: 'Schedule (Cron Expression)',
      type: 'string',
      description:
        'Cron expression for scheduled generation (e.g., "0 9 * * *" for daily at 9 AM UTC)',
      validation: (Rule) => Rule.required(),
      initialValue: '0 9 * * *',
    }),
    defineField({
      name: 'nextRunTime',
      title: 'Next Scheduled Run',
      type: 'datetime',
      description: 'When this topic will next generate content',
      readOnly: true,
    }),
    defineField({
      name: 'lastGeneratedAt',
      title: 'Last Generated',
      type: 'datetime',
      description: 'When content was last generated for this topic',
      readOnly: true,
    }),

    // Generation Options
    defineField({
      name: 'generation',
      title: 'Generation Options',
      type: 'object',
      description: 'Content generation settings',
      fields: [
        defineField({
          name: 'targetWordCount',
          title: 'Target Word Count',
          type: 'number',
          description:
            'Target word count for posts (leave empty for AI decision)',
        }),
        defineField({
          name: 'includeCodeExamples',
          title: 'Include Code Examples',
          type: 'boolean',
          description: 'Emphasize code examples in content',
          initialValue: true,
        }),
        defineField({
          name: 'seoOptimized',
          title: 'SEO Optimized',
          type: 'boolean',
          description: 'Generate SEO-optimized content',
          initialValue: true,
        }),
        defineField({
          name: 'customInstructions',
          title: 'Custom Instructions',
          type: 'text',
          description: 'Additional instructions for content generation',
          rows: 3,
        }),
        defineField({
          name: 'enableImageGeneration',
          title: 'Enable Image Generation',
          type: 'boolean',
          description:
            'Generate AI images for posts (requires paid Gemini API tier)',
          initialValue: true,
        }),
      ],
    }),

    // Sanity Overrides
    defineField({
      name: 'sanityOverride',
      title: 'Sanity Overrides',
      type: 'object',
      description: 'Optional overrides for Sanity configuration',
      options: { collapsed: true },
      fields: [
        defineField({
          name: 'documentType',
          title: 'Document Type',
          type: 'string',
          description: 'Sanity document type to create (default: "post")',
          initialValue: 'post',
        }),
        defineField({
          name: 'imageFormat',
          title: 'Image Format',
          type: 'string',
          description: 'Format for generated images',
          options: {
            list: [
              { title: 'PNG', value: 'png' },
              { title: 'JPG', value: 'jpg' },
              { title: 'SVG', value: 'svg' },
            ],
          },
          initialValue: 'png',
        }),
      ],
    }),

    // Statistics
    defineField({
      name: 'totalGenerated',
      title: 'Total Generated',
      type: 'number',
      description: 'Total number of posts generated for this topic',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'lastError',
      title: 'Last Error',
      type: 'text',
      description: 'Last generation error (if any)',
      readOnly: true,
      rows: 2,
    }),
    defineField({
      name: 'lastGeneratedPostId',
      title: 'Last Generated Post',
      type: 'reference',
      description: 'Reference to the most recently generated post',
      to: [{ type: 'post' }],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'topic',
      active: 'active',
      schedule: 'cronSchedule',
    },
    prepare({ title, subtitle, active, schedule }) {
      return {
        title: `${active ? '✓' : '○'} ${title}`,
        subtitle: `${subtitle} • ${schedule}`,
      }
    },
  },
  orderings: [
    {
      title: 'Active First',
      name: 'activeFirst',
      by: [
        { field: 'active', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Last Generated',
      name: 'lastGeneratedDesc',
      by: [{ field: 'lastGeneratedAt', direction: 'desc' }],
    },
  ],
})
