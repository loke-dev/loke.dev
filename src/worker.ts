import { handle } from '@astrojs/cloudflare/handler'
import * as Sentry from '@sentry/cloudflare'
import { STRICT_TRANSPORT_SECURITY } from '@/utils/headers.server'
import { getStudioRedirect } from '@/lib/studio-redirect'

const WORKER_VERSION_HEADER = 'X-Loke-Worker-Version'

function withTransportSecurity(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Strict-Transport-Security', STRICT_TRANSPORT_SECURITY)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function withWorkerVersion(request: Request, versionId?: string): Request {
  if (!versionId) return request

  const headers = new Headers(request.headers)
  headers.set(WORKER_VERSION_HEADER, versionId)
  return new Request(request, { headers })
}

type SentryEnv = Env & { SENTRY_DSN?: string }

const handler: ExportedHandler<SentryEnv> = {
  async fetch(request, env, context) {
    const studioRedirect = getStudioRedirect(request)
    if (studioRedirect) {
      return withTransportSecurity(studioRedirect)
    }

    const response = await handle(
      withWorkerVersion(request, env.CF_VERSION_METADATA?.id),
      env,
      context
    )
    return withTransportSecurity(response)
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
