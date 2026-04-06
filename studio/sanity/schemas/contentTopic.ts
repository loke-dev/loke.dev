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
        'The subject area for content generation (e.g. "React performance", "TypeScript generics", "CSS container queries")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tone',
      title: 'Writing Tone',
      type: 'string',
      description:
        'Voice and style. Be specific — this goes directly into the prompt. E.g. "Direct and opinionated, slightly sarcastic, no corporate fluff"',
      initialValue:
        'Direct and opinionated. Casual but technically precise. Occasional dry humor.',
    }),

    // SEO Targeting
    defineField({
      name: 'seo',
      title: 'SEO Targeting',
      type: 'object',
      description:
        'Control what the AI targets for search ranking. The more specific, the better.',
      fields: [
        defineField({
          name: 'primaryKeyword',
          title: 'Primary Keyword',
          type: 'string',
          description:
            'Lock in the exact keyword phrase to rank for. If empty, the AI picks one from research. Example: "react server components performance"',
        }),
        defineField({
          name: 'secondaryKeywords',
          title: 'Secondary Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description:
            'Additional keyword phrases to weave in naturally. 3–5 is ideal.',
          options: { layout: 'tags' },
        }),
        defineField({
          name: 'targetAudience',
          title: 'Target Audience',
          type: 'string',
          description:
            'Who is this for, specifically. This shapes research, title, and how deep the content goes. E.g. "mid-level React devs who know hooks but haven\'t touched RSC yet"',
        }),
        defineField({
          name: 'contentAngle',
          title: 'Content Angle',
          type: 'text',
          rows: 2,
          description:
            'A specific perspective or hook for the article. E.g. "Compare the three main approaches with real benchmark numbers", "Focus on the migration path from the old API", "Cover the gotchas that the docs don\'t mention"',
        }),
        defineField({
          name: 'persona',
          title: 'Author Persona',
          type: 'string',
          description:
            'The voice behind the article. E.g. "Senior frontend engineer with 7 years React experience, opinionated about performance, has shipped to millions of users"',
        }),
      ],
    }),

    // Generation Options
    defineField({
      name: 'generation',
      title: 'Generation Options',
      type: 'object',
      fields: [
        defineField({
          name: 'targetWordCount',
          title: 'Target Word Count',
          type: 'number',
          description:
            'Leave empty for default (1500). Longer posts (2000–3000) tend to rank better for competitive keywords.',
        }),
        defineField({
          name: 'includeCodeExamples',
          title: 'Include Code Examples',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'customInstructions',
          title: 'Custom Instructions',
          type: 'text',
          description:
            'Any extra instructions appended to the writer prompt. E.g. "Always mention Next.js App Router compatibility", "Include a comparison table"',
          rows: 3,
        }),
        defineField({
          name: 'enableImageGeneration',
          title: 'Enable Image Generation',
          type: 'boolean',
          description: 'Generate a header image via Imagen 4',
          initialValue: true,
        }),
      ],
    }),

    // Schedule
    defineField({
      name: 'cronSchedule',
      title: 'Schedule (Cron Expression)',
      type: 'string',
      description:
        'Cron expression for optional automated generation. E.g. \"0 9 * * 1\" = every Monday at 9 AM UTC',
      initialValue: '0 9 * * *',
    }),

    // Status (read-only)
    defineField({
      name: 'generationStatus',
      title: 'Generation Status',
      type: 'string',
      options: {
        list: [
          { title: 'Idle', value: 'idle' },
          { title: 'Researching', value: 'researching' },
          { title: 'Writing', value: 'writing' },
          { title: 'Uploading', value: 'uploading' },
          { title: 'Done', value: 'done' },
          { title: 'Error', value: 'error' },
        ],
      },
      initialValue: 'idle',
      readOnly: true,
    }),
    defineField({
      name: 'lastGeneratedAt',
      title: 'Last Generated',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'totalGenerated',
      title: 'Total Generated',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'lastError',
      title: 'Last Error',
      type: 'text',
      readOnly: true,
      rows: 2,
    }),
    defineField({
      name: 'lastGeneratedPostId',
      title: 'Last Generated Post',
      type: 'reference',
      to: [{ type: 'post' }],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'topic',
      active: 'active',
      status: 'generationStatus',
    },
    prepare({ title, subtitle, active, status }) {
      const statusEmoji: Record<string, string> = {
        idle: '○',
        researching: '🔍',
        writing: '✍️',
        uploading: '⬆️',
        done: '✓',
        error: '✗',
      }
      const emoji = statusEmoji[status] ?? '○'
      return {
        title: `${active ? emoji : '—'} ${title}`,
        subtitle,
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
      title: 'Last Generated',
      name: 'lastGeneratedDesc',
      by: [{ field: 'lastGeneratedAt', direction: 'desc' }],
    },
  ],
})
