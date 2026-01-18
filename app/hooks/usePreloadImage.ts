import { useEffect } from 'react'

interface PreloadImageOptions {
  src: string
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  as?: 'image'
}

export function usePreloadImage({
  src,
  width,
  height,
  quality = 80,
  format = 'webp',
}: PreloadImageOptions) {
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('src', src)
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('q', quality.toString())
    params.set('f', format)

    const imageUrl = `/resources/image?${params.toString()}`

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = imageUrl

    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [src, width, height, quality, format])
}
