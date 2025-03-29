import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'Sorry, the page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-max text-center">
        <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
          404 error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="text-base font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Go back home<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
