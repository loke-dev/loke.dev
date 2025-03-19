import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const withMDX = createMDX()

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

export default withMDX(nextConfig)
