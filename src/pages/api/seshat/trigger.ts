import { Client } from '@upstash/qstash'
import type { APIRoute } from 'astro'

const SANITY_HOSTED_STUDIO_ORIGINS = new Set(['sanity.io', 'www.sanity.io'])

function resolveAppOrigin(requestUrl: string): string {
  const requestOrigin = new URL(requestUrl).origin
  const configured = process.env.APP_URL

  if (!configured) return requestOrigin

  try {
    const parsed = new URL(configured)
    if (
      (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') ||
      parsed.hostname.endsWith('.sanity.studio') ||
      parsed.hostname.endsWith('.sanity.io') ||
      SANITY_HOSTED_STUDIO_ORIGINS.has(parsed.hostname)
    ) {
      return requestOrigin
    }

    return parsed.origin
  } catch {
    return requestOrigin
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { topicId } = body

    if (!topicId || typeof topicId !== 'string') {
      return Response.json({ error: 'topicId is required' }, { status: 400 })
    }
    const qstashToken = process.env.QSTASH_TOKEN
    if (!qstashToken) {
      const writeUrl = new URL('/api/seshat/write', request.url).toString()
      const writeResponse = await fetch(writeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      })
      if (!writeResponse.ok) {
        const errorData = await writeResponse.json().catch(() => ({}))
        const details = errorData.details
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error
        return Response.json(
          { error: 'Generation failed', details },
          { status: writeResponse.status }
        )
      }
      return Response.json({
        success: true,
        message: 'Content generation completed',
      })
    }

    const appOrigin = resolveAppOrigin(request.url)
    const workerUrl = `${appOrigin}/api/seshat/worker`

    const qstash = new Client({ token: qstashToken })

    await qstash.publishJSON({
      url: workerUrl,
      body: { topicId },
      retries: 3,
    })

    return Response.json({
      success: true,
      message: 'Content generation queued successfully',
    })
  } catch (error) {
    console.error('Error queuing content generation:', error)
    return Response.json(
      {
        error: 'Failed to queue generation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
