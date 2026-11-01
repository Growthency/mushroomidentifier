/**
 * Amazon Associates placements.
 *
 * One tag for the whole site; the `ascsubtag` parameter tells the placements
 * apart in Associates Central → Reports → Tracking → Sub tag. Books link by
 * ISBN-10 (Amazon treats it as the ASIN, checked live on 2026-11-01). Gear
 * links go to a search result so a discontinued listing never breaks a box.
 * Rules we follow: no prices in our copy, rel="sponsored nofollow", and the
 * disclosure line on every box.
 */

export const AMAZON_TAG = 'mushroomidentifiers-20'

export type Product = { title: string; by: string; note: string; dp?: string; search?: string }

export type AffiliateContext =
  | 'psychedelic'
  | 'northeast'
  | 'midwest'
  | 'pnw'
  | 'rockies'
  | 'southeast'
  | 'wood'
  | 'edible'
  | 'safety'
  | 'books-us'
  | 'default'

const BOOKS = {
  stamets: { title: 'Psilocybin Mushrooms of the World', by: 'Paul Stamets', note: 'The standard identification key for this group, with the spore print and bruising checks this guide describes.', dp: '0898158397' },
  demystified: { title: 'Mushrooms Demystified', by: 'David Arora', note: 'The big reference key for North America. Heavy, but it settles arguments the pocket guides cannot.', dp: '0898151694' },
  rain: { title: 'All That the Rain Promises and More', by: 'David Arora', note: 'The pocket guide for western mushrooms, small enough to carry.', dp: '0898153883' },
  audubon: { title: 'National Audubon Society Field Guide to North American Mushrooms', by: 'Gary Lincoff', note: 'Photo guide covering the whole continent. The best first book for a beginner.', dp: '0394519922' },
  upperMidwest: { title: 'Mushrooms of the Upper Midwest', by: 'Teresa Marrone and Kathy Yerich', note: 'Simple photo guide to the common species of Minnesota, Wisconsin, Michigan and Iowa.', dp: '1591934176' },
  midwest: { title: 'Mushrooms of the Midwest', by: 'Michael Kuo and Andrew Methven', note: 'Deeper regional guide from the author of MushroomExpert.com.', dp: '0252079760' },
  northeast: { title: 'Mushrooms of the Northeast', by: 'Teresa Marrone and Walt Sturgeon', note: 'Simple photo guide to the common species from Pennsylvania to Maine.', dp: '1591935911' },
  baroni: { title: 'Mushrooms of the Northeastern United States and Eastern Canada', by: 'Timothy Baroni', note: 'Timber Press field guide with full descriptions and look-alikes.', dp: '1604696346' },
  pnw: { title: 'Mushrooms of the Pacific Northwest, Revised Edition', by: 'Steve Trudell', note: 'Timber Press field guide for Washington, Oregon, Idaho and British Columbia.', dp: '1643260863' },
  rockies: { title: 'Mushrooms of the Rocky Mountain Region', by: 'Vera Stucky Evenson', note: 'Timber Press field guide for Colorado, Utah, New Mexico and the mountain West.', dp: '1604695765' },
  southeast: { title: 'Mushrooms of the Southeast', by: 'Todd Elliott and Steven Stephenson', note: 'Timber Press field guide for Georgia, the Carolinas and the Gulf states.', dp: '160469730X' },
} satisfies Record<string, Product>

const GEAR = {
  loupe: { title: '10x jeweler’s loupe', by: 'Glass 10x hand lens', note: 'Lets you see gill edges, pore size and surface hairs that separate look-alikes.', dp: 'B018V46B4A' },
  knife: { title: 'Opinel No. 08 mushroom knife', by: 'Curved stainless blade with a boar-bristle brush', note: 'Cuts cleanly and brushes soil off caps so you can see the base and the ring.', dp: 'B000KIMSG6' },
  bag: { title: 'Foldable mesh foraging bag', by: 'Mesh, not plastic', note: 'Keeps finds dry and lets spores fall as you walk. Plastic bags turn mushrooms to mush.', dp: 'B0FPF1J14D' },
  dehydrator: { title: 'Food dehydrator', by: 'Any tray dehydrator with a thermostat', note: 'The simplest way to store a good find. Dried mushrooms keep for a year.', search: 'food dehydrator' },
  oysterKit: { title: 'Oyster mushroom grow kit', by: 'Countertop kit', note: 'Grow the real thing at home and learn its gills and smell before you forage it.', search: 'oyster mushroom grow kit' },
  lionsManeKit: { title: 'Lion’s mane grow kit', by: 'Countertop kit', note: 'A safe way to know this species by sight before you look for it on trees.', search: 'lions mane mushroom grow kit' },
} satisfies Record<string, Product>

