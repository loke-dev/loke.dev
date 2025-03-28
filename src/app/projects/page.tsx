import { Metadata } from 'next'
import { ProjectCard } from '@/components/projectCard'
import { getProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Check out my latest projects and work',
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  const featuredProjects = projects.filter((p) => p.featured)
  const regularProjects = projects.filter((p) => !p.featured)

  return (
    <div className="container max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          A collection of projects I've worked on, showcasing my experience in
          web development, AI, and software engineering
        </p>
      </div>

      {featuredProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                image={project.image}
                link={project.link}
                github={project.github}
                isFeatured={true}
              />
            ))}
          </div>
        </div>
      )}

      {regularProjects.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">
            More Projects
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {regularProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                image={project.image}
                link={project.link}
                github={project.github}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
