/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { startTransition, StrictMode } from 'react'
import { loadServiceWorker } from '@remix-pwa/sw'
import { RemixBrowser } from '@remix-run/react'
import { hydrateRoot } from 'react-dom/client'

const isProduction =
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'

if (isProduction) {
  loadServiceWorker()
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  )
})
