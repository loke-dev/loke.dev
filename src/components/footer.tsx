import Link from 'next/link'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/40 border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear} loke.dev. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
