import { json, type ActionFunctionArgs } from '@remix-run/node'
import { Client } from '@upstash/qstash'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const body = await request.json()
    const { topicId, topic } = body

    if (!topicId && !topic) {
      return json(
        { error: 'Either topicId or topic is required' },
        { status: 400 }
      )
    }

    if (topicId && typeof topicId !== 'string') {
      return json({ error: 'topicId must be a string' }, { status: 400 })
    }

    if (topic && typeof topic !== 'string') {
      return json({ error: 'topic must be a string' }, { status: 400 })
    }

    const appUrl = process.env.APP_URL

    if (!appUrl) {
      const directWorkerUrl = new URL(
        '/api/seshat/write',
        request.url
      ).toString()

      const workerResponse = await fetch(directWorkerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicId, topic }),
      })

      if (!workerResponse.ok) {
        const errorData = await workerResponse.json().catch(() => ({}))
        return json(
          {
            error: 'Worker execution failed',
            details: errorData.error || errorData.details,
          },
          { status: workerResponse.status }
        )
      }

      return json({
        success: true,
        message: 'Content generation completed',
      })
    }

    const qstashToken = process.env.QSTASH_TOKEN

    if (!qstashToken) {
      return json(
        { error: 'QSTASH_TOKEN environment variable is not set' },
        { status: 500 }
      )
    }

    const workerUrl = `${appUrl}/api/seshat/worker`

    const qstash = new Client({ token: qstashToken })

    await qstash.publishJSON({
      url: workerUrl,
      body: { topicId, topic },
      retries: 3,
    })

    return json({
      success: true,
      message: 'Content generation queued successfully',
    })
  } catch (error) {
    console.error('Error queuing content generation:', error)
    return json(
      {
        error: 'Failed to queue generation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
