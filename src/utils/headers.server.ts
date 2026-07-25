export function getSecurityHeaders(options?: {
  allowStudioFrame?: boolean
}): Record<string, string> {
  const frameAncestors = options?.allowStudioFrame
    ? "'self' https://loke-dev.sanity.studio https://www.sanity.io"
    : "'none'"

  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), unload=()',
    'X-DNS-Prefetch-Control': 'on',
    'Content-Security-Policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      `frame-ancestors ${frameAncestors}`,
      "form-action 'self'",
      "img-src 'self' data: https://cdn.sanity.io",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
      "connect-src 'self'",
      'frame-src https://challenges.cloudflare.com',
    ].join('; '),
  }

  if (!options?.allowStudioFrame) {
    headers['X-Frame-Options'] = 'DENY'
  }

  return headers
}
