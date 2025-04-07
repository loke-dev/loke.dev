import { Link } from '@remix-run/react'

export function Hero() {
  return (
    <div className="relative isolate px-6 lg:px-8">
      <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight  sm:text-6xl">
            Welcome to Loke.dev
          </h1>
          <p className="mt-6 text-lg leading-8 ">
            Frontend developer & open source enthusiast. Building web
            experiences with modern technologies.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/projects"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              View Projects
            </Link>
            <Link to="/blog" className="text-sm font-semibold leading-6 ">
              Read Blog <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
