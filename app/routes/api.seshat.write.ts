import { execSync } from 'child_process'
import { json, type ActionFunctionArgs } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { topic } = await request.json()

    if (!topic || typeof topic !== 'string') {
      return json({ error: 'Topic is required' }, { status: 400 })
    }

    // Execute seshat write command with --topic flag
    const output = execSync(
      `pnpm exec seshat write --topic "${topic.replace(/"/g, '\\"')}"`,
      {
        encoding: 'utf-8',
        cwd: process.cwd(),
        env: {
          ...process.env,
          GEMINI_API_KEY: process.env.GEMINI_API_KEY,
          SANITY_WRITE_TOKEN: process.env.SANITY_WRITE_TOKEN,
        },
      }
    )

    return json({
      success: true,
      message: 'Blog post generated successfully',
      output,
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
