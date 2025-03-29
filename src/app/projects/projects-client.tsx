'use client'

import { fadeInSlideUp, scaleIn } from '@/lib/animations'
import { ProjectCard } from '@/components/projectCard'
import { Animated } from '@/components/ui/animated'
import type { Project } from '@/types/project'

interface ProjectsClientProps {
  featuredProjects: Project[]
  regularProjects: Project[]
}

export function ProjectsClient({
  featuredProjects,
  regularProjects,
}: ProjectsClientProps) {
  return (
    <div className="container max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Animated variants={fadeInSlideUp} className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          A collection of projects I've worked on, showcasing my experience in
          web development, AI, and software engineering
        </p>
      </Animated>

      {featuredProjects.length > 0 && (
        <div className="mt-12">
          <Animated variants={fadeInSlideUp} delay={0.2}>
            <h2 className="mb-8 text-center text-2xl font-semibold">
              Featured Projects
            </h2>
          </Animated>
          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <Animated
                key={project.id}
                variants={scaleIn}
                delay={0.4 + index * 0.1}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  image={project.image}
                  link={project.link}
                  github={project.github}
                  isFeatured={true}
                />
              </Animated>
            ))}
          </div>
        </div>
      )}

      {regularProjects.length > 0 && (
        <div className="mt-16">
          <Animated variants={fadeInSlideUp} delay={0.6}>
            <h2 className="mb-8 text-center text-2xl font-semibold">
              More Projects
            </h2>
          </Animated>
          <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {regularProjects.map((project, index) => (
              <Animated
                key={project.id}
                variants={scaleIn}
                delay={0.8 + index * 0.1}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  image={project.image}
                  link={project.link}
                  github={project.github}
                />
              </Animated>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
