import { urlFor } from './image'
import type { SanityImage } from './types'

export { formatDate } from '@/utils/format-date'

export function getSanityImageUrl(
  image: SanityImage | undefined,
  width: number,
  height?: number,
  quality: number = 80
): string | null {
  if (!image) return null
  const builder = urlFor(image).width(width).quality(quality).auto('format')
  return height ? builder.height(height).url() : builder.url()
}

export function getSanityImageSrcSet(
  image: SanityImage | undefined,
  widths: number[],
  height?: number,
  quality: number = 80,
  layoutWidth?: number
): string | null {
  if (!image) return null
  const refW = layoutWidth ?? widths[Math.floor(widths.length / 2)]!
  const parts = widths.map((w) => {
    const b = urlFor(image).width(w).quality(quality).auto('format')
    const u = height ? b.height(Math.round((height * w) / refW)).url() : b.url()
    return `${u} ${w}w`
  })
  return parts.join(', ')
}
