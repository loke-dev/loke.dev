import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const SANITY_PROJECT_ID = 'l25uat4p'
const SANITY_DATASET = 'production'

const voiceRules = [
  { label: 'em dash', pattern: /—/u },
  {
    label: 'stock AI phrase',
    pattern:
      /\b(?:delve|delving|landscape|seamless|robust|comprehensive|cutting-edge|game[ -]?changer|leverage|unlock|empower|revolutionize|transformative|testament|ever-evolving)\b/iu,
  },
  {
    label: 'stock AI phrasing',
    pattern: /\b(?:it'?s important to note|in today'?s|at the end of the day|in conclusion|dive into)\b/iu,
  },
]

const ignoredFields = new Set([
  '_createdAt',
  '_id',
  '_key',
  '_rev',
  '_type',
  '_updatedAt',
  'code',
  'editorial',
  'github',
  'href',
  'language',
  'reproduction',
  'repository',
  'setupCommand',
  'slug',
  'sources',
  'url',
  'verificationCommand',
  'versionScope',
])

function findVoiceIssues(text, location) {
  return voiceRules.flatMap(({ label, pattern }) => {
    const match = text.match(pattern)
    return match ? [`${location}: ${label} “${match[0]}”`] : []
  })
}

function collectDocumentText(value, location, issues) {
  if (typeof value === 'string') {
    issues.push(...findVoiceIssues(value, location))
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectDocumentText(item, `${location}[${index}]`, issues)
    )
    return
  }

  if (!value || typeof value !== 'object') return

  for (const [key, nestedValue] of Object.entries(value)) {
    if (ignoredFields.has(key)) continue
    collectDocumentText(nestedValue, `${location}.${key}`, issues)
  }
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory()
        ? listFiles(path)
        : entry.isFile() && /\.(astro|ts|tsx)$/.test(entry.name)
          ? [path]
          : []
    })
  )
  return files.flat()
}

const query = '*[_type in ["post", "project", "homePage", "aboutPage", "blogPage", "contactPage", "projectsPage", "contentTopic", "author"]]'
const endpoint = new URL(
  `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/${SANITY_DATASET}`
)
endpoint.searchParams.set('query', query)

const response = await fetch(endpoint)
if (!response.ok) {
  throw new Error(`Could not check published CMS copy: ${response.status} ${response.statusText}`)
}

const { result: documents } = await response.json()
const issues = []

for (const document of documents) {
  collectDocumentText(document, `${document._type}:${document._id}`, issues)
}

for (const file of await listFiles(new URL('../src/', import.meta.url).pathname)) {
  const text = await readFile(file, 'utf8')
  issues.push(...findVoiceIssues(text, file.replace(process.cwd(), '.')))
}

if (issues.length) {
  console.error('Public copy voice check failed:\n')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(`Public copy voice check passed for ${documents.length} CMS documents.`)
