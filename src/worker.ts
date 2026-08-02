import { handle } from '@astrojs/cloudflare/handler'
import * as Sentry from '@sentry/cloudflare'

const STUDIO_HOST = 'loke-dev.sanity.studio'
const WORKER_VERSION_HEADER = 'X-Loke-Worker-Version'

function getStudioRedirect(request: Request): Response | null {
  const url = new URL(request.url)
  if (url.pathname !== '/studio' && !url.pathname.startsWith('/studio/')) {
    return null
  }

  const studioPath = url.pathname.slice('/studio'.length) || '/'
  const studioUrl = new URL(`https://${STUDIO_HOST}${studioPath}`)
  studioUrl.search = url.search

  return Response.redirect(studioUrl, 302)
}

function withWorkerVersion(request: Request, versionId?: string): Request {
  if (!versionId) return request

  const headers = new Headers(request.headers)
  headers.set(WORKER_VERSION_HEADER, versionId)
  return new Request(request, { headers })
}

type SentryEnv = Env & { SENTRY_DSN?: string }

const handler: ExportedHandler<SentryEnv> = {
  fetch(request, env, context) {
    const studioRedirect = getStudioRedirect(request)
    if (studioRedirect) {
      return studioRedirect
    }

    return handle(
      withWorkerVersion(request, env.CF_VERSION_METADATA?.id),
      env,
      context
    )
  },
}

export default Sentry.withSentry(
  (env: SentryEnv) =>
    env.SENTRY_DSN
      ? {
          dsn: env.SENTRY_DSN,
          environment: 'production',
          tracesSampleRate: 0.1,
          enableLogs: true,
          integrations: [
            Sentry.consoleLoggingIntegration({ levels: ['warn', 'error'] }),
          ],
        }
      : undefined,
  handler
)
