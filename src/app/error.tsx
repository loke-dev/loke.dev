'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-max text-center">
        <p className="text-sm font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
          Error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          We&apos;re sorry, but an unexpected error occurred.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            Try again
          </button>
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
