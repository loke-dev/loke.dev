/// <reference lib="WebWorker" />

import {
  EnhancedCache,
  isDocumentRequest,
  isLoaderRequest,
  Logger,
  NavigationHandler,
  type DefaultFetchHandler,
} from '@remix-pwa/sw'

// Use a timestamp or build hash for automatic version-based invalidation
// This will be updated on each build to ensure cache invalidation
const version = 'v1-' + new Date().toISOString().split('T')[0]

const DOCUMENT_CACHE_NAME = `document-cache-${version}`
const ASSET_CACHE_NAME = `asset-cache-${version}`
const DATA_CACHE_NAME = `data-cache-${version}`

const logger = new Logger({
  prefix: '[Loke-dev]',
})

// Document cache - CacheFirst strategy for HTML pages
const documentCache = new EnhancedCache(DOCUMENT_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxEntries: 64,
    // Add cache expiration for documents
    maxAgeSeconds: 60 * 60 * 24, // 1 day
  },
})

// Asset cache - CacheFirst with longer expiration for static assets
const assetCache = new EnhancedCache(ASSET_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
    maxEntries: 100,
  },
})

// Data cache - NetworkFirst for API data
const dataCache = new EnhancedCache(DATA_CACHE_NAME, {
  version,
  strategy: 'NetworkFirst',
  strategyOptions: {
    networkTimeoutInSeconds: 10,
    maxEntries: 72,
    maxAgeSeconds: 60 * 60, // 1 hour stale data is acceptable
  },
})

// Track network status
let isOnline = true

export {}

declare let self: ServiceWorkerGlobalScope

