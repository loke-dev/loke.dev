const bannedPatterns = [
  /—/u,
  /\b(?:delve|delving|landscape|seamless|robust|comprehensive|cutting-edge|game[ -]?changer|leverage|unlock|empower|revolutionize|transformative|testament|ever-evolving)\b/iu,
  /\b(?:it'?s important to note|in today'?s|at the end of the day|in conclusion|dive into)\b/iu,
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

export const voiceDescription =
  'Use casual, plain English. Write like a real person, not a polished AI demo. No em dashes. Avoid stock words like “seamless”, “robust”, “comprehensive”, “leverage”, and “unlock”.'

export function validatePublicCopy(value: unknown): true | string {
  const texts: string[] = []

  const collect = (current: unknown, key?: string) => {
    if (key && ignoredFields.has(key)) return
    if (typeof current === 'string') {
      texts.push(current)
      return
    }
    if (Array.isArray(current)) {
      current.forEach((item) => collect(item))
      return
    }
    if (!current || typeof current !== 'object') return
    for (const [nestedKey, nestedValue] of Object.entries(current)) {
      collect(nestedValue, nestedKey)
    }
  }

  collect(value)
  const match = texts
    .flatMap((text) =>
      bannedPatterns.map((pattern) => text.match(pattern)?.[0])
    )
    .find(Boolean)

  return match
    ? `Remove “${match}”. Keep the wording plain and casual; em dashes and stock AI phrasing are not allowed.`
    : true
}
