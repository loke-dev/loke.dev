import path from 'node:path'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { generate } from 'seshat-scribe/dist/commands/generate.js'
import { loadConfig } from 'seshat-scribe/dist/config.js'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { topic } = await request.json()

    if (!topic || typeof topic !== 'string') {
      return json({ error: 'Topic is required' }, { status: 400 })
    }

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

    const configPath = path.join(process.cwd(), 'seshat.config.json')
    const config = await loadConfig(configPath)

    config.topic = topic

    await generate({ topic })

    return json({
      success: true,
      message: 'Blog post generated successfully',
    })
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
