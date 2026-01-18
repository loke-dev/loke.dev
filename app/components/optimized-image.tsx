import { ImgHTMLAttributes } from 'react'

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
  const buildImageUrl = (w?: number, h?: number) => {
    const params = new URLSearchParams()
    params.set('src', src)
    if (w) params.set('w', w.toString())
    if (h) params.set('h', h.toString())
    params.set('q', quality.toString())
    params.set('f', format)
    params.set('fit', fit)
    return `/resources/image?${params.toString()}`
  }

  if (responsive && width) {
    const widths = [width * 0.5, width, width * 1.5, width * 2]
      .map((w) => Math.round(w))
      .filter((w) => w <= 2400)

    const srcSet = widths.map((w) => `${buildImageUrl(w)} ${w}w`).join(', ')

    return (
      <img
        src={buildImageUrl(width, height)}
        srcSet={srcSet}
        sizes={sizes || `(max-width: ${width}px) 100vw, ${width}px`}
        alt={alt}
        {...props}
      />
    )
  }

  return <img src={buildImageUrl(width, height)} alt={alt} {...props} />
}
