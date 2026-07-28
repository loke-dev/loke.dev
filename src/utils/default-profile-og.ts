import { SITE_DOMAIN } from '@/utils/meta'

export function getDefaultProfileOgUrl() {
  return new URL('/brand/workshop-signal/loke-og-default.png', SITE_DOMAIN).href
}
