import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Sorry, the page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-max mx-auto text-center">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          404 error
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-6">
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
