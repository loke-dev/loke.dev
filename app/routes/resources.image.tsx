import { LoaderFunctionArgs } from '@remix-run/node'
import {
  getImageCacheHeaders,
  ImageFormat,
  optimizeImage,
} from '@/utils/image-optimizer.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const src = url.searchParams.get('src')
  const width = url.searchParams.get('w')
  const height = url.searchParams.get('h')
  const quality = url.searchParams.get('q')
  const format = url.searchParams.get('f') as ImageFormat | null
  const fit = url.searchParams.get('fit') as
    | 'cover'
    | 'contain'
    | 'fill'
    | 'inside'
    | 'outside'
    | null

  if (!src) {
    return new Response('Missing src parameter', { status: 400 })
  }

  try {
    const { buffer, contentType } = await optimizeImage(src, {
      width: width ? parseInt(width, 10) : undefined,
      height: height ? parseInt(height, 10) : undefined,
      quality: quality ? parseInt(quality, 10) : undefined,
      format: format || 'webp',
      fit: fit || 'cover',
    })

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        ...getImageCacheHeaders(),
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    console.error('Image optimization error:', error)
    return new Response('Image not found or optimization failed', {
      status: 404,
    })
  }
}
