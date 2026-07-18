type DiagramKind =
  | 'revalidation-flow'
  | 'immutable-headers-flow'
  | 'content-cache-architecture'
  | 'next-params-comparison'
  | 'next-css-diagnostic'
  | 'next-router-migration-map'
  | 'next-rendering-boundary'
  | 'next-cache-decision'
  | 'next-migration-rollout'

type Diagram = {
  label: string
  html: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const arrow = '<span class="article-diagram__arrow" aria-hidden="true">→</span>'
const node = (label: string, variant = '') =>
  `<span class="article-diagram__node ${variant}">${label}</span>`

const diagrams: Record<DiagramKind, Diagram> = {
  'revalidation-flow': {
    label: 'Sanity content revalidation flow',
    html: `<div class="article-diagram__flow">${node('Sanity publish')}${arrow}${node('Signed webhook', 'article-diagram__node--accent')}${arrow}${node('Deploy and targeted purge')}${arrow}${node('Warm reader paths')}</div>`,
  },
  'immutable-headers-flow': {
    label: 'Cloudflare immutable headers repair flow',
    html: `<div class="article-diagram__flow">${node('Request')}${arrow}${node('Cache hit')}${arrow}${node('Cached Response\nheaders are immutable', 'article-diagram__node--warning')}${arrow}${node('new Response(...)', 'article-diagram__node--accent')}${arrow}${node('Astro finalizes')}</div>`,
  },
  'content-cache-architecture': {
    label: 'CMS-backed Astro caching architecture',
    html: `<div class="article-diagram__architecture"><div class="article-diagram__flow">${node('Sanity CMS')}${arrow}${node('Astro render')}${arrow}${node('Cloudflare edge cache', 'article-diagram__node--accent')}${arrow}${node('Readers')}</div><div class="article-diagram__flow article-diagram__flow--secondary">${node('Signed content event')}${arrow}${node('Deploy, purge, warm')}</div></div>`,
  },
  'next-params-comparison': {
    label: 'Next.js asynchronous params comparison',
    html: `<div class="article-diagram__compare"><div class="article-diagram__panel article-diagram__panel--warning"><span class="article-diagram__eyebrow">Before</span><code>params.slug</code><strong>Sync access fails in Next.js 15+</strong></div><div class="article-diagram__panel article-diagram__panel--accent"><span class="article-diagram__eyebrow">After</span><code>const { slug } = await params</code><strong>Resolve once at the server boundary</strong></div></div>`,
  },
  'next-css-diagnostic': {
    label: 'Next.js CSS diagnostic decision tree',
    html: `<div class="article-diagram__decision"><div class="article-diagram__decision-start">Styles are missing</div><div class="article-diagram__decision-branches"><div>${node('Class missing')}<p>Check component code, CSS Module import, or Tailwind scanning.</p></div><div>${node('Rule crossed out')}<p>Check selector specificity and source order.</p></div><div>${node('No CSS asset')}<p>Run a production build and inspect the Network panel.</p></div></div></div>`,
  },
  'next-router-migration-map': {
    label: 'Pages Router to App Router migration map',
    html: `<div class="article-diagram__architecture"><div class="article-diagram__flow">${node('pages/\nexisting routes', 'article-diagram__node--warning')}${arrow}${node('Shared data, UI, tests')}${arrow}${node('app/\nfirst migrated route', 'article-diagram__node--accent')}</div><div class="article-diagram__flow article-diagram__flow--secondary">${node('Keep both routers live')}${arrow}${node('Move one route family')}${arrow}${node('Delete Pages route last')}</div></div>`,
  },
  'next-rendering-boundary': {
    label: 'Server and Client Component boundary',
    html: `<div class="article-diagram__compare"><div class="article-diagram__panel article-diagram__panel--accent"><span class="article-diagram__eyebrow">Server Component</span><code>fetch, secrets, database</code><strong>Default. Keep work and dependencies on the server.</strong></div><div class="article-diagram__panel"><span class="article-diagram__eyebrow">Client Component</span><code>useState, click, browser APIs</code><strong>Add 'use client' only at the interactive edge.</strong></div></div>`,
  },
  'next-cache-decision': {
    label: 'Next.js rendering and cache decision guide',
    html: `<div class="article-diagram__decision"><div class="article-diagram__decision-start">Does this request depend on per-user request data?</div><div class="article-diagram__decision-branches"><div>${node('Yes', 'article-diagram__node--warning')}<p>Read cookies or headers where needed. Treat the route as dynamic.</p></div><div>${node('No')}<p>Set explicit cache and revalidation rules around the data that changes.</p></div><div>${node('Not sure', 'article-diagram__node--accent')}<p>Measure the route and write down the expected freshness before shipping.</p></div></div></div>`,
  },
  'next-migration-rollout': {
    label: 'Safe App Router rollout stages',
    html: `<div class="article-diagram__flow">${node('Baseline\nexisting route')}${arrow}${node('Migrate one route family', 'article-diagram__node--accent')}${arrow}${node('Test and compare')}${arrow}${node('Ship behind normal monitoring')}${arrow}${node('Remove old route')}</div>`,
  },
}

export function renderArticleDiagram(value: {
  kind?: unknown
  caption?: unknown
}): string {
  const kind = value.kind as DiagramKind
  const diagram = diagrams[kind]
  if (!diagram) return ''

  const caption = typeof value.caption === 'string' ? value.caption : ''
  return `<figure class="article-diagram not-prose my-8" aria-label="${escapeHtml(diagram.label)}"><div class="article-diagram__surface">${diagram.html}</div>${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}</figure>`
}
