import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const containerVariants = cva('container mx-auto', {
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-3xl',
      lg: 'max-w-6xl',
      full: 'max-w-full',
    },
    padded: {
      true: 'px-4 py-4 md:py-16 md:px-8',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    padded: true,
  },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ size, padded }), className)}
        {...props}
      />
    )
  }
)
Container.displayName = 'Container'

export { Container }
