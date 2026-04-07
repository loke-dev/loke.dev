import { z } from 'zod'
import { FLASH_MODEL, generateKey, getGenAI } from './gemini'
import { normalizeUrlForDedup } from './grounding-sources'
import { sanitizeHttpResourceUrl } from './markdown-link-utils'
import type { ResearchResult } from './researcher'

const MAX_RESOURCES = 3
const MAX_CURATED_EXTRAS = 1

const CuratedSchema = z.object({
  resources: z.array(
    z.object({
      title: z.string().min(1),
      url: z.string().url(),
    })
  ),
})

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

function stripCodeFences(text: string): string {
  let t = text.trim()
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
  }
  return t.trim()
}

export function mergeResourceLinks(
  research: ResearchResult,
  curated: Array<{ title: string; url: string }>
): Array<{ title: string; url: string }> {
  const seen = new Set<string>()
  const out: Array<{ title: string; url: string }> = []
  const push = (title: string, url: string) => {
    const u = sanitizeHttpResourceUrl(url)
    if (!u || !isHttpUrl(u) || seen.has(u)) return
    seen.add(u)
    out.push({ title: title.trim().slice(0, 200), url: u })
  }
  for (const c of research.citableSources ?? []) {
    push(c.title, c.url)
  }
  for (const c of curated) {
    push(c.title, c.url)
  }
  return out.slice(0, MAX_RESOURCES)
}

export async function curateResources(
  markdownArticle: string,
  research: ResearchResult
): Promise<Array<{ title: string; url: string }>> {
  const ai = getGenAI()

  const allowedNorm = new Set(
    (research.citableSources ?? []).map((c) => normalizeUrlForDedup(c.url))
  )

  const researchBlob = [
    ...(research.keyFacts ?? []).map((f) => `- ${f}`),
    ...(research.recentDevelopments ?? []).map((f) => `- ${f}`),
    ...(research.communitySignals ?? []).map((f) => `- community: ${f}`),
    ...(research.developerPainPoints ?? []).map((f) => `- pain: ${f}`),
  ].join('\n')

  const discovered = (research.citableSources ?? [])
    .slice(0, 5)
    .map((c) => `- ${c.title} ${c.url}`)
    .join('\n')

  const prompt = `You may add at most one supplemental resource row for the post's Resources list (not shown in the article body), only when the article is missing a clearly critical reference (for example canonical official docs for an API named in the solution).

Article (markdown, excerpt may be truncated):
${markdownArticle.slice(0, 12000)}

Research notes:
${researchBlob.slice(0, 5000)}

URLs already discovered during research (prefer those; never invent):
${discovered || '(none)'}

Return JSON only, no markdown fences:
{"resources":[{"title":"short label","url":"https://..."}]}

Rules:
- Default: {"resources":[]}. Add 0 or 1 item only. If the article already cites enough or nothing is essential, return {"resources":[]}.
- Only real https (or http for legacy docs). No affiliate or spam.
- Titles under 80 characters. No duplicate URLs.
- Every url must be copied exactly from "URLs already discovered" above. Never invent or paraphrase a URL.`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: { temperature: 0.3 },
  })

  const raw = stripCodeFences(response.text?.trim() || '')
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  const checked = CuratedSchema.safeParse(parsed)
  if (!checked.success) return []

  return checked.data.resources
    .map((r) => {
      const url = sanitizeHttpResourceUrl(r.url.trim())
      if (!url) return null
      return { title: r.title.trim(), url }
    })
    .filter(
      (r): r is { title: string; url: string } =>
        r !== null &&
        isHttpUrl(r.url) &&
        allowedNorm.has(normalizeUrlForDedup(r.url))
    )
    .slice(0, MAX_CURATED_EXTRAS)
}

export function keyResourcesForSanity(
  resources: Array<{ title: string; url: string }>
): Array<{ _key: string; title: string; url: string }> {
  return resources.map((r, i) => ({
    _key: `res-${i}-${generateKey()}`,
    title: r.title,
    url: r.url,
  }))
}
