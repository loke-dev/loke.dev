import { FLASH_MODEL, getGenAI, pickOne } from './gemini'
import type { ResearchResult } from './researcher'
import type { ContentPlan } from './seo-planner'

const OPENING_HOOKS = [
  'Start with a concrete bug or failure you hit, then explain what it taught you.',
  'Open with a counterintuitive claim that most developers get wrong. State it bluntly, then back it up.',
  'Begin with a single line of code or an error message, then explain why it matters.',
  'Open by describing the exact moment a wrong assumption cost you hours, then get into the fix.',
  'Start with a direct opinion: "X is overrated / misunderstood / used wrong by most people." Then prove it.',
  'Begin mid-problem, as if picking up a conversation. No preamble, no setup.',
  "Open with a sharp observation about how the ecosystem handles this topic, and why it's often wrong.",
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
    targetAudience?: string
    contentAngle?: string
    persona?: string
  } = {}
): Promise<string> {
  const ai = getGenAI()
  const hook = pickOne(OPENING_HOOKS)

  const wordCount = options.targetWordCount || 1500
  const codeNote =
    options.includeCodeExamples !== false
      ? 'Include at least 2 or 3 practical code examples. Make them real: specific filenames, realistic variable names, actual error messages where relevant.'
      : 'Minimize code examples, focus on concepts and explanations.'

  const customNote = options.customInstructions
    ? `\nAdditional instructions: ${options.customInstructions}`
    : ''

  const personaLine = options.persona
    ? `You are writing as: ${options.persona}`
    : 'You are writing as a senior web developer with strong opinions, shaped by years of real production experience.'

  const audienceLine = options.targetAudience
    ? `Writing for: ${options.targetAudience}. Pitch the depth and assumed knowledge accordingly.`
    : 'Writing for: experienced web developers.'

  const angleLine = options.contentAngle
    ? `Angle: ${options.contentAngle}. This is the specific lens for the whole article.`
    : ''

  const semanticNote =
    research.semanticKeywords.length > 0
      ? `Semantic keywords to weave in naturally (these signal topical authority to Google): ${research.semanticKeywords.join(', ')}`
      : ''

  const prompt = `Write a technical blog post in markdown. ${personaLine}

${audienceLine}
${angleLine}

**Title:** ${plan.title}
**Primary keyword:** ${plan.primaryKeyword}
**Secondary keywords:** ${plan.secondaryKeywords.join(', ')}
**Tone:** ${tone}
**Target length:** ~${wordCount} words

**Opening hook:**
${hook}
Never open with "In this post", "In this article", "Today we'll", "Welcome to", or any variation. Never start by explaining what you are about to say; just say it.

**Heading structure (adapt freely, don't follow robotically):**
${plan.headings.map((h) => `- ${h}`).join('\n')}

**Research to incorporate naturally:**
${research.keyFacts.map((f) => `- ${f}`).join('\n')}

**Questions this post should answer:**
${research.popularQuestions.map((q) => `- ${q}`).join('\n')}

**Writing rules:**
- Sound like a human wrote this after shipping real work: relaxed, curious, a little opinionated, never performatively excited. Educate and entertain without sounding like a keynote or a tutorial brochure.
- Never use the em dash character (Unicode U+2014) or spaced en dash as a clause hinge. Prefer commas, periods, colons, parentheses, or split into two sentences. This is mandatory in body text.
- Do not use semicolons to glue clauses in prose. Use a full stop and a new sentence, or a comma. Keep semicolons only inside code blocks where the language requires them.
- Small rough edges are fine: occasional fragments, starting with And or But, mild repetition humans use. Do not aim for textbook polish.
- Vary sentence length aggressively. Short. Then longer when the idea needs room. Then short again. Never three sentences of similar length in a row.
- Take positions where it helps. Prefer a default recommendation over vague "it depends" with no takeaway.
- Use contractions. "You're", "it's", "don't", "that's". Sound like a person.
- First person works. "I spent two hours debugging this." "My rule of thumb is..."
- Be specific. Name the tool, the version, the exact error. Not "a common framework."
- Keep momentum: foreshadow payoffs, use concrete stakes, leave hooks into the next section so the reader wants to continue.
- ${codeNote}
- Use ## for H2, ### for H3, \`\`\`lang for code blocks
- No frontmatter, no title at the top. Start directly with the content.
- No summary conclusion. End on a concrete takeaway, a parting shot, or a gotcha, not a recap.
- Include at least one moment where you push back on conventional advice or an "obvious" solution
- Mention the primary keyword naturally about 3 to 5 times total
- ${semanticNote}${customNote}

Write the full article now. Make it the kind of post a developer bookmarks because it is actually useful, not just comprehensive.`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
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
