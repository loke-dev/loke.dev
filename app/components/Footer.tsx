export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            Built by Loke. The source code is available on{' '}
            <a
              href="https://github.com/loke-dev/loke.dev"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-8">
          <a
            href="https://github.com/loke-dev"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/loke_dev"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}
