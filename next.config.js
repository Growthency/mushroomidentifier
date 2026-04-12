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
  experimental: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'tsbxbtajtzfvianasoaw.supabase.co',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        // Security headers — all pages
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        // Static blog & info pages — cache at CDN edge for 1 hour, stale-while-revalidate 1 day
        source: '/(about|contact|pricing|blog|mushroom-parts-explained|mushroom-identifier-book|mushroom-identification-quiz|how-to-get-rid-of-mushrooms-in-grass|why-are-mushrooms-growing-in-my-yard|are-there-any-deadly-leccinum-mushrooms|amanita-bisporigera-destroying-angel|amanita-phalloides-death-cap|amanita-virosa-mushroom|agaricus-arvensis-horse-mushroom|death-cap-vs-destroying-angel|amanita-ocreata|amanita-muscaria|amanita-pantherina|galerina-marginata|omphalotus-illudens|agaricus-campestris|boletus-edulis|cantharellus-cibarius|morchella-esculenta|pleurotus-ostreatus|gyromitra-esculenta|agaricus-xanthodermus|chlorophyllum-molybdites|scleroderma-citrinum|hypholoma-fasciculare|cortinarius-rubellus|lepiota-brunneoincarnata)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
