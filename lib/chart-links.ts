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
  ['/orange-mushrooms', '/red-mushrooms', '/yellow-mushrooms', '/yellow-mushroom-in-potted-plant', '/wine-cap-mushroom', '/inky-cap-mushroom'],
  ['/bracket-fungus', '/edible-polypore-mushrooms', '/artists-conk', '/red-belted-conk', '/birch-polypore', '/black-staining-polypore', '/resinous-polypore', '/reishi-look-alikes', '/white-tree-fungus'],
  ['/morel-vs-false-morel', '/where-to-find-morel-mushrooms', '/morel-mushroom-season', '/michigan-morel-mushrooms'],
  ['/stinkhorn-mushroom', '/lattice-stinkhorn', '/octopus-stinkhorn', '/stinkhorn-eggs', '/elegant-stinkhorn', '/birds-nest-fungus', '/puffball-mushroom'],
  ['/white-mushrooms-in-yard', '/mushrooms-growing-in-mulch', '/slime-mold', '/dog-vomit-slime-mold', '/mushrooms-growing-in-house', '/yellow-mushrooms', '/cluster-mushroom-identification', '/birds-nest-fungus'],
  ['/bolete-mushroom', '/russula-mushroom', '/milk-cap-mushroom', '/lobster-mushroom', '/parasol-mushroom', '/blewit-mushroom', '/false-oyster-mushroom', '/cluster-mushroom-identification'],
  ['/edible-mushrooms-in-california', '/poisonous-mushrooms-in-california', '/edible-mushrooms-in-oregon', '/edible-mushrooms-in-washington-state', '/poisonous-mushrooms-in-washington-state', '/edible-mushrooms-in-the-pacific-northwest', '/edible-mushrooms-in-idaho', '/edible-mushrooms-in-montana'],
  ['/edible-mushrooms-in-colorado', '/arizona-mushroom-identification', '/edible-mushrooms-in-utah', '/edible-mushrooms-in-idaho', '/edible-mushrooms-in-montana', '/white-mushrooms-in-texas'],
  ['/edible-mushrooms-in-texas', '/white-mushrooms-in-texas', '/edible-mushrooms-in-oklahoma', '/edible-mushrooms-in-arkansas', '/edible-mushrooms-in-louisiana', '/edible-mushrooms-in-missouri'],
  ['/edible-mushrooms-in-florida', '/poisonous-mushrooms-in-florida', '/edible-mushrooms-in-georgia', '/edible-mushrooms-in-alabama', '/edible-mushrooms-in-south-carolina', '/edible-mushrooms-in-north-carolina', '/edible-mushrooms-in-tennessee', '/edible-mushrooms-in-louisiana'],
  ['/edible-mushrooms-in-virginia', '/edible-mushrooms-in-west-virginia', '/edible-mushrooms-in-kentucky', '/edible-mushrooms-in-north-carolina', '/edible-mushrooms-in-tennessee', '/edible-mushrooms-in-maryland', '/edible-mushrooms-in-pa', '/edible-mushrooms-in-ohio'],
  ['/edible-mushrooms-in-ohio', '/edible-mushrooms-in-michigan', '/michigan-morel-mushrooms', '/edible-mushrooms-in-indiana', '/edible-mushrooms-in-illinois', '/edible-mushrooms-in-kentucky', '/edible-mushrooms-in-iowa', '/edible-mushrooms-in-minnesota'],
  ['/edible-mushrooms-in-new-york', '/edible-mushrooms-in-new-jersey', '/edible-mushrooms-in-massachusetts', '/edible-mushrooms-in-connecticut', '/edible-mushrooms-in-maine', '/edible-mushrooms-in-pa', '/edible-mushrooms-in-maryland'],
]

