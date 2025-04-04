import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Container } from './container'

const pageVariants = cva('min-h-[calc(100vh-4rem)]', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
      full: '',
    },
    noPadding: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    noPadding: false,
  },
})

export interface PageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageVariants> {}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ className, size, noPadding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(pageVariants({ size, noPadding }), className)}
      >
        <Container size={size} padded={!noPadding} {...props} />
      </div>
    )
  }
)
Page.displayName = 'Page'

export { Page }
