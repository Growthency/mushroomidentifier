import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import IdentifyBanner from '@/components/blog/IdentifyBanner'
import TableOfContents from '@/components/blog/TableOfContents'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import LiveViewCount from '@/components/blog/LiveViewCount'
import ViewTracker from '@/components/blog/ViewTracker'

export const metadata: Metadata = {
  title: 'Boletus edulis (Porcini Mushroom) \u2013 Identification Guide',
  description: 'Boletus edulis, commonly known as porcini, cep, or king bolete, is one of the most prized edible mushrooms in the world.',
  alternates: { canonical: 'https://mushroomidentifiers.com/boletus-edulis' },
  openGraph: {
    title: 'Boletus edulis (Porcini Mushroom) \u2013 Identification Guide',
    description: 'Boletus edulis, commonly known as porcini, cep, or king bolete, is one of the most prized edible mushrooms in the world.',
    url: 'https://mushroomidentifiers.com/boletus-edulis',
    images: [{ url: 'https://mushroomidentifiers.com/boletus-edulis-porcini-mushroom-identification.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Boletus edulis (Porcini Mushroom) \u2013 Identification, Edibility & Lookalikes","description":"Boletus edulis, commonly known as porcini, cep, or king bolete, is one of the most prized edible mushrooms in the world.","image":["https://mushroomidentifiers.com/boletus-edulis-porcini-mushroom-identification.webp","https://mushroomidentifiers.com/porcini-mushroom-pore-surface.webp","https://mushroomidentifiers.com/boletus-edulis-habitat-forest.webp"],"author":{"@type":"Organization","name":"Mushroom Identifiers","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifiers","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/boletus-edulis","datePublished":"2026-04-11","dateModified":"2026-04-11"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is porcini mushroom safe to eat?","acceptedAnswer":{"@type":"Answer","text":"Yes, it is one of the safest and most popular edible mushrooms when correctly identified."}},{"@type":"Question","name":"What does porcini taste like?","acceptedAnswer":{"@type":"Answer","text":"It has a rich, nutty, and slightly earthy flavor."}},{"@type":"Question","name":"How do you identify porcini?","acceptedAnswer":{"@type":"Answer","text":"Look for pores (not gills), thick stem with net pattern, and white flesh."}},{"@type":"Question","name":"Can beginners forage porcini safely?","acceptedAnswer":{"@type":"Answer","text":"Yes, with proper guidance and verification tools."}},{"@type":"Question","name":"Where does porcini grow?","acceptedAnswer":{"@type":"Answer","text":"In forests, especially near pine, oak, and spruce trees."}},{"@type":"Question","name":"Can AI identify porcini mushrooms?","acceptedAnswer":{"@type":"Answer","text":"Yes, AI tools can assist, but always verify manually."}}]}]}

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="mb-10">{children}</section>
)
const Divider = () => (
  <hr className="my-10 border-0 border-t" style={{ borderColor: 'var(--border)' }} />
)
const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-playfair text-2xl md:text-3xl font-bold mb-4 mt-2" style={{ color: 'var(--text-primary)' }}>
    {children}
  </h2>
)
const H3 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h3 id={id} className="font-playfair text-xl font-bold mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>
    {children}
  </h3>
)
const SafeBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-5" style={{ background: '#22c55e12', border: '1px solid #22c55e35' }}>
    <span className="text-xl flex-shrink-0">&#x2705;</span>
    <div style={{ color: '#86efac' }}>{children}</div>
  </div>
)
const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-xl my-5" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}>
    <div style={{ color: 'var(--text-muted)' }}>{children}</div>
  </div>
)
const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-5" style={{ background: '#f9731615', border: '1px solid #f9731640' }}>
    <span className="text-xl flex-shrink-0">&#x26A0;&#xFE0F;</span>
    <div style={{ color: '#fdba74' }}>{children}</div>
  </div>
)

