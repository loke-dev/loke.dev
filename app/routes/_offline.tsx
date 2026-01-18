import { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { WifiOff } from 'lucide-react'
import { createMetaTags } from '@/utils/meta'
import { Button } from '@/components/ui/button'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: "You're Offline",
    description: 'Offline page for Loke.dev',
  })
}

export function loader() {
  return new Response(null, {
    headers: {
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    },
  })
}

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <WifiOff className="h-12 w-12 text-muted-foreground" />
      </div>

      <h1 className="text-3xl font-bold mb-4">You&rsquo;re Offline</h1>

      <p className="text-muted-foreground max-w-md mb-8">
        It looks like you&rsquo;ve lost your internet connection. Some content
        and functionality may be limited while you&rsquo;re offline.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={() => window.location.reload()}>
          Try Reconnecting
        </Button>

        <Button variant="outline" asChild>
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground">
        <p>
          This site is available offline thanks to Progressive Web App
          technology. You can still access previously visited pages.
        </p>
      </div>
    </div>
  )
}
