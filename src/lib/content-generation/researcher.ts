import type { RepositoryContext } from './analyzer'
import { FLASH_MODEL, getGenAI } from './gemini'
import { normalizeGeneratedBlogMarkdown } from './normalize-generated-markdown'

export type SourceType =
  | 'stackoverflow'
  | 'github_issue'
  | 'github_discussion'
  | 'reddit'
  | 'hackernews'
  | 'forum'
  | 'docs'
  | 'article'
  | 'social'
  | 'other'

export interface CitableSource {
  title: string
  url: string
  sourceType: SourceType | string
  note?: string
}

export interface ResearchResult {
  keyFacts: string[]
  recentDevelopments: string[]
  popularQuestions: string[]
  semanticKeywords: string[]
  searchIntent: string
  freshAngle: string
  avoidAngles: string[]
  developerPainPoints: string[]
  communitySignals: string[]
  citableSources: CitableSource[]
}

export interface ResearchOptions {
  primaryKeyword?: string
  targetAudience?: string
  contentAngle?: string
  realWorldProblem?: string
  promisedOutcome?: string
  researchSeeds?: string[]
  articleIntent?: string
}

function normalizeSourceTitle(text: string): string {
  return normalizeGeneratedBlogMarkdown(text)
}

function stripResearchStrings(r: ResearchResult): ResearchResult {
  const s = normalizeGeneratedBlogMarkdown
  const pain = r.developerPainPoints ?? []
  const signals = r.communitySignals ?? []
  const sources = r.citableSources ?? []
  return {
    keyFacts: (r.keyFacts ?? []).map(s),
    recentDevelopments: (r.recentDevelopments ?? []).map(s),
    popularQuestions: (r.popularQuestions ?? []).map(s),
    semanticKeywords: (r.semanticKeywords ?? []).map(s),
    searchIntent: s(r.searchIntent ?? 'informational'),
    freshAngle: s(r.freshAngle ?? ''),
    avoidAngles: (r.avoidAngles ?? []).map(s),
    developerPainPoints: pain.map(s),
    communitySignals: signals.map(s),
    citableSources: sources
      .filter(
        (c) => c && typeof c.url === 'string' && typeof c.title === 'string'
      )
      .map((c) => ({
        title: normalizeSourceTitle(c.title).trim(),
        url: c.url.trim(),
        sourceType: c.sourceType ?? 'other',
        note: c.note ? normalizeSourceTitle(c.note).trim() : undefined,
      })),
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
    ? `\nContent angle SEO field: ${options.contentAngle}`
    : ''

  const problemHint = options.realWorldProblem
    ? `\nEditor-defined problem focus (authoritative on what hurts in production): ${options.realWorldProblem}`
    : ''

  const outcomeHint = options.promisedOutcome
    ? `\nEditor-defined outcome the finished post must enable: ${options.promisedOutcome}`
    : ''

  const seedsHint =
    options.researchSeeds && options.researchSeeds.length > 0
      ? `\nRun these seeds first (paste into search as given if they are URLs or exact queries): ${options.researchSeeds.join(' | ')}`
      : ''

  const intentHint =
    options.articleIntent && options.articleIntent !== 'auto'
      ? `\nEditor preferred article shape: ${options.articleIntent.replace(/_/g, ' ')}. Set searchIntent and depth to match when consistent with evidence (troubleshooting, tutorial, informational, comparison, reference).`
      : ''

  const prompt = `You are an expert technical content researcher. The goal is a high-relevance developer blog post that solves a real problem people are hitting in the wild, not a generic overview. Topic seed: "${topic}"
${keywordHint}${audienceHint}${angleHint}${problemHint}${outcomeHint}${seedsHint}${intentHint}${avoidList}

Use Google Search aggressively. Run multiple targeted queries, for example:
- site:stackoverflow.com plus the topic, error text, or framework name
- site:reddit.com r/webdev OR r/programming OR topic-specific subreddits
- site:github.com issues or discussions plus keywords (look for highly reacted threads)
- site:news.ycombinator.com for recent spikes of interest
- "twitter.com" OR "x.com" plus topic keywords for polarized or viral tech takes when relevant
- Official docs and respected engineering blogs when they define expected behavior versus what breaks in practice

Your job is to surface evidence of real friction: duplicate questions, recurring error messages, issue trackers with many thumbs-up, threads with high engagement, or clear confusion gaps between docs and reality.

Collect:
1. What is ranking today and what angles they use
2. Concrete developer pain: symptoms, error strings, "works on my machine" class failures, upgrade gotchas, API surprises
3. Where the pain shows up online (which threads, issues, or posts). Summarize engagement signals when visible (votes, duplicate count, comment heat)
4. Recent versions, deprecations, or ecosystem shifts in the last 12 months
5. Numbers or benchmarks that make the problem credible
6. Semantic or co-occurring keywords for topical authority
7. The content gap: what exhausted developers still cannot find in one clear article

citableSources rules (critical):
- Every URL must be a link you actually saw in search results or grounding. Never invent or guess URLs.
- Prefer primary threads: Stack Overflow questions, GitHub issues or discussions, Reddit posts, HN threads, official issues trackers.
- Include 4 to 12 entries when the web actually provides them. Use fewer only if search is thin.
- sourceType must be one of: stackoverflow | github_issue | github_discussion | reddit | hackernews | forum | docs | article | social | other

Return a JSON object with this exact structure:
{
  "keyFacts": ["specific fact with numbers/versions where possible", "another concrete fact", "another"],
  "recentDevelopments": ["specific recent change or trend", "another; include versions/dates when known"],
  "popularQuestions": ["exact phrasing developers search or ask", "another question", "another"],
  "semanticKeywords": ["term Google expects in authoritative articles on this topic", "another", "another", "another", "another"],
  "searchIntent": "one of: informational | tutorial | comparison | troubleshooting | reference",
  "freshAngle": "one concrete angle tied to a real community pain point; not a vague umbrella take",
  "avoidAngles": ["generic angle that is done to death", "another tired take"],
  "developerPainPoints": ["3 to 6 vivid descriptions of real problems: what breaks, who feels it, typical trigger", "another pain point"],
  "communitySignals": ["3 to 8 bullets tying pain to the web: e.g. highly voted SO thread about X, GitHub issue 1234 on Y, active Reddit thread on Z", "another"],
  "citableSources": [
    { "title": "short human label for the link", "url": "https://...", "sourceType": "stackoverflow", "note": "optional one-line why this matters" }
  ]
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
      developerPainPoints: [],
      communitySignals: [],
      citableSources: [],
    }
  }

  try {
    const raw = JSON.parse(jsonMatch[0]) as Partial<ResearchResult>
    const merged: ResearchResult = {
      keyFacts: raw.keyFacts ?? [],
      recentDevelopments: raw.recentDevelopments ?? [],
      popularQuestions: raw.popularQuestions ?? [],
      semanticKeywords: raw.semanticKeywords ?? [],
      searchIntent: raw.searchIntent ?? 'informational',
      freshAngle: raw.freshAngle ?? topic,
      avoidAngles: raw.avoidAngles ?? [],
      developerPainPoints: raw.developerPainPoints ?? [],
      communitySignals: raw.communitySignals ?? [],
      citableSources: raw.citableSources ?? [],
    }
    return stripResearchStrings(merged)
  } catch {
    return {
      keyFacts: [],
      recentDevelopments: [],
      popularQuestions: [],
      semanticKeywords: [],
      searchIntent: 'informational',
      freshAngle: topic,
      avoidAngles: [],
      developerPainPoints: [],
      communitySignals: [],
      citableSources: [],
    }
  }
}
