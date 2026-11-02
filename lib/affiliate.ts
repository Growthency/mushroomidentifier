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

export type Product = { title: string; by: string; note: string; dp?: string; search?: string; image?: string }

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
  | 'grow'
  | 'preserve'
  | 'scope'
  | 'confirm'
  | 'default'

const BOOKS = {
  stamets: { title: 'Psilocybin Mushrooms of the World', by: 'Paul Stamets', note: 'The standard identification key for this group, with the spore print and bruising checks this guide describes.', dp: '0898158397', image: '/affiliate/stamets.webp' },
  demystified: { title: 'Mushrooms Demystified', by: 'David Arora', note: 'The big reference key for North America. Heavy, but it settles arguments the pocket guides cannot.', dp: '0898151694', image: '/affiliate/demystified.webp' },
  rain: { title: 'All That the Rain Promises and More', by: 'David Arora', note: 'The pocket guide for western mushrooms, small enough to carry.', dp: '0898153883', image: '/affiliate/rain.webp' },
  audubon: { title: 'National Audubon Society Field Guide to North American Mushrooms', by: 'Gary Lincoff', note: 'Photo guide covering the whole continent. The best first book for a beginner.', dp: '0394519922', image: '/affiliate/audubon.webp' },
  upperMidwest: { title: 'Mushrooms of the Upper Midwest', by: 'Teresa Marrone and Kathy Yerich', note: 'Simple photo guide to the common species of Minnesota, Wisconsin, Michigan and Iowa.', dp: '1591934176', image: '/affiliate/upperMidwest.webp' },
  midwest: { title: 'Mushrooms of the Midwest', by: 'Michael Kuo and Andrew Methven', note: 'Deeper regional guide from the author of MushroomExpert.com.', dp: '0252079760', image: '/affiliate/midwest.webp' },
  northeast: { title: 'Mushrooms of the Northeast', by: 'Teresa Marrone and Walt Sturgeon', note: 'Simple photo guide to the common species from Pennsylvania to Maine.', dp: '1591935911', image: '/affiliate/northeast.webp' },
  baroni: { title: 'Mushrooms of the Northeastern United States and Eastern Canada', by: 'Timothy Baroni', note: 'Timber Press field guide with full descriptions and look-alikes.', dp: '1604696346', image: '/affiliate/baroni.webp' },
  pnw: { title: 'Mushrooms of the Pacific Northwest, Revised Edition', by: 'Steve Trudell', note: 'Timber Press field guide for Washington, Oregon, Idaho and British Columbia.', dp: '1643260863', image: '/affiliate/pnw.webp' },
  rockies: { title: 'Mushrooms of the Rocky Mountain Region', by: 'Vera Stucky Evenson', note: 'Timber Press field guide for Colorado, Utah, New Mexico and the mountain West.', dp: '1604695765', image: '/affiliate/rockies.webp' },
  southeast: { title: 'Mushrooms of the Southeast', by: 'Todd Elliott and Steven Stephenson', note: 'Timber Press field guide for Georgia, the Carolinas and the Gulf states.', dp: '160469730X', image: '/affiliate/southeast.webp' },
} satisfies Record<string, Product>

