import type { MetaFunction } from '@remix-run/node'
import { Hero } from '@/components/hero'
import { Page } from '@/components/layout'

export const meta: MetaFunction = () => {
  return [
    { title: 'Loke.dev - Frontend Developer' },
    {
      name: 'description',
      content:
        'Personal website of Loke, frontend developer and open source enthusiast.',
    },
  ]
}

export default function Index() {
  return (
    <Page noPadding>
      <Hero />
    </Page>
  )
}
