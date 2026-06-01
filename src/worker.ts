import { handle } from '@astrojs/cloudflare/handler'
import { runSeshatScheduler } from '@/lib/content-generation/scheduler'

const STUDIO_HOST = 'loke-dev.sanity.studio'

function getStudioProxyRequest(request: Request): Request | null {
  const url = new URL(request.url)
  if (url.pathname !== '/studio' && !url.pathname.startsWith('/studio/')) {
    return null
  }

  url.protocol = 'https:'
  url.hostname = STUDIO_HOST
  url.port = ''

  return new Request(url, request)
}

export default {
  fetch(request, env, context) {
    const studioRequest = getStudioProxyRequest(request)
    if (studioRequest) {
      return fetch(studioRequest)
    }

    return handle(request, env, context)
  },
  async scheduled() {
    await runSeshatScheduler()
  },
} satisfies ExportedHandler<Env>
