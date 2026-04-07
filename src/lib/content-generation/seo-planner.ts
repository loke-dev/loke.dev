import { FLASH_MODEL, getGenAI } from './gemini'
import { normalizeGeneratedBlogMarkdown } from './normalize-generated-markdown'
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

export interface PlanOptions {
  primaryKeyword?: string
  secondaryKeywords?: string[]
  targetAudience?: string
  contentAngle?: string
  targetWordCount?: number
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
  'A Guide to',
  'Introduction to',
  'Getting Started with',
  'How to Use',
]

export async function planContent(
  topic: string,
  tone: string,
  research: ResearchResult,
  options: PlanOptions = {}
): Promise<ContentPlan> {
  const ai = getGenAI()

  const wordCountNote = options.targetWordCount
    ? `Target article length: ~${options.targetWordCount} words.`
    : 'Target article length: 1500–2500 words.'

  const keywordInstruction = options.primaryKeyword
    ? `PRIMARY KEYWORD (locked; use this exactly): "${options.primaryKeyword}"
This keyword must appear in: the title, the slug, the meta description, and naturally about 3 to 5 times in the article.`
    : `Choose the primary keyword from the research. Pick the phrase with the best balance of search volume and specificity. Prefer long-tail over broad terms.`

  const audienceNote = options.targetAudience
    ? `Target audience: ${options.targetAudience}`
    : 'Target audience: experienced web developers'

  const angleNote = options.contentAngle
    ? `Content angle: ${options.contentAngle}`
    : `Content angle: ${research.freshAngle}`

  const secondaryKwNote =
    options.secondaryKeywords && options.secondaryKeywords.length > 0
      ? `Locked secondary keywords (include these): ${options.secondaryKeywords.join(', ')}`
      : `Suggested secondary keywords from research: ${research.semanticKeywords.slice(0, 5).join(', ')}`

  const prompt = `You are an SEO specialist planning a blog post for a developer audience.

Topic: "${topic}"
Tone: ${tone}
${wordCountNote}
${audienceNote}
${angleNote}
Search intent: ${research.searchIntent}

${keywordInstruction}

${secondaryKwNote}

Research to draw from:
- Fresh angle: ${research.freshAngle}
- Real developer pain to center the post (use in title or H2s where honest): ${(research.developerPainPoints ?? []).slice(0, 5).join(' | ') || 'infer from questions below'}
- Community signal (this traffic is searching for answers): ${(research.communitySignals ?? []).slice(0, 5).join(' | ') || 'n/a'}
- Key facts: ${research.keyFacts.slice(0, 4).join('; ')}
- Popular questions developers search for: ${research.popularQuestions.slice(0, 3).join('; ')}
- Recent developments: ${research.recentDevelopments.slice(0, 2).join('; ')}

Avoid these overused title patterns: ${BAD_TITLE_PATTERNS.join(', ')}
Avoid these angles (already covered to death): ${research.avoidAngles.join('; ')}

Title rules:
- Must contain or closely relate to the primary keyword
- Specific and concrete: name the exact thing, not the category
- Do not use em dashes (U+2014) in title, meta description, or any heading text
- 50–65 characters for optimal SERP display
- For tutorials/how-to intent: include a specific outcome ("Build X that does Y")
- For troubleshooting intent: promise relief from a concrete failure mode developers recognize
- For informational: make a claim or observation that's interesting on its own
- No clickbait, no "you won't believe", no exclamation marks

Heading rules:
- H2s should map to specific questions from the research
- At least one H2 should target a secondary keyword phrase naturally
- Mix "how to X" with "why X" and "when to use X" headings

Return a JSON object:
{
  "title": "Specific compelling title 50–65 chars",
  "slug": "url-friendly-slug-under-60-chars",
  "metaDescription": "150–160 char description. Start with the primary keyword or a close variant. End with a clear value proposition.",
  "primaryKeyword": "the exact primary keyword phrase",
  "secondaryKeywords": ["secondary keyword 1", "secondary keyword 2", "secondary keyword 3", "secondary keyword 4"],
  "tags": ["tag1", "tag2", "tag3"],
  "headings": ["H2 heading 1", "H2 heading 2", "H2 heading 3", "H2 heading 4", "H2 heading 5"],
  "imagePrompt": "Vivid description for a blog header illustration. No text in image. Specific visual metaphor tied to the exact topic."
}`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: { temperature: 0.8 },
  })

  const text = response.text?.trim() || ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('SEO planner returned invalid JSON')

  const plan = JSON.parse(jsonMatch[0]) as ContentPlan

  plan.title = normalizeGeneratedBlogMarkdown(plan.title)
  plan.metaDescription = normalizeGeneratedBlogMarkdown(plan.metaDescription)
  plan.imagePrompt = normalizeGeneratedBlogMarkdown(plan.imagePrompt)
  plan.headings = plan.headings.map((h) => normalizeGeneratedBlogMarkdown(h))

  plan.slug = plan.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)

  return plan
}