type Box = { eyebrow: string; heading: string; items: Product[] }

const BOXES: Record<AffiliateContext, Box> = {
  psychedelic: { eyebrow: 'Books for this guide', heading: 'Identification references worth owning', items: [BOOKS.stamets, BOOKS.demystified, GEAR.loupe] },
  northeast: { eyebrow: 'Field guides for this region', heading: 'Books that cover these species', items: [BOOKS.northeast, BOOKS.baroni, GEAR.knife] },
  midwest: { eyebrow: 'Field guides for this region', heading: 'Books that cover these species', items: [BOOKS.upperMidwest, BOOKS.midwest, GEAR.knife] },
  pnw: { eyebrow: 'Field guides for this region', heading: 'Books that cover these species', items: [BOOKS.pnw, BOOKS.rain, GEAR.knife] },
  rockies: { eyebrow: 'Field guides for this region', heading: 'Books that cover these species', items: [BOOKS.rockies, BOOKS.rain, GEAR.knife] },
  southeast: { eyebrow: 'Field guides for this region', heading: 'Books that cover these species', items: [BOOKS.southeast, BOOKS.audubon, GEAR.knife] },
  wood: { eyebrow: 'Gear for wood-growing species', heading: 'Tools that make this identification easier', items: [GEAR.loupe, GEAR.oysterKit, GEAR.dehydrator] },
  edible: { eyebrow: 'Foraging kit', heading: 'What experienced foragers carry', items: [GEAR.knife, GEAR.bag, BOOKS.audubon] },
  safety: { eyebrow: 'Identification references', heading: 'Books and tools for a safer check', items: [BOOKS.audubon, BOOKS.demystified, GEAR.loupe] },
  'books-us': { eyebrow: 'Field guides for the United States', heading: 'Start with the guide for your region', items: [BOOKS.audubon, BOOKS.demystified, BOOKS.upperMidwest, BOOKS.northeast, BOOKS.pnw, BOOKS.southeast] },
  default: { eyebrow: 'Forager’s kit', heading: 'Books and tools for identification', items: [BOOKS.audubon, GEAR.loupe, GEAR.knife] },
}

const REGION: Array<[RegExp, AffiliateContext]> = [
  [/-in-(pa|maryland|michigan-?north|new-york|new-jersey|ohio)$/, 'northeast'],
  [/-in-(michigan|minnesota|wisconsin|illinois|indiana|iowa|missouri)$|poisonous-mushrooms-iowa/, 'midwest'],
  [/pacific-northwest|-in-(alaska|washington|oregon)|washington-state/, 'pnw'],
  [/-in-(utah|new-mexico|colorado|idaho|montana)/, 'rockies'],
  [/-in-(georgia|florida|texas|north-carolina|south-carolina|alabama|tennessee)/, 'southeast'],
]

