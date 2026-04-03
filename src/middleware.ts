import { defineMiddleware } from 'astro:middleware'
import { getSecurityHeaders } from '@/utils/headers.server'

export const onRequest = defineMiddleware((_context, next) => {
  const response = next()
  return response.then((res) => {
    const headers = getSecurityHeaders()
    for (const [key, value] of Object.entries(headers)) {
      res.headers.set(key, value)
    }
    return res
  })
})
