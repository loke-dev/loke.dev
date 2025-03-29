'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  defaultTransition,
  fadeIn,
  fadeInSlideLeft,
  fadeInSlideUp,
  scaleIn,
} from '@/lib/animations'
import { Animated } from '@/components/ui/animated'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="bg-background relative min-h-[90vh] w-full overflow-hidden">
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
            <div className="bg-muted inline-block rounded-full px-4 py-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Web Developer
              </p>
            </div>
            <Animated variants={fadeInSlideUp} delay={0.5}>
              <h1 className="text-primary text-4xl font-bold tracking-tight sm:text-6xl">
                Loke.dev
              </h1>
            </Animated>
          </div>
          <Animated
            variants={fadeIn}
            delay={0.7}
            className="text-muted-foreground max-w-lg text-lg"
          >
            <p>
              Web developer crafting elegant solutions with modern technologies.
              Focused on creating impactful digital experiences.
            </p>
          </Animated>
          <Animated
            variants={fadeInSlideUp}
            delay={0.9}
            className="flex items-center gap-4"
          >
            <Button asChild size="lg" className="relative overflow-hidden">
              <Link href="/about">
                <span className="relative z-10">About Me</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="relative overflow-hidden"
            >
              <Link href="/contact">
                <span className="relative z-10">Get in Touch</span>
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
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-primary/50 absolute top-1/2 right-0 h-72 w-72 -translate-y-1/2 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -15, 0],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 right-24 h-64 w-64 -translate-y-1/2 rounded-full bg-white/50 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 20, 0],
              x: [0, 40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-primary/35 absolute top-1/2 right-12 h-56 w-56 -translate-y-1/2 rounded-full blur-3xl"
          />
        </Animated>
      </div>
    </section>
  )
}
