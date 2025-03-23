import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const withMDX = createMDX({})

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  serverExternalPackages: ['shiki'],
  experimental: {
    viewTransition: true,
  },
}

export default withMDX(nextConfig)
