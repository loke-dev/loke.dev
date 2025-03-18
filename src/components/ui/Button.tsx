import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { type ReactNode } from 'react'

const buttonVariants = cva(
  'flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium md:px-10 md:py-4 md:text-lg',
  {
    variants: {
      intent: {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary:
          'bg-white text-indigo-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-gray-700',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
)

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode
  href?: string
  className?: string
}

export default function Button({
  children,
  intent,
  href,
  className,
}: ButtonProps) {
  const classes = buttonVariants({ intent, className })

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return <button className={classes}>{children}</button>
}
