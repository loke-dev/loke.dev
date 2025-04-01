import { ReactNode } from 'react'

type CalloutType = 'info' | 'warning' | 'success' | 'error'

type CalloutProps = {
  children: ReactNode
  type?: CalloutType
  title?: string
}

export function Callout({ children, type = 'info', title }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200',
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200',
  }

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      {title && <h4 className="mb-2 font-bold">{title}</h4>}
      <div>{children}</div>
    </div>
  )
}