/** Older guides and the charts that extend them. */
const FROM: Record<string, string[]> = {
  '/oak-tree-fungus-identification': ['/bracket-fungus', '/hen-of-the-woods-mushroom', '/black-staining-polypore', '/artists-conk', '/maple-tree-fungus-identification', '/pine-tree-fungus-identification', '/palm-tree-fungus-identification', '/black-trumpet-mushroom', '/cauliflower-mushroom'],
  '/tree-mushroom-identification': ['/bracket-fungus', '/white-tree-fungus', '/maple-tree-fungus-identification', '/pine-tree-fungus-identification', '/palm-tree-fungus-identification', '/pheasant-back-mushroom', '/hen-of-the-woods-mushroom', '/golden-oyster-mushroom'],
  '/tree-mushroom-identification-chart': ['/bracket-fungus', '/white-tree-fungus', '/red-belted-conk', '/jelly-fungus', '/wood-ear-mushroom', '/coral-fungus', '/pheasant-back-mushroom', '/angel-wing-mushroom', '/maple-tree-fungus-identification'],
  '/maple-tree-fungus-identification': ['/artists-conk', '/white-tree-fungus'],
  '/pine-tree-fungus-identification': ['/red-belted-conk', '/milk-cap-mushroom'],
  '/puffball-mushroom': ['/stinkhorn-eggs', '/white-mushrooms-in-yard', '/shrimp-of-the-woods-mushroom', '/cup-fungus', '/coral-fungus', '/jelly-fungus'],
  '/inky-cap-mushroom': ['/winter-mushrooms', '/wine-cap-mushroom', '/yellow-mushroom-in-potted-plant', '/mushrooms-growing-in-house', '/mushrooms-growing-in-mulch'],
  '/stinkhorn-mushroom': ['/lattice-stinkhorn', '/octopus-stinkhorn', '/stinkhorn-eggs', '/elegant-stinkhorn', '/jelly-fungus', '/cup-fungus', '/coral-fungus', '/orange-mushrooms', '/red-mushrooms'],
  '/cup-fungus': ['/mushrooms-growing-in-house', '/birds-nest-fungus'],
  '/jelly-fungus': ['/slime-mold', '/dog-vomit-slime-mold'],
  '/winter-mushrooms': ['/blewit-mushroom', '/birch-polypore', '/resinous-polypore'],
  '/hen-of-the-woods-mushroom': ['/black-staining-polypore', '/edible-polypore-mushrooms'],
  '/golden-oyster-mushroom': ['/false-oyster-mushroom', '/yellow-mushrooms'],
  '/angel-wing-mushroom': ['/false-oyster-mushroom'],
  '/yellow-mushroom-in-potted-plant': ['/yellow-mushrooms', '/mushrooms-growing-in-house', '/mushrooms-growing-in-mulch'],
  '/orange-mushrooms': ['/lobster-mushroom', '/elegant-stinkhorn', '/yellow-mushrooms'],
  '/red-mushrooms': ['/russula-mushroom', '/lobster-mushroom'],
  '/cantharellus-cibarius': ['/black-trumpet-mushroom', '/hedgehog-mushroom', '/lobster-mushroom', '/orange-mushrooms', '/cauliflower-mushroom'],
  '/omphalotus-illudens': ['/false-oyster-mushroom', '/cluster-mushroom-identification', '/orange-mushrooms', '/golden-oyster-mushroom'],
  '/laetiporus-sulphureus': ['/edible-polypore-mushrooms', '/bracket-fungus', '/hen-of-the-woods-mushroom', '/pheasant-back-mushroom', '/orange-mushrooms', '/cauliflower-mushroom'],
  '/oyster-mushroom-identification-guide': ['/false-oyster-mushroom', '/golden-oyster-mushroom', '/angel-wing-mushroom', '/winter-mushrooms'],
  '/galerina-marginata': ['/cluster-mushroom-identification', '/mushrooms-growing-in-mulch', '/winter-mushrooms', '/wine-cap-mushroom'],
  '/amanita-muscaria': ['/red-mushrooms', '/yellow-mushrooms', '/orange-mushrooms', '/pine-tree-fungus-identification'],
  '/honey-mushroom-identification-guide': ['/cluster-mushroom-identification', '/shrimp-of-the-woods-mushroom', '/maple-tree-fungus-identification'],
  '/hypholoma-fasciculare': ['/cluster-mushroom-identification', '/yellow-mushrooms'],
  '/agaricus-xanthodermus': ['/yellow-mushrooms', '/white-mushrooms-in-yard'],
  '/ganoderma-lucidum-group': ['/reishi-look-alikes', '/artists-conk', '/red-belted-conk', '/palm-tree-fungus-identification', '/red-mushrooms', '/maple-tree-fungus-identification'],
  '/is-reishi-mushroom-psychedelic': ['/reishi-look-alikes'],
  '/medicinal-mushroom-identification': ['/reishi-look-alikes', '/birch-polypore'],
  '/inonotus-obliquus-chaga': ['/birch-polypore'],
  '/chlorophyllum-molybdites': ['/parasol-mushroom', '/white-mushrooms-in-yard', '/white-mushrooms-in-texas', '/poisonous-mushrooms-in-florida', '/palm-tree-fungus-identification', '/yellow-mushroom-in-potted-plant'],
  '/white-poisonous-mushrooms': ['/white-mushrooms-in-yard', '/white-mushrooms-in-texas', '/parasol-mushroom'],
  '/lepiota-brunneoincarnata': ['/parasol-mushroom'],
  '/death-cap-mushroom-identification': ['/poisonous-mushrooms-in-california', '/white-mushrooms-in-yard'],
  '/amanita-ocreata': ['/poisonous-mushrooms-in-california'],
  '/boletus-edulis': ['/bolete-mushroom'],
  '/are-there-any-deadly-leccinum-mushrooms': ['/bolete-mushroom'],
  '/cortinarius-rubellus': ['/blewit-mushroom'],
  '/gyromitra-esculenta': ['/morel-vs-false-morel', '/morel-mushroom-season', '/cup-fungus'],
  '/morchella-esculenta': ['/morel-vs-false-morel', '/where-to-find-morel-mushrooms', '/morel-mushroom-season', '/michigan-morel-mushrooms', '/cup-fungus', '/pheasant-back-mushroom'],
  '/edible-mushrooms-in-michigan': ['/michigan-morel-mushrooms', '/morel-mushroom-season', '/where-to-find-morel-mushrooms'],
  '/hericium-erinaceus-lions-mane-mushroom': ['/hedgehog-mushroom', '/coral-fungus', '/white-tree-fungus'],
  '/turkey-tail-mushroom-identification': ['/bracket-fungus', '/winter-mushrooms', '/pheasant-back-mushroom'],
  '/trametes-versicolor-turkey-tail': ['/bracket-fungus', '/winter-mushrooms'],
  '/backyard-mushroom-identification-guide': ['/white-mushrooms-in-yard', '/mushrooms-growing-in-mulch', '/slime-mold', '/dog-vomit-slime-mold', '/wine-cap-mushroom', '/yellow-mushroom-in-potted-plant', '/orange-mushrooms', '/red-mushrooms'],
  '/why-are-mushrooms-growing-in-my-yard': ['/white-mushrooms-in-yard', '/mushrooms-growing-in-mulch', '/slime-mold', '/cluster-mushroom-identification', '/yellow-mushroom-in-potted-plant', '/wine-cap-mushroom'],
  '/how-to-get-rid-of-mushrooms-in-grass': ['/white-mushrooms-in-yard', '/slime-mold', '/dog-vomit-slime-mold'],
  '/garden-mushroom-identification': ['/mushrooms-growing-in-mulch', '/white-mushrooms-in-yard', '/wine-cap-mushroom', '/yellow-mushroom-in-potted-plant'],
  '/dog-ate-mushroom': ['/white-mushrooms-in-yard', '/dog-vomit-slime-mold', '/mushrooms-growing-in-mulch', '/yellow-mushroom-in-potted-plant', '/orange-mushrooms', '/red-mushrooms'],
  '/how-to-identify-a-mushroom-you-found': ['/cluster-mushroom-identification', '/yellow-mushrooms', '/white-mushrooms-in-yard'],
  '/mushroom-grow-kits': ['/golden-oyster-mushroom', '/wine-cap-mushroom'],
  '/oyster-mushroom-grow-kit': ['/golden-oyster-mushroom'],
  '/how-to-grow-enoki-mushrooms': ['/winter-mushrooms'],
  '/spore-print': ['/parasol-mushroom', '/blewit-mushroom', '/cluster-mushroom-identification', '/wine-cap-mushroom', '/shrimp-of-the-woods-mushroom'],
  '/gills-vs-pores-vs-ridges-in-mushroom-identification': ['/bolete-mushroom', '/bracket-fungus', '/edible-polypore-mushrooms'],
  '/mushroom-color-changes-and-bruising-explained': ['/bolete-mushroom', '/milk-cap-mushroom', '/black-staining-polypore'],
  '/mushroom-habitat': ['/where-to-find-morel-mushrooms', '/winter-mushrooms', '/maple-tree-fungus-identification', '/pine-tree-fungus-identification'],
  '/edible-mushroom-identification': ['/edible-polypore-mushrooms', '/hen-of-the-woods-mushroom', '/black-trumpet-mushroom', '/hedgehog-mushroom'],
  '/wild-mushroom-identification-guide': ['/orange-mushrooms', '/red-mushrooms', '/yellow-mushrooms', '/winter-mushrooms'],
  '/poisonous-vs-edible-mushrooms': ['/morel-vs-false-morel', '/false-oyster-mushroom', '/orange-mushrooms', '/red-mushrooms', '/angel-wing-mushroom'],
}

const MAX = 8

/** Chart pages a given page should point to, best first. */
export function chartTargetsFor(slug: string): string[] {
  const self = slug.startsWith('/') ? slug : `/${slug}`
  const out = [...(FROM[self] ?? [])]
  for (const family of FAMILIES) if (family.includes(self)) out.push(...family)
  return Array.from(new Set(out)).filter((s) => s !== self)
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
  return targets.flatMap((t) => rows.filter((r) => r.slug === t)).slice(0, MAX)
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
