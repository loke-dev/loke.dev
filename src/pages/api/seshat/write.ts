import type { APIRoute } from 'astro'
import { generate } from '@/lib/content-generation'
import { dataset, projectId } from '@/lib/sanity/projectDetails'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { topicId } = body

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

    await generate({
      topicId,
      sanityProject: projectId,
      sanityDataset: dataset,
    })

    return Response.json({
      success: true,
      message: 'Blog post generated successfully',
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
