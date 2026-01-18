import { ImgHTMLAttributes } from 'react'
import { buildImageUrl, buildSrcSet } from '@/utils/image-helpers'

interface OptimizedImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  sizes?: string
  responsive?: boolean
}

export function OptimizedImage({
  src,
  width,
  height,
  quality = 80,
  format = 'webp',
  fit = 'cover',
  sizes,
  responsive = false,
  alt,
  ...props
}: OptimizedImageProps) {
  const opts = { height, quality, format, fit }

  if (responsive && width) {
    const widths = [width * 0.5, width, width * 1.5, width * 2]
      .map((w) => Math.round(w))
      .filter((w) => w <= 2400)
    return (
      <img
        src={buildImageUrl(src, { ...opts, width })}
        srcSet={buildSrcSet(src, widths, opts)}
        sizes={sizes || `(max-width: ${width}px) 100vw, ${width}px`}
        alt={alt}
        {...props}
      />
    )
  }

  return (
    <img src={buildImageUrl(src, { ...opts, width })} alt={alt} {...props} />
  )
}
