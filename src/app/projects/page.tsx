import { getProjects } from '@/lib/projects'
import { ProjectsClient } from './projects-client'

export default async function ProjectsPage() {
  const projects = await getProjects()
  const featuredProjects = projects.filter((p) => p.featured)
  const regularProjects = projects.filter((p) => !p.featured)

  return (
    <ProjectsClient
      featuredProjects={featuredProjects}
      regularProjects={regularProjects}
    />
  )
}
