export type PartnerCategory =
  | 'AI and automation'
  | 'Cloud and hosting'
  | 'Content and email'
  | 'Developer tooling'

export interface Partner {
  slug: string
  name: string
  category: PartnerCategory
  destination: string
  summary: string
  fit: string
  relationship: 'used-on-loke-dev' | 'editorial-candidate'
  affiliate: boolean
  affiliateProgram?: string
}

export const partners = [
  {
    slug: 'cloudflare',
    name: 'Cloudflare',
    category: 'Cloud and hosting',
    destination: 'https://www.cloudflare.com/developer-platform/',
    summary:
      'Workers, static assets, edge caching, DNS, security, and related platform services.',
    fit: 'A strong fit when an application benefits from global edge execution or consolidating delivery and security in one platform.',
    relationship: 'used-on-loke-dev',
    affiliate: false,
  },
  {
    slug: 'digitalocean',
    name: 'DigitalOcean',
    category: 'Cloud and hosting',
    destination: 'https://www.digitalocean.com/',
    summary:
      'Developer-focused cloud platform with virtual machines, managed application hosting, databases, storage, Kubernetes, and AI infrastructure.',
    fit: 'A candidate for developers who want a smaller cloud platform with a choice between managed deployment and direct server control.',
    relationship: 'editorial-candidate',
    affiliate: false,
    affiliateProgram: 'https://www.digitalocean.com/affiliates',
  },
  {
    slug: 'kinsta',
    name: 'Kinsta',
    category: 'Cloud and hosting',
    destination: 'https://kinsta.com/wordpress-hosting/',
    summary:
      'Managed WordPress hosting with staging, backups, migrations, CDN, security controls, and developer access.',
    fit: 'A candidate for business or client WordPress sites where managed operations, support, staging, and predictable recovery work can justify a premium over a basic server.',
    relationship: 'editorial-candidate',
    affiliate: false,
    affiliateProgram: 'https://kinsta.com/affiliates/',
  },
  {
    slug: 'sanity',
    name: 'Sanity',
    category: 'Content and email',
    destination: 'https://www.sanity.io/',
    summary:
      'Structured content platform with a programmable editing environment and APIs.',
    fit: 'Useful when content needs a real schema, editorial workflow, and reuse across several frontends.',
    relationship: 'used-on-loke-dev',
    affiliate: false,
  },
  {
    slug: 'sentry',
    name: 'Sentry',
    category: 'Developer tooling',
    destination: 'https://sentry.io/',
    summary:
      'Application error reporting, performance monitoring, tracing, and logs.',
    fit: 'Worth adding when production failures need enough context to reproduce and prioritize them.',
    relationship: 'used-on-loke-dev',
    affiliate: false,
  },
  {
    slug: 'gitkraken',
    name: 'GitKraken',
    category: 'Developer tooling',
    destination: 'https://www.gitkraken.com/',
    summary:
      'Git desktop, CLI, IDE, worktree, merge, code review, and agent workflow tools for individual developers and teams.',
    fit: 'A candidate when visual history, private repository access, conflict handling, worktrees, or multi-repository work saves enough measured time to justify the subscription.',
    relationship: 'editorial-candidate',
    affiliate: false,
    affiliateProgram: 'https://www.gitkraken.com/referral-program',
  },
  {
    slug: '1password',
    name: '1Password',
    category: 'Developer tooling',
    destination: 'https://1password.com/',
    summary:
      'Password, passkey, SSH key, API credential, shared vault, and developer secrets tooling for individuals and organizations.',
    fit: 'A candidate for developer teams that need shared credential ownership, controlled vault access, account recovery, and a path from human secrets to CLI or service-account workflows.',
    relationship: 'editorial-candidate',
    affiliate: false,
    affiliateProgram: 'https://1password.com/affiliate',
  },
  {
    slug: 'resend',
    name: 'Resend',
    category: 'Content and email',
    destination: 'https://resend.com/',
    summary: 'Transactional email API designed for application developers.',
    fit: 'A small, focused choice for contact forms and product email sent from application code.',
    relationship: 'used-on-loke-dev',
    affiliate: false,
  },
  {
    slug: 'n8n-cloud',
    name: 'n8n Cloud',
    category: 'AI and automation',
    destination: 'https://n8n.io/cloud/',
    summary:
      'Hosted workflow automation with visual orchestration, code steps, integrations, and AI workflow support.',
    fit: 'A candidate for developers who want managed automation without operating the n8n service themselves.',
    relationship: 'editorial-candidate',
    affiliate: false,
    affiliateProgram: 'https://n8n.io/affiliates/',
  },
  {
    slug: 'lovable',
    name: 'Lovable',
    category: 'AI and automation',
    destination: 'https://lovable.dev/',
    summary:
      'AI-assisted web application builder with managed publishing, GitHub sync, and full-stack development features.',
    fit: 'A candidate for developers and technical founders who want a fast first build while keeping a path to code review, external hosting, and independent operation.',
    relationship: 'editorial-candidate',
    affiliate: false,
    affiliateProgram: 'https://lovable.dev/partners/affiliates',
  },
] satisfies Partner[]

export function getPartner(slug: string): Partner | undefined {
  return partners.find((partner) => partner.slug === slug)
}

export function getPartnerHref(partner: Partner, source: string): string {
  return `/go/${partner.slug}?from=${encodeURIComponent(source)}`
}
