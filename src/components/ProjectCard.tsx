import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectCardProps {
  title: string
  description: string
  className?: string
}

export default function ProjectCard({ title, description, className }: ProjectCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}
