/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
const apiUrl = process.env.API_URL

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: apiUrl ? [{ hostname: new URL(apiUrl).hostname }] : [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  rewrites() {
    if (apiUrl) {
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/:path*`,
          basePath: false,
        },
      ]
    }
    return []
  },
}

export default withNextIntl(nextConfig)
