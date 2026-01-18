import type {
  ImageFormat,
  ImageTransformOptions,
} from '@/utils/image-optimizer.server'

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

export function buildResponsiveSrcSet(
  src: string,
  baseWidth: number,
  options: Omit<ImageTransformOptions, 'width'> = {}
): string {
  const widths = [
    Math.round(baseWidth * 0.5),
    baseWidth,
    Math.round(baseWidth * 1.5),
    Math.round(baseWidth * 2),
  ].filter((w) => w <= 2400)

  return widths
    .map((w) => `${buildImageUrl(src, { ...options, width: w })} ${w}w`)
    .join(', ')
}

export function buildSizesAttribute(config: {
  mobile?: string
  tablet?: string
  desktop?: string
  default: string
}): string {
  const sizes: string[] = []

  if (config.mobile) {
    sizes.push(`(max-width: 640px) ${config.mobile}`)
  }
  if (config.tablet) {
    sizes.push(`(max-width: 1024px) ${config.tablet}`)
  }
  if (config.desktop) {
    sizes.push(`(max-width: 1536px) ${config.desktop}`)
  }
  sizes.push(config.default)

  return sizes.join(', ')
}

export const IMAGE_PRESETS = {
  thumbnail: {
    width: 400,
    quality: 80,
    format: 'webp' as ImageFormat,
    fit: 'cover' as const,
  },
  blogPost: {
    width: 800,
    quality: 85,
    format: 'webp' as ImageFormat,
    fit: 'cover' as const,
  },
  hero: {
    width: 1920,
    height: 1080,
    quality: 90,
    format: 'webp' as ImageFormat,
    fit: 'cover' as const,
  },
  avatar: {
    width: 256,
    height: 256,
    quality: 90,
    format: 'webp' as ImageFormat,
    fit: 'cover' as const,
  },
  icon: {
    width: 64,
    height: 64,
    quality: 90,
    format: 'png' as ImageFormat,
    fit: 'contain' as const,
  },
} as const

export function getImagePreset(
  preset: keyof typeof IMAGE_PRESETS
): ImageTransformOptions {
  return IMAGE_PRESETS[preset]
}
