import path from 'node:path'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { generate } from 'seshat-scribe/dist/commands/generate.js'
import { loadConfig } from 'seshat-scribe/dist/config.js'
import { dataset, projectId } from '@/lib/sanity/projectDetails'

export const config = {
  maxDuration: 300,
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const body = await request.json()
    const { topic, topicId } = body

    // Validate environment variables
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

    // New Sanity-native mode with topicId
    if (topicId) {
      if (typeof topicId !== 'string') {
        return json({ error: 'topicId must be a string' }, { status: 400 })
      }

      await generate({
        topicId,
        sanityProject: projectId,
        sanityDataset: dataset,
      })

      return json({
        success: true,
        message: 'Blog post generated successfully from content topic',
      })
    }

    // Legacy file-based mode with topic override
    if (topic) {
      if (typeof topic !== 'string') {
        return json({ error: 'topic must be a string' }, { status: 400 })
      }

      const configPath = path.join(process.cwd(), 'seshat.config.json')
      await loadConfig(configPath) // Validate config exists

      await generate({ topic })

      return json({
        success: true,
        message: 'Blog post generated successfully',
      })
    }

    // No topic or topicId provided
    return json(
      { error: 'Either topic or topicId is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error generating blog post:', error)
    return json(
      {
        error: 'Failed to generate blog post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