const GEAR = {
  loupe: { title: '10x jeweler’s loupe', by: 'Glass 10x hand lens', note: 'Lets you see gill edges, pore size and surface hairs that separate look-alikes.', dp: 'B018V46B4A', image: '/affiliate/loupe.webp' },
  knife: { title: 'Opinel No. 08 mushroom knife', by: 'Curved stainless blade with a boar-bristle brush', note: 'Cuts cleanly and brushes soil off caps so you can see the base and the ring.', dp: 'B000KIMSG6', image: '/affiliate/knife.webp' },
  bag: { title: 'Foldable mesh foraging bag', by: 'Mesh, not plastic', note: 'Keeps finds dry and lets spores fall as you walk. Plastic bags turn mushrooms to mush.', dp: 'B0FPF1J14D', image: '/affiliate/bag.webp' },
  dehydrator: { title: 'Food dehydrator', by: 'Any tray dehydrator with a thermostat', note: 'The simplest way to store a good find. Dried mushrooms keep for a year.', search: 'food dehydrator', image: '/affiliate/dehydrator.webp' },
  oysterKit: { title: 'Oyster mushroom grow kit', by: 'Countertop kit', note: 'Grow the real thing at home and learn its gills and smell before you forage it.', search: 'oyster mushroom grow kit', image: '/affiliate/oysterKit.webp' },
  lionsManeKit: { title: 'Lion’s mane grow kit', by: 'Countertop kit', note: 'A safe way to know this species by sight before you look for it on trees.', search: 'lions mane mushroom grow kit', image: '/affiliate/lionsManeKit.webp' },
  bttrOyster: { title: 'Back to the Roots Organic Oyster Mushroom Grow Kit', by: 'Back to the Roots', note: 'Organic countertop kit. Open it, mist it daily, and the listing promises oyster mushrooms in about 10 days.', dp: 'B00CD0KZ78', image: '/affiliate/oysterKit.webp' },
  nsBlueOyster: { title: 'North Spore Blue Oyster Mushroom Grow Kit, 4 lb', by: 'North Spore', note: 'Larger 4 lb kit with a spray bottle. The listing gives 0.5 to 1.5 lb on the first harvest, with more flushes after.', dp: 'B076VWP33D', image: '/affiliate/oysterKit.webp' },
  goldenOyster: { title: 'Organic 4 lb Golden Oyster Mushroom Growing Kit', by: 'Double-sided fruiting kit', note: 'Golden oysters grow in warm rooms and fruit from two sides of the block, per the listing.', dp: 'B0F3JLNN8X', image: '/affiliate/oysterKit.webp' },
  inbloomLions: { title: 'inbloom Lion\u2019s Mane Mushroom Growing Kit, 4 lb', by: 'inbloom', note: 'A 4 lb kit with a spray bottle for growing lion\u2019s mane on the counter.', dp: 'B0HFSF6HCK', image: '/affiliate/lionsManeKit.webp' },
  cosori5ss: { title: 'Cosori 5-Tray Stainless Steel Food Dehydrator', by: 'Cosori', note: '3.1 sq ft of drying space on stainless trays. One of the most-reviewed dehydrators on Amazon.', dp: 'B0CHRWLM5Z', image: '/affiliate/dehydrator.webp' },
  cosori10: { title: 'Cosori 10-Tray Stainless Steel Food Dehydrator', by: 'Cosori', note: '7.4 sq ft of drying space for a large harvest or a full season of mushrooms.', dp: 'B0H3PDPV1L', image: '/affiliate/dehydrator.webp' },
  cosoriBudget: { title: 'Cosori 5-Tray BPA-Free Food Dehydrator', by: 'Cosori', note: 'Lower-cost model with temperature control up to 165 F. Enough for a few baskets of mushrooms.', dp: 'B09GFVL7QX', image: '/affiliate/dehydrator.webp' },
  prestoCanner: { title: 'Presto 23-Quart Pressure Canner and Cooker', by: 'Presto', note: 'The kind of pressure canner that National Center for Home Food Preservation guidance calls for when canning mushrooms.', dp: 'B0000BYCFU', image: '/affiliate/canner.webp' },
  microscope: { title: 'AmScope 40X-1000X Compound Microscope', by: 'AmScope', note: 'Magnifies enough to see spores. Some look-alikes can only be separated under a microscope.', dp: 'B00AM5XB5O', image: '/affiliate/microscope.webp' },
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
  grow: { eyebrow: 'Grow kits mentioned in this guide', heading: 'Kits that fruit on the counter', items: [GEAR.bttrOyster, GEAR.nsBlueOyster, GEAR.inbloomLions] },
  preserve: { eyebrow: 'Equipment for drying mushrooms', heading: 'Dehydrators and a pressure canner', items: [GEAR.cosori5ss, GEAR.cosori10, GEAR.prestoCanner] },
  confirm: { eyebrow: 'Before you trust any ID', heading: 'Check this result against a field guide', items: [BOOKS.audubon, GEAR.loupe, BOOKS.demystified] },
  scope: { eyebrow: 'Microscopes for mushroom identification', heading: 'Two ways to start looking at spores', items: [GEAR.microscope, GEAR.loupe] },
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
  if (/identifier-book|mushroom-book|field-guide/.test(s)) return 'books-us'
  if (/grow-kit|growing-kit|grow-your-own|grow-mushrooms/.test(s)) return 'grow'
  if (/dry-mushrooms|dehydrat|preserv|freeze-dr|store-mushrooms/.test(s)) return 'preserve'
  if (/microscope|spore-print|spores-under/.test(s)) return 'scope'
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
const DISCLOSURE = 'As an Amazon Associate, Mushroom Identifiers earns from qualifying purchases. Prices and availability are shown on Amazon. Gear pictures are illustrations of the product type; book covers are the real covers.'

function item(p: Product, subtag: string): string {
  const thumb = p.image ? `<a class="mi-aff-thumb" href="${amazonUrl(p, subtag)}" target="_blank" rel="sponsored nofollow noopener" tabindex="-1"><img src="${p.image}" alt="" width="72" height="96" loading="lazy"></a>` : ''
  return `<li class="mi-aff-item">${thumb}<div class="mi-aff-text"><strong>${esc(p.title)}</strong><span class="mi-aff-by">${esc(p.by)}</span><span class="mi-aff-note">${esc(p.note)}</span></div><a class="mi-aff-btn" href="${amazonUrl(p, subtag)}" target="_blank" rel="sponsored nofollow noopener">See on Amazon</a></li>`
}

export function affiliateBoxHtml(context: AffiliateContext, placement: string): string {
  const box = BOXES[context] || BOXES.default
  const subtag = `${placement}-${context}`.replace(/[^a-z0-9-]/gi, '').slice(0, 40)
  return `<aside class="mi-aff" data-ctx="${context}"><div class="mi-aff-head"><span class="mi-aff-eyebrow">${esc(box.eyebrow)}</span><strong class="mi-aff-title">${esc(box.heading)}</strong></div><ul class="mi-aff-list">${box.items.map((p) => item(p, subtag)).join('')}</ul><p class="mi-aff-foot">Shipping these fast? <a href="${BOUNTY.prime}" target="_blank" rel="sponsored nofollow noopener">Try Prime free for 30 days</a>. ${DISCLOSURE}</p></aside>`
}

export function affiliateKitHtml(): string {
  const items = [GEAR.loupe, GEAR.knife, BOOKS.audubon]
  return `<aside class="mi-aff mi-aff-kit"><div class="mi-aff-head"><span class="mi-aff-eyebrow">Forager’s kit</span><strong class="mi-aff-title">Three things worth carrying</strong></div><ul class="mi-aff-list">${items.map((p) => `<li class="mi-aff-item">${p.image ? `<a class="mi-aff-thumb" href="${amazonUrl(p, 'sidebar-kit')}" target="_blank" rel="sponsored nofollow noopener" tabindex="-1"><img src="${p.image}" alt="" width="56" height="72" loading="lazy"></a>` : ''}<div class="mi-aff-text"><strong>${esc(p.title)}</strong><span class="mi-aff-note">${esc(p.note)}</span></div><a class="mi-aff-btn" href="${amazonUrl(p, 'sidebar-kit')}" target="_blank" rel="sponsored nofollow noopener">Amazon</a></li>`).join('')}</ul><p class="mi-aff-foot"><a href="${BOUNTY.prime}" target="_blank" rel="sponsored nofollow noopener">Try Prime free for 30 days</a> for fast shipping. <a href="/mushroom-identifier-book">Compare field guides by region</a>. ${DISCLOSURE}</p></aside>`
}

/** Prime free-trial link. The subtag separates the bar from the banners in reports. */
export function primeUrl(sub: string): string {
  return `${BOUNTY.prime}&ascsubtag=${encodeURIComponent(sub)}`
}

/** In-content landscape banner, 728x90 on desktop. Part of the article flow. */
export function primeBannerHtml(sub: string): string {
  const u = primeUrl(sub)
  return `<aside class="mi-prime"><a class="mi-prime-img" href="${u}" target="_blank" rel="sponsored nofollow noopener" tabindex="-1"><img src="/affiliate/prime.webp" alt="" width="160" height="90" loading="lazy"></a><div class="mi-prime-text"><span class="mi-prime-eyebrow">Free for 30 days</span><strong class="mi-prime-title">Try Amazon Prime free</strong><span class="mi-prime-sub">Fast delivery on field guides, kits and gear.</span></div><a class="mi-prime-btn" href="${u}" target="_blank" rel="sponsored nofollow noopener">Start free trial</a><span class="mi-prime-ad">Ad</span></aside>`
}

function gridItem(p: Product, rank: number, sub: string): string {
  const u = amazonUrl(p, sub)
  return `<li class="mi-grid-item"><span class="mi-grid-rank">${rank}</span><a class="mi-grid-img" href="${u}" target="_blank" rel="sponsored nofollow noopener" tabindex="-1"><img src="${p.image || ''}" alt="${esc(p.title)}" width="240" height="180" loading="lazy"></a><span class="mi-grid-tag">${esc(p.by)}</span><a class="mi-grid-name" href="${u}" target="_blank" rel="sponsored nofollow noopener">${esc(p.title)}</a><a class="mi-grid-btn" href="${u}" target="_blank" rel="sponsored nofollow noopener">See it on Amazon</a></li>`
}

/** Three-card "Our picks at a glance" row, placed right after the intro. */
export function picksGridHtml(context: AffiliateContext): string {
  const box = BOXES[context] || BOXES.default
  const sub = `intro-${context}`.replace(/[^a-z0-9-]/gi, '').slice(0, 40)
  return `<aside class="mi-grid"><p class="mi-grid-title">Our picks at a glance</p><ol class="mi-grid-list">${box.items.slice(0, 3).map((p, i) => gridItem(p, i + 1, sub)).join('')}</ol></aside>`
}

/**
 * Article placements. Right after the intro: the picks grid, then the Prime
 * banner. Long articles add one box before the FAQ. Poison and safety pages
 * keep the products lower down, so the warning comes first. Pages with
 * hand-placed cards keep those and only gain what they lack.
 */
export function injectAffiliateBoxes(html: string, context: AffiliateContext): string {
  if (!html) return html
  const hasGrid = html.includes('class="mi-grid')
  const handPlaced = hasGrid || html.includes('class="mi-aff')
  const banner = primeBannerHtml(`banner-${context}`.replace(/[^a-z0-9-]/gi, ''))
  const h2s = [...html.matchAll(/<h2[\s>]/g)].map((m) => m.index as number)

  if (context === 'safety') {
    if (handPlaced) return html
    const main = affiliateBoxHtml(context, 'article') + banner
    if (h2s.length < 4) return html + main
    return html.slice(0, h2s[2]) + main + html.slice(h2s[2])
  }

  const first = html.search(/<h[23][\s>]/i)
  const top = (hasGrid ? '' : picksGridHtml(context)) + banner
  let out = first > 0 ? html.slice(0, first) + top + html.slice(first) : top + html
  if (handPlaced || h2s.length < 8) return out
  const faq = out.search(/<h2[^>]*>[^<]*(Frequently Asked Questions|Final Safety)/i)
  if (faq > 0) out = out.slice(0, faq) + affiliateBoxHtml(context === 'edible' ? 'default' : 'edible', 'article-end') + out.slice(faq)
  return out
}

/** One product per context for the sticky sidebar card. */
const PICK: Record<AffiliateContext, { product: Product; tag: string; image: string; alt: string }> = {
  psychedelic: { product: BOOKS.stamets, tag: 'The reference for this guide', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  northeast: { product: BOOKS.northeast, tag: 'Field guide for your region', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  midwest: { product: BOOKS.upperMidwest, tag: 'Field guide for your region', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  pnw: { product: BOOKS.pnw, tag: 'Field guide for your region', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  rockies: { product: BOOKS.rockies, tag: 'Field guide for your region', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  southeast: { product: BOOKS.southeast, tag: 'Field guide for your region', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  wood: { product: GEAR.knife, tag: 'The one tool every forager carries', image: '/affiliate-pick-knife.webp', alt: 'Curved mushroom knife with a brush beside a basket of mushrooms, illustration' },
  edible: { product: GEAR.knife, tag: 'The one tool every forager carries', image: '/affiliate-pick-knife.webp', alt: 'Curved mushroom knife with a brush beside a basket of mushrooms, illustration' },
  safety: { product: BOOKS.audubon, tag: 'The first book to own', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  'books-us': { product: BOOKS.demystified, tag: 'The reference experts use', image: '/affiliate-pick-books.webp', alt: 'Stack of mushroom field guides with a hand lens, illustration' },
  grow: { product: GEAR.bttrOyster, tag: 'Beginner kit for this guide', image: '/affiliate/oysterKit.webp', alt: 'Oyster mushroom grow kit' },
  preserve: { product: GEAR.cosori5ss, tag: 'Dehydrator for this guide', image: '/affiliate/dehydrator.webp', alt: 'Food dehydrator' },
  confirm: { product: BOOKS.audubon, tag: 'The first book to own', image: '/affiliate/audubon.webp', alt: 'Field guide' },
  scope: { product: GEAR.microscope, tag: 'For looking at spores', image: '/affiliate/microscope.webp', alt: 'Compound microscope' },
  default: { product: GEAR.knife, tag: 'The one tool every forager carries', image: '/affiliate-pick-knife.webp', alt: 'Curved mushroom knife with a brush beside a basket of mushrooms, illustration' },
}

export function affiliatePickHtml(context: AffiliateContext = 'default'): string {
  const pick = PICK[context] || PICK.default
  const p = pick.product
  const url = amazonUrl(p, `sidebar-pick-${context}`)
  return `<aside class="mi-aff mi-pick"><span class="mi-pick-tag">Editor’s pick</span><a class="mi-pick-img" href="${url}" target="_blank" rel="sponsored nofollow noopener"><img src="${p.image || pick.image}" alt="${esc(p.title)}" width="320" height="240" loading="lazy"></a><p class="mi-pick-eyebrow">${esc(pick.tag)}</p><strong class="mi-pick-title">${esc(p.title)}</strong><span class="mi-aff-by">${esc(p.by)}</span><span class="mi-aff-note">${esc(p.note)}</span><a class="mi-aff-btn mi-pick-btn" href="${url}" target="_blank" rel="sponsored nofollow noopener">Check price on Amazon</a><p class="mi-aff-foot">${DISCLOSURE}</p></aside>`
}
