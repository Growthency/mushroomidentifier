/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        // Static blog & info pages — cache at CDN edge for 1 hour, stale-while-revalidate 1 day
        source: '/(about|contact|pricing|blog|mushroom-parts-explained|mushroom-identifier-book|how-to-get-rid-of-mushrooms-in-grass|why-are-mushrooms-growing-in-my-yard|amanita-bisporigera-destroying-angel|amanita-phalloides-death-cap|amanita-virosa-mushroom|agaricus-arvensis-horse-mushroom|death-cap-vs-destroying-angel)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        // Blog listing page
        source: '/blog',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=1800, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
