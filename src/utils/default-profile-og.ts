import { getImage } from 'astro:assets'
import { SITE_DOMAIN } from '@/utils/meta'
import defaultProfile from '@/assets/loke-clay.png'

let defaultProfileOgUrlPromise: Promise<string> | null = null

export function getDefaultProfileOgUrl() {
  defaultProfileOgUrlPromise ??= getImage({
    src: defaultProfile,
    width: 1200,
    height: 1200,
    format: 'webp',
    quality: 82,
  }).then((defaultOg) => new URL(defaultOg.src, SITE_DOMAIN).href)
  return defaultProfileOgUrlPromise
}
