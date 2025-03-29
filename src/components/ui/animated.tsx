'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'

interface AnimatedProps {
  children: ReactNode
  variants?: Variants
  className?: string
  transition?: typeof defaultTransition
  delay?: number
}

export function Animated({
  children,
  variants,
  className,
  transition = defaultTransition,
  delay = 0,
}: AnimatedProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ ...transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
