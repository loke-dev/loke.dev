import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
  serverExternalPackages: ['shiki'],
  transpilePackages: ['next-mdx-remote'],
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
