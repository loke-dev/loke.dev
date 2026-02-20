import { json, type ActionFunctionArgs } from '@remix-run/node'
import { Receiver } from '@upstash/qstash'
import { generate } from 'seshat-scribe/dist/commands/generate.js'
import { sanityWriteClient } from '@/lib/sanity/client'
import { dataset, projectId } from '@/lib/sanity/projectDetails'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  const qstashToken = process.env.QSTASH_CURRENT_SIGNING_KEY
  const qstashSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY

  if (!qstashToken || !qstashSigningKey) {
    return json({ error: 'QStash configuration missing' }, { status: 500 })
  }

  const receiver = new Receiver({
    currentSigningKey: qstashToken,
    nextSigningKey: qstashSigningKey,
  })

  const signature = request.headers.get('upstash-signature')
  if (!signature) {
    return json({ error: 'Missing signature' }, { status: 401 })
  }

  const body = await request.text()

  try {
    await receiver.verify({
      signature,
      body,
    })
  } catch (error) {
    console.error('QStash signature verification failed:', error)
    return json({ error: 'Invalid signature' }, { status: 401 })
  }

  let parsedBody: { topic?: string; topicId?: string }
  try {
    parsedBody = JSON.parse(body)
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { topic, topicId } = parsedBody

  if (!process.env.GEMINI_API_KEY) {
    return json(
      { error: 'GEMINI_API_KEY environment variable is not set' },
      { status: 500 }
    )
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    return json(
      { error: 'SANITY_WRITE_TOKEN environment variable is not set' },
      { status: 500 }
    )
  }

  try {
    let generatedPostId: string | undefined

    if (topicId) {
      if (typeof topicId !== 'string') {
        return json({ error: 'topicId must be a string' }, { status: 400 })
      }

      const result = await generate({
        topicId,
        sanityProject: projectId,
        sanityDataset: dataset,
      })

      generatedPostId = result?.postId

      await sanityWriteClient
        .patch(topicId)
        .set({
          lastGeneratedAt: new Date().toISOString(),
        })
        .inc({ totalGenerated: 1 })
        .commit()

      if (generatedPostId) {
        await sanityWriteClient
          .patch(topicId)
          .set({
            lastGeneratedPostId: {
              _type: 'reference',
              _ref: generatedPostId,
            },
          })
          .commit()
      }

      return json({
        success: true,
        message: 'Blog post generated successfully from content topic',
        postId: generatedPostId,
      })
    }

    if (topic) {
      if (typeof topic !== 'string') {
        return json({ error: 'topic must be a string' }, { status: 400 })
      }

      await generate({ topic })

      return json({
        success: true,
        message: 'Blog post generated successfully',
      })
    }

    return json(
      { error: 'Either topic or topicId is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error generating blog post:', error)

    if (topicId && typeof topicId === 'string') {
      await sanityWriteClient
        .patch(topicId)
        .set({
          lastError: error instanceof Error ? error.message : 'Unknown error',
        })
        .commit()
        .catch((patchError) => {
          console.error('Failed to update error in Sanity:', patchError)
        })
    }

    return json(
      {
        error: 'Failed to generate blog post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
