import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const sectionVariants = cva('mb-12', {
  variants: {},
  defaultVariants: {},
})

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  title?: string
  description?: string
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, title, description, id, ...props }, ref) => {
    return (
      <section id={id} ref={ref} className={cn(sectionVariants(), className)}>
        {(title || description) && (
          <div className="mb-6">
            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div>{props.children}</div>
      </section>
    )
  }
)
Section.displayName = 'Section'

export { Section }
