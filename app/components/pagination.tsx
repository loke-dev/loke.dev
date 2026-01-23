import { Link, useSearchParams } from '@remix-run/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  baseUrl?: string
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  baseUrl = '',
}: PaginationProps) {
  const [searchParams] = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    const queryString = params.toString()
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const showPages = 5 // Number of page buttons to show

    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Always show first page
    pages.push(1)

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) {
      pages.push('ellipsis')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1"
    >
      <Link
        to={createPageUrl(currentPage - 1)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors',
          hasPrevPage
            ? 'border-input bg-background hover:bg-secondary'
            : 'pointer-events-none border-transparent opacity-50'
        )}
        aria-disabled={!hasPrevPage}
        tabIndex={hasPrevPage ? 0 : -1}
        prefetch="intent"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Link>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              to={createPageUrl(page)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-input bg-background hover:bg-secondary'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
              prefetch="intent"
            >
              {page}
            </Link>
          )
        )}
      </div>

      <Link
        to={createPageUrl(currentPage + 1)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors',
          hasNextPage
            ? 'border-input bg-background hover:bg-secondary'
            : 'pointer-events-none border-transparent opacity-50'
        )}
        aria-disabled={!hasNextPage}
        tabIndex={hasNextPage ? 0 : -1}
        prefetch="intent"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Link>
    </nav>
  )
}
