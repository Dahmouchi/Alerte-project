import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or '50mb' or whatever size you need
    },
  },
  // ... any other existing config
}

export default nextConfig