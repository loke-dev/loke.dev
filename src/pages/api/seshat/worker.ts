import type { APIRoute } from 'astro'
import { CronExpressionParser } from 'cron-parser'
import { generate } from '@/lib/content-generation'
import { fetchTopicsForScheduler } from '@/lib/content-generation/sanity'
import { dataset, projectId } from '@/lib/sanity/projectDetails'

const BUSY = new Set(['researching', 'writing', 'uploading'])

function authorizeCron(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

function isDue(
  cronSchedule: string,
  lastGeneratedAt: string | null,
  now: Date
) {
  try {
    const interval = CronExpressionParser.parse(cronSchedule.trim(), {
      currentDate: now,
      tz: 'UTC',
    })
    const prevRun = interval.prev().toDate()
    if (!lastGeneratedAt) return true
    return new Date(lastGeneratedAt).getTime() < prevRun.getTime()
  } catch {
    return false
  }
}

async function runWorker(request: Request) {
  if (!authorizeCron(request)) {
    return new Response(null, { status: 401 })
  }

  if (!process.env.GEMINI_API_KEY || !process.env.SANITY_WRITE_TOKEN) {
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const now = new Date()
  const topics = await fetchTopicsForScheduler(projectId, dataset)
  const generated: string[] = []

  for (const row of topics) {
    const status = row.generationStatus ?? 'idle'
    if (BUSY.has(status)) continue
    if (!isDue(row.cronSchedule, row.lastGeneratedAt ?? null, now)) continue
    try {
      await generate({
        topicId: row._id,
        sanityProject: projectId,
        sanityDataset: dataset,
      })
      generated.push(row._id)
    } catch {}
  }

  return Response.json({
    ok: true,
    checked: topics.length,
    generated,
  })
}

export const GET: APIRoute = ({ request }) => runWorker(request)

export const POST: APIRoute = ({ request }) => runWorker(request)
