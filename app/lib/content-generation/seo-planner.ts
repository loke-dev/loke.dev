import { FLASH_MODEL, getGenAI } from './gemini'
import type { ResearchResult } from './researcher'

export interface ContentPlan {
  title: string
  slug: string
  metaDescription: string
  primaryKeyword: string
  secondaryKeywords: string[]
  tags: string[]
  headings: string[]
  imagePrompt: string
}

const BAD_TITLE_PATTERNS = [
  'Ultimate Guide',
  'Complete Guide',
  'Master the Art',
  'Everything You Need',
  'Comprehensive Guide',
  'Deep Dive',
  'The Power of',
  'Unlock the',
  'Supercharge Your',
]

export async function planContent(
  topic: string,
  tone: string,
  research: ResearchResult,
  targetWordCount?: number
): Promise<ContentPlan> {
  const ai = getGenAI()

  const wordCountNote = targetWordCount
    ? `Target article length: ~${targetWordCount} words.`
    : 'Target article length: 1200–2000 words.'

  const prompt = `You are an SEO specialist planning a blog post for a developer audience.

Topic: "${topic}"
Tone: ${tone}
${wordCountNote}

Research summary:
- Fresh angle: ${research.freshAngle}
- Key facts: ${research.keyFacts.slice(0, 3).join('; ')}
- Popular questions: ${research.popularQuestions.slice(0, 2).join('; ')}

Avoid these overused title patterns: ${BAD_TITLE_PATTERNS.join(', ')}
Avoid these overused angles: ${research.avoidAngles.join('; ')}

Return a JSON object:
{
  "title": "Specific, compelling title that a developer would actually click",
  "slug": "url-friendly-slug-max-60-chars",
  "metaDescription": "150-160 char meta description with primary keyword, action-oriented",
  "primaryKeyword": "main keyword phrase",
  "secondaryKeywords": ["related keyword 1", "related keyword 2", "related keyword 3"],
  "tags": ["tag1", "tag2", "tag3"],
  "headings": ["H2 heading 1", "H2 heading 2", "H2 heading 3", "H2 heading 4"],
  "imagePrompt": "Description for a blog header image (no text in image, visual metaphor for the topic)"
}

The title should be specific and direct — not generic. Make it feel like it was written by someone who actually cares about the topic.`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: { temperature: 0.9 },
  })

  const text = response.text?.trim() || ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('SEO planner returned invalid JSON')

  const plan = JSON.parse(jsonMatch[0]) as ContentPlan

  // Ensure slug is clean
  plan.slug = plan.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96)

  return plan
}
