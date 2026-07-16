import { handle } from '@astrojs/cloudflare/handler'
import * as Sentry from '@sentry/cloudflare'
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

type SentryEnv = Env & { SENTRY_DSN?: string }

async function runScheduledContentGeneration() {
  const startedAt = Date.now()

  try {
    await runSeshatScheduler()
    const duration = Date.now() - startedAt

    Sentry.logger.info('Seshat scheduler completed', { duration })
    Sentry.metrics.count('seshat.scheduler.runs', 1, {
      attributes: { outcome: 'success' },
    })
    Sentry.metrics.distribution('seshat.scheduler.duration', duration, {
      unit: 'millisecond',
    })
  } catch (error) {
    const duration = Date.now() - startedAt

    Sentry.logger.error('Seshat scheduler failed', { duration })
    Sentry.metrics.count('seshat.scheduler.runs', 1, {
      attributes: { outcome: 'failure' },
    })
    Sentry.metrics.distribution('seshat.scheduler.duration', duration, {
      unit: 'millisecond',
    })

    throw error
  }
}

const handler: ExportedHandler<SentryEnv> = {
  fetch(request, env, context) {
    const studioRequest = getStudioProxyRequest(request)
    if (studioRequest) {
      return fetch(studioRequest)
    }

    return handle(request, env, context)
  },
  async scheduled(_event, _env, context) {
    context.waitUntil(
      Sentry.withMonitor(
        'seshat-content-scheduler',
        runScheduledContentGeneration,
        {
          schedule: { type: 'crontab', value: '45 23 * * *' },
          checkinMargin: 10,
          maxRuntime: 30,
          timezone: 'Europe/Stockholm',
        }
      )
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
