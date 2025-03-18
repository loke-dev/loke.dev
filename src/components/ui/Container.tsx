import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactNode } from 'react'

const containerVariants = cva('mx-auto max-w-7xl', {
  variants: {
    padding: {
      default: 'px-4 sm:px-6 lg:px-8',
      none: '',
    },
    spacing: {
      default: 'py-8',
      large: 'py-12 lg:py-16',
      xlarge: 'py-16',
      none: '',
    },
  },
  defaultVariants: {
    padding: 'default',
    spacing: 'default',
  },
})

export interface ContainerProps extends VariantProps<typeof containerVariants> {
  children: ReactNode
  className?: string
}

export default function Container({
  children,
  padding,
  spacing,
  className,
}: ContainerProps) {
  return (
    <div className={containerVariants({ padding, spacing, className })}>
      {children}
    </div>
  )
}
