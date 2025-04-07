import type { MetaFunction } from '@remix-run/node'
import { Grid, Page, PageHeader, Section } from '@/components/layout'
import { ProjectCard } from '@/components/projectCard'
import { Project } from '@/types/projects'

export const meta: MetaFunction = () => {
  return [
    { title: 'Projects - loke.dev' },
    { name: 'description', content: 'My portfolio of projects and work' },
  ]
}

const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'Personal Portfolio 123',
    description:
      'A personal portfolio website built with Remix, showcasing my projects and skills.',
    technologies: ['Remix', 'React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    imageUrl:
      'https://placehold.co/500x500/4F46E5/FFFFFF?text=Portfolio+Website',
    url: 'https://loke.dev',
    github: 'https://github.com/username/portfolio',
    featured: true,
    year: 2024,
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Platform',
    description:
      'A modern e-commerce platform with product management, cart functionality, and payment processing.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Stripe'],
    imageUrl:
      'https://placehold.co/500x500/6D28D9/FFFFFF?text=E-commerce+Platform',
    github: 'https://github.com/username/ecommerce',
    featured: true,
    year: 2023,
  },
  {
    id: 'recipe-app',
    title: 'Recipe App',
    description:
      'An application for discovering and sharing recipes with friends.',
    technologies: ['React', 'Firebase', 'Styled Components'],
    imageUrl: 'https://placehold.co/500x500/EF4444/FFFFFF?text=Recipe+App',
    url: 'https://recipe-app.example.com',
    featured: false,
    year: 2023,
  },
  {
    id: 'weather-app',
    title: 'Weather Dashboard',
    description:
      'A weather dashboard providing real-time weather data for locations worldwide.',
    technologies: ['React', 'OpenWeather API', 'CSS Modules'],
    imageUrl:
      'https://placehold.co/500x500/0EA5E9/FFFFFF?text=Weather+Dashboard',
    github: 'https://github.com/username/weather-app',
    featured: false,
    year: 2022,
  },
  {
    id: 'task-manager',
    title: 'Task Manager',
    description:
      'A simple task management application with drag and drop functionality.',
    technologies: ['Vue.js', 'Vuex', 'TailwindCSS'],
    imageUrl: 'https://placehold.co/500x500/22C55E/FFFFFF?text=Task+Manager',
    github: 'https://github.com/username/task-manager',
    featured: false,
    year: 2022,
  },
]

export default function Projects() {
  const featuredProjects = projects.filter((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)

  return (
    <Page>
      <PageHeader
        title="Projects"
        description="A showcase of my work, side projects, and experiments."
      />

      {featuredProjects.length > 0 && (
        <Section title="Featured Projects">
          <div className="flex flex-col gap-10">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </Section>
      )}

      {otherProjects.length > 0 && (
        <Section title="Other Projects">
          <Grid columns={1} columnsSm={2} columnsLg={3} gap="sm">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Grid>
        </Section>
      )}
    </Page>
  )
}
