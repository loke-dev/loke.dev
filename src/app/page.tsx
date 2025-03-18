import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '../components/JsonLd'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to loke.dev - Personal website of Loke',
}

export default function Home() {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'loke.dev',
    url: 'https://loke.dev',
    description: 'Personal website of Loke',
    author: {
      '@type': 'Person',
      name: 'Loke',
    },
  }

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              <span className="block">Welcome to</span>
              <span className="block text-indigo-600 dark:text-indigo-400">
                loke.dev
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl dark:text-gray-400">
              Personal website of Loke. Web developer, designer, and technology
              enthusiast.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="rounded-md shadow">
                <Link
                  href="/about"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:px-10 md:py-4 md:text-lg"
                >
                  About Me
                </Link>
              </div>
              <div className="ml-3 rounded-md shadow">
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:px-10 md:py-4 md:text-lg dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              <span className="block">Latest Projects</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Project cards would go here */}
              <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-900">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Project One
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Description of project one. This is a placeholder for a real
                    project.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-900">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Project Two
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Description of project two. This is a placeholder for a real
                    project.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-900">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Project Three
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Description of project three. This is a placeholder for a
                    real project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
