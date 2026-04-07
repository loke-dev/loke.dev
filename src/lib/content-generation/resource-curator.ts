import { z } from 'zod'
import { FLASH_MODEL, generateKey, getGenAI } from './gemini'
import type { ResearchResult } from './researcher'

const MAX_RESOURCES = 10

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
    const u = url.trim()
    if (!isHttpUrl(u) || seen.has(u)) return
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

  const researchBlob = [
    ...(research.keyFacts ?? []).map((f) => `- ${f}`),
    ...(research.recentDevelopments ?? []).map((f) => `- ${f}`),
    ...(research.communitySignals ?? []).map((f) => `- community: ${f}`),
    ...(research.developerPainPoints ?? []).map((f) => `- pain: ${f}`),
  ].join('\n')

  const discovered = (research.citableSources ?? [])
    .slice(0, 14)
    .map((c) => `- ${c.title} ${c.url}`)
    .join('\n')

  const prompt = `You curate supplemental links for a developer blog post. Prioritize URLs that back real-world problems and solutions (issues, discussions, canonical docs).

Article (markdown, excerpt may be truncated):
${markdownArticle.slice(0, 12000)}

Research notes:
${researchBlob.slice(0, 5000)}

URLs already discovered during research (prefer reusing these when they still fit the finished article; do not invent alternatives):
${discovered || '(none)'}

Return JSON only, no markdown fences, with this shape:
{"resources":[{"title":"short label","url":"https://..."}]}

Rules:
- 0 to 6 *additional* items beyond what the writer already used. If nothing valid, use {"resources":[]}.
- Only https (or http for legacy docs) URLs you believe are real. No affiliate or spam.
- Titles under 80 characters.
- No duplicate URLs. Skip any URL already listed in discovered when it is redundant.`

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
    .filter((r) => isHttpUrl(r.url))
    .slice(0, 6)
    .map((r) => ({ title: r.title.trim(), url: r.url.trim() }))
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
