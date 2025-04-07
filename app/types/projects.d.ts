export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  imageUrl?: string
  url?: string
  github?: string
  featured: boolean
  year: number
}
