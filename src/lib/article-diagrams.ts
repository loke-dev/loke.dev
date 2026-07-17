type DiagramKind =
  | 'revalidation-flow'
  | 'immutable-headers-flow'
  | 'content-cache-architecture'
  | 'next-params-comparison'
  | 'next-css-diagnostic'

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
