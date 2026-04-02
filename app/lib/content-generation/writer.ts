import { getGenAI, pickOne, PRO_MODEL } from './gemini'
import type { ResearchResult } from './researcher'
import type { ContentPlan } from './seo-planner'

const OPENING_HOOKS = [
  'Start with a concrete problem or frustration developers face, then immediately address it.',
  'Open with a surprising fact or counterintuitive observation from the research.',
  'Begin with a direct, opinionated statement about the topic — no hedging.',
  'Open by describing a specific scenario where this knowledge would have saved time.',
  'Start with a question that the rest of the post answers.',
  'Begin mid-thought, as if continuing a conversation with a developer colleague.',
]

export async function writeArticle(
  topic: string,
  tone: string,
  plan: ContentPlan,
  research: ResearchResult,
  options: {
    targetWordCount?: number
    includeCodeExamples?: boolean
    customInstructions?: string
  } = {}
): Promise<string> {
  const ai = getGenAI()
  const hook = pickOne(OPENING_HOOKS)

  const wordCount = options.targetWordCount || 1500
  const codeNote =
    options.includeCodeExamples !== false
      ? 'Include at least 2–3 practical code examples with correct syntax.'
      : 'Minimize code examples, focus on concepts and explanations.'

  const customNote = options.customInstructions
    ? `\nAdditional instructions: ${options.customInstructions}`
    : ''

  const prompt = `Write a technical blog post in markdown for experienced web developers.

**Title:** ${plan.title}
**Primary keyword:** ${plan.primaryKeyword}
**Secondary keywords:** ${plan.secondaryKeywords.join(', ')}
**Tone:** ${tone}
**Target length:** ~${wordCount} words

**Opening hook to use:**
${hook}
Never start with "In this post", "In this article", "Today we'll", or any variation.

**Suggested heading structure:**
${plan.headings.map((h) => `- ${h}`).join('\n')}
(Adapt these as needed — don't follow them robotically)

**Key facts to incorporate naturally:**
${research.keyFacts.map((f) => `- ${f}`).join('\n')}

**Questions to answer:**
${research.popularQuestions.map((q) => `- ${q}`).join('\n')}

**Writing rules:**
- First person is fine when it fits naturally ("I've found", "I prefer")
- Vary sentence length — mix short punchy sentences with longer ones
- Be opinionated. Share a perspective. Don't hedge everything.
- ${codeNote}
- Use ## for H2, ### for H3, \`\`\`lang for code blocks
- No frontmatter, no title at the top — start directly with the content
- Include practical gotchas, edge cases, or trade-offs where relevant
- Mention the primary keyword naturally 3–5 times total${customNote}

Write the full article now.`

  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: prompt,
    config: { temperature: 1.0 },
  })

  let content = response.text?.trim() || ''

  // Strip wrapping code blocks if model added them
  if (content.startsWith('```')) {
    content = content
      .replace(/^```(?:markdown|md)?\n/, '')
      .replace(/\n```$/, '')
  }

  return content
}
