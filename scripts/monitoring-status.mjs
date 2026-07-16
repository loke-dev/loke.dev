const sentryToken = requiredEnv('SENTRY_AUTH_TOKEN')
const betterStackToken = requiredEnv('BETTERSTACK_UPTIME_TOKEN')
const sentryOrg = process.env.SENTRY_ORG ?? 'loke-development'
const sentryProject = process.env.SENTRY_PROJECT ?? 'loke-dev'
const sentryApiUrl = (process.env.SENTRY_API_URL ?? 'https://sentry.io/api/0').replace(/\/$/, '')

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.monitoring.example to .env.monitoring and add the local API token.`)
  }
  return value
}

async function getJson(label, url, token) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(`${label} request failed with HTTP ${response.status}.`)
  return response.json()
}

const [issues, monitorsResponse, incidentsResponse] = await Promise.all([
  getJson('Sentry unresolved issues', `${sentryApiUrl}/projects/${encodeURIComponent(sentryOrg)}/${encodeURIComponent(sentryProject)}/issues/?query=is%3Aunresolved&limit=100`, sentryToken),
  getJson('Better Stack monitors', 'https://uptime.betterstack.com/api/v2/monitors', betterStackToken),
  getJson('Better Stack active incidents', 'https://uptime.betterstack.com/api/v3/incidents?resolved=false', betterStackToken),
])

const monitors = monitorsResponse.data ?? []
const incidents = incidentsResponse.data ?? []

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  sentry: { organization: sentryOrg, project: sentryProject, unresolvedIssueCount: Array.isArray(issues) ? issues.length : 0 },
  betterStack: {
    monitorCount: monitors.length,
    monitors: monitors.map(({ id, attributes = {} }) => ({ id, name: attributes.pronounceable_name, status: attributes.status, lastCheckedAt: attributes.last_checked_at })),
    activeIncidentCount: incidents.length,
    activeIncidents: incidents.map(({ id, attributes = {} }) => ({ id, status: attributes.status, startedAt: attributes.started_at })),
  },
}, null, 2))
