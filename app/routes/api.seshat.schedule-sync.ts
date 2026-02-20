import { json, type ActionFunctionArgs } from '@remix-run/node'
import { Client } from '@upstash/qstash'
import { client } from '@/lib/sanity/client'

interface ContentTopic {
  _id: string
  name: string
  active: boolean
  cronSchedule: string
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  const qstashToken = process.env.QSTASH_TOKEN

  if (!qstashToken) {
    return json(
      { error: 'QSTASH_TOKEN environment variable is not set' },
      { status: 500 }
    )
  }

  try {
    const qstash = new Client({ token: qstashToken })
    const workerUrl = new URL('/api/seshat/worker', request.url).toString()

    const topics = await client.fetch<ContentTopic[]>(
      `*[_type == "contentTopic" && active == true] {
        _id,
        name,
        active,
        cronSchedule
      }`
    )

    const existingSchedules = await qstash.schedules.list()

    const scheduleMap = new Map(
      existingSchedules.map((schedule) => [
        schedule.destination,
        schedule.scheduleId,
      ])
    )

    const results = {
      created: [] as string[],
      updated: [] as string[],
      deleted: [] as string[],
      errors: [] as { topicId: string; error: string }[],
    }

    for (const topic of topics) {
      try {
        const scheduleId = `seshat-${topic._id}`
        const existingScheduleId = scheduleMap.get(workerUrl)

        if (existingScheduleId) {
          await qstash.schedules.delete(existingScheduleId)
          results.deleted.push(existingScheduleId)
        }

        await qstash.schedules.create({
          destination: workerUrl,
          cron: topic.cronSchedule,
          body: JSON.stringify({ topicId: topic._id }),
          retries: 3,
          scheduleId,
        })

        results.created.push(scheduleId)
        scheduleMap.delete(workerUrl)
      } catch (error) {
        console.error(`Failed to sync schedule for topic ${topic._id}:`, error)
        results.errors.push({
          topicId: topic._id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const activeTopicIds = new Set(topics.map((t) => t._id))
    for (const [destination, scheduleId] of scheduleMap) {
      if (
        destination.includes('/api/seshat/worker') &&
        scheduleId.startsWith('seshat-')
      ) {
        const topicId = scheduleId.replace('seshat-', '')
        if (!activeTopicIds.has(topicId)) {
          try {
            await qstash.schedules.delete(scheduleId)
            results.deleted.push(scheduleId)
          } catch (error) {
            console.error(`Failed to delete schedule ${scheduleId}:`, error)
          }
        }
      }
    }

    return json({
      success: true,
      message: `Synced ${topics.length} topic schedules`,
      results,
    })
  } catch (error) {
    console.error('Error syncing schedules:', error)
    return json(
      {
        error: 'Failed to sync schedules',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