export default function BoletusEdulisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-10 items-start">
            <article className="min-w-0 flex-1 max-w-4xl">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: 'var(--text-faint)' }}>
                <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:underline" style={{ color: 'var(--accent)' }}>Blog</Link>
                <span>/</span>
                <span>Boletus edulis Porcini Mushroom</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>Edible</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#eab30820', color: '#eab308' }}>Gourmet</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Boletus edulis</em> (Porcini Mushroom) &ndash; Identification, Edibility &amp; Lookalikes
                </h1>
                <AuthorBlock updatedAt="Apr 11, 2026" />
                <LiveViewCount slug="/boletus-edulis" className="mb-2" />
              </div>

              {/* Featured Image */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/boletus-edulis-porcini-mushroom-identification.webp"
                    alt="Boletus edulis porcini mushroom identification — king bolete specimen showing cap and stem"
                    width={820}
                    height={550}
                    sizes="(max-width: 768px) 100vw, 820px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Boletus edulis (King Bolete). Photo: James St. John, CC BY 2.0, via Wikimedia Commons
                </figcaption>
              </figure>

              <TableOfContents />

              {/* ── What is Boletus edulis? ── */}
              <Section>
                <H2 id="what-is-boletus-edulis">What is Boletus edulis?</H2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Boletus edulis</em>, commonly known as porcini, cep, or king bolete, is one of the most prized edible mushrooms in the world. It is highly valued for its rich, nutty flavor, meaty texture, and culinary versatility, especially in Italian and French cuisine. Unlike many mushrooms, porcini has pores instead of gills, a thick stem, and a smooth brown cap.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  For identification, key features include white pores that turn yellowish with age, a thick bulbous stem with a net-like pattern, and no color change when cut. While generally safe, confusion with bitter or inedible boletes is possible. Using a <Link href="/" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identifier</Link> tool or AI mushroom identification app can help confirm identification and improve foraging accuracy.
                </p>
              </Section>

              <Divider />

              {/* ── Scientific Classification ── */}
              <Section>
                <H2 id="scientific-classification">Scientific Classification &amp; Taxonomy</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <tbody>
                      {([
                        ['Kingdom', 'Fungi'],
                        ['Phylum', 'Basidiomycota'],
                        ['Class', 'Agaricomycetes'],
                        ['Order', 'Boletales'],
                        ['Family', 'Boletaceae'],
                        ['Genus', 'Boletus'],
                        ['Species', 'Boletus edulis'],
                      ] as const).map(([rank, name], i) => (
                        <tr key={rank} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold w-36" style={{ color: 'var(--accent)' }}>{rank}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}><em>{name}</em></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  The porcini belongs to the <em>Boletus</em> genus, which includes many edible and some inedible species. It forms part of a complex group often referred to as the <em>Boletus edulis</em> species complex, found across different continents with slight variations in appearance and habitat.
                </p>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Key Features (Identification Essentials)</H2>

                <H3 id="cap-characteristics">Cap Characteristics</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The cap of porcini is smooth, slightly sticky when moist, and ranges from light brown to dark chestnut. It typically starts convex and becomes flatter with age. The size can vary widely, but mature caps often reach 10&ndash;25 cm in diameter, making it a large and noticeable mushroom in the wild.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Shape:</strong> Convex when young, flattening with age</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Color:</strong> Light brown to dark chestnut</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Surface:</strong> Smooth, slightly sticky when moist</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Size:</strong> 10&ndash;25 cm diameter</li>
                </ul>

                <H3 id="pore-surface">Pore Surface (Instead of Gills)</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Instead of gills, porcini mushrooms have a spongy layer of pores underneath the cap. These pores are white when young and gradually turn yellow or olive-green with maturity. This is one of the most important distinguishing features from gilled mushrooms.
                </p>

                {/* Pore surface image */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full" style={{ maxHeight: '460px' }}>
                    <Image
                      src="/porcini-mushroom-pore-surface.webp"
                      alt="Porcini mushroom pore surface — Boletus edulis white hymenium underside close-up"
                      width={820}
                      height={550}
                      className="w-full object-cover"
                      style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    Pore surface of Boletus edulis showing white hymenium. Photo: Retama, CC BY-SA 4.0, via Wikimedia Commons
                  </figcaption>
                </figure>

                <H3 id="stem">Stem (Stipe)</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The stem is thick, bulbous, and often swollen at the base. It is typically white to light brown with a distinctive net-like (reticulate) pattern, especially near the top. This feature is key for identifying true porcini.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Shape:</strong> Thick, bulbous, swollen at base</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Color:</strong> White to light brown</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Pattern:</strong> Net-like (reticulate) near top</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Height:</strong> 8&ndash;20 cm</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Color, Smell & Texture ── */}
              <Section>
                <H2 id="color-smell-texture">Color, Smell &amp; Texture</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Porcini mushrooms are known for their pleasant, earthy aroma and firm texture. The flesh remains white when cut and does not change color, which helps differentiate it from some toxic lookalikes. The texture is dense and meaty, making it ideal for cooking and drying.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {([
                    ['Color', 'White flesh, brown cap, white to yellow pores'],
                    ['Smell', 'Pleasant, earthy, nutty aroma'],
                    ['Texture', 'Dense, firm, and meaty'],
                  ] as const).map(([label, desc]) => (
                    <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Habitat & Environment ── */}
              <Section>
                <H2 id="habitat-distribution">Environment &amp; Habitat</H2>

                <H3 id="habitat">Habitat &amp; Distribution</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Porcini mushrooms are found across Europe, North America, and Asia, particularly in temperate forests. They grow in association with trees like pine, spruce, oak, and birch, forming symbiotic relationships that support forest ecosystems.
                </p>

                {/* Habitat image */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full" style={{ maxHeight: '460px' }}>
                    <Image
                      src="/boletus-edulis-habitat-forest.webp"
                      alt="Boletus edulis habitat — porcini king bolete growing in natural forest environment"
                      width={820}
                      height={550}
                      className="w-full object-cover"
                      style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    Boletus edulis in its natural forest habitat. Photo: Staszek99, CC BY-SA 4.0, via Wikimedia Commons
                  </figcaption>
                </figure>

                <H3 id="seasonality">Seasonality</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  They typically appear from late summer to autumn, especially after rainfall followed by warm conditions. In some regions, they may also appear in spring depending on climate.
                </p>

                <H3 id="growth-pattern">Growth Pattern</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Porcini grow singly or in small groups, often near tree roots. They are mycorrhizal, meaning they form beneficial relationships with trees, exchanging nutrients through underground networks.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {([
                    ['Regions', 'Europe, North America, Asia'],
                    ['Trees', 'Pine, spruce, oak, birch'],
                    ['Season', 'Late summer to autumn'],
                    ['Growth', 'Solitary or small groups near tree roots'],
                  ] as const).map(([label, val]) => (
                    <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold w-20 flex-shrink-0" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Physical Dimensions ── */}
              <Section>
                <H2 id="physical-dimensions">Physical Dimensions &amp; Structure</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Measurement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['Cap Diameter', '10\u201325 cm'],
                        ['Stem Height', '8\u201320 cm'],
                        ['Stem Thickness', '3\u20138 cm'],
                        ['Pores', 'Fine, sponge-like'],
                      ] as const).map(([feat, val], i) => (
                        <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--accent)' }}>{feat}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  The overall structure is robust and heavy, often described as &ldquo;king-sized&rdquo; compared to many other mushrooms. Its thick stem and large cap make it easy to spot in suitable habitats.
                </p>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Edibility & Nutrition ── */}
              <Section>
                <H2 id="edibility-nutrition">Edibility &amp; Nutritional Value</H2>

                <SafeBox>
                  <p className="text-sm font-semibold">Is Boletus edulis edible? Yes &mdash; highly edible and considered a gourmet mushroom.</p>
                </SafeBox>

                <H3 id="culinary-uses">Culinary Uses</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Porcini are widely used in risottos, pasta, soups, and sauces. They can be eaten fresh or dried, with drying intensifying their flavor significantly. They are a staple of Italian and French cooking and pair well with garlic, thyme, and cream-based dishes.
                </p>

                <H3 id="nutritional-benefits">Nutritional Benefits</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  They are rich in protein, fiber, antioxidants, and essential vitamins like B-complex vitamins, making them both nutritious and flavorful.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {([
                    ['Protein', 'High plant-based protein content'],
                    ['Vitamins', 'B-complex, vitamin D'],
                    ['Antioxidants', 'Rich in ergothioneine'],
                  ] as const).map(([label, desc]) => (
                    <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Risk Level ── */}
              <Section>
                <H2 id="risk-level">Risk Level Assessment</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Factor</th>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['Edibility', 'Excellent'],
                        ['Toxicity Risk', 'Low (with correct ID)'],
                        ['Misidentification Risk', 'Moderate'],
                        ['Fatality Risk', 'Low'],
                      ] as const).map(([factor, level], i) => (
                        <tr key={factor} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--accent)' }}>{factor}</td>
                          <td className="px-4 py-3" style={{ color: factor === 'Edibility' ? '#86efac' : factor === 'Fatality Risk' ? '#86efac' : '#fdba74' }}>{level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <WarningBox>
                  <p className="text-sm">While porcini is safe when correctly identified, confusion with bitter or inedible species can ruin meals or cause mild discomfort. Always verify with a reliable <Link href="/" className="font-medium underline" style={{ color: '#fdba74' }}>mushroom identification app</Link>.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Similar Species ── */}
              <Section>
                <H2 id="similar-species">Similar Species (Critical Comparison)</H2>
                <H3 id="common-lookalikes">Common Lookalikes</H3>
                <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        {['Feature', 'Porcini (Boletus edulis)', 'Bitter Bolete (Tylopilus felleus)'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['Taste', 'Pleasant, nutty', 'Very bitter'],
                        ['Stem Pattern', 'Fine white net-like', 'Darker, coarser net'],
                        ['Pore Color', 'White \u2192 yellow-green', 'Pinkish'],
                        ['Flesh on Cut', 'No color change', 'May turn pinkish'],
                        ['Edibility', 'Excellent', 'Inedible (not toxic)'],
                      ] as const).map(([feat, porcini, bitter], i) => (
                        <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                          <td className="px-4 py-3" style={{ color: '#86efac' }}>{porcini}</td>
                          <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{bitter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  One of the most common lookalikes is <em>Tylopilus felleus</em> (bitter bolete), which is not toxic but has an extremely unpleasant taste. Unlike porcini, it often has pinkish pores and a darker stem network. For more help identifying similar species, check our <Link href="/are-there-any-deadly-leccinum-mushrooms" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>guide to deadly Leccinum mushrooms</Link>.
                </p>
              </Section>

              <Divider />

              {/* ── Growth Pattern & Life Cycle ── */}
              <Section>
                <H2 id="growth-lifecycle">Growth Pattern &amp; Life Cycle</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Porcini mushrooms are mycorrhizal fungi, meaning they form symbiotic relationships with tree roots. This allows them to exchange nutrients, helping trees grow while receiving sugars in return. Their life cycle includes spore dispersal, underground mycelium growth, and seasonal fruiting bodies.
                </p>
                <InfoBox>
                  <p className="text-sm"><strong style={{ color: 'var(--text-primary)' }}>Did you know?</strong> Porcini cannot be cultivated commercially because they require living tree partners to grow. All porcini in markets are wild-harvested.</p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Regions ── */}
              <Section>
                <H2 id="regions">Regions Where It Is Found</H2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  Porcini mushrooms are widely distributed and especially abundant in temperate forests with suitable tree partners:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {([
                    ['Italy', 'Primary culinary source'],
                    ['France', 'Highly prized as c\u00E8pe'],
                    ['United States', 'Pacific Northwest, Rockies'],
                    ['China', 'Major exporter'],
                    ['Scandinavia', 'Northern forests'],
                    ['Eastern Europe', 'Poland, Czech Republic'],
                  ] as const).map(([country, detail]) => (
                    <div key={country} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>{country}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{detail}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Economic & Ecological Value ── */}
              <Section>
                <H2 id="economic-ecological-value">Economic &amp; Ecological Value</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Porcini mushrooms have significant economic value due to their demand in global cuisine. They are harvested commercially and sold fresh or dried. Ecologically, they play a vital role in forest health by supporting tree growth and nutrient cycling. Understanding <Link href="/mushroom-parts-explained" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom parts and anatomy</Link> helps foragers better appreciate these ecological relationships.
                </p>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Pros and Cons ── */}
              <Section>
                <H2 id="pros-cons">Pros and Cons</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: '#22c55e08', border: '1px solid #22c55e25' }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: '#86efac' }}>Pros</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Highly edible and delicious</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Nutritionally rich in protein and vitamins</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Widely available in suitable habitats</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Dries well for long-term storage</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444408', border: '1px solid #ef444425' }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: '#fca5a5' }}>Cons</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Seasonal availability only</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Can be confused with bitter bolete</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Requires proper identification knowledge</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Cannot be commercially cultivated</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── How to Identify Safely ── */}
              <Section>
                <H2 id="how-to-identify">How to Identify Boletus edulis Safely</H2>
                <H3 id="step-by-step">Step-by-Step Identification</H3>
                <div className="space-y-3">
                  {([
                    ['1', 'Check for pores instead of gills', 'Porcini have a spongy pore layer, not blade-like gills'],
                    ['2', 'Confirm white flesh that does not change color', 'Cut the mushroom in half \u2014 flesh should stay white'],
                    ['3', 'Look for thick stem with net-like pattern', 'The reticulation is especially visible near the cap'],
                    ['4', 'Observe brown cap and forest habitat', 'Found near pine, oak, spruce, or birch trees'],
                    ['5', 'Taste test (tiny bit, spit out)', 'Should be pleasant and mild \u2014 bitter = wrong species'],
                  ] as const).map(([step, title, desc]) => (
                    <div key={step} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{step}</span>
                      <div>
                        <span className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>{title}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <InfoBox>
                  <p className="text-sm">For added safety, use a <Link href="/" className="font-medium underline" style={{ color: 'var(--accent)' }}>free mushroom identifier by photo</Link> to verify findings before consumption.</p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Expert Tips ── */}
              <Section>
                <H2 id="expert-tips">Expert Identification Tips</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Always inspect multiple features rather than relying on one trait. Avoid mushrooms with red pores or those that stain blue when cut. Stick to known habitats and confirm with reliable tools or guides. For a comprehensive visual reference, consult our <Link href="/mushroom-identifier-book" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identification book</Link> recommendations.
                </p>
                <WarningBox>
                  <p className="text-sm">Never eat a wild mushroom based on a single identification feature. Cross-reference cap color, pore type, stem pattern, habitat, and smell before consuming any foraged species.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── FAQs ── */}
              <Section>
                <H2 id="faqs">People Also Ask (FAQs)</H2>
                <div className="space-y-3">
                  {([
                    { q: 'Is porcini mushroom safe to eat?', a: 'Yes, it is one of the safest and most popular edible mushrooms when correctly identified. It has been consumed for centuries across Europe and Asia.' },
                    { q: 'What does porcini taste like?', a: 'It has a rich, nutty, and slightly earthy flavor that intensifies when dried. It pairs perfectly with pasta, risotto, and cream sauces.' },
                    { q: 'How do you identify porcini?', a: 'Look for pores (not gills), a thick stem with a net-like reticulate pattern, and white flesh that does not change color when cut.' },
                    { q: 'Can beginners forage porcini safely?', a: 'Yes, with proper guidance and verification tools. Porcini is one of the easier boletes to identify, but beginners should always double-check with an experienced forager or identification tool.' },
                    { q: 'Where does porcini grow?', a: 'In temperate forests worldwide, especially near pine, oak, spruce, and birch trees. They are most common in Europe and North America.' },
                    { q: 'Can AI identify porcini mushrooms?', a: 'Yes, AI tools can assist with identification, but always verify manually. Use them as a helpful starting point, not a definitive answer.' },
                  ] as const).map(({ q, a }) => (
                    <details key={q} className="rounded-xl overflow-hidden group" style={{ border: '1px solid var(--border)' }}>
                      <summary className="px-5 py-4 cursor-pointer font-semibold text-sm flex items-center justify-between select-none" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', listStyle: 'none' }}>
                        <span>{q}</span>
                        <span className="ml-3 flex-shrink-0 transition-transform duration-200 group-open:rotate-45" style={{ color: 'var(--accent)' }}>+</span>
                      </summary>
                      <div className="px-5 py-4 text-sm leading-relaxed" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                        {a}
                      </div>
                    </details>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Final Thoughts ── */}
              <Section>
                <H2 id="final-thoughts">Final Thoughts</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Boletus edulis</em> is a top-tier edible mushroom known for its flavor, size, and global culinary value. Its distinctive features make it easier to identify than many species, but caution is still necessary.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  By combining field knowledge with a reliable <Link href="/" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identifier tool</Link>, you can safely enjoy one of nature&apos;s finest wild foods while avoiding potential lookalikes.
                </p>
              </Section>

              <Divider />
              <ViewTracker slug="/boletus-edulis" />
              <BlogComments slug="/boletus-edulis" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
