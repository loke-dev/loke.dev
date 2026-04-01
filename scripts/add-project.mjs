import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'l25uat4p',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

const project = {
  _type: 'project',
  title: 'SvelteKit Landing Page Template',
  slug: { _type: 'slug', current: 'sveltekit-landing-page-template' },
  description:
    'Production-ready SvelteKit + Tailwind v4 landing page template. Scores 100 on Lighthouse, loads in under 1 second, and is free and open source forever.',
  technologies: ['SvelteKit', 'Tailwind CSS', 'TypeScript', 'Vercel'],
  url: 'https://sveltekit-landing-page-template.vercel.app/',
  github: 'https://github.com/loke-dev/sveltekit-landing-page-template',
  featured: true,
  year: 2024,
}

const result = await client.create(project)
console.log('Project created:', result._id)
