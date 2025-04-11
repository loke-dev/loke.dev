/// <reference lib="WebWorker" />

import {
  EnhancedCache,
  isDocumentRequest,
  isLoaderRequest,
  Logger,
  NavigationHandler,
  type DefaultFetchHandler,
} from '@remix-pwa/sw'

const version = 'v1'

const DOCUMENT_CACHE_NAME = `document-cache`
const ASSET_CACHE_NAME = `asset-cache`
const DATA_CACHE_NAME = `data-cache`

const logger = new Logger({
  prefix: '[Loke-dev]',
})

const documentCache = new EnhancedCache(DOCUMENT_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxEntries: 64,
  },
})

const assetCache = new EnhancedCache(ASSET_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
    maxEntries: 100,
  },
})

const dataCache = new EnhancedCache(DATA_CACHE_NAME, {
  version,
  strategy: 'NetworkFirst',
  strategyOptions: {
    networkTimeoutInSeconds: 10,
    maxEntries: 72,
  },
})

// Track network status
let isOnline = true

export {}

declare let self: ServiceWorkerGlobalScope

self.addEventListener('install', (event) => {
  logger.log('Service worker installed')

  // Preload essential files
  const precacheResources = [
    '/_offline',
    '/manifest.json',
    '/favicon.ico',
    '/loke_clay.png',
  ]

  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      caches
        .open(DOCUMENT_CACHE_NAME)
        .then((cache) => cache.addAll(precacheResources)),
    ])
  )
})

self.addEventListener('activate', (event) => {
  logger.log('Service worker activated')

  // Clean up old caches
  const currentCaches = [DOCUMENT_CACHE_NAME, ASSET_CACHE_NAME, DATA_CACHE_NAME]

  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .map((cacheName) => {
              if (!currentCaches.includes(cacheName)) {
                logger.log(`Deleting outdated cache: ${cacheName}`)
                return caches.delete(cacheName)
              }
              return null
            })
            .filter(Boolean)
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

  if (isDocumentRequest(request)) {
    try {
      return await documentCache.handleRequest(request)
    } catch (error) {
      logger.error('Failed to serve document from cache:', error)

      // If we're offline and the document isn't cached, serve the offline page
      if (!isOnline) {
        const offlineResponse = await caches.match('/_offline')
        if (offlineResponse) return offlineResponse
      }

      // Fall back to network
      return fetch(request)
    }
  }

  if (isLoaderRequest(request)) {
    try {
      return await dataCache.handleRequest(request)
    } catch (error) {
      logger.error('Failed to serve loader data from cache:', error)
      return fetch(request)
    }
  }

  if (self.__workerManifest.assets.includes(url.pathname)) {
    return assetCache.handleRequest(request)
  }

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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // If offline, try to serve the offline page
          const cache = await caches.open(DOCUMENT_CACHE_NAME)
          const cachedResponse = await cache.match('/_offline')

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
