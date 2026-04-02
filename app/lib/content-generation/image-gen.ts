import { getGenAI, IMAGE_MODEL, pickOne } from './gemini'

const STYLE_OVERLAYS = [
  'Style: Digital drawing, hand-drawn aesthetic, warm and approachable colors. Indie illustration feel. No text in image.',
  'Style: Muted, film-like colors with slight grain. Feels like a vintage book cover. No text in image.',
  'Style: Bold shapes, limited 2–3 color palette, high contrast graphic poster. No text in image.',
  'Style: Soft painterly look, visible texture, not photorealistic. No text in image.',
  'Style: Minimal — lots of negative space, one strong focal point, restrained colors. No text in image.',
  'Style: Slightly surreal — one unexpected scale or juxtaposition, still readable. No text in image.',
]

export async function generateBlogImage(
  imagePrompt: string
): Promise<Buffer | null> {
  const ai = getGenAI()

  try {
    const overlay = pickOne(STYLE_OVERLAYS)
    const fullPrompt = `${imagePrompt}\n\n${overlay}`

    const result = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
    })

    const imageBytes = result.generatedImages?.[0]?.image?.imageBytes
    if (!imageBytes) return null

    if (typeof imageBytes === 'string') {
      return Buffer.from(imageBytes, 'base64')
    }

    return Buffer.from(imageBytes)
  } catch (err) {
    console.error('Image generation failed:', err)
    return null
  }
}
