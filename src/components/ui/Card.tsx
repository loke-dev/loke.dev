import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactNode } from 'react'

const cardVariants = cva(
  'overflow-hidden rounded-lg bg-white shadow dark:bg-gray-900',
  {
    variants: {
      padding: {
        default: 'p-6',
        compact: 'p-4',
        none: '',
      },
    },
    defaultVariants: {
      padding: 'default',
    },
  }
)

export interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode
  className?: string
}

export default function Card({ children, padding, className }: CardProps) {
  return <div className={cardVariants({ padding, className })}>{children}</div>
}
