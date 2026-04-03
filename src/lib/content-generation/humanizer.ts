import { FLASH_MODEL, getGenAI } from './gemini'

const BANNED_PHRASES = [
  'delve',
  "it's worth noting",
  "let's explore",
  "let's dive",
  "let's take a look",
  'seamlessly',
  'in conclusion',
  'in summary',
  'to summarize',
  'as we can see',
  'furthermore',
  'moreover',
  'additionally',
  'in addition',
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
  'it is worth noting',
  'rest assured',
  'look no further',
  'exciting',
  'robust',
  'cutting-edge',
  'state-of-the-art',
  'best practices',
  "in today's world",
  'in the modern world',
  'the world of',
  'when it comes to',
  'the fact that',
  'needless to say',
  'of course',
  'obviously',
  'clearly',
  'simply put',
  'in other words',
  'that being said',
  'having said that',
  'with that in mind',
  'first and foremost',
  'last but not least',
  'the bottom line',
  'at the end of the day',
]

export async function humanizeContent(markdown: string): Promise<string> {
  const ai = getGenAI()

  const prompt = `You are a ruthless technical editor who despises AI-generated writing. Your job is to rewrite this blog post so it reads like it came from a real senior developer who has strong opinions and actually ships code — not a language model trying to sound helpful.

BANNED phrases — if any of these appear, cut them or rewrite the sentence entirely:
${BANNED_PHRASES.map((p) => `- "${p}"`).join('\n')}

Structural rules — these are non-negotiable:
- Shatter paragraph uniformity. Mix 1-sentence paragraphs with longer ones. AI writing has suspiciously even paragraph lengths.
- Vary sentence rhythm violently. Three short sentences. Then one that runs longer and sets up the next point without wrapping up cleanly.
- Start sentences with conjunctions sometimes. "But that's the wrong mental model." "And it gets worse."
- Cut filler ruthlessly. Every sentence must earn its place. Delete anything that doesn't add information or voice.
- No summary conclusions. Real blog posts don't end with "In conclusion, we learned X, Y, Z." End on something concrete or a parting opinion.
- Remove all throat-clearing. Opening sentences that explain what the article will cover — cut them.

Voice rules:
- Take actual positions. Don't hedge with "it depends" or "there are tradeoffs." Pick a side and defend it.
- Use contractions naturally. "You're" not "you are". "It's" not "it is". "Don't" not "do not".
- Use specific, real examples. Not "a popular framework" — name it. Not "a large file" — give a size.
- First person is fine. "I've been burned by this." "My preferred approach is..."
- One moment of dry technical humor per section — understated, not forced. The kind of thing that gets a knowing nod, not a laugh.
- Occasionally contradict conventional wisdom with a specific reason why.

What NOT to change:
- All facts, data, and technical accuracy must remain intact
- All code examples stay exactly as-is
- Markdown structure (##, ###, code blocks, lists) stays intact
- SEO keywords should still appear naturally

Here is the article to rewrite:

${markdown}`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: { temperature: 1.2 },
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
