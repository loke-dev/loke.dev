import { promises as fs } from 'fs'
import path from 'path'
import type { Project } from '@/types/project'

export async function getProjects() {
  const filePath = path.join(process.cwd(), 'src/app/projects/projects.json')
  const fileContents = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(fileContents)
  return data.projects as Project[]
}
