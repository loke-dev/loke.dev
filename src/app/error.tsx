"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-max mx-auto text-center">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
          Error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          We&apos;re sorry, but an unexpected error occurred.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-base font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            Go back home<span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
