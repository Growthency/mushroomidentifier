import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import IdentifyBanner from '@/components/blog/IdentifyBanner'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import ArticleViewCount from '@/components/blog/ArticleViewCount'

export const metadata: Metadata = {
  title: 'Agaricus campestris (Meadow Mushroom) \u2013 Identification Guide',
  description: 'Agaricus campestris, commonly known as the meadow mushroom or field mushroom, is a widely recognized edible wild mushroom found in grasslands, pastures, and open fields.',
  alternates: { canonical: 'https://mushroomidentifiers.com/agaricus-campestris' },
  openGraph: {
    title: 'Agaricus campestris (Meadow Mushroom) \u2013 Identification Guide',
    description: 'Agaricus campestris, commonly known as the meadow mushroom or field mushroom, is a widely recognized edible wild mushroom found in grasslands, pastures, and open fields.',
    url: 'https://mushroomidentifiers.com/agaricus-campestris',
    images: [{ url: 'https://mushroomidentifiers.com/agaricus-campestris-meadow-mushroom-identification.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Agaricus campestris (Meadow Mushroom) \u2013 Identification, Edibility & Lookalikes',
      description: 'Agaricus campestris, commonly known as the meadow mushroom or field mushroom, is a widely recognized edible wild mushroom found in grasslands, pastures, and open fields.',
      image: 'https://mushroomidentifiers.com/agaricus-campestris-meadow-mushroom-identification.webp',
      author: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: 'https://mushroomidentifiers.com/agaricus-campestris',
      datePublished: '2026-04-11',
      dateModified: '2026-04-11',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is Agaricus campestris safe to eat?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, but only if correctly identified. It can be confused with toxic species.' } },
        { '@type': 'Question', name: 'What does it taste like?', acceptedAnswer: { '@type': 'Answer', text: 'Mild, similar to store-bought mushrooms.' } },
        { '@type': 'Question', name: 'How do I tell it apart from toxic species?', acceptedAnswer: { '@type': 'Answer', text: 'No yellow staining, pleasant smell, and pink to brown gills.' } },
        { '@type': 'Question', name: 'Where does it grow?', acceptedAnswer: { '@type': 'Answer', text: 'In meadows, lawns, and grasslands.' } },
        { '@type': 'Question', name: 'Can beginners forage it safely?', acceptedAnswer: { '@type': 'Answer', text: 'Only with proper knowledge or guidance.' } },
        { '@type': 'Question', name: 'Can AI identify meadow mushrooms?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, AI tools can help, but always verify manually.' } },
      ],
    },
  ],
}

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
const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-5" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
    <span className="text-xl flex-shrink-0">⚠️</span>
    <div style={{ color: '#fca5a5' }}>{children}</div>
  </div>
)
const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-xl my-5" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}>
    <div style={{ color: 'var(--text-muted)' }}>{children}</div>
  </div>
)
const SafeBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-5" style={{ background: '#22c55e12', border: '1px solid #22c55e35' }}>
    <span className="text-xl flex-shrink-0">✅</span>
    <div style={{ color: '#86efac' }}>{children}</div>
  </div>
)

