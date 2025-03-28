import Link from 'next/link'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { ThemeToggle } from './themeToggle'
import { cn } from '@/lib/utils'

export default function Header() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="mr-4 flex">
          <Link href="/" className="font-bold">
            loke.dev
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/blog"
            className={cn(navigationMenuTriggerStyle(), 'bg-transparent px-4')}
          >
            Blog
          </Link>
          <Link
            href="/projects"
            className={cn(navigationMenuTriggerStyle(), 'bg-transparent px-4')}
          >
            Projects
          </Link>
          <Link
            href="/about"
            className={cn(navigationMenuTriggerStyle(), 'bg-transparent px-4')}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(navigationMenuTriggerStyle(), 'bg-transparent px-4')}
          >
            Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
