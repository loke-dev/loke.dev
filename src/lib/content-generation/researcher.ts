import type { RepositoryContext } from './analyzer'
import { FLASH_MODEL, getGenAI } from './gemini'
import { normalizeGeneratedBlogMarkdown } from './normalize-generated-markdown'

export interface ResearchResult {
  keyFacts: string[]
  recentDevelopments: string[]
  popularQuestions: string[]
  semanticKeywords: string[]
  searchIntent: string
  freshAngle: string
  avoidAngles: string[]
}

export interface ResearchOptions {
  primaryKeyword?: string
  targetAudience?: string
  contentAngle?: string
}

function stripResearchStrings(r: ResearchResult): ResearchResult {
  const s = normalizeGeneratedBlogMarkdown
  return {
    keyFacts: r.keyFacts.map(s),
    recentDevelopments: r.recentDevelopments.map(s),
    popularQuestions: r.popularQuestions.map(s),
    semanticKeywords: r.semanticKeywords.map(s),
    searchIntent: s(r.searchIntent),
    freshAngle: s(r.freshAngle),
    avoidAngles: r.avoidAngles.map(s),
  }
}

export async function researchTopic(
  topic: string,
  context: RepositoryContext,
  options: ResearchOptions = {}
): Promise<ResearchResult> {
  const ai = getGenAI()

  const avoidList =
    context.recentTitles.length > 0
      ? `\nAlready published on this site (avoid duplicating these angles):\n${context.recentTitles
          .slice(0, 10)
          .map((t) => `- ${t}`)
          .join('\n')}`
      : ''

  const keywordHint = options.primaryKeyword
    ? `\nTarget keyword to rank for: "${options.primaryKeyword}". Research what is currently ranking for this exact phrase and what those articles are missing.`
    : ''

  const audienceHint = options.targetAudience
    ? `\nTarget audience: ${options.targetAudience}. Tailor facts and questions to their knowledge level and pain points.`
    : ''

  const angleHint = options.contentAngle
    ? `\nContent angle to research toward: ${options.contentAngle}`
    : ''

  const prompt = `You are an expert technical content researcher. Research this topic for a developer blog post: "${topic}"
${keywordHint}${audienceHint}${angleHint}${avoidList}

Use Google Search to find:
1. What's currently ranking for this topic and what angles they take
2. Questions developers are actually asking (Stack Overflow, Reddit, GitHub discussions)
3. Recent developments, version changes, or ecosystem shifts in the last 12 months
4. Specific numbers, benchmarks, or statistics that add credibility
5. The semantic keywords that Google expects to see in authoritative content on this topic (LSI/co-occurring terms)
6. What the top results are missing: the content gap a new article could fill

Return a JSON object with this exact structure:
{
  "keyFacts": ["specific fact with numbers/versions where possible", "another concrete fact", "another"],
  "recentDevelopments": ["specific recent change or trend", "another; include versions/dates when known"],
  "popularQuestions": ["exact question developers search for", "another question", "another"],
  "semanticKeywords": ["term Google expects to see in authoritative articles on this topic", "another related term", "another", "another", "another"],
  "searchIntent": "one of: informational | tutorial | comparison | troubleshooting | reference",
  "freshAngle": "one specific, non-obvious angle that top results are missing; be concrete, not vague",
  "avoidAngles": ["generic angle that's been done to death", "another overused take on this topic"]
}

Be specific throughout. Vague facts like "React is popular" are useless. Concrete facts like "React 19 ships with the Actions API, replacing the useTransition workaround pattern" are valuable.`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.7,
    },
  })

  const text = response.text?.trim() || ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return {
      keyFacts: [],
      recentDevelopments: [],
      popularQuestions: [],
      semanticKeywords: [],
      searchIntent: 'informational',
      freshAngle: topic,
      avoidAngles: [],
    }
  }

  try {
    return stripResearchStrings(JSON.parse(jsonMatch[0]) as ResearchResult)
  } catch {
    return {
      keyFacts: [],
      recentDevelopments: [],
      popularQuestions: [],
      semanticKeywords: [],
      searchIntent: 'informational',
      freshAngle: topic,
      avoidAngles: [],
    }
  }
}
