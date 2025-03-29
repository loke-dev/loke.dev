'use client'

import {
  BookOpenIcon,
  CameraIcon,
  CodeIcon,
  CoffeeIcon,
  GlobeIcon,
  HeartIcon,
  MountainIcon,
} from 'lucide-react'
import {
  fadeIn,
  fadeInSlideLeft,
  fadeInSlideUp,
  scaleIn,
} from '@/lib/animations'
import { Animated } from '@/components/ui/animated'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function About() {
  const currentYear = new Date().getFullYear()
  const startYear = 2017
  const yearsOfExperience = currentYear - startYear

  const skills = [
    {
      category: 'Frontend',
      items: [
        'React',
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Shadcn UI',
        'Framer Motion',
      ],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'tRPC'],
    },
    {
      category: 'DevOps',
      items: ['Docker', 'CI/CD', 'Vercel', 'GitHub Actions'],
    },
    { category: 'Tools', items: ['Git', 'VS Code', 'Figma'] },
  ]

  const interests = [
    { name: 'Hiking', icon: <MountainIcon className="mr-2 h-4 w-4" /> },
    { name: 'Photography', icon: <CameraIcon className="mr-2 h-4 w-4" /> },
    { name: 'Open Source', icon: <GlobeIcon className="mr-2 h-4 w-4" /> },
    { name: 'Reading', icon: <BookOpenIcon className="mr-2 h-4 w-4" /> },
    { name: 'Coding', icon: <CodeIcon className="mr-2 h-4 w-4" /> },
    { name: 'Coffee', icon: <CoffeeIcon className="mr-2 h-4 w-4" /> },
  ]

  return (
    <Animated variants={fadeIn}>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <Animated
            variants={fadeInSlideUp}
            className="grid lg:grid-cols-3 lg:gap-12"
          >
            <Animated variants={fadeInSlideLeft} className="space-y-6">
              <div className="flex flex-col items-center lg:items-start">
                <Animated variants={scaleIn} delay={0.2}>
                  <Avatar className="mb-4 h-32 w-32">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      LC
                    </AvatarFallback>
                  </Avatar>
                </Animated>
                <Animated variants={fadeInSlideUp} delay={0.3}>
                  <h1 className="text-3xl font-bold">Loke</h1>
                </Animated>
                <Animated variants={fadeInSlideUp} delay={0.4}>
                  <p className="text-muted-foreground text-lg">
                    Frontend Developer
                  </p>
                </Animated>
              </div>
              <Animated variants={fadeIn} delay={0.5}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">Sweden</p>
                    </div>
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-muted-foreground">
                        {yearsOfExperience} years
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Focus</p>
                      <p className="text-muted-foreground">
                        Web Development & UI/UX
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Animated>
            </Animated>

            <div className="mt-12 space-y-8 lg:col-span-2 lg:mt-0">
              <Animated variants={fadeInSlideUp} delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                    <CardDescription>
                      Frontend developer with a passion for clean UI and great
                      UX
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Hi there! I'm Loke, a frontend developer with{' '}
                      {yearsOfExperience} years of experience crafting modern,
                      responsive, and accessible web applications. My journey in
                      web development began in 2017, and I've been passionate
                      about creating exceptional digital experiences ever since.
                    </p>
                    <p>
                      I specialize in building applications with React and
                      Next.js, leveraging TypeScript for type safety and
                      Tailwind CSS for beautiful, responsive designs. I'm
                      particularly enthusiastic about component-driven
                      development and creating reusable, maintainable UI
                      systems.
                    </p>
                    <p>
                      Throughout my career, I've worked on projects ranging from
                      small business websites to complex web applications with
                      thousands of users. I approach each project with attention
                      to detail, focusing on performance optimization,
                      accessibility, and creating intuitive user experiences.
                    </p>
                  </CardContent>
                </Card>
              </Animated>

              <Animated variants={fadeInSlideUp} delay={0.4}>
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>
                      Technical expertise and capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {skills.map((skillGroup, index) => (
                        <Animated
                          key={index}
                          variants={fadeIn}
                          delay={0.2 + index * 0.1}
                        >
                          <div>
                            <h3 className="mb-3 font-medium">
                              {skillGroup.category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {skillGroup.items.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            {index < skills.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        </Animated>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Animated>

              <Animated variants={fadeInSlideUp} delay={0.6}>
                <Card>
                  <CardHeader>
                    <CardTitle>Interests</CardTitle>
                    <CardDescription>
                      What I enjoy outside of coding
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {interests.map((interest, index) => (
                        <Animated
                          key={index}
                          variants={scaleIn}
                          delay={0.2 + index * 0.1}
                        >
                          <div className="flex items-center">
                            {interest.icon}
                            <span>{interest.name}</span>
                          </div>
                        </Animated>
                      ))}
                    </div>
                    <Animated variants={fadeIn} delay={0.8}>
                      <div className="mt-6">
                        <p className="flex items-center">
                          <HeartIcon className="mr-4 h-12 w-12 text-red-500" />
                          <span>
                            When I'm not coding, you'll find me exploring new
                            technologies, contributing to open source, or
                            seeking inspiration in nature. I believe in
                            continuous learning and strive to stay at the
                            forefront of web development trends.
                          </span>
                        </p>
                      </div>
                    </Animated>
                  </CardContent>
                </Card>
              </Animated>
            </div>
          </Animated>
        </div>
      </div>
    </Animated>
  )
}