export function affiliateContextFor(slug: string, category?: string | null): AffiliateContext {
  const s = slug.replace(/^\//, '').toLowerCase()
  if (/psychedelic|psilocyb/.test(s)) return 'psychedelic'
  for (const [re, ctx] of REGION) if (re.test(s)) return ctx
  if (/tree|turkey|trametes|oyster|pleurotus|hericium|lions-mane|reishi|ganoderma|chaga|inonotus|laetiporus|lentinus|hypholoma|galerina|honey-mushroom|stinkhorn/.test(s)) return 'wood'
  if (/chanterelle|cantharellus|boletus|morchella|morel|puffball|inky-cap|agaricus-campestris|agaricus-arvensis|edible|wild-mushroom|how-to-identify|photograph|parts-explained|gills/.test(s)) return 'edible'
  if (/death-cap|amanita|poison|toxic|dog-ate|white-poisonous|small-brown|gyromitra|cortinarius|lepiota|chlorophyllum|omphalotus|scleroderma|can-two|deadly|safely/.test(s)) return 'safety'
  if (category === 'Safety') return 'safety'
  return 'default'
}

export function amazonUrl(p: Product, subtag: string): string {
  const base = p.dp ? `https://www.amazon.com/dp/${p.dp}` : `https://www.amazon.com/s?k=${encodeURIComponent(p.search || p.title)}`
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}tag=${AMAZON_TAG}&linkCode=ll2&ascsubtag=${encodeURIComponent(subtag)}`
}

export const BOUNTY = {
  prime: `https://www.amazon.com/tryprimefree?tag=${AMAZON_TAG}`,
  audible: `https://www.amazon.com/dp/B00NB86OYE?tag=${AMAZON_TAG}`,
  kindleUnlimited: `https://www.amazon.com/kindle-dbs/hz/signup?tag=${AMAZON_TAG}`,
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const DISCLOSURE = 'As an Amazon Associate, Mushroom Identifiers earns from qualifying purchases. Prices and availability are shown on Amazon.'

function item(p: Product, subtag: string): string {
  return `<li class="mi-aff-item"><div class="mi-aff-text"><strong>${esc(p.title)}</strong><span class="mi-aff-by">${esc(p.by)}</span><span class="mi-aff-note">${esc(p.note)}</span></div><a class="mi-aff-btn" href="${amazonUrl(p, subtag)}" target="_blank" rel="sponsored nofollow noopener">See on Amazon</a></li>`
}

export function affiliateBoxHtml(context: AffiliateContext, placement: string): string {
  const box = BOXES[context] || BOXES.default
  const subtag = `${placement}-${context}`.replace(/[^a-z0-9-]/gi, '').slice(0, 40)
  return `<aside class="mi-aff" data-ctx="${context}"><div class="mi-aff-head"><span class="mi-aff-eyebrow">${esc(box.eyebrow)}</span><strong class="mi-aff-title">${esc(box.heading)}</strong></div><ul class="mi-aff-list">${box.items.map((p) => item(p, subtag)).join('')}</ul><p class="mi-aff-foot">Shipping these fast? <a href="${BOUNTY.prime}" target="_blank" rel="sponsored nofollow noopener">Try Prime free for 30 days</a>. ${DISCLOSURE}</p></aside>`
}

export function affiliateKitHtml(): string {
  const items = [GEAR.loupe, GEAR.knife, BOOKS.audubon]
  return `<aside class="mi-aff mi-aff-kit"><div class="mi-aff-head"><span class="mi-aff-eyebrow">Forager’s kit</span><strong class="mi-aff-title">Three things worth carrying</strong></div><ul class="mi-aff-list">${items.map((p) => `<li class="mi-aff-item"><div class="mi-aff-text"><strong>${esc(p.title)}</strong><span class="mi-aff-note">${esc(p.note)}</span></div><a class="mi-aff-btn" href="${amazonUrl(p, 'sidebar-kit')}" target="_blank" rel="sponsored nofollow noopener">Amazon</a></li>`).join('')}</ul><p class="mi-aff-foot"><a href="${BOUNTY.prime}" target="_blank" rel="sponsored nofollow noopener">Try Prime free for 30 days</a> for fast shipping. ${DISCLOSURE}</p></aside>`
}

/**
 * Put one product box into an article body: before the third H2 when the
 * article has at least four sections, otherwise at the end. Long articles
 * (eight or more H2s) also get a kit box before the FAQ.
 */
export function injectAffiliateBoxes(html: string, context: AffiliateContext): string {
  if (!html || html.includes('class="mi-aff')) return html
  const h2s = [...html.matchAll(/<h2[\s>]/g)].map((m) => m.index as number)
  const main = affiliateBoxHtml(context, 'article')
  if (h2s.length < 4) return html + main
  let out = html.slice(0, h2s[2]) + main + html.slice(h2s[2])
  if (h2s.length >= 8) {
    const faq = out.search(/<h2[^>]*>[^<]*(Frequently Asked Questions|Final Safety)/i)
    if (faq > 0) out = out.slice(0, faq) + affiliateBoxHtml(context === 'edible' ? 'default' : 'edible', 'article-end') + out.slice(faq)
  }
  return out
}
