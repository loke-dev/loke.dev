import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx'],
  serverExternalPackages: ['shiki'],
  transpilePackages: ['next-mdx-remote'],
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
