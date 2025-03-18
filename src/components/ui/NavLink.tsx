import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { type ReactNode } from 'react'

const navLinkVariants = cva('', {
  variants: {
    type: {
      header:
        'rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
      footer: 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300',
      brand: 'text-xl font-bold text-gray-900 dark:text-white',
    },
  },
  defaultVariants: {
    type: 'header',
  },
})

export interface NavLinkProps extends VariantProps<typeof navLinkVariants> {
  children: ReactNode
  href: string
  className?: string
}

export default function NavLink({
  children,
  type,
  href,
  className,
}: NavLinkProps) {
  return (
    <Link href={href} className={navLinkVariants({ type, className })}>
      {children}
    </Link>
  )
}
