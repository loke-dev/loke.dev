import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { getProjectsPage } from '@/utils/sanity.queries'
import { Grid, Page, PageHeader, Section } from '@/components/layout'
import { ProjectCard } from '@/components/projectCard'
import { client } from '@/lib/sanity/client'
import { PROJECTS_QUERY } from '@/lib/sanity/queries'
import type { Project } from '@/lib/sanity/types'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Projects',
    description:
      'Portfolio of web development projects including GitDash, blog templates for Remix, Next.js, and SvelteKit, VSCode themes, and open-source tools. Built with React, TypeScript, and modern frameworks.',
    url: `${SITE_DOMAIN}/projects`,
  })
}

export function headers() {
  return {
    'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
  }
}

export async function loader() {
  const [projects, page] = await Promise.all([
    client.fetch<Project[]>(PROJECTS_QUERY),
    getProjectsPage(),
  ])
  return { projects, page }
}

export default function Projects() {
  const { projects, page } = useLoaderData<typeof loader>()
  const featuredProjects = projects.filter((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)

  return (
    <Page>
      <PageHeader title={page.title} description={page.description} />

      {featuredProjects.length > 0 && (
        <Section title={page.featuredSectionTitle}>
          <div className="flex flex-col gap-10">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} featured />
            ))}
          </div>
        </Section>
      )}

      {otherProjects.length > 0 && (
        <Section title={page.otherSectionTitle}>
          <Grid columns={1} columnsSm={2} columnsLg={3} gap="sm">
            {otherProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </Grid>
        </Section>
      )}
    </Page>
  )
}
