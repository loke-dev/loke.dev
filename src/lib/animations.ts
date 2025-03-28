import { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeInSlideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export const fadeInSlideLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
}

export const defaultTransition = {
  duration: 0.7,
  type: 'spring',
  stiffness: 100,
  damping: 20,
}

export const hoverScale = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 400, damping: 10 },
}

export const floatingAnimation = {
  animate: {
    scale: [1, 1.4, 1],
    rotate: [0, 15, 0],
    x: [0, 50, 0],
    y: [0, -30, 0],
  },
  transition: {
    duration: 12,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}
