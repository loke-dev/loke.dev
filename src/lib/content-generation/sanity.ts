import { createClient } from '@sanity/client'
import { keyResourcesForSanity } from './resource-curator'
import type { ContentPlan } from './seo-planner'

function getSanityWriteClient(projectId: string, dataset: string) {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) throw new Error('SANITY_WRITE_TOKEN is not set')
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}

export interface ContentTopic {
  _id: string
  name: string
  topic: string
  tone: string
  cronSchedule: string
  seo?: {
    primaryKeyword?: string
    secondaryKeywords?: string[]
    targetAudience?: string
    contentAngle?: string
    persona?: string
  }
  generation?: {
    targetWordCount?: number
    includeCodeExamples?: boolean
    customInstructions?: string
    enableImageGeneration?: boolean
  }
  active: boolean
}

export type TopicScheduleRow = {
  _id: string
  cronSchedule: string
  lastGeneratedAt: string | null
  generationStatus: string | null
}

export async function fetchTopicsForScheduler(
  projectId: string,
  dataset: string
): Promise<TopicScheduleRow[]> {
  const client = getSanityWriteClient(projectId, dataset)
  return client.fetch(
    `*[_type == "contentTopic" && active == true && defined(cronSchedule) && cronSchedule != ""] { _id, cronSchedule, lastGeneratedAt, generationStatus }`
  )
}

export async function fetchTopic(
  topicId: string,
  projectId: string,
  dataset: string
): Promise<ContentTopic> {
  const client = getSanityWriteClient(projectId, dataset)
  const topic = await client.fetch<ContentTopic | null>(
    `*[_type == "contentTopic" && _id == $topicId][0]`,
    { topicId }
  )
  if (!topic) throw new Error(`Content topic not found: ${topicId}`)
  return topic
}

export async function setGenerationStatus(
  topicId: string,
  projectId: string,
  dataset: string,
  status: 'idle' | 'researching' | 'writing' | 'uploading' | 'done' | 'error'
) {
  const client = getSanityWriteClient(projectId, dataset)
  await client
    .patch(topicId)
    .set({ generationStatus: status })
    .commit()
    .catch(() => {}) // non-fatal
}

export async function createPost(
  plan: ContentPlan,
  body: unknown[],
  imageBuffer: Buffer | null,
  projectId: string,
  dataset: string,
  resources?: Array<{ title: string; url: string }>
): Promise<{ postId: string; slug: string }> {
  const client = getSanityWriteClient(projectId, dataset)

  let imageRef: {
    _type: 'image'
    asset: { _type: 'reference'; _ref: string }
  } | null = null

  if (imageBuffer) {
    try {
      const asset = await client.assets.upload('image', imageBuffer, {
        filename: `${plan.slug}.png`,
      })
      imageRef = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      }
    } catch (err) {
      console.error('Image upload failed, continuing without image:', err)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  const doc: { _type: string } & Record<string, unknown> = {
    _type: 'post',
    title: plan.title,
    slug: { _type: 'slug', current: plan.slug },
    description: plan.metaDescription,
    date: today,
    tags: plan.tags,
    body,
  }

  if (imageRef) {
    doc.image = imageRef
    doc.imageAlt = `Header image for ${plan.title}`
  }

  if (resources?.length) {
    doc.resources = keyResourcesForSanity(resources)
  }

  const result = await client.create(doc)
  return { postId: result._id, slug: plan.slug }
}

export async function finalizeTopicRecord(
  topicId: string,
  postId: string,
  projectId: string,
  dataset: string
) {
  const client = getSanityWriteClient(projectId, dataset)
  await client
    .patch(topicId)
    .set({
      lastGeneratedAt: new Date().toISOString(),
      generationStatus: 'done',
      lastError: null,
      lastGeneratedPostId: { _type: 'reference', _ref: postId },
    })
    .inc({ totalGenerated: 1 })
    .commit()
}

export async function recordTopicError(
  topicId: string,
  projectId: string,
  dataset: string,
  errorMessage: string
) {
  const client = getSanityWriteClient(projectId, dataset)
  await client
    .patch(topicId)
    .set({
      lastError: `[${new Date().toISOString()}] ${errorMessage}`,
      generationStatus: 'error',
    })
    .commit()
    .catch(() => {})
}
