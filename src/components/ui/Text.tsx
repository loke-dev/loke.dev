import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactNode, type ElementType } from 'react'

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl',
      h2: 'text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl',
      h3: 'text-lg font-medium text-gray-900 dark:text-white',
      body: 'text-base text-gray-500 dark:text-gray-400',
      bodyLarge: 'text-lg text-gray-500 dark:text-gray-400',
      bodyXL: 'text-xl text-gray-500 dark:text-gray-400',
      caption: 'text-sm text-gray-500 dark:text-gray-400',
    },
    intent: {
      primary: '',
      accent: 'text-indigo-600 dark:text-indigo-400',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
    intent: 'primary',
    align: 'left',
  },
})

export interface TextProps extends VariantProps<typeof textVariants> {
  children: ReactNode
  className?: string
  as?: ElementType
}

export default function Text({
  children,
  variant,
  intent,
  align,
  className,
  as: Component = 'p',
}: TextProps) {
  return (
    <Component className={textVariants({ variant, intent, align, className })}>
      {children}
    </Component>
  )
}
