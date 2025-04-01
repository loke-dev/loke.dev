import type { MetaFunction } from '@remix-run/node'
import { Project } from '@/types/projects'
import { ProjectCard } from '../components/ProjectCard'

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
      'https://placehold.co/1200x630/4F46E5/FFFFFF?text=Portfolio+Website',
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
      'https://placehold.co/1200x630/6D28D9/FFFFFF?text=E-commerce+Platform',
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
    imageUrl: 'https://placehold.co/600x400/EF4444/FFFFFF?text=Recipe+App',
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
      'https://placehold.co/600x400/0EA5E9/FFFFFF?text=Weather+Dashboard',
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
    imageUrl: 'https://placehold.co/600x400/22C55E/FFFFFF?text=Task+Manager',
    github: 'https://github.com/username/task-manager',
    featured: false,
    year: 2022,
  },
]

export default function Projects() {
  const featuredProjects = projects.filter((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)

  return (
    <div className="container mx-auto px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Projects</h1>
        <p className="mb-12 text-lg text-muted-foreground">
          A showcase of my work, side projects, and experiments.
        </p>

        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">Featured Projects</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </section>
        )}

        {otherProjects.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Other Projects</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
