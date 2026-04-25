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
    // Keep @vercel/blob (and its modern-undici dependency) out of the webpack
    // bundle. The Next.js 13 webpack config can't parse undici's private class
    // fields (#target), but they run fine in Node at runtime — so load the
    // package directly from node_modules instead of bundling it.
    serverComponentsExternalPackages: ['@vercel/blob', 'undici'],
  },
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
        // Frequently-updated routes — listing, feeds, sitemap. Edge cache
        // for ONE MINUTE max with stale-while-revalidate, so newly
        // published articles appear within 60s even before Next.js's
        // revalidatePath() finishes propagating. The previous 1-hour
        // edge cache here was the reason new posts stayed invisible to
        // visitors despite the server-side revalidation working.
        source: '/(blog|sitemap\\.xml|feed\\.xml)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
        ],
      },
      {
        // Static blog & info pages — cache at CDN edge for 1 hour, stale-while-revalidate 1 day
        // (these rarely change, so aggressive caching is safe)
        source: '/(about|contact|pricing|mushroom-parts-explained|mushroom-identifier-book|mushroom-identification-quiz|how-to-get-rid-of-mushrooms-in-grass|why-are-mushrooms-growing-in-my-yard|are-there-any-deadly-leccinum-mushrooms|amanita-bisporigera-destroying-angel|amanita-phalloides-death-cap|amanita-virosa-mushroom|agaricus-arvensis-horse-mushroom|death-cap-vs-destroying-angel|amanita-ocreata|amanita-muscaria|amanita-pantherina|galerina-marginata|omphalotus-illudens|agaricus-campestris|boletus-edulis|cantharellus-cibarius|morchella-esculenta|pleurotus-ostreatus|gyromitra-esculenta|agaricus-xanthodermus|chlorophyllum-molybdites|scleroderma-citrinum|hypholoma-fasciculare|cortinarius-rubellus|lepiota-brunneoincarnata)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
