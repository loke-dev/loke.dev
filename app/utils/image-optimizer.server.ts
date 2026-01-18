import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png'

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: ImageFormat
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

const DEFAULT_QUALITY = 80
const MAX_WIDTH = 2400
const MAX_HEIGHT = 2400

export async function optimizeImage(
  imagePath: string,
  options: ImageTransformOptions = {}
) {
  const pathFromPublic = imagePath.startsWith('/')
    ? imagePath.slice(1)
    : imagePath
  const fullPath = join(process.cwd(), 'public', pathFromPublic)

  if (!existsSync(fullPath)) {
    throw new Error(`Image not found: ${imagePath}`)
  }

  const {
    width,
    height,
    quality = DEFAULT_QUALITY,
    format = 'webp',
    fit = 'cover',
  } = options

  const imageBuffer = await readFile(fullPath)

  let transformer = sharp(imageBuffer)

  if (width || height) {
    const resizeWidth = width ? Math.min(width, MAX_WIDTH) : undefined
    const resizeHeight = height ? Math.min(height, MAX_HEIGHT) : undefined

    transformer = transformer.resize(resizeWidth, resizeHeight, {
      fit,
      withoutEnlargement: true,
    })
  }

  switch (format) {
    case 'webp':
      transformer = transformer.webp({ quality })
      break
    case 'avif':
      transformer = transformer.avif({ quality })
      break
    case 'jpeg':
      transformer = transformer.jpeg({ quality, mozjpeg: true })
      break
    case 'png':
      transformer = transformer.png({ quality })
      break
  }

  const optimizedBuffer = await transformer.toBuffer()
  const metadata = await sharp(optimizedBuffer).metadata()

  return {
    buffer: optimizedBuffer,
    contentType: `image/${format}`,
    width: metadata.width,
    height: metadata.height,
  }
}

export function getImageCacheHeaders() {
  return {
    'Cache-Control': 'public, max-age=31536000, immutable',
  }
}
