import { env as workerEnv } from 'cloudflare:workers'

export interface AnalyticsEvent {
  event: string
  site: string
  path: string
  placement: string
  target: string
  campaign: string
}

function getAnalyticsDataset(
  value: unknown
): AnalyticsEngineDataset | undefined {
  if (typeof value !== 'object' || value === null) return undefined

  const dataset = Reflect.get(value, 'AFFILIATE_ANALYTICS')
  if (typeof dataset !== 'object' || dataset === null) return undefined

  const writeDataPoint = Reflect.get(dataset, 'writeDataPoint')
  return typeof writeDataPoint === 'function'
    ? (dataset as AnalyticsEngineDataset)
    : undefined
}

export function recordAnalyticsEvent(event: AnalyticsEvent): void {
  const dataset = getAnalyticsDataset(workerEnv)

  try {
    dataset?.writeDataPoint({
      indexes: [`${event.site}:${event.event}`],
      blobs: [
        'v1',
        event.event,
        event.site,
        event.path,
        event.placement,
        event.target,
        event.campaign,
      ],
      doubles: [1],
    })
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'analytics_write_failed',
        analyticsEvent: event.event,
        site: event.site,
        error: error instanceof Error ? error.message : 'unknown',
      })
    )
  }

  console.info(JSON.stringify(event))
}
