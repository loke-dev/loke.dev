import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || 'l25uat4p'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_TOKEN

if (!token) {
  console.error('Error: SANITY_TOKEN environment variable is required')
  console.error(
    'Generate a token at: https://sanity.io/manage/project/' +
      projectId +
      '/api#tokens'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function removePublishedField() {
  // Find all posts that have the published field
  const posts = await client.fetch<{ _id: string; title: string }[]>(
    `*[_type == "post" && defined(published)]{ _id, title }`
  )

  if (posts.length === 0) {
    console.log('No posts found with the "published" field.')
    return
  }

  console.log(`Found ${posts.length} posts with "published" field. Removing...`)

  for (const post of posts) {
    await client.patch(post._id).unset(['published']).commit()
    console.log(`✓ Removed "published" from: ${post._id} - ${post.title}`)
  }

  console.log(
    `\nDone! Removed "published" field from all ${posts.length} posts.\n`
  )
}

removePublishedField().catch(console.error)
