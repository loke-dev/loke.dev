import { json, type ActionFunctionArgs } from '@remix-run/node'

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

    const githubToken = process.env.GITHUB_TOKEN
    const githubRepo = process.env.GITHUB_REPOSITORY || 'lokecarlsson/loke.dev'

    if (!githubToken) {
      return json(
        { error: 'GITHUB_TOKEN environment variable is not set' },
        { status: 500 }
      )
    }

    const [owner, repo] = githubRepo.split('/')

    const inputs: Record<string, string> = {}
    if (topicId) inputs.topicId = topicId
    if (topic) inputs.topic = topic

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/seshat.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${githubToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'master',
          inputs,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error:', errorText)
      return json(
        {
          error: 'Failed to trigger GitHub Action',
          details: errorText,
        },
        { status: response.status }
      )
    }

    return json({
      success: true,
      message:
        'Content generation started in background. Check GitHub Actions for progress.',
    })
  } catch (error) {
    console.error('Error triggering GitHub Action:', error)
    return json(
      {
        error: 'Failed to trigger generation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
