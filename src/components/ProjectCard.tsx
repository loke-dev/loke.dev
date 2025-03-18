import Card from './ui/Card'
import Text from './ui/Text'

interface ProjectCardProps {
  title: string
  description: string
  className?: string
}

export default function ProjectCard({
  title,
  description,
  className,
}: ProjectCardProps) {
  return (
    <Card className={className}>
      <Text variant="h3" as="h3">
        {title}
      </Text>
      <Text variant="body" className="mt-2">
        {description}
      </Text>
    </Card>
  )
}
