import type { MetaFunction } from '@remix-run/node'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { Grid, Page, PageHeader, Section } from '@/components/layout'
import { ProjectCard } from '@/components/projectCard'
import { Project } from '@/types/projects'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Projects',
    description:
      'Portfolio of web development projects including GitDash, blog templates for Remix, Next.js, and SvelteKit, VSCode themes, and open-source tools. Built with React, TypeScript, and modern frameworks.',
    url: `${SITE_DOMAIN}/projects`,
  })
}

const projects: Project[] = [
  {
    id: 'gitdash',
    title: 'GitDash',
    description:
      'A comprehensive GitHub dashboard for developers and teams. Track repositories, pull requests, issues, and team activity in one beautiful interface. Built with modern tools for optimal performance and user experience.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'GitHub API', 'Vite'],
    imageUrl: 'https://placehold.co/500x500/6366F1/FFFFFF?text=GitDash',
    url: 'https://gitdash.dev',
    featured: true,
    year: 2024,
  },
  {
    id: 'loke-dev',
    title: 'loke.dev',
    description:
      'My personal website and blog built with Remix, featuring MDX blog posts, project showcase, and a modern design system. A playground for experimenting with the latest web technologies.',
    technologies: ['Remix', 'React', 'TypeScript', 'Tailwind CSS', 'MDX'],
    imageUrl: 'https://placehold.co/500x500/10B981/FFFFFF?text=loke.dev',
    url: 'https://loke.dev',
    github: 'https://github.com/loke-dev/loke.dev',
    featured: true,
    year: 2025,
  },
  {
    id: 'remix-mdx-blog-template',
    title: 'Remix MDX Blog Template',
    description:
      'A modern blog starter template built with Remix and MDX. Features server-side rendering, type-safe MDX components, and a beautiful default theme. Perfect for developers who want to start blogging quickly.',
    technologies: ['Remix', 'React', 'TypeScript', 'MDX', 'Vite'],
    imageUrl: 'https://placehold.co/500x500/F59E0B/FFFFFF?text=Remix+Template',
    github: 'https://github.com/loke-dev/remix-mdx-blog-template',
    url: 'https://remix-mdx-blog-template.vercel.app',
    featured: false,
    year: 2025,
  },
  {
    id: 'sveltekit-mdsvex-blog-template',
    title: 'SvelteKit MDsveX Blog Template',
    description:
      'A fast and elegant blog template built with SvelteKit and MDsveX. Includes Tailwind CSS, RSS feed generation, and excellent developer experience. Highly customizable and performant.',
    technologies: [
      'SvelteKit',
      'Svelte',
      'TypeScript',
      'MDsveX',
      'Tailwind CSS',
    ],
    imageUrl:
      'https://placehold.co/500x500/FF3E00/FFFFFF?text=SvelteKit+Template',
    github: 'https://github.com/loke-dev/sveltekit-mdsvex-blog-template',
    url: 'https://sveltekit-mdsvex-blog.loke.dev/',
    featured: false,
    year: 2025,
  },
  {
    id: 'nextjs-mdx-blog-template',
    title: 'Next.js MDX Blog Template',
    description:
      'A clean and minimal blog template for Next.js with MDX support. Features App Router, TypeScript, and a focus on great content presentation. Built for speed and simplicity.',
    technologies: ['Next.js', 'React', 'TypeScript', 'MDX', 'Tailwind CSS'],
    imageUrl:
      'https://placehold.co/500x500/000000/FFFFFF?text=Next.js+Template',
    url: 'https://nextjs-mdx-blog-template.vercel.app',
    github: 'https://github.com/loke-dev/nextjs-mdx-blog-template',
    featured: false,
    year: 2025,
  },
  {
    id: 'angrboda',
    title: 'Angrboda VSCode Theme',
    description:
      'A carefully crafted dark theme for Visual Studio Code with vibrant colors and excellent contrast. Designed for long coding sessions with reduced eye strain.',
    technologies: ['TypeScript', 'VSCode Extension API'],
    imageUrl: 'https://placehold.co/500x500/7C3AED/FFFFFF?text=Angrboda',
    github: 'https://github.com/loke-dev/Angrboda',
    featured: false,
    year: 2025,
  },
  {
    id: 'tcg',
    title: 'Team Color Generator',
    description:
      'Generate beautiful team colors for your projects, sports teams, or gaming guilds. Built with Vue.js for a smooth and interactive color selection experience.',
    technologies: ['Vue.js', 'JavaScript', 'CSS'],
    imageUrl: 'https://placehold.co/500x500/EC4899/FFFFFF?text=TCG',
    github: 'https://github.com/loke-dev/TCG',
    url: 'https://tcg.loke.dev/',
    featured: false,
    year: 2025,
  },
  {
    id: 'awesome-gridsome',
    title: 'Awesome Gridsome',
    description:
      'A curated list of awesome Gridsome resources, starters, plugins, and tutorials. A comprehensive collection for the Gridsome community with 64 stars and growing.',
    technologies: ['Documentation', 'Markdown'],
    imageUrl:
      'https://placehold.co/500x500/0EA5E9/FFFFFF?text=Awesome+Gridsome',
    github: 'https://github.com/loke-dev/awesome-gridsome',
    featured: false,
    year: 2025,
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
