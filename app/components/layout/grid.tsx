import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const gridVariants = cva('grid', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      'auto-fill': 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
    },
    columnsSm: {
      1: 'sm:grid-cols-1',
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-3',
      4: 'sm:grid-cols-4',
      'auto-fill': 'sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
    },
    columnsMd: {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      'auto-fill': 'md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
    },
    columnsLg: {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      'auto-fill': 'lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
    },
    gap: {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-10',
    },
  },
  defaultVariants: {
    columns: 1,
    columnsMd: 2,
    columnsLg: 3,
    gap: 'md',
  },
})

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    { className, columns, columnsSm, columnsMd, columnsLg, gap, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          gridVariants({
            columns,
            columnsSm,
            columnsMd,
            columnsLg,
            gap,
          }),
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = 'Grid'

export { Grid }
