/**
 * "More identification charts" box: links from older guides to the chart pages
 * and between the charts themselves. A target only shows once it is published,
 * so a scheduled chart joins every list on its own when the cron puts it live.
 */
import { createCachedClient } from '@/lib/db'

/** Chart pages that should link to each other, grouped by topic. */
const FAMILIES: string[][] = [
  ['/hedgehog-mushroom', '/black-trumpet-mushroom', '/hen-of-the-woods-mushroom', '/cauliflower-mushroom', '/winter-mushrooms', '/shrimp-of-the-woods-mushroom', '/golden-oyster-mushroom', '/wine-cap-mushroom'],
  ['/puffball-mushroom', '/inky-cap-mushroom', '/stinkhorn-mushroom', '/jelly-fungus', '/wood-ear-mushroom', '/coral-fungus', '/cup-fungus'],
  ['/oak-tree-fungus-identification', '/maple-tree-fungus-identification', '/pine-tree-fungus-identification', '/palm-tree-fungus-identification', '/pheasant-back-mushroom', '/angel-wing-mushroom'],
  ['/orange-mushrooms', '/red-mushrooms', '/yellow-mushroom-in-potted-plant', '/wine-cap-mushroom', '/inky-cap-mushroom'],
]

/** Older guides and the charts that extend them. */
const FROM: Record<string, string[]> = {
  '/oak-tree-fungus-identification': ['/hen-of-the-woods-mushroom', '/maple-tree-fungus-identification', '/pine-tree-fungus-identification', '/palm-tree-fungus-identification', '/black-trumpet-mushroom', '/cauliflower-mushroom'],
  '/tree-mushroom-identification': ['/maple-tree-fungus-identification', '/pine-tree-fungus-identification', '/palm-tree-fungus-identification', '/pheasant-back-mushroom', '/hen-of-the-woods-mushroom', '/golden-oyster-mushroom'],
  '/tree-mushroom-identification-chart': ['/jelly-fungus', '/wood-ear-mushroom', '/coral-fungus', '/pheasant-back-mushroom', '/angel-wing-mushroom', '/maple-tree-fungus-identification'],
  '/puffball-mushroom': ['/shrimp-of-the-woods-mushroom', '/cup-fungus', '/coral-fungus', '/jelly-fungus'],
  '/inky-cap-mushroom': ['/winter-mushrooms', '/wine-cap-mushroom', '/yellow-mushroom-in-potted-plant'],
  '/stinkhorn-mushroom': ['/jelly-fungus', '/cup-fungus', '/coral-fungus', '/orange-mushrooms', '/red-mushrooms'],
  '/cantharellus-cibarius': ['/black-trumpet-mushroom', '/hedgehog-mushroom', '/orange-mushrooms', '/cauliflower-mushroom'],
  '/omphalotus-illudens': ['/orange-mushrooms', '/golden-oyster-mushroom'],
  '/laetiporus-sulphureus': ['/hen-of-the-woods-mushroom', '/pheasant-back-mushroom', '/orange-mushrooms', '/cauliflower-mushroom'],
  '/oyster-mushroom-identification-guide': ['/golden-oyster-mushroom', '/angel-wing-mushroom', '/winter-mushrooms'],
  '/galerina-marginata': ['/winter-mushrooms', '/wine-cap-mushroom'],
  '/amanita-muscaria': ['/red-mushrooms', '/orange-mushrooms', '/pine-tree-fungus-identification'],
  '/honey-mushroom-identification-guide': ['/shrimp-of-the-woods-mushroom', '/maple-tree-fungus-identification'],
  '/ganoderma-lucidum-group': ['/palm-tree-fungus-identification', '/red-mushrooms', '/maple-tree-fungus-identification'],
  '/chlorophyllum-molybdites': ['/palm-tree-fungus-identification', '/yellow-mushroom-in-potted-plant'],
  '/gyromitra-esculenta': ['/cup-fungus'],
  '/morchella-esculenta': ['/cup-fungus', '/pheasant-back-mushroom'],
  '/hericium-erinaceus-lions-mane-mushroom': ['/hedgehog-mushroom', '/coral-fungus'],
  '/turkey-tail-mushroom-identification': ['/winter-mushrooms', '/pheasant-back-mushroom'],
  '/trametes-versicolor-turkey-tail': ['/winter-mushrooms'],
  '/backyard-mushroom-identification-guide': ['/wine-cap-mushroom', '/yellow-mushroom-in-potted-plant', '/orange-mushrooms', '/red-mushrooms'],
  '/why-are-mushrooms-growing-in-my-yard': ['/yellow-mushroom-in-potted-plant', '/wine-cap-mushroom'],
  '/garden-mushroom-identification': ['/wine-cap-mushroom', '/yellow-mushroom-in-potted-plant'],
  '/dog-ate-mushroom': ['/yellow-mushroom-in-potted-plant', '/orange-mushrooms', '/red-mushrooms'],
  '/mushroom-grow-kits': ['/golden-oyster-mushroom', '/wine-cap-mushroom'],
  '/oyster-mushroom-grow-kit': ['/golden-oyster-mushroom'],
  '/how-to-grow-enoki-mushrooms': ['/winter-mushrooms'],
  '/spore-print': ['/wine-cap-mushroom', '/shrimp-of-the-woods-mushroom'],
  '/mushroom-habitat': ['/winter-mushrooms', '/maple-tree-fungus-identification', '/pine-tree-fungus-identification'],
  '/edible-mushroom-identification': ['/hen-of-the-woods-mushroom', '/black-trumpet-mushroom', '/hedgehog-mushroom'],
  '/wild-mushroom-identification-guide': ['/orange-mushrooms', '/red-mushrooms', '/winter-mushrooms'],
  '/poisonous-vs-edible-mushrooms': ['/orange-mushrooms', '/red-mushrooms', '/angel-wing-mushroom'],
}

const MAX = 8

/** Chart pages a given page should point to, best first. */
export function chartTargetsFor(slug: string): string[] {
  const self = slug.startsWith('/') ? slug : `/${slug}`
  const out = [...(FROM[self] ?? [])]
  for (const family of FAMILIES) if (family.includes(self)) out.push(...family)
  return Array.from(new Set(out)).filter((s) => s !== self).slice(0, MAX)
}

/** The targets that are live now, in the order chartTargetsFor gave them. */
export async function getChartLinks(slug: string): Promise<{ slug: string; title: string }[]> {
  const targets = chartTargetsFor(slug)
  if (!targets.length) return []
  const { data } = await createCachedClient([], 60)
    .from('blog_posts')
    .select('slug, title')
    .eq('status', 'published')
    .in('slug', targets)
  const rows = (data ?? []) as { slug: string; title: string }[]
  return targets.flatMap((t) => rows.filter((r) => r.slug === t))
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function chartLinksHtml(links: { slug: string; title: string }[]): string {
  if (!links.length) return ''
  const items = links.map((l) => `<li><a href="https://mushroomidentifiers.com${l.slug}">${esc(l.title.replace(/\s*\(.*?\)\s*$/, ''))}</a></li>`).join('')
  return `<aside class="mi-guides"><div class="mi-guides-title">More identification charts</div><ul>${items}</ul></aside>`
}

/** Puts the box before the FAQ, or at the end when a page has none. No <p> inside: ArticleContent cuts at every </p>. */
export function addChartLinks(html: string, links: { slug: string; title: string }[]): string {
  const box = chartLinksHtml(links)
  if (!html || !box) return html
  const faq = html.search(/<h2[^>]*>[^<]*Frequently Asked Questions/i)
  return faq > 0 ? html.slice(0, faq) + box + html.slice(faq) : html + box
}
