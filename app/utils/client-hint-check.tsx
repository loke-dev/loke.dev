import { useEffect } from 'react'
import { subscribeToSchemeChange } from '@epic-web/client-hints/color-scheme'
import { useRevalidator } from '@remix-run/react'
import { hintsUtils } from './hints'

export function ClientHintCheck() {
  const { revalidate } = useRevalidator()

  useEffect(() => {
    return subscribeToSchemeChange(() => {
      revalidate()
    })
  }, [revalidate])

  return (
    <script
      id="client-hint-check"
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  )
}
