import type { ImageTransformOptions } from '@/utils/image-optimizer.server'

export function buildImageUrl(
  src: string,
  options: ImageTransformOptions = {}
): string {
  const params = new URLSearchParams()
  params.set('src', src)
  if (options.width) params.set('w', options.width.toString())
  if (options.height) params.set('h', options.height.toString())
  if (options.quality) params.set('q', options.quality.toString())
  if (options.format) params.set('f', options.format)
  if (options.fit) params.set('fit', options.fit)
  return `/resources/image?${params.toString()}`
}

export function buildSrcSet(
  src: string,
  widths: number[],
  options: Omit<ImageTransformOptions, 'width'> = {}
): string {
  return widths
    .map((w) => `${buildImageUrl(src, { ...options, width: w })} ${w}w`)
    .join(', ')
}
