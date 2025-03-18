import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactNode } from 'react'

const sectionVariants = cva('', {
  variants: {
    background: {
      white: 'bg-white dark:bg-gray-900',
      gray: 'bg-gray-50 dark:bg-gray-800',
    },
  },
  defaultVariants: {
    background: 'white',
  },
})

export interface SectionProps extends VariantProps<typeof sectionVariants> {
  children: ReactNode
  className?: string
}

export default function Section({
  children,
  background,
  className,
}: SectionProps) {
  return (
    <section className={sectionVariants({ background, className })}>
      {children}
    </section>
  )
}
