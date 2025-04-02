import { getHintUtils } from '@epic-web/client-hints'
import { clientHint as colorSchemeHint } from '@epic-web/client-hints/color-scheme'

export const hintsUtils = getHintUtils({
  theme: {
    ...colorSchemeHint,
    fallback: 'light',
  },
})

export const { getHints } = hintsUtils
export const getClientHintCheckScript = hintsUtils.getClientHintCheckScript