self.addEventListener('install', (event) => {
  logger.log('Service worker installed')

  // Preload essential files - use absolute URLs and filter out any that fail
  const precacheResources = [
    self.location.origin + '/_offline',
    self.location.origin + '/manifest.json',
    self.location.origin + '/favicon.ico',
    self.location.origin + '/android-chrome-512x512.png',
    self.location.origin + '/android-chrome-192x192.png',
    self.location.origin + '/apple-touch-icon.png',
  ]

  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      // Try to cache each resource separately and ignore failures
      (async () => {
        const cache = await caches.open(DOCUMENT_CACHE_NAME)
        // Add each resource individually so a single failure doesn't break the whole cache
        await Promise.allSettled(
          precacheResources.map(async (url) => {
            try {
              const response = await fetch(url, { cache: 'reload' })
              if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.status}`)
              }
              return cache.put(url, response)
            } catch (error) {
              logger.error(`Failed to cache ${url}:`, error)
              return Promise.resolve() // Continue despite error
            }
          })
        )
      })(),
    ])
  )
})

self.addEventListener('activate', (event) => {
  logger.log('Service worker activated')

  // Get current cache names with version included
  const currentCaches = [DOCUMENT_CACHE_NAME, ASSET_CACHE_NAME, DATA_CACHE_NAME]

  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches by looking for caches that don't match our current version
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Keep non-versioned caches or caches with current version
              // Delete old version caches
              const isCurrentCache = currentCaches.includes(cacheName)
              const isOldVersionCache =
                (cacheName.startsWith('document-cache-') && !isCurrentCache) ||
                (cacheName.startsWith('asset-cache-') && !isCurrentCache) ||
                (cacheName.startsWith('data-cache-') && !isCurrentCache)

              return isOldVersionCache
            })
            .map((cacheName) => {
              logger.log(`Deleting outdated cache: ${cacheName}`)
              return caches.delete(cacheName)
            })
        )
      }),
    ])
  )
})

// Listen for online/offline events
self.addEventListener('online', () => {
  isOnline = true
  logger.log('App is online')

  // Notify all clients
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage({ type: 'ONLINE' }))
  })
})

self.addEventListener('offline', () => {
  isOnline = false
  logger.log('App is offline')

  // Notify all clients
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage({ type: 'OFFLINE' }))
  })
})

// Handle background sync for deferred operations when coming back online
self.addEventListener('sync', (event) => {
  // Use type assertion to access the tag property
  const syncEvent = event as Event & { tag: string }
  if (syncEvent.tag === 'deferred-operations') {
    logger.log('Performing deferred operations sync')
    // Implement sync logic here if needed
  }
})

export const defaultFetchHandler: DefaultFetchHandler = async ({ context }) => {
  const request = context.event.request
  const url = new URL(request.url)

  // Add cache-busting for development environment
  const isDev =
    process.env.NODE_ENV === 'development' || url.hostname === 'localhost'

  // Special case for the offline route
  if (url.pathname === '/_offline') {
    // First try to fetch from network
    try {
      const response = await fetch(request)
      // If successful, clone and cache it
      if (response.ok) {
        const responseClone = response.clone()
        caches.open(DOCUMENT_CACHE_NAME).then((cache) => {
          cache.put(request, responseClone)
          logger.log('Cached offline page from network')
        })
      }
      return response
    } catch {
      // If network fails, check all caches
      const allCaches = await caches.keys()
      for (const cacheName of allCaches) {
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(request)
        if (cachedResponse) return cachedResponse
      }

      // Otherwise, create a simple offline response
      return new Response(
        `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>You're Offline</title>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; }
              h1 { font-size: 1.5rem; }
            </style>
          </head>
          <body>
            <h1>You're offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.href='/'">Try Homepage</button>
            <button onclick="window.location.reload()">Retry</button>
          </body>
        </html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache', // Don't cache this fallback
          },
        }
      )
    }
  }

  // Skip caching for development
  if (isDev) {
    return fetch(request)
  }

  // Handle document requests
  if (isDocumentRequest(request)) {
    try {
      return await documentCache.handleRequest(request)
    } catch (error) {
      logger.error('Failed to serve document from cache:', error)

      // If we're offline and the document isn't cached, serve the offline page
      if (!isOnline) {
        const offlineUrl = self.location.origin + '/_offline'

        // Try exact match first
        let offlineResponse = await caches.match(offlineUrl)

        // If no exact match, try any match
        if (!offlineResponse) {
          const allCaches = await caches.keys()
          for (const cacheName of allCaches) {
            const cacheInstance = await caches.open(cacheName)
            offlineResponse = await cacheInstance.match(offlineUrl)
            if (offlineResponse) break
          }
        }

        if (offlineResponse) return offlineResponse
      }

      // Fall back to network
      return fetch(request)
    }
  }

  // Handle data requests (API)
  if (isLoaderRequest(request)) {
    try {
      return await dataCache.handleRequest(request)
    } catch (error) {
      logger.error('Failed to serve loader data from cache:', error)
      return fetch(request)
    }
  }

  // Handle static assets
  if (self.__workerManifest.assets.includes(url.pathname)) {
    // Add cache headers to response
    const assetResponse = await assetCache.handleRequest(request)

    // If we have a response and it's not an opaque response, add cache headers
    if (assetResponse && assetResponse.type !== 'opaque') {
      const headers = new Headers(assetResponse.headers)

      // Add cache headers if not already present
      if (!headers.has('Cache-Control')) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      }

      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers,
      })
    }

    return assetResponse
  }

  // Default to network for all other requests
  return fetch(request)
}

const messageHandler = new NavigationHandler({
  cache: documentCache,
})

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  event.waitUntil(messageHandler.handleMessage(event))
})

// Add offline fallback handling
self.addEventListener('fetch', (event: FetchEvent) => {
  const request = event.request

  // Only handle navigation requests that fail
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // First try to use the default fetch handler
          const preloadResponse = await event.preloadResponse
          if (preloadResponse) {
            return preloadResponse
          }

          return await fetch(request)
        } catch {
          // If offline, try to serve the offline page
          const cache = await caches.open(DOCUMENT_CACHE_NAME)
          const offlineUrl = self.location.origin + '/_offline'

          // Try exact match first
          let cachedResponse = await cache.match(offlineUrl)

          // If no exact match, try any match
          if (!cachedResponse) {
            const allCaches = await caches.keys()
            for (const cacheName of allCaches) {
              const cacheInstance = await caches.open(cacheName)
              cachedResponse = await cacheInstance.match(offlineUrl)
              if (cachedResponse) break
            }
          }

          if (cachedResponse) {
            return cachedResponse
          }

          // If the offline page isn't cached, return a simple offline message
          return new Response(
            'You are offline and the offline page is not cached.',
            {
              status: 503,
              headers: { 'Content-Type': 'text/plain' },
            }
          )
        }
      })()
    )
  }
})
