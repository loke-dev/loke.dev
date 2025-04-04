import { Link } from '@remix-run/react'
import { Project } from '@/types/projects'
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
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${featured ? 'flex flex-col md:flex-row w-full' : ''}`}
    >
      {project.imageUrl && (
        <div
          className={`relative w-full overflow-hidden ${
            featured
              ? 'md:w-1/3 md:h-auto aspect-[16/9] md:aspect-auto'
              : 'aspect-[4/3]'
          }`}
        >
          <img
            src={project.imageUrl}
            alt={project.title}
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
