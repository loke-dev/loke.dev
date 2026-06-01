import { CronExpressionParser } from 'cron-parser'
import { generate } from '@/lib/content-generation'
import { fetchTopicsForScheduler } from '@/lib/content-generation/sanity'
import { dataset, projectId } from '@/lib/sanity/projectDetails'

const BUSY = new Set(['researching', 'writing', 'uploading'])

export interface SeshatSchedulerResult {
  ok: true
  checked: number
  generated: string[]
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

export async function runSeshatScheduler(
  now = new Date()
): Promise<SeshatSchedulerResult> {
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

  return {
    ok: true,
    checked: topics.length,
    generated,
  }
}
