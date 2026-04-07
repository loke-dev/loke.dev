import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contentTopic',
  title: 'Content Topic',
  type: 'document',
  icon: () => '✦',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'problem', title: 'Problem & research' },
    { name: 'seo', title: 'SEO' },
    { name: 'generation', title: 'Generation' },
    { name: 'schedule', title: 'Schedule' },
    { name: 'status', title: 'Status' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Topic Name',
      group: 'identity',
      type: 'string',
      description: 'Internal label in the Studio (not the blog title).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      group: 'identity',
      type: 'boolean',
      description: 'Whether this topic is active for scheduled generation.',
      initialValue: true,
    }),
    defineField({
      name: 'topic',
      title: 'Subject line',
      group: 'identity',
      type: 'string',
      description:
        'Short seed for the pipeline (shown to research and SEO). Pair with **Real-world problem focus** for problem-led posts. Examples: "Vite SSR import.meta in libraries", "Next.js 15 cookies in middleware", "PostgreSQL connection pool exhaustion in Node"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tone',
      title: 'Writing tone',
      group: 'identity',
      type: 'string',
      description:
        'Voice and style passed straight into the writer. Be specific. Example: direct, a little sarcastic, no startup slogans.',
      initialValue:
        'Direct and opinionated. Casual but technically precise. Occasional dry humor.',
    }),

    defineField({
      name: 'problemLed',
      title: 'Real-world problem focus',
      group: 'problem',
      type: 'object',
      description:
        'Fill this when you want a post anchored in something developers actually bump into (Stack Overflow style pain, GitHub issues, Reddit threads). Leave empty only for broader exploratory topics.',
      fields: [
        defineField({
          name: 'realWorldProblem',
          title: 'Concrete problem',
          type: 'text',
          rows: 5,
          description:
            'What breaks, for whom, and when. Quote error messages, versions, or repro sketches if you know them. This steers research toward community signals and citable threads.',
        }),
        defineField({
          name: 'promisedOutcome',
          title: 'Promised outcome',
          type: 'text',
          rows: 3,
          description:
            'After reading, the dev should be able to ______. Example: "ship a fix without disabling strict mode", "know which flag to flip and why"',
        }),
        defineField({
          name: 'researchSeeds',
          title: 'Research seeds',
          type: 'array',
          of: [{ type: 'string' }],
          description:
            'Optional. Exact URLs or search phrases to run first (e.g. full Stack Overflow or GitHub issue URL, or `site:stackoverflow.com my error text`). Speeds up grounding.',
          options: { layout: 'tags' },
        }),
        defineField({
          name: 'articleIntent',
          title: 'Article shape',
          type: 'string',
          description:
            'Biases outline and SEO plan. Choose **Auto** to let research pick search intent.',
          initialValue: 'auto',
          options: {
            list: [
              { title: 'Auto (follow research)', value: 'auto' },
              {
                title: 'Troubleshooting – fix a failure',
                value: 'troubleshooting',
              },
              { title: 'How-to – ship a specific outcome', value: 'how_to' },
              {
                title: 'Explainer – mental model / why it works',
                value: 'explainer',
              },
              {
                title: 'Comparison – choose between options',
                value: 'comparison',
              },
            ],
            layout: 'radio',
          },
        }),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO targeting',
      group: 'seo',
      type: 'object',
      description: 'What the model should optimize for in search.',
      fields: [
        defineField({
          name: 'primaryKeyword',
          title: 'Primary keyword',
          type: 'string',
          description:
            'Exact phrase to rank for, if empty the AI picks one. Example: `next.js middleware cookies not working`',
        }),
        defineField({
          name: 'secondaryKeywords',
          title: 'Secondary keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description:
            'Extra phrases to work in naturally. Three to five is plenty.',
          options: { layout: 'tags' },
        }),
        defineField({
          name: 'targetAudience',
          title: 'Target audience',
          type: 'string',
          description:
            'Who this is for. Shapes depth and jargon. Example: mid-level React devs who have not shipped RSC to production.',
        }),
        defineField({
          name: 'contentAngle',
          title: 'Content angle',
          type: 'text',
          rows: 2,
          description:
            'Extra editorial hook beyond the problem block. Examples: migration path, benchmark numbers, docs vs reality.',
        }),
        defineField({
          name: 'persona',
          title: 'Author persona',
          type: 'string',
          description:
            'Who is "speaking". Example: senior frontend engineer, opinionated about perf, shipped at scale.',
        }),
      ],
    }),

    defineField({
      name: 'generation',
      title: 'Generation options',
      group: 'generation',
      type: 'object',
      fields: [
        defineField({
          name: 'targetWordCount',
          title: 'Target word count',
          type: 'number',
          description:
            'Default about 1500 if empty. Longer can help competitive keywords.',
        }),
        defineField({
          name: 'includeCodeExamples',
          title: 'Include code examples',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'customInstructions',
          title: 'Custom instructions',
          type: 'text',
          description: 'Appended to the writer prompt only.',
          rows: 3,
        }),
        defineField({
          name: 'enableImageGeneration',
          title: 'Enable image generation',
          type: 'boolean',
          description: 'Header image via Imagen.',
          initialValue: true,
        }),
      ],
    }),

    defineField({
      name: 'cronSchedule',
      title: 'Schedule (cron)',
      group: 'schedule',
      type: 'string',
      description: 'UTC. Example: `0 9 * * 1` = Mondays 09:00.',
      initialValue: '0 9 * * *',
    }),

    defineField({
      name: 'generationStatus',
      title: 'Generation status',
      group: 'status',
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
      title: 'Last generated',
      group: 'status',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'totalGenerated',
      title: 'Total generated',
      group: 'status',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'lastError',
      title: 'Last error',
      group: 'status',
      type: 'text',
      readOnly: true,
      rows: 2,
    }),
    defineField({
      name: 'lastGeneratedPostId',
      title: 'Last generated post',
      group: 'status',
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
      title: 'Active first',
      name: 'activeFirst',
      by: [
        { field: 'active', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Last generated',
      name: 'lastGeneratedDesc',
      by: [{ field: 'lastGeneratedAt', direction: 'desc' }],
    },
  ],
})
