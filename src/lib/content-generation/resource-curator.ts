import { z } from 'zod'
import { FLASH_MODEL, generateKey, getGenAI } from './gemini'
import type { ResearchResult } from './researcher'

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

export async function curateResources(
  markdownArticle: string,
  research: ResearchResult
): Promise<Array<{ title: string; url: string }>> {
  const ai = getGenAI()

  const researchBlob = [
    ...research.keyFacts.map((f) => `- ${f}`),
    ...research.recentDevelopments.map((f) => `- ${f}`),
  ].join('\n')

  const prompt = `You curate supplemental links for a developer blog post.

Article (markdown, excerpt may be truncated):
${markdownArticle.slice(0, 12000)}

Research notes:
${researchBlob.slice(0, 6000)}

Return JSON only, no markdown fences, with this shape:
{"resources":[{"title":"short label","url":"https://..."}]}

Rules:
- 0 to 6 items. If nothing valid, use {"resources":[]}.
- Only include URLs you believe are real official docs, repos, or well-known references.
- Prefer https. No affiliate or spam links.
- Titles under 80 characters.
- Do not duplicate the same URL.`

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
    .slice(0, 8)
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
