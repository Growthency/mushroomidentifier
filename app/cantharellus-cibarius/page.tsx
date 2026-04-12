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
  title: 'Cantharellus cibarius (Chanterelle) \u2013 Identification Guide',
  description: 'Cantharellus cibarius, commonly known as the chanterelle, is one of the most popular and highly prized wild edible mushrooms in the world.',
  alternates: { canonical: 'https://mushroomidentifiers.com/cantharellus-cibarius' },
  openGraph: {
    title: 'Cantharellus cibarius (Chanterelle) \u2013 Identification Guide',
    description: 'Cantharellus cibarius, commonly known as the chanterelle, is one of the most popular and highly prized wild edible mushrooms in the world.',
    url: 'https://mushroomidentifiers.com/cantharellus-cibarius',
    images: [{ url: 'https://mushroomidentifiers.com/cantharellus-cibarius-chanterelle-identification.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Cantharellus cibarius (Chanterelle) \u2013 Identification, Edibility & Lookalikes","description":"Cantharellus cibarius, commonly known as the chanterelle, is one of the most popular and highly prized wild edible mushrooms in the world.","image":["https://mushroomidentifiers.com/cantharellus-cibarius-chanterelle-identification.webp","https://mushroomidentifiers.com/chanterelle-false-gills-ridges.webp","https://mushroomidentifiers.com/cantharellus-cibarius-habitat-forest.webp"],"author":{"@type":"Organization","name":"Mushroom Identifiers","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifiers","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/cantharellus-cibarius","datePublished":"2026-04-11","dateModified":"2026-04-11"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Are chanterelles safe to eat?","acceptedAnswer":{"@type":"Answer","text":"Yes, they are safe and highly valued when correctly identified."}},{"@type":"Question","name":"What do chanterelles taste like?","acceptedAnswer":{"@type":"Answer","text":"They have a mild, fruity, and slightly peppery flavor."}},{"@type":"Question","name":"How do you identify chanterelles?","acceptedAnswer":{"@type":"Answer","text":"By their ridged underside, yellow color, and fruity smell."}},{"@type":"Question","name":"Can beginners forage chanterelles?","acceptedAnswer":{"@type":"Answer","text":"Yes, but they should verify using multiple identification methods."}},{"@type":"Question","name":"Where do chanterelles grow?","acceptedAnswer":{"@type":"Answer","text":"In forests, near trees, often among moss or leaf litter."}},{"@type":"Question","name":"Can AI identify chanterelle mushrooms?","acceptedAnswer":{"@type":"Answer","text":"Yes, AI tools can assist, but always confirm manually."}}]}]}

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

export default function CantharellusCibariusPage() {
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
                <span>Cantharellus cibarius Chanterelle</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>Edible</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#eab30820', color: '#eab308' }}>Gourmet</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Cantharellus cibarius</em> (Chanterelle) &ndash; Identification, Edibility &amp; Lookalikes
                </h1>
                <AuthorBlock updatedAt="Apr 11, 2026" />
                <LiveViewCount slug="/cantharellus-cibarius" className="mb-2" />
              </div>

              {/* Featured Image */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/cantharellus-cibarius-chanterelle-identification.webp"
                    alt="Cantharellus cibarius chanterelle mushroom identification — golden chanterelle specimen showing cap and stem"
                    width={820}
                    height={550}
                    sizes="(max-width: 768px) 100vw, 820px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Cantharellus cibarius (Golden Chanterelle). Photo: Holger Krisp, CC BY 3.0, via Wikimedia Commons
                </figcaption>
              </figure>

              <TableOfContents />

              {/* ── What is Cantharellus cibarius? ── */}
              <Section>
                <H2 id="what-is-cantharellus-cibarius">What is Cantharellus cibarius?</H2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Cantharellus cibarius</em>, commonly known as the chanterelle, is one of the most popular and highly prized wild edible mushrooms in the world. It is recognized for its golden-yellow color, fruity aroma, and unique ridged underside (false gills) rather than true gills. Found across Europe, North America, and Asia, chanterelles are valued in gourmet cooking for their delicate texture and rich flavor.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  For identification, the key features include forked ridges instead of gills, a firm flesh, and a mild apricot-like smell. However, they can be confused with toxic lookalikes such as <em>Omphalotus illudens</em>. To improve accuracy, beginners and experts alike often use a <Link href="/" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identifier</Link> tool or AI mushroom identification app alongside field knowledge.
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
                        ['Order', 'Cantharellales'],
                        ['Family', 'Cantharellaceae'],
                        ['Genus', 'Cantharellus'],
                        ['Species', 'Cantharellus cibarius'],
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
                  Chanterelles belong to a group of fungi characterized by their mycorrhizal relationships with trees, meaning they depend on forest ecosystems to grow. Several closely related species exist worldwide, often grouped under the chanterelle complex.
                </p>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Key Features (Identification Essentials)</H2>

                <H3 id="cap-characteristics">Cap Characteristics</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The cap of chanterelles is typically bright yellow to golden-orange, with a smooth or slightly wavy surface. It starts convex and becomes funnel-shaped as it matures. The edges are often irregular or lobed, giving the mushroom a natural, organic appearance.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Shape:</strong> Convex when young, becoming funnel-shaped</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Color:</strong> Bright yellow to golden-orange</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Surface:</strong> Smooth or slightly wavy</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Size:</strong> 3&ndash;10 cm diameter</li>
                </ul>

                <H3 id="false-gills">False Gills (Ridges)</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Instead of true gills, chanterelles have thick, forked ridges that run down the stem. These ridges are blunt and widely spaced, unlike the thin, sharp gills of many toxic mushrooms. This is one of the most reliable identification features.
                </p>

                {/* False gills image */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full" style={{ maxHeight: '460px' }}>
                    <Image
                      src="/chanterelle-false-gills-ridges.webp"
                      alt="Chanterelle false gills ridges — Cantharellus cibarius forked hymenium underside close-up"
                      width={820}
                      height={550}
                      className="w-full object-cover"
                      style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    False gills (ridged hymenium) of Cantharellus cibarius. Photo: Inger-Lise Fonneland, CC BY 4.0, via Wikimedia Commons
                  </figcaption>
                </figure>

                <H3 id="stem">Stem (Stipe)</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The stem is solid, firm, and the same color as the cap or slightly lighter. It tapers downward and merges smoothly with the cap, lacking a clear separation. This unified structure helps distinguish chanterelles from many lookalikes.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Shape:</strong> Solid, tapering downward</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Color:</strong> Same as cap or slightly lighter</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Structure:</strong> Merges smoothly with cap</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Height:</strong> 3&ndash;8 cm</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Color, Smell & Texture ── */}
              <Section>
                <H2 id="color-smell-texture">Color, Smell &amp; Texture</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Chanterelles are known for their pleasant fruity aroma, often compared to apricots. The flesh is firm and white inside, maintaining its structure when cut. Their color remains consistent throughout, and they do not exhibit staining or rapid discoloration.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {([
                    ['Color', 'Golden-yellow throughout, white flesh inside'],
                    ['Smell', 'Fruity, apricot-like aroma'],
                    ['Texture', 'Firm, dense, holds shape when cooked'],
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
                  Chanterelles are found across Europe, North America, Asia, and parts of Africa, particularly in temperate forests. They grow in association with trees such as oak, beech, pine, and spruce, forming beneficial underground partnerships.
                </p>

                {/* Habitat image */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full" style={{ maxHeight: '460px' }}>
                    <Image
                      src="/cantharellus-cibarius-habitat-forest.webp"
                      alt="Cantharellus cibarius habitat — golden chanterelle growing on forest floor among moss and leaf litter"
                      width={820}
                      height={550}
                      className="w-full object-cover"
                      style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    Chanterelle in its natural forest habitat. Photo: Arthur Kaljas, CC BY-SA 4.0, via Wikimedia Commons
                  </figcaption>
                </figure>

                <H3 id="seasonality">Seasonality</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  They typically appear from late spring to autumn, depending on rainfall and temperature. Moist conditions following rain often trigger their growth.
                </p>

                <H3 id="growth-pattern">Growth Pattern</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Chanterelles grow singly or in scattered groups, often hidden among leaf litter or moss. They rarely grow directly on wood, which is an important distinction from some toxic lookalikes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {([
                    ['Regions', 'Europe, North America, Asia, Africa'],
                    ['Trees', 'Oak, beech, pine, spruce'],
                    ['Season', 'Late spring to autumn'],
                    ['Growth', 'Solitary or scattered on soil, not wood'],
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
                        ['Cap Diameter', '3\u201310 cm'],
                        ['Stem Height', '3\u20138 cm'],
                        ['Stem Thickness', '1\u20133 cm'],
                        ['Structure', 'Solid, dense'],
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
                  Their compact yet sturdy structure makes them easy to handle and transport when foraging.
                </p>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Edibility & Nutrition ── */}
              <Section>
                <H2 id="edibility-nutrition">Edibility &amp; Nutritional Value</H2>

                <SafeBox>
                  <p className="text-sm font-semibold">Is Cantharellus cibarius edible? Yes &mdash; highly edible and considered a gourmet mushroom.</p>
                </SafeBox>

                <H3 id="culinary-uses">Culinary Uses</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Chanterelles are widely used in saut&eacute;ed dishes, sauces, soups, and fine dining recipes. Their flavor pairs well with butter, garlic, and herbs. They are a staple in French, Scandinavian, and Eastern European cuisines.
                </p>

                <H3 id="nutritional-benefits">Nutritional Benefits</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  They are rich in vitamins (especially vitamin D), antioxidants, and fiber, contributing to a healthy diet.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {([
                    ['Vitamin D', 'One of the best natural sources'],
                    ['Antioxidants', 'Beta-carotene and selenium'],
                    ['Fiber', 'Supports digestive health'],
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
                        ['Toxicity Risk', 'Moderate (misidentification risk)'],
                        ['Fatality Risk', 'Low'],
                        ['Identification Difficulty', 'Moderate'],
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
                  <p className="text-sm">Although edible, proper identification is essential to avoid confusion with toxic species. Always verify with a reliable <Link href="/" className="font-medium underline" style={{ color: '#fdba74' }}>wild mushroom identifier</Link>.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Similar Species ── */}
              <Section>
                <H2 id="similar-species">Similar Species (Critical Comparison)</H2>
                <H3 id="key-lookalike">Key Lookalike</H3>
                <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        {['Feature', 'Chanterelle (C. cibarius)', 'Jack-o\u2019-Lantern (O. illudens)'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['Underside', 'Blunt forked ridges', 'True sharp gills'],
                        ['Growth', 'On soil, solitary/scattered', 'On wood, in clusters'],
                        ['Glow', 'No bioluminescence', 'Bioluminescent'],
                        ['Flesh', 'White, firm', 'Orange throughout'],
                        ['Toxicity', 'Edible (excellent)', 'Toxic (causes illness)'],
                      ] as const).map(([feat, chant, jack], i) => (
                        <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                          <td className="px-4 py-3" style={{ color: '#86efac' }}>{chant}</td>
                          <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{jack}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The most dangerous lookalike is <em>Omphalotus illudens</em> (jack-o&apos;-lantern mushroom), which grows in clusters on wood and has true gills. For a detailed breakdown, read our <Link href="/omphalotus-illudens" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>Omphalotus illudens identification guide</Link>.
                </p>
              </Section>

              <Divider />

              {/* ── Growth Pattern & Life Cycle ── */}
              <Section>
                <H2 id="growth-lifecycle">Growth Pattern &amp; Life Cycle</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Chanterelles are mycorrhizal fungi, forming symbiotic relationships with tree roots. This allows them to exchange nutrients, supporting forest ecosystems. Their life cycle includes spore dispersal, underground mycelium growth, and seasonal fruiting bodies.
                </p>
                <InfoBox>
                  <p className="text-sm"><strong style={{ color: 'var(--text-primary)' }}>Did you know?</strong> Like porcini, chanterelles cannot be commercially cultivated because they require living tree partners. All chanterelles sold in markets are wild-harvested from forests.</p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Regions ── */}
              <Section>
                <H2 id="regions">Regions Where It Is Found</H2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  Chanterelles are widely distributed and especially common in temperate forest regions:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {([
                    ['France', 'Gourmet culinary staple'],
                    ['Italy', 'Popular in regional cuisine'],
                    ['United States', 'Pacific Northwest, Appalachia'],
                    ['China', 'Major wild harvest region'],
                    ['Scandinavia', 'Abundant in Nordic forests'],
                    ['Eastern Europe', 'Poland, Lithuania, Latvia'],
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
                  Chanterelles have high economic value due to their demand in global cuisine and are often sold fresh in markets. Ecologically, they play a crucial role in forest health by supporting tree growth through nutrient exchange. To learn more about how mushroom structures contribute to these relationships, see our <Link href="/mushroom-parts-explained" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom parts explained</Link> guide.
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
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Highly edible and flavorful</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Nutritionally beneficial (vitamin D)</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Widely appreciated in culinary arts</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Distinctive appearance aids identification</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444408', border: '1px solid #ef444425' }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: '#fca5a5' }}>Cons</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Seasonal availability only</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Can be confused with jack-o&apos;-lantern</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Requires careful identification</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Cannot be commercially cultivated</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── How to Identify Safely ── */}
              <Section>
                <H2 id="how-to-identify">How to Identify Cantharellus cibarius Safely</H2>
                <H3 id="step-by-step">Step-by-Step Identification</H3>
                <div className="space-y-3">
                  {([
                    ['1', 'Look for golden-yellow color', 'Consistent color from cap through stem, no dramatic color shifts'],
                    ['2', 'Check for false gills (ridges)', 'Blunt, forked ridges that run down the stem \u2014 not thin sharp gills'],
                    ['3', 'Smell for fruity aroma', 'Should have a pleasant apricot-like scent, not fishy or foul'],
                    ['4', 'Confirm growth on soil, not wood', 'Chanterelles grow from ground near trees \u2014 wood growth suggests a lookalike'],
                    ['5', 'Check flesh color when cut', 'Should be white and firm inside with no orange staining'],
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
                  <p className="text-sm">For added safety, use a <Link href="/" className="font-medium underline" style={{ color: 'var(--accent)' }}>mushroom identifier free by photo</Link> tool to verify your findings before consumption.</p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Expert Tips ── */}
              <Section>
                <H2 id="expert-tips">Expert Identification Tips</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Always check multiple features before confirming identification. Avoid mushrooms with sharp gills or those growing directly on wood. Cross-reference with reliable guides or tools, especially if you are new to foraging. For a comprehensive visual reference, explore our <Link href="/mushroom-identifier-book" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identification book</Link> recommendations.
                </p>
                <WarningBox>
                  <p className="text-sm">The jack-o&apos;-lantern mushroom (<em>Omphalotus illudens</em>) is the most commonly confused toxic species. Always check that your chanterelle has ridges (not gills), grows from soil (not wood), and has white flesh inside.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── FAQs ── */}
              <Section>
                <H2 id="faqs">People Also Ask (FAQs)</H2>
                <div className="space-y-3">
                  {([
                    { q: 'Are chanterelles safe to eat?', a: 'Yes, they are safe and highly valued when correctly identified. Chanterelles have been foraged and enjoyed for centuries across Europe, North America, and Asia.' },
                    { q: 'What do chanterelles taste like?', a: 'They have a mild, fruity, and slightly peppery flavor with a delicate texture. Their taste intensifies when saut\u00E9ed in butter.' },
                    { q: 'How do you identify chanterelles?', a: 'By their ridged underside (false gills), golden-yellow color, fruity apricot-like smell, and growth on soil near trees rather than on wood.' },
                    { q: 'Can beginners forage chanterelles?', a: 'Yes, but they should verify using multiple identification methods and cross-reference with a reliable guide or identification tool.' },
                    { q: 'Where do chanterelles grow?', a: 'In temperate forests worldwide, near trees like oak, beech, pine, and spruce. They prefer moist, mossy ground and leaf litter.' },
                    { q: 'Can AI identify chanterelle mushrooms?', a: 'Yes, AI tools can assist with identification, but always confirm manually. Use them as a helpful starting point, not a definitive answer.' },
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
                  <em>Cantharellus cibarius</em> is one of the most sought-after edible mushrooms thanks to its flavor, appearance, and ecological importance. Its unique features make it relatively easy to identify, but caution is still necessary.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  By combining field knowledge with a reliable <Link href="/" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identifier tool</Link>, you can confidently and safely enjoy chanterelles while avoiding dangerous lookalikes.
                </p>
              </Section>

              <Divider />
              <ViewTracker slug="/cantharellus-cibarius" />
              <BlogComments slug="/cantharellus-cibarius" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
