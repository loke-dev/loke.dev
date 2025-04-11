import { Link } from '@remix-run/react'

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">You&rsquo;re offline</h1>
      <p className="mb-6 max-w-md">
        It looks like you&rsquo;re currently offline. Some content may not be
        available until you reconnect to the internet.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Homepage
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
