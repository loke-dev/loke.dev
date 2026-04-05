import { Receiver } from '@upstash/qstash'
import type { APIRoute } from 'astro'
import { generate } from '@/lib/content-generation'
import { dataset, projectId } from '@/lib/sanity/projectDetails'

function normalizeSecret(value: string | undefined) {
  if (!value) return undefined
  const normalized = value.trim().replace(/^['"]|['"]$/g, '')
  return normalized || undefined
}

export const POST: APIRoute = async ({ request }) => {
  const currentSigningKey = normalizeSecret(
    process.env.QSTASH_CURRENT_SIGNING_KEY
  )
  const nextSigningKey = normalizeSecret(process.env.QSTASH_NEXT_SIGNING_KEY)

  if (
    !currentSigningKey &&
    !nextSigningKey &&
    !process.env.QSTASH_REGION?.trim()
  ) {
    return Response.json(
      { error: 'QStash configuration missing' },
      { status: 500 }
    )
  }

  const receiver = new Receiver({
    currentSigningKey,
    nextSigningKey,
  })

  const signature = request.headers.get('upstash-signature')
  if (!signature) {
    return Response.json({ error: 'Missing signature' }, { status: 401 })
  }

  const body = await request.text()
  const upstashRegion = request.headers.get('upstash-region')

  try {
    await receiver.verify({
      signature,
      body,
      upstashRegion: upstashRegion ?? undefined,
    })
  } catch (error) {
    console.error('QStash signature verification failed:', error)
    const message = error instanceof Error ? error.message : ''
    if (message.includes('No signing keys available')) {
      return Response.json(
        { error: 'QStash signing keys are not configured correctly' },
        { status: 500 }
      )
    }
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let parsedBody: { topicId?: string }
  try {
    parsedBody = JSON.parse(body)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { topicId } = parsedBody

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: 'GEMINI_API_KEY environment variable is not set' },
      { status: 500 }
    )
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    return Response.json(
      { error: 'SANITY_WRITE_TOKEN environment variable is not set' },
      { status: 500 }
    )
  }

  if (!topicId || typeof topicId !== 'string') {
    return Response.json({ error: 'topicId is required' }, { status: 400 })
  }

  try {
    const result = await generate({
      topicId,
      sanityProject: projectId,
      sanityDataset: dataset,
    })

    return Response.json({
      success: true,
      message: 'Blog post generated successfully',
      postId: result.postId,
      slug: result.slug,
    })
  } catch (error) {
    console.error('Error generating blog post:', error)
    return Response.json(
      {
        error: 'Failed to generate blog post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
