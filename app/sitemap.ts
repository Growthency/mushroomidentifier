export const dynamic = 'force-dynamic'

import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://mushroomidentifiers.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastMod = new Date('2026-03-31')

  // ── Static pages ──
  const staticPages: MetadataRoute.Sitemap = [
    // Core pages
    { url: `${BASE_URL}/`,          lastModified: lastMod, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/pricing`,   lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`,      lastModified: lastMod, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/about`,     lastModified: lastMod, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,   lastModified: lastMod, changeFrequency: 'monthly', priority: 0.7 },

    // Legal pages
    { url: `${BASE_URL}/privacy`,   lastModified: lastMod, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/terms`,     lastModified: lastMod, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/refund`,    lastModified: lastMod, changeFrequency: 'yearly',  priority: 0.4 },

    // Hardcoded blog / article pages
    { url: `${BASE_URL}/death-cap-vs-destroying-angel`,                lastModified: lastMod,                    changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/mushroom-parts-explained`,                     lastModified: lastMod,                    changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE_URL}/agaricus-arvensis-horse-mushroom`,             lastModified: lastMod,                    changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE_URL}/amanita-phalloides-death-cap`,                 lastModified: lastMod,                    changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/amanita-bisporigera-destroying-angel`,         lastModified: lastMod,                    changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/amanita-virosa-mushroom`,                      lastModified: lastMod,                    changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/mushroom-identification-quiz`,                 lastModified: lastMod,                    changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE_URL}/mushroom-identifier-book`,                     lastModified: new Date('2026-04-04'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/how-to-get-rid-of-mushrooms-in-grass`,         lastModified: new Date('2026-04-04'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/why-are-mushrooms-growing-in-my-yard`,         lastModified: new Date('2026-04-04'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/are-there-any-deadly-leccinum-mushrooms`,      lastModified: new Date('2026-04-05'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/amanita-ocreata`,                              lastModified: new Date('2026-04-10'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/amanita-muscaria`,                             lastModified: new Date('2026-04-10'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/amanita-pantherina`,                           lastModified: new Date('2026-04-10'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/galerina-marginata`,                           lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/omphalotus-illudens`,                          lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/agaricus-campestris`,                          lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/boletus-edulis`,                               lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/cantharellus-cibarius`,                        lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/morchella-esculenta`,                          lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/pleurotus-ostreatus`,                          lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/gyromitra-esculenta`,                          lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/agaricus-xanthodermus`,                        lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/chlorophyllum-molybdites`,                     lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/scleroderma-citrinum`,                         lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/hypholoma-fasciculare`,                        lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/cortinarius-rubellus`,                         lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/lepiota-brunneoincarnata`,                     lastModified: new Date('2026-04-11'),     changeFrequency: 'monthly', priority: 0.85 },
  ]

  // ── Dynamic pages from Supabase (admin-created posts) ──
  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global: { fetch: (url: any, init: any) => fetch(url, { ...init, cache: 'no-store' }) } }
    )

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at, created_at')
      .eq('status', 'published')

    if (posts && posts.length > 0) {
      // Collect slugs already in static pages to avoid duplicates
      const staticSlugs = new Set(staticPages.map(p => p.url))

      dynamicPages = posts
        .filter(p => !staticSlugs.has(`${BASE_URL}${p.slug}`))
        .map(p => ({
          url: `${BASE_URL}${p.slug}`,
          lastModified: new Date(p.updated_at || p.published_at || p.created_at),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }))
    }
  } catch (err) {
    console.error('[sitemap] Failed to fetch dynamic posts:', err)
  }

  return [...staticPages, ...dynamicPages]
}
