import { createClient } from '@supabase/supabase-js'
import { BLOG_HIDDEN_SLUGS } from '@/lib/blog-hidden-slugs'

const SITE_URL = 'https://mushroomidentifiers.com'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('title, slug, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(50)

  // Static mushroom species pages
  const speciesPages = [
    { title: 'Death Cap (Amanita phalloides) — Identification Guide', slug: '/amanita-phalloides-death-cap', category: 'Species Guide' },
    { title: 'Destroying Angel (Amanita bisporigera) — Identification Guide', slug: '/amanita-bisporigera-destroying-angel', category: 'Species Guide' },
    { title: 'Fly Agaric (Amanita muscaria) — Identification Guide', slug: '/amanita-muscaria', category: 'Species Guide' },
    { title: 'Panther Cap (Amanita pantherina) — Identification Guide', slug: '/amanita-pantherina', category: 'Species Guide' },
    { title: 'Western Destroying Angel (Amanita ocreata) — Identification Guide', slug: '/amanita-ocreata', category: 'Species Guide' },
    { title: 'Deadly Galerina (Galerina marginata) — Identification Guide', slug: '/galerina-marginata', category: 'Species Guide' },
    { title: 'Jack O\'Lantern Mushroom (Omphalotus illudens) — Identification Guide', slug: '/omphalotus-illudens', category: 'Species Guide' },
    { title: 'Field Mushroom (Agaricus campestris) — Identification Guide', slug: '/agaricus-campestris', category: 'Species Guide' },
    { title: 'Porcini (Boletus edulis) — Identification Guide', slug: '/boletus-edulis', category: 'Species Guide' },
    { title: 'Chanterelle (Cantharellus cibarius) — Identification Guide', slug: '/cantharellus-cibarius', category: 'Species Guide' },
    { title: 'Morel (Morchella esculenta) — Identification Guide', slug: '/morchella-esculenta', category: 'Species Guide' },
    { title: 'Oyster Mushroom (Pleurotus ostreatus) — Identification Guide', slug: '/pleurotus-ostreatus', category: 'Species Guide' },
    { title: 'False Morel (Gyromitra esculenta) — Identification Guide', slug: '/gyromitra-esculenta', category: 'Species Guide' },
    { title: 'Yellow Stainer (Agaricus xanthodermus) — Identification Guide', slug: '/agaricus-xanthodermus', category: 'Species Guide' },
    { title: 'Green-spored Parasol (Chlorophyllum molybdites) — Identification Guide', slug: '/chlorophyllum-molybdites', category: 'Species Guide' },
    { title: 'Common Earthball (Scleroderma citrinum) — Identification Guide', slug: '/scleroderma-citrinum', category: 'Species Guide' },
    { title: 'Sulphur Tuft (Hypholoma fasciculare) — Identification Guide', slug: '/hypholoma-fasciculare', category: 'Species Guide' },
    { title: 'Deadly Webcap (Cortinarius rubellus) — Identification Guide', slug: '/cortinarius-rubellus', category: 'Species Guide' },
    { title: 'Deadly Dapperling (Lepiota brunneoincarnata) — Identification Guide', slug: '/lepiota-brunneoincarnata', category: 'Species Guide' },
    { title: 'Horse Mushroom (Agaricus arvensis) — Identification Guide', slug: '/agaricus-arvensis-horse-mushroom', category: 'Species Guide' },
    { title: 'Amanita virosa — Identification Guide', slug: '/amanita-virosa-mushroom', category: 'Species Guide' },
    { title: 'Death Cap vs Destroying Angel — How to Tell Them Apart', slug: '/death-cap-vs-destroying-angel', category: 'Comparison Guide' },
    { title: 'Mushroom Parts Explained — Anatomy & Identification', slug: '/mushroom-parts-explained', category: 'Educational' },
    { title: 'Mushroom Identification Quiz — Test Your Knowledge', slug: '/mushroom-identification-quiz', category: 'Interactive' },
    { title: 'Best Mushroom Identifier Books', slug: '/mushroom-identifier-book', category: 'Resources' },
    { title: 'How to Get Rid of Mushrooms in Grass', slug: '/how-to-get-rid-of-mushrooms-in-grass', category: 'Guide' },
    { title: 'Why Are Mushrooms Growing in My Yard?', slug: '/why-are-mushrooms-growing-in-my-yard', category: 'Guide' },
    { title: 'Are There Any Deadly Leccinum Mushrooms?', slug: '/are-there-any-deadly-leccinum-mushrooms', category: 'Guide' },
  ]

  const now = new Date().toUTCString()

  // Build RSS items from blog posts — drop policy / meta posts (Safety
  // Disclaimer, Editorial Policy) so they don't appear in subscribers'
  // feed readers alongside editorial content. Direct URLs still index.
  const blogItems = (posts || []).filter(p => !BLOG_HIDDEN_SLUGS.has(p.slug)).map(post => {
    const pubDate = new Date(post.published_at || post.created_at).toUTCString()
    const link = `${SITE_URL}${post.slug.startsWith('/') ? '' : '/blog/'}${post.slug}`
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`
  })

  // Build RSS items from species pages — title + link only
  const speciesItems = speciesPages.map(page => {
    return `    <item>
      <title><![CDATA[${page.title}]]></title>
      <link>${SITE_URL}${page.slug}</link>
      <guid isPermaLink="true">${SITE_URL}${page.slug}</guid>
      <pubDate>${now}</pubDate>
    </item>`
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Mushroom Identifiers — AI Mushroom Identification</title>
    <link>${SITE_URL}</link>
    <description>Expert mushroom identification guides, species profiles, and AI-powered mushroom identification tools. Learn to identify edible and poisonous mushrooms safely.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/android-chrome-512x512.png</url>
      <title>Mushroom Identifiers</title>
      <link>${SITE_URL}</link>
      <width>512</width>
      <height>512</height>
    </image>
${blogItems.join('\n')}
${speciesItems.join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
