import Link from 'next/link'
import { type ReactNode } from 'react'

type NavLinkType = 'header' | 'footer' | 'brand'

interface NavLinkProps {
  children: ReactNode
  href: string
  type?: NavLinkType
  className?: string
}

export default function NavLink({
  children,
  href,
  type = 'header',
  className = '',
}: NavLinkProps) {
  let classes = ''

  switch (type) {
    case 'brand':
      classes = 'text-xl font-bold'
      break
    case 'footer':
      classes = 'link link-hover'
      break
    case 'header':
    default:
      classes = ''
      break
  }

  return (
    <Link href={href} className={`${classes} ${className}`}>
      {children}
    </Link>
  )
}
