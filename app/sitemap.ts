import { MetadataRoute } from 'next'

const BASE_URL = 'https://mushroomidentifiers.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date('2026-03-31')

  return [
    // Core pages
    { url: `${BASE_URL}/`,          lastModified: lastMod, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/pricing`,   lastModified: lastMod, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`,      lastModified: lastMod, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/about`,     lastModified: lastMod, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,   lastModified: lastMod, changeFrequency: 'monthly', priority: 0.7 },

    // Auth pages
    { url: `${BASE_URL}/login`,     lastModified: lastMod, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/signup`,    lastModified: lastMod, changeFrequency: 'monthly', priority: 0.5 },

    // Legal pages
    { url: `${BASE_URL}/privacy`,   lastModified: lastMod, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${BASE_URL}/terms`,     lastModified: lastMod, changeFrequency: 'yearly',  priority: 0.4 },

    // Blog / Article pages
    { url: `${BASE_URL}/death-cap-vs-destroying-angel`,                lastModified: lastMod, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/mushroom-parts-explained`,                     lastModified: lastMod, changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE_URL}/agaricus-arvensis-horse-mushroom`,             lastModified: lastMod, changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE_URL}/amanita-phalloides-death-cap`,                 lastModified: lastMod, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/amanita-bisporigera-destroying-angel`,         lastModified: lastMod, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/amanita-virosa-mushroom`,                      lastModified: lastMod, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/mushroom-identification-quiz`,                 lastModified: lastMod, changeFrequency: 'monthly', priority: 0.8  },
  ]
}
