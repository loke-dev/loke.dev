'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Animated } from '@/components/ui/animated'
import {
  fadeIn,
  fadeInSlideLeft,
  fadeInSlideUp,
  scaleIn,
  hoverScale,
  floatingAnimation,
  defaultTransition,
} from '@/lib/animations'

export function Hero() {
  return (
    <div className="bg-background relative min-h-[90vh] w-full overflow-hidden">
      <Animated
        variants={fadeIn}
        transition={{ ...defaultTransition, duration: 1.5 }}
        className="absolute inset-0"
      >
        <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:60px_60px]" />
        <div className="from-background via-background/80 to-background absolute inset-0 bg-gradient-to-b" />
      </Animated>

      <div className="relative container mx-auto grid min-h-[90vh] grid-cols-1 items-center px-4 md:grid-cols-2 md:gap-12">
        <Animated
          variants={fadeInSlideLeft}
          className="relative z-10 space-y-6"
        >
          <div className="space-y-4">
            <motion.div
              variants={scaleIn}
              whileHover={hoverScale}
              className="border-primary/20 bg-primary/10 inline-block rounded-full border px-4 py-1.5"
            >
              <span className="text-primary text-sm font-medium">
                Web Developer
              </span>
            </motion.div>
            <Animated variants={fadeInSlideUp} delay={0.5}>
              <motion.span
                className="from-primary bg-gradient-to-r via-purple-500 to-pink-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
                whileHover={hoverScale}
              >
                Loke.dev
              </motion.span>
            </Animated>
          </div>
          <Animated
            variants={fadeIn}
            delay={0.7}
            className="text-muted-foreground max-w-lg text-lg"
          >
            Web developer crafting elegant solutions with modern technologies.
            Focused on creating impactful digital experiences.
          </Animated>
          <Animated
            variants={fadeInSlideUp}
            delay={0.9}
            className="flex items-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden"
            >
              <Link href="/about">
                <motion.span className="relative z-10" whileHover={hoverScale}>
                  About Me
                </motion.span>
                <div className="from-primary/50 to-primary absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="group relative overflow-hidden"
            >
              <Link href="/contact">
                <motion.span className="relative z-10" whileHover={hoverScale}>
                  Get in Touch
                </motion.span>
                <div className="from-secondary/50 to-secondary absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>
          </Animated>
        </Animated>

        <Animated
          variants={scaleIn}
          delay={0.4}
          className="relative hidden md:block"
        >
          <motion.div
            {...floatingAnimation}
            className="bg-primary/30 absolute top-1/2 right-0 h-64 w-64 -translate-y-1/2 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.6, 1],
              rotate: [0, -20, 0],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 right-24 h-48 w-48 -translate-y-1/2 rounded-full bg-purple-500/30 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 25, 0],
              x: [0, 30, 0],
              y: [0, 25, 0],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 right-12 h-32 w-32 -translate-y-1/2 rounded-full bg-pink-600/30 blur-3xl"
          />
        </Animated>
      </div>
    </div>
  )
}
