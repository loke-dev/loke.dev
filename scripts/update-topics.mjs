/**
 * Syncs Content Topic documents in Sanity (problem-led fields + SEO).
 * Run: SANITY_WRITE_TOKEN=... node scripts/update-topics.mjs
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

const DAILY_TOPIC_ID = '7ed1bbaa-c86c-4736-8e03-ca738d860e02'
const WEEKLY_TOPIC_ID = '05f8e71d-6a99-4579-8a16-92730d51ff58'

async function patchOrCreateByName(name, doc) {
  const id = await client.fetch(
    `*[_type == "contentTopic" && name == $name][0]._id`,
    { name }
  )
  if (id) {
    await client.patch(id).set(doc).commit()
    console.log(`✓ Patched (by name): ${name}`)
    return id
  }
  const created = await client.create({
    _type: 'contentTopic',
    active: true,
    generationStatus: 'idle',
    totalGenerated: 0,
    ...doc,
  })
  console.log(`✓ Created: ${name} (${created._id})`)
  return created._id
}

const problemLedRotationReact = {
  realWorldProblem: `Each run must chase a concrete failure developers paste into Google: hydration mismatch warnings, "use client" / "use server" boundary surprises, broken builds after a React or router upgrade, Suspense waterfalls that tank UX, stale closures in hooks, or RSC errors that only show in production. Anchor in symptoms and versions, not feature tours.`,
  promisedOutcome: `The reader can see the failure mode, apply a fix or workaround, understand why it happened, and leave with a short verification checklist or test idea.`,
  researchSeeds: [
    'site:stackoverflow.com react hydration',
    'site:stackoverflow.com react server components',
    'site:github.com facebook/react/issues hydration',
    'site:reddit.com/r/reactjs upgrade broke',
  ],
  articleIntent: 'auto',
}

const problemLedRotationTS = {
  realWorldProblem: `Each post starts from real friction: a compiler error people screenshot, strictNullChecks surprises, generics that infer as never or unknown, keyof / mapped type puzzles, decorators or moduleResolution breaks after tsconfig changes, or Zod schemas that drift from types. Prefer duplicate Stack Overflow themes and GitHub issues over abstract type theory.`,
  promisedOutcome: `The reader can unblock the error or pattern in their repo, knows the mental model in one paragraph, and has copy-paste-safe patterns that match strict mode.`,
  researchSeeds: [
    'site:stackoverflow.com typescript generic infer',
    'site:stackoverflow.com typescript strict null',
    'site:github.com microsoft/TypeScript issues',
  ],
  articleIntent: 'auto',
}

const problemLedPerf = {
  realWorldProblem: `Focus on regressions and tickets: bad LCP or CLS after a deploy, INP spikes from third-party scripts, layout shift from web fonts or images, bundle bloat from a dependency upgrade, or cache headers that work in dev and fail in prod. Tie advice to Lighthouse or field data where possible.`,
  promisedOutcome: `The reader knows what to measure, what changed, and a ordered fix list with expected impact on Core Web Vitals or payload.`,
  researchSeeds: [
    'site:stackoverflow.com core web vitals',
    'site:stackoverflow.com lighthouse LCP',
    'web.dev vitals',
  ],
  articleIntent: 'troubleshooting',
}

const problemLedNode = {
  realWorldProblem: `Ground posts in incident-shaped problems: connection pool exhaustion, Prisma timeouts under load, undici/fetch gotchas in serverless, auth session bugs across edge and node runtimes, N+1 queries, or "works in dev" race conditions. Pull angles from GitHub issues and serverless forums.`,
  promisedOutcome: `The reader can reproduce the failure sketch, apply a production-safe fix, and know what to monitor afterward.`,
  researchSeeds: [
    'site:stackoverflow.com prisma connection pool',
    'site:stackoverflow.com nodejs serverless cold start',
    'site:github.com/prisma/prisma/issues',
  ],
  articleIntent: 'troubleshooting',
}

const problemLedCss = {
  realWorldProblem: `Target layout bugs and behavior gaps: container queries not matching expectations, grid/flex overlap with overflow, cascade layer ordering surprises, view transitions jank, animating subtrees that hurt INP, or Tailwind vs native feature tradeoffs when upgrading. Cite reduced test cases and browser quirks.`,
  promisedOutcome: `The reader gets a minimal fix, understands browser support boundaries, and can choose native CSS vs a library with confidence.`,
  researchSeeds: [
    'site:stackoverflow.com css container query',
    'site:stackoverflow.com tailwind arbitrary',
    'developer.mozilla.org CSS',
  ],
  articleIntent: 'auto',
}

const updates = [
  {
    kind: 'patchId',
    id: DAILY_TOPIC_ID,
    data: {
      name: 'React & Modern Frontend',
      topic:
        'React 19, RSC boundaries, hydration errors, router data APIs (React Router v7, Remix), hooks pitfalls, performance regressions, client vs server component mistakes',
      tone: 'Direct and opinionated. No keynote voice. Name versions and error strings when known. One dry joke max per section.',
      cronSchedule: '0 8 * * 1,3,5',
      active: true,
      problemLed: problemLedRotationReact,
      seo: {
        targetAudience:
          'Mid-level to senior React developers shipping production apps. Comfortable with hooks, now hitting RSC, routing, or perf edge cases.',
        contentAngle:
          'Problem first: what breaks, where it shows up (SO, GitHub, Reddit), then the smallest fix that survives production. No generic feature overviews.',
        persona:
          'Senior frontend engineer who has migrated apps to RSC and modern routers and debugs hydration at 2am.',
        secondaryKeywords: [
          'react hydration error',
          'react server components',
          'react 19 upgrade',
          'react router v7',
          'remix data loading',
          'use client use server',
        ],
      },
      generation: {
        targetWordCount: 1900,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions:
          'Open with a concrete bug, warning, or failed expectation. At least two code blocks: one showing the bad path and one the fix. Name React and bundler versions when the issue is version-specific.',
      },
    },
  },
  {
    kind: 'patchId',
    id: WEEKLY_TOPIC_ID,
    data: {
      name: 'TypeScript Patterns',
      topic:
        'TypeScript strict mode errors, generic inference failures, utility and conditional types, narrowing, Zod and runtime validation aligned with types, tsconfig migration breaks',
      tone: 'Precise and blunt about any and sloppy types. Short sentences. Prefer real compiler messages over toy generics.',
      cronSchedule: '0 8 * * 2,4',
      active: true,
      problemLed: problemLedRotationTS,
      seo: {
        targetAudience:
          'Developers using TypeScript daily who still fight the compiler on generics, strict options, and library typings.',
        contentAngle:
          'Each article solves one class of real errors or PR review fights. Show the wrong inference first, then the pattern that fixes it.',
        persona:
          'Engineer who reviews TypeScript PRs and cares about strictness without cleverness for its own sake.',
        secondaryKeywords: [
          'typescript strict mode',
          'typescript generics error',
          'zod typescript infer',
          'typescript satisfies',
          'type narrowing typescript',
        ],
      },
      generation: {
        targetWordCount: 2000,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions:
          'Quote or paraphrase a realistic compiler error in the hook. Use playground-ready examples. End with when not to use the advanced pattern.',
      },
    },
  },
  {
    kind: 'byName',
    name: 'Web Performance & Core Web Vitals',
    data: {
      name: 'Web Performance & Core Web Vitals',
      topic:
        'LCP CLS INP regressions, image and font loading, JavaScript cost, caching and CDN behavior, edge vs origin, Lighthouse and field data',
      tone: 'Numbers first. If you cannot point to a metric or byte count, say less.',
      cronSchedule: '0 8 * * 6',
      active: true,
      problemLed: problemLedPerf,
      seo: {
        targetAudience:
          'Frontend developers responsible for Core Web Vitals or who get paged when Lighthouse drops after a release.',
        contentAngle:
          'Tie each post to a regression story: before metric, suspected cause, change, after metric. Avoid tips without measurement.',
        persona:
          'Engineer who has pulled LCP from red to green on a real product and documents the proof.',
        secondaryKeywords: [
          'LCP optimization',
          'cumulative layout shift fix',
          'INP javascript',
          'core web vitals 2024',
          'lighthouse performance',
        ],
      },
      generation: {
        targetWordCount: 1900,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions:
          'Include before/after numbers (ms, KB, or score deltas) or explain exactly how to capture them. One section on what commonly fakes a win in lab but fails in field.',
      },
    },
  },
  {
    kind: 'byName',
    name: 'Node.js & Backend Patterns',
    data: {
      name: 'Node.js & Backend Patterns',
      topic:
        'Node.js and serverless runtimes, HTTP APIs, auth sessions, Prisma Drizzle SQL, connection limits, observability, tRPC edges',
      tone: 'Production first. Say what breaks under load or cold start. Skip enterprise pattern theater.',
      cronSchedule: '0 10 * * 4',
      active: true,
      problemLed: problemLedNode,
      seo: {
        targetAudience:
          'Fullstack devs who ship backends but feel shaky about databases, pools, and serverless limits.',
        contentAngle:
          'Frame as incident prevention: the failure, the misleading dev experience, the prod-safe fix, the guardrail.',
        persona:
          'Engineer who owns API uptime and has debugged pool exhaustion and flaky serverless auth.',
        secondaryKeywords: [
          'nodejs prisma production',
          'serverless database connection',
          'trpc error handling',
          'rest api timeout',
        ],
      },
      generation: {
        targetWordCount: 2000,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions:
          'Always include a "production gotcha" section: timeouts, pools, env differences, or observability. Prefer one vertical slice over ten shallow bullets.',
      },
    },
  },
  {
    kind: 'byName',
    name: 'Modern CSS & UI',
    data: {
      name: 'Modern CSS & UI',
      topic:
        'Container queries, cascade layers, grid and subgrid, scroll-driven and view-driven UX, view transitions, Tailwind v4 workflows, design tokens in CSS',
      tone: 'Excited about native CSS but honest about bugs and support. No sneering at users on older browsers without a fallback story.',
      cronSchedule: '0 8 * * 0',
      active: true,
      problemLed: problemLedCss,
      seo: {
        targetAudience:
          'Frontend developers who want modern layout and motion without reaching for JS by default.',
        contentAngle:
          'Fix a specific layout or motion bug with native CSS, show the old hack, and state support and fallbacks plainly.',
        persona:
          'CSS-focused engineer who rips out JS for subtrees that CSS can own safely.',
        secondaryKeywords: [
          'css container queries',
          'css grid layout fix',
          'tailwind css v4',
          'view transitions api',
        ],
      },
      generation: {
        targetWordCount: 1600,
        includeCodeExamples: true,
        enableImageGeneration: true,
        customInstructions:
          'Every post compares old vs new approach with minimal HTML/CSS. Mention baseline browser support or use a @supports gate when it matters.',
      },
    },
  },
]

async function run() {
  console.log('Updating content topics in Sanity...\n')

  for (const u of updates) {
    try {
      if (u.kind === 'patchId') {
        await client.patch(u.id).set(u.data).commit()
        console.log(`✓ Patched (by id): ${u.data.name}`)
      } else if (u.kind === 'byName') {
        await patchOrCreateByName(u.name, u.data)
      }
    } catch (err) {
      console.error(`✗ Failed for "${u.data?.name ?? u.name}":`, err.message)
    }
  }

  console.log('\nDone. Open Studio → Content Topics to review.')
}

run()
