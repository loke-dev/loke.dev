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
    <div className={`card bg-base-100 shadow-lg ${className || ''}`}>
      <div className="card-body">
        <h3 className="card-title text-lg font-medium">{title}</h3>
        <p className="mt-2">{description}</p>
      </div>
    </div>
  )
}
