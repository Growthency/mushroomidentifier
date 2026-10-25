/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server build for the Docker image (Hetzner / Coolify).
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  swcMinify: true,
  experimental: {
    // Load these from node_modules at runtime instead of bundling them:
    // pg has optional native bindings, Better Auth / bcryptjs are Node-only.
    serverComponentsExternalPackages: ['pg', 'better-auth', 'bcryptjs'],
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
        // Uploaded files (blog images, Writerfy images, avatars) live on our
        // own server under /uploads/… and are stored with absolute URLs.
        // Without this entry Next.js <Image> silently refuses to render them.
        protocol: 'https',
        hostname: 'mushroomidentifiers.com',
        pathname: '/uploads/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        // www → apex, one permanent hop (Vercel used to do this for us).
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mushroomidentifiers.com' }],
        destination: 'https://mushroomidentifiers.com/:path*',
        permanent: true,
      },
    ]
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
        // Homepage — most-visited route, was previously uncached at the
        // CDN edge. Every full reload paid a ~3s cold-origin TTFB which
        // caused the "blank gradient" pause users complained about.
        // Cache for 60s with a generous stale-while-revalidate so admin
        // edits to hero text, blocks, etc. still appear within a minute,
        // but repeat visitors get instant edge responses.
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
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
