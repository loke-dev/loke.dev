import Image from 'next/image'
import { Link as LinkIcon } from 'lucide-react'
import { siGithub } from 'simple-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ProjectCardProps {
  title: string
  description: string
  technologies: string[]
  image?: string
  link: string
  github: string
  isFeatured?: boolean
}

export function ProjectCard({
  title,
  description,
  technologies,
  image,
  link,
  github,
  isFeatured = false,
}: ProjectCardProps) {
  const imageWidth = isFeatured ? 1200 : 800
  const imageHeight = isFeatured ? 675 : 450
  const fallbackImage = `https://placehold.co/${imageWidth}x${imageHeight}/1a1a1a/ffffff?text=${encodeURIComponent(title)}`

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-none">
        <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
          <div className="bg-muted relative h-full w-full">
            <Image
              src={image ?? fallbackImage}
              alt={title}
              width={imageWidth}
              height={imageHeight}
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
              priority={isFeatured}
            />
          </div>
        </div>
        <CardTitle className={isFeatured ? 'text-2xl' : 'text-base sm:text-lg'}>
          {title}
        </CardTitle>
        <CardDescription
          className={isFeatured ? 'mt-2 text-lg' : 'text-sm sm:text-base'}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div
          className={`flex flex-wrap ${isFeatured ? 'gap-2' : 'gap-1.5 sm:gap-2'}`}
        >
          {technologies.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className={!isFeatured ? 'text-xs sm:text-sm' : undefined}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-none flex-wrap gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
        >
          <a href={github} target="_blank" rel="noopener noreferrer">
            <svg
              role="img"
              viewBox="0 0 24 24"
              className="mr-2 h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={siGithub.path} />
            </svg>
            GitHub
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
            <LinkIcon className="mr-2 h-4 w-4" />
            Demo
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
