import type { MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { getAboutPage } from '@/utils/sanity.queries'
import { Page, PageHeader, Section } from '@/components/layout'
import { OptimizedImage } from '@/components/optimized-image'
import { PortableText } from '@/components/PortableText'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'About',
    description:
      'Learn about my journey as a full-stack web developer, my skills in React, Remix, TypeScript, and modern web technologies, and how I build accessible, performant applications.',
    url: `${SITE_DOMAIN}/about`,
  })
}

export function headers() {
  return {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  }
}

export async function loader() {
  const page = await getAboutPage()
  return { page }
}

export default function About() {
  const { page } = useLoaderData<typeof loader>()

  return (
    <Page>
      <PageHeader title={page.title} />

      <div className="prose prose-gray dark:prose-invert">
        <div className="flex justify-center mb-6">
          <OptimizedImage
            src="/loke_clay.png"
            alt="3D clay avatar"
            width={512}
            quality={90}
            format="webp"
            fit="cover"
            className="rounded-lg w-64 h-auto"
          />
        </div>

        <p className="lead">{page.intro}</p>

        {page.sections?.map((section) => (
          <Section key={section._key} title={section.title}>
            <PortableText value={section.content} />
          </Section>
        ))}
      </div>
    </Page>
  )
}
