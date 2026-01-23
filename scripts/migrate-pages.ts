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

// Helper to create portable text blocks from plain text
function textToPortableText(text: string) {
  return text.split('\n\n').map((paragraph, index) => ({
    _type: 'block',
    _key: `block-${index}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `span-${index}`,
        text: paragraph,
        marks: [],
      },
    ],
  }))
}

// Helper to create list items in portable text
function listToPortableText(items: string[]) {
  return items.map((item, index) => ({
    _type: 'block',
    _key: `list-${index}`,
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `span-${index}`,
        text: item,
        marks: [],
      },
    ],
  }))
}

const pages = {
  homePage: {
    _id: 'homePage',
    _type: 'homePage',
    heroTitle: 'Loke.dev',
    heroDescription:
      'Building modern web experiences with a focus on performance, accessibility, and beautiful design.',
    technologiesSectionTitle: 'Some Technologies I Work With',
    technologies: [
      'JavaScript',
      'TypeScript',
      'React',
      'Remix',
      'Next.js',
      'Tailwind CSS',
    ],
    blogSectionTitle: 'Latest from the Blog',
    blogSectionDescription:
      'Thoughts, tutorials, and insights about web development and technology.',
    ctaTitle: "Let's work together",
    ctaDescription:
      "Looking for a web developer to help bring your project to life? I'm always open to discussing new opportunities and collaborations.",
    ctaButtonText: 'Get in Touch',
  },
  aboutPage: {
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: 'About Me',
    intro:
      "Hi, I'm a developer passionate about creating meaningful digital experiences.",
    sections: [
      {
        _key: 'journey',
        title: 'My Journey',
        content: textToPortableText(
          "I've been working in web development for several years, focusing on building accessible, responsive, and performant applications. I enjoy working with modern technologies and frameworks to create solutions that solve real problems."
        ),
      },
      {
        _key: 'skills',
        title: 'Skills & Expertise',
        content: listToPortableText([
          'Frontend: React, Remix, Next.js, TypeScript',
          'Styling: Tailwind CSS, CSS-in-JS',
          'Backend: Node.js, Express, SQL/NoSQL databases',
          'DevOps: CI/CD, Docker, Cloud services',
        ]),
      },
      {
        _key: 'contact',
        title: 'Get in Touch',
        content: textToPortableText(
          "Feel free to reach out if you'd like to collaborate on a project or just want to chat!"
        ),
      },
    ],
  },
  blogPage: {
    _id: 'blogPage',
    _type: 'blogPage',
    title: 'Blog',
    description:
      'Articles, guides, and thoughts on web development and technology',
    emptyStateTitle: 'No posts yet',
    emptyStateDescription: 'Check back soon for new articles!',
  },
  projectsPage: {
    _id: 'projectsPage',
    _type: 'projectsPage',
    title: 'Projects',
    description: 'A showcase of my work, side projects, and experiments.',
    featuredSectionTitle: 'Featured Projects',
    otherSectionTitle: 'Other Projects',
  },
  contactPage: {
    _id: 'contactPage',
    _type: 'contactPage',
    title: 'Contact Me',
    description:
      'Have a question or want to work together? Feel free to reach out using the form below.',
    alternativeContactTitle: 'Other ways to reach me',
    alternativeContactDescription:
      'You can also connect with me on social media or via email.',
  },
}

async function migratePages() {
  console.log('Starting page migration...\n')

  for (const [name, pageData] of Object.entries(pages)) {
    try {
      // Check if document already exists
      const existing = await client.fetch(`*[_id == $id][0]`, { id: name })

      if (existing) {
        console.log(`⏭️  ${name} already exists, skipping...`)
        continue
      }

      await client.createOrReplace(
        pageData as Parameters<typeof client.createOrReplace>[0]
      )
      console.log(`✅ Created ${name}`)
    } catch (error) {
      console.error(`❌ Failed to create ${name}:`, error)
    }
  }

  console.log('\n✨ Migration complete!')
  console.log(
    '\nYou can now edit these pages in Sanity Studio at /studio under "Pages"'
  )
}

migratePages().catch(console.error)
