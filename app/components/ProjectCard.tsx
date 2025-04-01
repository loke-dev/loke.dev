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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {project.imageUrl && (
        <div
          className={`relative w-full overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover object-center"
          />
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className={featured ? 'text-xl' : 'text-lg'}>
          {project.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="mb-4 text-muted-foreground text-sm">
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

      <CardFooter className="flex gap-3">
        {project.url && (
          <Button asChild variant="default" size="sm">
            <Link to={project.url} target="_blank" rel="noopener noreferrer">
              Visit Project
            </Link>
          </Button>
        )}
        {project.github && (
          <Button asChild variant="outline" size="sm">
            <Link to={project.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
