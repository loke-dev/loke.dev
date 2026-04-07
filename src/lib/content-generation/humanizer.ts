import { FLASH_MODEL, getGenAI } from './gemini'
import { normalizeGeneratedBlogMarkdown } from './normalize-generated-markdown'

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
  'tapestry',
  'pivotal moment',
  'plays a pivotal',
  'instrumental in',
  'shed light',
  'shedding light',
  'deep dive',
  'unlock insights',
  'rich ecosystem',
  'ever-evolving',
  'paradigm shift',
  'synergy',
  'holistic approach',
]

export async function humanizeContent(markdown: string): Promise<string> {
  const ai = getGenAI()

  const prompt = `You are a ruthless technical editor who despises AI-generated writing. Rewrite this blog post so it reads like a real senior developer with strong opinions who actually ships code, not a language model trying to sound helpful or upbeat.

Hard ban on typography: do not output the em dash character (U+2014) or spaced en dash used as a clause hinge anywhere in your rewrite, including headings. Use commas, periods, colons, parentheses, or two sentences instead.
Do not use semicolons between clauses in body prose. Prefer a period and a new sentence, or a comma if it still reads clearly. Semicolons inside fenced code blocks must remain exactly as needed for the language.

BANNED phrases (if any appear, cut or rewrite the sentence):
${BANNED_PHRASES.map((p) => `- "${p}"`).join('\n')}

Structural rules:
- No markdown links in the body. If you see [label](url), rewrite as plain text (the name or a short description). URLs belong in the site's Resources list, not inline.
- Remove bare https:// or http:// URL strings from prose; keep the human-readable name of the site or doc instead.
- Shatter paragraph uniformity. Mix one-sentence paragraphs with longer ones. Even paragraph length is an AI tell.
- Vary sentence rhythm. Three short sentences. Then one that runs longer and sets up the next point without wrapping up too neatly.
- Start sentences with conjunctions sometimes. "But that's the wrong mental model." "And it gets worse."
- Cut filler ruthlessly. Every sentence must earn its place. Delete anything that adds neither information nor voice.
- No summary conclusions. Do not end with "In conclusion, we learned X, Y, Z." End on something concrete or a parting opinion.
- Remove throat-clearing. Cut openings that explain what the article will cover.

Voice rules:
- Relaxed and natural, like explaining to a sharp colleague. Educational and mildly entertaining. No cheese, no forced wit, no influencer energy.
- Take clear positions where it helps. Shallow "it depends" with no default is boring: pick what you would actually do first, then qualify if needed.
- Small human imperfections are fine: occasional fragments, slightly informal grammar, a redundant phrase if it sounds spoken. Do not polish into sterility.
- Use contractions naturally. "You're" not "you are". "It's" not "it is". "Don't" not "do not".
- Use specific, real examples. Not "a popular framework": name it. Not "a large file": give a size.
- First person is fine. "I've been burned by this." "My preferred approach is..."
- At most one understated dry joke per section. Knowing nod territory, not punchlines.
- Give the reader reasons to keep going: tension, stakes, or curiosity across section breaks.

Do not change:
- Facts, data, or technical accuracy
- Code blocks and their contents (character-for-character identical inside every fenced block)
- Markdown structure (##, ###, lists). You may reword heading bullets but keep the same hierarchy count and order of sections unless a heading is pure fluff
- SEO keywords should still read naturally in prose

Article to rewrite:

${markdown}`

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: { temperature: 1.2 },
  })

  let content = response.text?.trim() || markdown

  if (content.startsWith('```')) {
    content = content
      .replace(/^```(?:markdown|md)?\n/, '')
      .replace(/\n```$/, '')
  }

  return normalizeGeneratedBlogMarkdown(content)
}
