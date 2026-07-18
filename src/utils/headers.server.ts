export function getSecurityHeaders(options?: {
  allowStudioFrame?: boolean
}): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), unload=()',
    'X-DNS-Prefetch-Control': 'on',
  }

  if (options?.allowStudioFrame) {
    headers['Content-Security-Policy'] =
      "frame-ancestors 'self' https://loke-dev.sanity.studio https://www.sanity.io"
  } else {
    headers['X-Frame-Options'] = 'DENY'
  }

  return headers
}
