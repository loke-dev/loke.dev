import { FLASH_MODEL, getGenAI } from './gemini'

const BANNED_PHRASES = [
  'delve',
  "it's worth noting",
  "let's explore",
  "let's dive",
  'seamlessly',
  'in conclusion',
  'in summary',
  'furthermore',
  'moreover',
  'revolutionize',
  'game-changing',
  'game changer',
  'in the realm of',
  'at its core',
  'navigate the',
  'embark on',
  'harness the power',
  'leverage',
  'unlock the potential',
  'it is important to note',
  'it should be noted',
  'rest assured',
  'look no further',
  'exciting',
  'robust',
  'cutting-edge',
  'state-of-the-art',
]

export async function humanizeContent(markdown: string): Promise<string> {
  const ai = getGenAI()

  const prompt = `You are a technical editor. Rewrite this blog post to sound like it was written by a real senior developer — not AI.

BANNED phrases (never use any of these):
${BANNED_PHRASES.map((p) => `- "${p}"`).join('\n')}

Rules:
- Keep all the facts, code examples, and structure exactly intact
- Vary sentence length aggressively — some very short, some longer
- Add one dry, understated developer humor moment per section (nothing forced)
- Replace vague examples with specific, realistic ones
- Make opinionated statements more direct and personal
- Start paragraphs differently — avoid starting consecutive paragraphs with "This" or "The"
- Remove any remaining AI padding or filler words
- Keep markdown formatting (##, ###, code blocks) intact

Here's the article to rewrite:

${markdown}`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: { temperature: 1.0 },
  })

  let content = response.text?.trim() || markdown

  // Strip wrapping code blocks if model added them
  if (content.startsWith('```')) {
    content = content
      .replace(/^```(?:markdown|md)?\n/, '')
      .replace(/\n```$/, '')
  }

  return content
}
