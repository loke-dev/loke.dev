import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const pageHeaderVariants = cva('mb-8', {
  variants: {
    align: {
      left: '',
      center: 'text-center',
    },
  },
  defaultVariants: {
    align: 'left',
  },
})

export interface PageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageHeaderVariants> {
  title: string
  description?: string
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, align, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(pageHeaderVariants({ align }), className)}
        {...props}
      >
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-lg text-muted-foreground">{description}</p>
        )}
        {props.children}
      </header>
    )
  }
)
PageHeader.displayName = 'PageHeader'

export { PageHeader }
