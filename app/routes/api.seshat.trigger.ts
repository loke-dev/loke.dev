import { json, type ActionFunctionArgs } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const body = await request.json()
    const { topicId } = body

    if (!topicId || typeof topicId !== 'string') {
      return json({ error: 'topicId is required' }, { status: 400 })
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
          inputs: {
            topicId,
          },
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
