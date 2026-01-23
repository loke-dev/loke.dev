import { Link } from '@remix-run/react'
import { ArrowRight } from 'lucide-react'
import { type PostListItem } from '@/utils/sanity.queries'
import { formatDate, getPostImageUrl } from '@/lib/sanity/helpers'

type PrefetchMode = 'intent' | 'viewport' | 'none'

type BlogPostCardProps = {
  post: PostListItem
  imageWidth?: number
  imageHeight?: number
  variant?: 'default' | 'minimal'
  prefetch?: PrefetchMode
}

export function BlogPostCard({
  post,
  imageWidth = 600,
  imageHeight = 338,
  variant = 'default',
  prefetch = 'intent',
}: BlogPostCardProps) {
  const imageUrl = getPostImageUrl(post, imageWidth, imageHeight)

  if (variant === 'minimal') {
    return (
      <article className="group flex h-full flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
        <Link
          to={`/blog/${post.slug.current}`}
          className="flex h-full flex-col"
          prefetch={prefetch}
          viewTransition
          aria-labelledby={`post-title-${post.slug.current}`}
        >
          {imageUrl && (
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={imageUrl}
                alt={post.imageAlt || ''}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col p-4">
            <h3
              id={`post-title-${post.slug.current}`}
              className="mb-2 font-semibold leading-tight line-clamp-2"
            >
              {post.title}
            </h3>
            <p className="flex-1 text-sm text-muted-foreground line-clamp-2">
              {post.description}
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                Read article{' '}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border transition-colors hover:bg-muted/50">
      <Link
        to={`/blog/${post.slug.current}`}
        className="flex h-full flex-col"
        prefetch={prefetch}
        viewTransition
        aria-labelledby={`post-title-${post.slug.current}`}
      >
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={post.imageAlt || ''}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.readingTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
          <h2
            id={`post-title-${post.slug.current}`}
            className="mb-2 text-xl font-bold tracking-tight group-hover:underline"
          >
            {post.title}
          </h2>
          <p className="flex-1 text-muted-foreground line-clamp-3">
            {post.description}
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
              Read article <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
