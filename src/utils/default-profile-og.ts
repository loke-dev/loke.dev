import { SITE_DOMAIN } from '@/utils/meta'
import defaultProfile from '@/assets/loke-clay-512.png'

export function getDefaultProfileOgUrl() {
  return new URL(defaultProfile.src, SITE_DOMAIN).href
}
