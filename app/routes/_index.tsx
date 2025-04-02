import type { MetaFunction } from '@remix-run/node'
import { Hero } from '@/components/hero'

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
    <main>
      <Hero />
    </main>
  )
}
