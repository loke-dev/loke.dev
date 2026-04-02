import { ImgHTMLAttributes } from 'react'
import { buildImageUrl, buildSrcSet } from '@/utils/image-helpers'

interface OptimizedImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string
  width?: number
  height?: number
  quality?: number
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  sizes?: string
  responsive?: boolean
}

export function OptimizedImage({
  src,
  width,
  height,
  quality = 80,
  fit = 'cover',
  sizes,
  responsive = false,
  alt,
  ...props
}: OptimizedImageProps) {
  const baseOpts = { height, quality, fit }

  if (responsive && width) {
    const widths = [width * 0.5, width, width * 1.5, width * 2]
      .map((w) => Math.round(w))
      .filter((w) => w <= 2400)
    const sizesAttr = sizes || `(max-width: ${width}px) 100vw, ${width}px`
    return (
      <picture>
        <source
          type="image/avif"
          srcSet={buildSrcSet(src, widths, { ...baseOpts, format: 'avif' })}
          sizes={sizesAttr}
        />
        <source
          type="image/webp"
          srcSet={buildSrcSet(src, widths, { ...baseOpts, format: 'webp' })}
          sizes={sizesAttr}
        />
        <img
          src={buildImageUrl(src, { ...baseOpts, format: 'webp', width })}
          width={width}
          height={height}
          loading={props.loading ?? 'lazy'}
          decoding={props.decoding ?? 'async'}
          alt={alt}
          {...props}
        />
      </picture>
    )
  }

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={buildImageUrl(src, { ...baseOpts, format: 'avif', width })}
      />
      <source
        type="image/webp"
        srcSet={buildImageUrl(src, { ...baseOpts, format: 'webp', width })}
      />
      <img
        src={buildImageUrl(src, { ...baseOpts, format: 'webp', width })}
        width={width}
        height={height}
        loading={props.loading ?? 'lazy'}
        decoding={props.decoding ?? 'async'}
        alt={alt}
        {...props}
      />
    </picture>
  )
}
