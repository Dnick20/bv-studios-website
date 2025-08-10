/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: true,
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'bluevstudio.com',
          },
        ],
        destination: 'https://www.bluevstudio.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
