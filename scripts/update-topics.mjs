/**
 * Run with: node scripts/update-topics.mjs
 * Requires SANITY_WRITE_TOKEN in environment.
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = 'l25uat4p'
const DATASET = 'production'

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('SANITY_WRITE_TOKEN is not set')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// IDs of existing topics to patch
const DAILY_TOPIC_ID = '7ed1bbaa-c86c-4736-8e03-ca738d860e02'
const WEEKLY_TOPIC_ID = '05f8e71d-6a99-4579-8a16-92730d51ff58'

const updates = [
  // ── Update existing: Daily → React & Modern Frontend ─────────────────────
  {
    type: 'patch',
    id: DAILY_TOPIC_ID,
    data: {
      name: 'React & Modern Frontend',
      topic: 'React 19, hooks patterns, Server Components, React Router v7, Remix, client-side performance, rendering strategies',
      tone: 'Direct and opinionated. No fluff. Specific over general. Occasional dry humor when something in the React ecosystem deserves it.',
      cronSchedule: '0 8 * * 1,3,5', // Mon, Wed, Fri at 8 AM UTC
      seo: {
        targetAudience: 'Mid-to-senior React developers who know hooks well but want to level up on RSC, performance, and modern patterns',
        contentAngle: 'Focus on what actually changed and why it matters in production — not just what the feature is',
        persona: 'Senior frontend engineer with 7+ years React experience, has migrated real apps to RSC and Remix, opinionated about performance',
        secondaryKeywords: ['react hooks', 'react server components', 'react performance', 'remix framework'],
      },
      generation: {
        targetWordCount: 1800,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions: 'Always include at least one concrete before/after code example showing the improvement. Name specific React versions when relevant.',
      },
    },
  },

  // ── Update existing: Weekly → TypeScript Patterns ─────────────────────────
  {
    type: 'patch',
    id: WEEKLY_TOPIC_ID,
    data: {
      name: 'TypeScript Patterns',
      topic: 'TypeScript advanced types, generics, utility types, type narrowing, strict mode patterns, runtime type validation, Zod',
      tone: 'Precise and technically confident. Occasionally sarcastic about any-as-escape-hatch. Practical over theoretical.',
      cronSchedule: '0 8 * * 2,4', // Tue, Thu at 8 AM UTC
      seo: {
        targetAudience: 'Developers who use TypeScript daily but mostly at the surface — want to understand generics, conditional types, and real type-safety patterns',
        contentAngle: 'Show the pattern and why it beats the naive alternative — focus on real codebases, not toy examples',
        persona: 'TypeScript power user who reviews PRs and pushes back on any types, has typed complex library APIs and knows what actually works',
        secondaryKeywords: ['typescript generics', 'typescript utility types', 'type narrowing', 'zod validation'],
      },
      generation: {
        targetWordCount: 2000,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions: 'Every post must include a TypeScript playground-compatible code example. Show the wrong way first, then the right way.',
      },
    },
  },

  // ── Create new: Web Performance ───────────────────────────────────────────
  {
    type: 'create',
    data: {
      _type: 'contentTopic',
      name: 'Web Performance & Core Web Vitals',
      topic: 'Core Web Vitals (LCP, CLS, INP), bundle optimization, code splitting, caching strategies, edge rendering, Lighthouse',
      tone: 'Measurement-first. No vague advice — everything backed by numbers. Direct.',
      cronSchedule: '0 8 * * 6', // Saturday at 8 AM UTC
      active: true,
      generationStatus: 'idle',
      totalGenerated: 0,
      seo: {
        targetAudience: 'Frontend developers who need to improve their site\'s Core Web Vitals scores and can read a Lighthouse report but need help with the fixes',
        contentAngle: 'Concrete, measurable fixes — always show before/after metrics or a clear way to measure the improvement',
        persona: 'Performance engineer who has improved LCP from 4s to 1.2s on a production site and knows exactly which levers to pull',
        secondaryKeywords: ['core web vitals', 'lighthouse optimization', 'LCP optimization', 'web performance tips'],
      },
      generation: {
        targetWordCount: 1800,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions: 'Every post must include specific metrics or benchmarks. Use Lighthouse score improvements, millisecond reductions, or byte savings as concrete evidence.',
      },
    },
  },

  // ── Create new: Node.js & Backend Patterns ────────────────────────────────
  {
    type: 'create',
    data: {
      _type: 'contentTopic',
      name: 'Node.js & Backend Patterns',
      topic: 'Node.js, serverless functions, edge functions, REST API design, authentication, database patterns, Prisma, tRPC, Drizzle',
      tone: 'Battle-tested and pragmatic. Shares what actually breaks in production. No enterprise patterns that add complexity without value.',
      cronSchedule: '0 8 * * 3', // Wednesday at 8 AM UTC
      active: true,
      generationStatus: 'idle',
      totalGenerated: 0,
      seo: {
        targetAudience: 'Fullstack developers who are stronger on the frontend and need reliable, production-ready backend patterns without over-engineering',
        contentAngle: 'What actually works at scale vs what tutorials show — focus on the gap between "works locally" and "works in production"',
        persona: 'Fullstack developer who has built and maintained production APIs, been burned by naive patterns, and has specific opinions about what not to do',
        secondaryKeywords: ['nodejs api', 'trpc typescript', 'prisma orm', 'serverless functions'],
      },
      generation: {
        targetWordCount: 2000,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions: 'Focus on production gotchas. At least one section should cover "what goes wrong in production that doesn\'t in development".',
      },
    },
  },

  // ── Create new: Modern CSS ────────────────────────────────────────────────
  {
    type: 'create',
    data: {
      _type: 'contentTopic',
      name: 'Modern CSS & UI',
      topic: 'Modern CSS, container queries, cascade layers, CSS Grid, View Transitions API, CSS animations, design tokens, Tailwind CSS',
      tone: 'Enthusiastic but precise. Evangelistic about what CSS can do natively now. Slightly dismissive of reaching for JavaScript when CSS works.',
      cronSchedule: '0 8 * * 0', // Sunday at 8 AM UTC
      active: true,
      generationStatus: 'idle',
      totalGenerated: 0,
      seo: {
        targetAudience: 'Frontend developers who learned CSS in the jQuery/Bootstrap era and want to catch up on what modern CSS can do without a library',
        contentAngle: '"You don\'t need JavaScript for this anymore" — show the native CSS solution vs the old hacky approach',
        persona: 'CSS enthusiast who advocates for removing JavaScript dependencies where CSS can do the job, has strong opinions about utility-first vs semantic CSS',
        secondaryKeywords: ['modern css', 'css container queries', 'tailwind css', 'css animations'],
      },
      generation: {
        targetWordCount: 1500,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions: 'Always include live-demo-style code snippets. Show browser support clearly. Include the old way vs the new way.',
      },
    },
  },
]

async function run() {
  console.log('Updating content topics in Sanity...\n')

  for (const update of updates) {
    try {
      if (update.type === 'patch') {
        await client.patch(update.id).set(update.data).commit()
        console.log(`✓ Updated: ${update.data.name}`)
      } else {
        const result = await client.create(update.data)
        console.log(`✓ Created: ${update.data.name} (${result._id})`)
      }
    } catch (err) {
      console.error(`✗ Failed for "${update.data?.name}":`, err.message)
    }
  }

  console.log('\nDone. Open Sanity Studio → Content Topics to review.')
}

run()
