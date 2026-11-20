import type { Metadata } from 'next'
import { createCachedClient } from '@/lib/db'
import { BLOG_HIDDEN_SLUGS } from '@/lib/blog-hidden-slugs'

// Every guide on one page, in plain links, so readers and crawlers can reach
// any article in one step. Re-rendered every 10 minutes to pick up new posts.
export const revalidate = 600

export const metadata: Metadata = {
  title: 'All Mushroom Guides: Identification Charts A to Z',
  description: 'Every mushroom identification chart, species guide, tree fungus guide and foraging article on Mushroom Identifiers, listed in one place.',
  alternates: { canonical: 'https://mushroomidentifiers.com/mushroom-guides' },
}

type Guide = { slug: string; title: string; category?: string | null }

/** Articles that live in code, not in the CMS. */
const STATIC_GUIDES: Guide[] = [
  { slug: '/amanita-muscaria', title: 'Fly Agaric (Amanita muscaria)' },
  { slug: '/amanita-pantherina', title: 'Panther Cap (Amanita pantherina)' },
  { slug: '/amanita-bisporigera-destroying-angel', title: 'Destroying Angel (Amanita bisporigera)' },
  { slug: '/amanita-virosa-mushroom', title: 'European Destroying Angel (Amanita virosa)' },
  { slug: '/amanita-ocreata', title: 'Western Destroying Angel (Amanita ocreata)' },
  { slug: '/death-cap-vs-destroying-angel', title: 'Death Cap vs Destroying Angel' },
  { slug: '/galerina-marginata', title: 'Deadly Galerina (Galerina marginata)' },
  { slug: '/cortinarius-rubellus', title: 'Deadly Webcap (Cortinarius rubellus)' },
  { slug: '/lepiota-brunneoincarnata', title: 'Deadly Dapperling (Lepiota brunneoincarnata)' },
  { slug: '/omphalotus-illudens', title: 'Jack-o’-Lantern Mushroom (Omphalotus illudens)' },
  { slug: '/chlorophyllum-molybdites', title: 'Green-Spored Parasol (Chlorophyllum molybdites)' },
  { slug: '/scleroderma-citrinum', title: 'Common Earthball (Scleroderma citrinum)' },
  { slug: '/agaricus-xanthodermus', title: 'Yellow Stainer (Agaricus xanthodermus)' },
  { slug: '/agaricus-campestris', title: 'Meadow Mushroom (Agaricus campestris)' },
  { slug: '/agaricus-arvensis-horse-mushroom', title: 'Horse Mushroom (Agaricus arvensis)' },
  { slug: '/morchella-esculenta', title: 'True Morel (Morchella esculenta)' },
  { slug: '/are-there-any-deadly-leccinum-mushrooms', title: 'Are There Any Deadly Leccinum Mushrooms?' },
  { slug: '/mushroom-parts-explained', title: 'Parts of a Mushroom: Labeled Diagram' },
  { slug: '/why-are-mushrooms-growing-in-my-yard', title: 'Why Are Mushrooms Growing in My Yard?' },
  { slug: '/how-to-get-rid-of-mushrooms-in-grass', title: 'How to Get Rid of Mushrooms in Grass' },
  { slug: '/mushroom-identification-quiz', title: 'Mushroom Identification Quiz' },
].map((g) => ({ ...g, category: 'Species Guide' }))

async function getGuides(): Promise<Guide[]> {
  try {
    const { data } = await createCachedClient([], 300)
      .from('blog_posts')
      .select('slug, title, category')
      .eq('status', 'published')
    const posts = ((data ?? []) as Guide[]).filter((p) => !BLOG_HIDDEN_SLUGS.has(p.slug))
    const inCms = new Set(posts.map((p) => p.slug))
    return [...posts, ...STATIC_GUIDES.filter((g) => !inCms.has(g.slug))]
  } catch (err) {
    console.error('[mushroom-guides] query failed', err)
    return STATIC_GUIDES
  }
}

export default async function MushroomGuidesPage() {
  const guides = await getGuides()
  const groups = new Map<string, Guide[]>()
  for (const g of guides) {
    const key = g.category || 'Guide'
    groups.set(key, [...(groups.get(key) ?? []), g])
  }
  const sections = Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length)

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
      <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
        All Mushroom Guides
      </h1>
      <p className="text-base leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
        Every identification chart, species guide and foraging article on Mushroom Identifiers, {guides.length} in all. Found a mushroom and not sure where to start?{' '}
        <a href="/" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Upload a photo to the free identifier</a>.
      </p>
      {sections.map(([name, list]) => (
        <section key={name} className="mb-10">
          <h2 className="font-playfair text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {name} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>({list.length})</span>
          </h2>
          <ul className="mi-guide-index">
            {[...list].sort((a, b) => a.title.localeCompare(b.title)).map((g) => (
              <li key={g.slug}>
                <a href={g.slug}>{g.title.replace(/\s*\(.*?\d{4}\)\s*$/, '')}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
