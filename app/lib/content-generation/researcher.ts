import type { RepositoryContext } from './analyzer'
import { FLASH_MODEL, getGenAI } from './gemini'

export interface ResearchResult {
  keyFacts: string[]
  recentDevelopments: string[]
  popularQuestions: string[]
  freshAngle: string
  avoidAngles: string[]
}

export async function researchTopic(
  topic: string,
  context: RepositoryContext
): Promise<ResearchResult> {
  const ai = getGenAI()

  const avoidList =
    context.recentTitles.length > 0
      ? `\nAlready covered titles to avoid duplicating:\n${context.recentTitles
          .slice(0, 10)
          .map((t) => `- ${t}`)
          .join('\n')}`
      : ''

  const prompt = `You are a research assistant helping a developer blogger write about: "${topic}"

Research this topic and extract the most valuable information for a developer audience.${avoidList}

Return a JSON object with this exact structure:
{
  "keyFacts": ["fact 1", "fact 2", "fact 3"],
  "recentDevelopments": ["recent change or trend 1", "recent change or trend 2"],
  "popularQuestions": ["question developers commonly have about this", "another question"],
  "freshAngle": "a specific, non-obvious angle or take on this topic that hasn't been covered to death",
  "avoidAngles": ["generic angle to avoid", "another overused take"]
}

Focus on practical, real-world developer concerns. Be specific, not generic.`

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
      freshAngle: topic,
      avoidAngles: [],
    }
  }

  try {
    return JSON.parse(jsonMatch[0]) as ResearchResult
  } catch {
    return {
      keyFacts: [],
      recentDevelopments: [],
      popularQuestions: [],
      freshAngle: topic,
      avoidAngles: [],
    }
  }
}
