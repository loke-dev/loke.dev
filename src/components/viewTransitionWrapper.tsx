'use client'

import { unstable_ViewTransition as ViewTransition } from 'react'
import { useViewTransition } from '@/hooks/useViewTransition'

export function ViewTransitionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const isSupported = useViewTransition()

  if (!isSupported) {
    return children
  }

  return <ViewTransition>{children}</ViewTransition>
}
