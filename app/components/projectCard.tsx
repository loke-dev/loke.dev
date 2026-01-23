import { Link } from '@remix-run/react'
import { getProjectImageSrcSet, getProjectImageUrl } from '@/lib/sanity/helpers'
import type { Project } from '@/lib/sanity/types'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project
  featured?: boolean
}) {
  const width = featured ? 800 : 500
  const height = featured ? 450 : 375
  const imageUrl = getProjectImageUrl(project, width, height)
  const srcSet = getProjectImageSrcSet(
    project,
    [Math.round(width / 2), width, Math.round(width * 1.5)],
    height
  )

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${featured ? 'flex flex-col md:flex-row w-full' : ''}`}
    >
      {imageUrl && (
        <div
          className={`relative w-full overflow-hidden ${
            featured
              ? 'md:w-1/3 md:h-auto aspect-[16/9] md:aspect-auto'
              : 'aspect-[4/3]'
          }`}
        >
          <img
            src={imageUrl}
            srcSet={srcSet || undefined}
            sizes={
              featured
                ? '(min-width: 1024px) 33vw, 100vw'
                : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
            }
            alt={project.title}
            loading="lazy"
            decoding="async"
            width={width}
            height={height}
            className="h-full w-full object-cover object-center"
          />
        </div>
      )}

      <div className={`flex flex-col ${featured ? 'md:w-2/3' : 'w-full'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={featured ? 'text-xl md:text-2xl' : 'text-lg'}>
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p
            className={`mb-4 text-muted-foreground ${featured ? 'text-base' : 'text-sm'}`}
          >
            {project.description}
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex gap-3 mt-auto">
          {project.url && (
            <Button asChild variant="default" size="sm">
              <Link to={project.url} target="_blank" rel="noopener noreferrer">
                Visit Project
              </Link>
            </Button>
          )}
          {project.github && (
            <Button asChild variant="outline" size="sm">
              <Link
                to={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}