export default function AgaricusCampestrisPage() {
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
                <span>Agaricus campestris Meadow Mushroom</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>Edible</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f9731620', color: '#f97316' }}>Lookalike Risk</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Agaricus campestris</em> (Meadow Mushroom) &ndash; Identification, Edibility &amp; Lookalikes
                </h1>
                <AuthorBlock updatedAt="Apr 11, 2026" />
                <ArticleViewCount views={2130} className="mb-2" />
              </div>

              {/* ── What is Agaricus campestris? ── */}
              <Section>
                <H2 id="what-is-agaricus-campestris">What is Agaricus campestris?</H2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Agaricus campestris</em>, commonly known as the meadow mushroom or field mushroom, is a widely recognized edible wild mushroom found in grasslands, pastures, and open fields. It belongs to the same genus as the cultivated <em>Agaricus bisporus</em> and is prized for its mild flavor and culinary versatility.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  For identification, the key features include white caps, pink gills that turn chocolate-brown with age, and a pleasant mushroom aroma. However, it can be confused with toxic species in the same genus, so accurate identification is essential. Beginners should combine field knowledge with a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identifier
                  </Link>{' '}
                  tool or AI mushroom identification app to safely confirm species before consumption.
                </p>
              </Section>

              {/* ── Featured Image 1 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/agaricus-campestris-meadow-mushroom-identification.webp"
                    alt="Agaricus campestris meadow mushroom identification — white cap edible wild mushroom in grassland"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Agaricus campestris (meadow mushroom) growing in an open field near Steenderen, Netherlands.
                  Source: Henk Monster, CC BY 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />
              <TableOfContents />

              {/* ── Taxonomy ── */}
              <Section>
                <H2 id="taxonomy">Scientific Classification &amp; Taxonomy</H2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Kingdom', 'Fungi'],
                    ['Phylum', 'Basidiomycota'],
                    ['Class', 'Agaricomycetes'],
                    ['Order', 'Agaricales'],
                    ['Family', 'Agaricaceae'],
                    ['Genus', 'Agaricus'],
                    ['Species', 'Agaricus campestris'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <InfoBox>
                  <p className="text-sm">Closely related to both edible and toxic <em>Agaricus</em> species. Correct identification within this genus is critical. See also our guide on{' '}
                    <Link href="/agaricus-arvensis-horse-mushroom" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                      Agaricus arvensis (Horse Mushroom)
                    </Link>{' '}— another edible species in the same genus.
                  </p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Key Features (Identification Essentials)</H2>

                <H3 id="cap">Cap Characteristics</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Color: White to slightly creamy</li>
                  <li>Shape: Convex → flat with age</li>
                  <li>Surface: Smooth, sometimes slightly silky</li>
                  <li>Size: 5–10 cm diameter</li>
                </ul>

                <H3 id="gills">Gills (Important Feature)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Start pink → turn dark brown (chocolate)</li>
                  <li>Free from the stem</li>
                </ul>

                <H3 id="stem">Stem (Stipe)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Short, sturdy</li>
                  <li>White with a small ring (annulus)</li>
                  <li>Smooth surface</li>
                </ul>

                <H3>Overall Appearance</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Clean white mushroom with pink-to-brown gills</li>
                  <li>Grows in open grassy areas</li>
                </ul>
              </Section>

              {/* ── Image 2 — Gill Detail ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/agaricus-campestris-field-mushroom-pink-gills-detail.webp"
                    alt="Agaricus campestris field mushroom pink gills detail — edible mushroom gill structure"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Close-up of Agaricus campestris gill structure — pink to brown gill color progression visible.
                  Source: Ak ccm, CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Color, Smell & Taste ── */}
              <Section>
                <H2 id="color-smell-taste">Color, Smell &amp; Taste</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li><strong>Color:</strong> White cap, pink → brown gills</li>
                  <li><strong>Smell:</strong> Pleasant, mushroom-like</li>
                  <li><strong>Taste:</strong> Mild and nutty (when properly identified and cooked)</li>
                  <li><strong>Texture:</strong> Firm but tender</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">Never taste wild mushrooms unless you are certain of identification.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Environment & Habitat ── */}
              <Section>
                <H2 id="habitat">Environment &amp; Habitat</H2>
                <H3>Habitat &amp; Distribution</H3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Found worldwide:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Europe</li>
                  <li>North America</li>
                  <li>Asia</li>
                  <li>Australia</li>
                </ul>
                <p className="text-sm mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>Common in:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Meadows</li>
                  <li>Pastures</li>
                  <li>Lawns</li>
                  <li>Grasslands</li>
                </ul>

                <H3>Seasonality</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Spring to autumn</li>
                </ul>

                <H3>Growth Pattern</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Grows in groups</li>
                  <li>Grows in rings (fairy rings)</li>
                  <li>Prefers nutrient-rich soil</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Physical Dimensions ── */}
              <Section>
                <H2 id="dimensions">Physical Dimensions &amp; Structure</H2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Cap Diameter', '5–10 cm'],
                    ['Stem Height', '3–7 cm'],
                    ['Stem Thickness', '1–2 cm'],
                    ['Gills', 'Free, crowded'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Edibility & Nutritional Value ── */}
              <Section>
                <H2 id="edibility">Edibility &amp; Nutritional Value</H2>
                <SafeBox>
                  <p className="text-sm font-semibold">Yes — Agaricus campestris is edible and highly regarded as a wild food mushroom.</p>
                </SafeBox>

                <H3>Culinary Uses</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Frying, grilling, soups</li>
                  <li>Similar taste to button mushrooms</li>
                </ul>

                <H3>Nutritional Benefits</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Rich in protein</li>
                  <li>Contains B vitamins</li>
                  <li>Low in calories</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Risk Level ── */}
              <Section>
                <H2 id="risk-level">Risk Level Assessment</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Edibility', '🟢 Edible'],
                    ['Toxicity Risk', '🟠 Moderate (misidentification risk)'],
                    ['Fatality Risk', '🔴 High if confused with toxic species'],
                    ['Identification Difficulty', '🟠 Moderate'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold w-36 flex-shrink-0" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Similar Species ── */}
              <Section>
                <H2 id="similar-species">Similar Species (Critical Comparison)</H2>

                <H3>Dangerous Lookalikes</H3>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-card)' }}>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Feature</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Meadow Mushroom</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Toxic Agaricus Species</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'var(--text-muted)' }}>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Smell</td><td className="p-3">Pleasant</td><td className="p-3">Chemical/phenol-like</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Staining</td><td className="p-3">Minimal</td><td className="p-3">Yellow staining</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Gills</td><td className="p-3">Pink → brown</td><td className="p-3">Similar but with warning signs</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Edibility</td><td className="p-3">Safe</td><td className="p-3">Toxic</td></tr>
                    </tbody>
                  </table>
                </div>

                <H3>Common Confusion Species</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li><em>Agaricus xanthodermus</em> (toxic — yellow-staining mushroom)</li>
                  <li>
                    <Link href="/amanita-virosa-mushroom" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                      Amanita virosa
                    </Link>{' '}(deadly — Destroying Angel)
                  </li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">Key rule: avoid white mushrooms with white gills (possible Amanita). Meadow mushrooms always have pink to brown gills, never white.</p>
                </WarningBox>
              </Section>

              {/* ── Image 3 — Group ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/agaricus-campestris-edible-wild-mushroom-group.webp"
                    alt="Agaricus campestris edible wild mushroom group growing in grassland"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Group of Agaricus campestris (meadow mushrooms) — typical cluster growth pattern.
                  Source: Christine Braaten, CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Growth Pattern & Life Cycle ── */}
              <Section>
                <H2 id="life-cycle">Growth Pattern &amp; Life Cycle</H2>
                <H3>Ecological Role</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Saprotrophic</li>
                  <li>Breaks down organic matter</li>
                  <li>Improves soil fertility</li>
                </ul>
                <H3>Life Cycle</H3>
                <ol className="list-decimal pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Spore release</li>
                  <li>Mycelium spreads in soil</li>
                  <li>Fruiting body develops</li>
                  <li>Spores disperse</li>
                </ol>
              </Section>

              <Divider />

              {/* ── Regions ── */}
              <Section>
                <H2 id="regions">Regions Where It Is Found</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>🇬🇧 United Kingdom</li>
                  <li>🇺🇸 United States</li>
                  <li>🇪🇺 Europe</li>
                  <li>🇦🇺 Australia</li>
                  <li>🌏 Worldwide in temperate regions</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Economic & Ecological Value ── */}
              <Section>
                <H2 id="ecological-value">Economic &amp; Ecological Value</H2>
                <H3>Ecological Importance</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Supports nutrient recycling</li>
                  <li>Enhances soil ecosystems</li>
                </ul>
                <H3>Economic Value</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Edible wild mushroom</li>
                  <li>Used in local foraging and markets</li>
                </ul>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Pros and Cons ── */}
              <Section>
                <H2 id="pros-and-cons">Pros and Cons</H2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: '#22c55e10', border: '1px solid #22c55e30' }}>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>✅ Pros</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Edible and tasty</li>
                      <li>Widely available</li>
                      <li>Nutritionally beneficial</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>❌ Cons</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Easily confused with toxic species</li>
                      <li>Requires careful identification</li>
                      <li>Not suitable for beginners without guidance</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── How to Identify ── */}
              <Section>
                <H2 id="field-guide">How to Identify Agaricus campestris Safely?</H2>
                <H3>Step-by-Step Identification</H3>
                <ol className="list-decimal pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Check pink gills (young stage)</li>
                  <li>Confirm gills turn brown with age</li>
                  <li>Smell → pleasant, not chemical</li>
                  <li>Look for growth in grasslands (not woods)</li>
                </ol>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  Always confirm with a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identification app
                  </Link>{' '}
                  or AI-based mushroom identification system for safer results. This helps reduce misidentification risks and supports beginners.
                </p>
              </Section>

              <Divider />

              {/* ── Expert Tips ── */}
              <Section>
                <H2 id="expert-tips">Expert Identification Tips</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Never pick mushrooms with white gills in grass (possible deadly species)</li>
                  <li>Check for yellow staining (avoid if present)</li>
                  <li>Smell is a key identifier</li>
                  <li>Use multiple features together</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  For understanding mushroom structures like gills, stems, and rings in detail, read our{' '}
                  <Link href="/mushroom-parts-explained" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom parts explained
                  </Link>{' '}
                  guide. And to learn how deadly lookalikes compare, see our{' '}
                  <Link href="/death-cap-vs-destroying-angel" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    Death Cap vs Destroying Angel
                  </Link>{' '}
                  comparison.
                </p>
              </Section>

              <Divider />

              {/* ── FAQ ── */}
              <Section>
                <H2 id="faq">Frequently Asked Questions</H2>
                {[
                  ['Is Agaricus campestris safe to eat?', 'Yes, but only if correctly identified. It can be confused with toxic species.'],
                  ['What does it taste like?', 'Mild, similar to store-bought mushrooms.'],
                  ['How do I tell it apart from toxic species?', 'No yellow staining, pleasant smell, and pink to brown gills.'],
                  ['Can beginners forage it safely?', 'Only with proper knowledge or guidance.'],
                  ['Where does it grow?', 'In meadows, lawns, and grasslands.'],
                  ['Can AI identify meadow mushrooms?', 'Yes, AI tools can help, but always verify manually.'],
                ].map(([q, a]) => (
                  <div key={q} className="mb-4 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{q}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{a}</p>
                  </div>
                ))}
              </Section>

              <Divider />

              {/* ── Final Thoughts ── */}
              <Section>
                <H2 id="final-thoughts">Final Thoughts</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Agaricus campestris</em> is a classic edible wild mushroom valued for its taste and availability. However, its resemblance to toxic species makes accurate identification essential.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  By understanding its gill color progression, smell, and habitat, and combining that with a reliable mushroom identifier tool, you can forage more safely and confidently.
                </p>
              </Section>

              <Divider />
              <BlogComments slug="/agaricus-campestris" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
