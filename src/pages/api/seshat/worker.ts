import { Receiver } from '@upstash/qstash'
import type { APIRoute } from 'astro'
import { generate } from '@/lib/content-generation'
import { dataset, projectId } from '@/lib/sanity/projectDetails'

export const POST: APIRoute = async ({ request }) => {
  const qstashToken = process.env.QSTASH_CURRENT_SIGNING_KEY
  const qstashSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY

  if (!qstashToken || !qstashSigningKey) {
    return Response.json(
      { error: 'QStash configuration missing' },
      { status: 500 }
    )
  }

  const receiver = new Receiver({
    currentSigningKey: qstashToken,
    nextSigningKey: qstashSigningKey,
  })

  const signature = request.headers.get('upstash-signature')
  if (!signature) {
    return Response.json({ error: 'Missing signature' }, { status: 401 })
  }

  const body = await request.text()

  try {
    await receiver.verify({ signature, body })
  } catch (error) {
    console.error('QStash signature verification failed:', error)
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
