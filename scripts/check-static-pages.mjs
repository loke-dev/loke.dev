import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const routes = [
  '/about',
  '/affiliate-disclosure',
  '/apps/flexithyme/privacy',
  '/apps/flexithyme/support',
  '/brand',
  '/changelog',
  '/contact',
  '/now',
  '/privacy',
  '/projects',
  '/services',
  '/tools',
  '/tools/1password-teams-vs-business-calculator',
  '/tools/ai-app-production-readiness-checklist',
  '/tools/cloudflare-workers-cost-calculator',
  '/tools/digitalocean-droplet-vs-app-platform-calculator',
  '/tools/git-tool-subscription-break-even-calculator',
  '/tools/kilo-pass-vs-byok-calculator',
  '/tools/kinsta-wordpress-total-cost-calculator',
  '/tools/n8n-hosting-calculator',
  '/tools/open-graph-preview-tester',
  '/tools/preview-vs-production-checker',
  '/tools/wrangler-config-explainer',
]

for (const route of routes) {
  const filePath = resolve('dist/client', `.${route}`, 'index.html')
  const html = readFileSync(filePath, 'utf8')
  if (!html.includes('<html')) {
    throw new Error(`Static route ${route} did not produce an HTML document.`)
  }
  if (html.includes('Redirecting from')) {
    throw new Error(`Static route ${route} produced a redirect document.`)
  }
}

console.log(`Static page body check passed for ${routes.length} routes.`)
