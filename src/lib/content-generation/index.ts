import { analyzeExistingPosts } from './analyzer'
import { humanizeContent } from './humanizer'
import { generateBlogImage } from './image-gen'
import { stripMarkdownLinksOutsideCodeFences } from './markdown-link-utils'
import { markdownToPortableText } from './portable-text'
import { researchTopic } from './researcher'
import { curateResources, mergeResourceLinks } from './resource-curator'
import {
  createPost,
  fetchTopic,
  finalizeTopicRecord,
  recordTopicError,
  setGenerationStatus,
} from './sanity'
import { planContent } from './seo-planner'
import { writeArticle } from './writer'

interface GenerateOptions {
  topicId: string
  sanityProject: string
  sanityDataset: string
}

export async function generate({
  topicId,
  sanityProject,
  sanityDataset,
}: GenerateOptions): Promise<{ postId: string; slug: string }> {
  try {
    const topic = await fetchTopic(topicId, sanityProject, sanityDataset)

    const context = await analyzeExistingPosts(sanityProject, sanityDataset)

    await setGenerationStatus(
      topicId,
      sanityProject,
      sanityDataset,
      'researching'
    )

    const research = await researchTopic(topic.topic, context, {
      primaryKeyword: topic.seo?.primaryKeyword,
      targetAudience: topic.seo?.targetAudience,
      contentAngle: topic.seo?.contentAngle,
      realWorldProblem: topic.problemLed?.realWorldProblem,
      promisedOutcome: topic.problemLed?.promisedOutcome,
      researchSeeds: topic.problemLed?.researchSeeds,
      articleIntent: topic.problemLed?.articleIntent,
    })

    const plan = await planContent(topic.topic, topic.tone, research, {
      primaryKeyword: topic.seo?.primaryKeyword,
      secondaryKeywords: topic.seo?.secondaryKeywords,
      targetAudience: topic.seo?.targetAudience,
      contentAngle: topic.seo?.contentAngle,
      targetWordCount: topic.generation?.targetWordCount,
      articleIntent: topic.problemLed?.articleIntent,
    })

    await setGenerationStatus(topicId, sanityProject, sanityDataset, 'writing')

    const rawArticle = await writeArticle(
      topic.topic,
      topic.tone,
      plan,
      research,
      {
        targetWordCount: topic.generation?.targetWordCount,
        includeCodeExamples: topic.generation?.includeCodeExamples,
        customInstructions: topic.generation?.customInstructions,
        targetAudience: topic.seo?.targetAudience,
        contentAngle: topic.seo?.contentAngle,
        persona: topic.seo?.persona,
        realWorldProblem: topic.problemLed?.realWorldProblem,
        promisedOutcome: topic.problemLed?.promisedOutcome,
      }
    )

    const humanized = await humanizeContent(rawArticle)
    const bodyMarkdown = stripMarkdownLinksOutsideCodeFences(humanized)

    const curatedExtras = await curateResources(bodyMarkdown, research)
    const postResources = mergeResourceLinks(research, curatedExtras)

    const body = markdownToPortableText(bodyMarkdown)

    await setGenerationStatus(
      topicId,
      sanityProject,
      sanityDataset,
      'uploading'
    )

    let imageBuffer: Buffer | null = null
    if (topic.generation?.enableImageGeneration !== false) {
      imageBuffer = await generateBlogImage(plan.imagePrompt)
    }

    const { postId, slug } = await createPost(
      plan,
      body,
      imageBuffer,
      sanityProject,
      sanityDataset,
      postResources.length ? postResources : undefined
    )

    await finalizeTopicRecord(topicId, postId, sanityProject, sanityDataset)

    return { postId, slug }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await recordTopicError(topicId, sanityProject, sanityDataset, message)
    throw error
  }
}
