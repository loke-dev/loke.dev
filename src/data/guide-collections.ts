export interface GuideCollection {
  slug: string
  label: string
  title: string
  description: string
  outcome: string
  postSlugs: string[]
  tool?: { href: string; label: string }
}

export const guideCollections: GuideCollection[] = [
  {
    slug: 'ship-with-confidence',
    label: 'Release workflow',
    title: 'Ship changes without guessing',
    description:
      'A practical route through preview checks, Worker configuration, and the small failures that only show up after deploy.',
    outcome:
      'You end up with a repeatable release check instead of a pile of browser tabs.',
    postSlugs: [
      'compare-preview-production-before-merge',
      'lint-wrangler-jsonc-github-actions',
      'wrangler-staging-production-bindings',
    ],
    tool: {
      href: '/tools/preview-vs-production-checker',
      label: 'Compare a preview with production',
    },
  },
  {
    slug: 'keep-dependencies-moving',
    label: 'Maintenance',
    title: 'Upgrade the stack without a surprise',
    description:
      'Useful when a runtime, package manager, framework, or lint setup changes underneath an otherwise healthy project.',
    outcome:
      'You can separate a real compatibility problem from a noisy install warning and test the right path.',
    postSlugs: [
      'node-20-eol-find-runtime-pins',
      'typescript-7-typescript-eslint-side-by-side',
      'pnpm-11-overrides-not-working-migration',
    ],
  },
  {
    slug: 'nextjs-app-router',
    label: 'Next.js',
    title: 'Make App Router changes less painful',
    description:
      'Migration notes and focused fixes for route params, CSS, caching, and the things that often get missed outside the page component.',
    outcome:
      'You get a clearer upgrade path and a better checklist for catching the quiet regressions.',
    postSlugs: [
      'migrate-nextjs-pages-router-to-app-router',
      'fix-nextjs-params-should-be-awaited',
      'nextjs-16-cache-components-cachelife-guide',
    ],
  },
  {
    slug: 'build-ai-features-carefully',
    label: 'AI work',
    title: 'Add AI without losing the plot',
    description:
      'A sensible starting point for AI-assisted code, app builders, and deciding what still needs a proper human review.',
    outcome:
      'You can keep ownership, permissions, and release checks visible while still moving quickly.',
    postSlugs: [
      'review-ai-generated-code-before-production',
      'lovable-code-ownership-github-exit-plan',
      'lovable-production-app-developer-checklist',
    ],
    tool: {
      href: '/tools/ai-app-production-readiness-checklist',
      label: 'Run the AI app release checklist',
    },
  },
]

export const toolStartingPoints = [
  {
    label: 'Before a release',
    title: 'Compare preview and production before you merge',
    description:
      'Check the visible route, redirect, metadata, and headers together. A green build does not cover all of that.',
    href: '/blog/compare-preview-production-before-merge',
  },
  {
    label: 'Cloudflare Workers',
    title: 'Lint wrangler.jsonc in GitHub Actions',
    description:
      'Keep config review close to the pull request, especially when bindings and environments can change what a Worker reaches.',
    href: '/blog/lint-wrangler-jsonc-github-actions',
  },
  {
    label: 'CMS delivery',
    title: 'Keep Sanity edits fresh without slowing the site down',
    description:
      'Use a signed content event and clear the small set of public pages that actually changed.',
    href: '/blog/revalidate-sanity-content-astro-cloudflare',
  },
]
