import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "../components/JsonLd";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to loke.dev - Personal website of Loke",
};

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "loke.dev",
    url: "https://loke.dev",
    description: "Personal website of Loke",
    author: {
      "@type": "Person",
      name: "Loke",
    },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-indigo-600 dark:text-indigo-400">
                loke.dev
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Personal website of Loke. Web developer, designer, and technology
              enthusiast.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="rounded-md shadow">
                <Link
                  href="/about"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  About Me
                </Link>
              </div>
              <div className="ml-3 rounded-md shadow">
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 dark:text-indigo-400 dark:bg-gray-800 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              <span className="block">Latest Projects</span>
            </h2>
            <div className="mt-6 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Project cards would go here */}
              <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
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
              <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
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
              <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg">
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
  );
}
