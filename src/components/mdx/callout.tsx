'use client'

import React from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success'
  title?: string
  children: React.ReactNode
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
}

const styles = {
  info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
  error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
}

const iconStyles = {
  info: 'text-blue-600 dark:text-blue-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
}

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(function Callout(
  { type = 'info', title, children },
  ref
) {
  const Icon = icons[type]

  return (
    <div ref={ref} className={`my-6 rounded-lg border p-4 ${styles[type]}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${iconStyles[type]} mt-0.5`} />
        <div>
          {title && <div className="font-medium">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
})
