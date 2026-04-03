export interface GitHubCommitItem {
  sha: string
  subject: string
  body: string
  authorName: string
  committedAt: string
  url: string
}

interface GitHubCommitApi {
  sha: string
  html_url: string
  commit: {
    message: string
    author?: { name?: string; date?: string }
  }
}

function env(name: string): string | undefined {
  const fromMeta = (import.meta.env as Record<string, string | undefined>)[name]
  if (typeof fromMeta === 'string' && fromMeta.trim()) return fromMeta.trim()
  const fromProc =
    typeof process !== 'undefined' ? process.env[name] : undefined
  if (typeof fromProc === 'string' && fromProc.trim()) return fromProc.trim()
  return undefined
}

function parseCommitMessage(message: string): {
  subject: string
  body: string
} {
  const raw = message.replace(/\r\n/g, '\n').trim()
  if (!raw) return { subject: 'Update', body: '' }
  const newlineIdx = raw.indexOf('\n')
  if (newlineIdx === -1) {
    return { subject: raw, body: '' }
  }
  const subject = raw.slice(0, newlineIdx).trim() || 'Update'
  const body = raw.slice(newlineIdx + 1).trim()
  return { subject, body }
}

function mapCommit(c: GitHubCommitApi): GitHubCommitItem {
  const { subject, body } = parseCommitMessage(c.commit.message)
  return {
    sha: c.sha.slice(0, 7),
    subject,
    body,
    authorName: c.commit.author?.name ?? 'Contributor',
    committedAt: c.commit.author?.date ?? new Date().toISOString(),
    url: c.html_url,
  }
}

function getHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'loke.dev-site',
  }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

export async function fetchRecentRepoCommits(
  owner: string,
  repo: string,
  limit: number = 40
): Promise<GitHubCommitItem[]> {
  const token = env('GITHUB_TOKEN')
  const perPage = Math.min(Math.max(limit, 1), 100)
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}`
  const res = await fetch(url, { headers: getHeaders(token) })
  if (!res.ok) return []
  const data = (await res.json()) as GitHubCommitApi[]
  if (!Array.isArray(data)) return []
  return data
    .filter((c) => c?.sha && c?.commit?.message)
    .map((c) => mapCommit(c))
}

export function getGithubRepoConfig(): { owner: string; repo: string } | null {
  const owner = env('GITHUB_OWNER')
  const repo = env('GITHUB_REPO')
  if (!owner || !repo) return null
  return { owner, repo }
}
