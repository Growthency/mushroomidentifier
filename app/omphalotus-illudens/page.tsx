import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import IdentifyBanner from '@/components/blog/IdentifyBanner'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import LiveViewCount from '@/components/blog/LiveViewCount'
import ViewTracker from '@/components/blog/ViewTracker'

export const metadata: Metadata = {
  title: "Omphalotus illudens (Jack-o'-Lantern Mushroom) - Identification Guide",
  description: 'Omphalotus illudens, commonly known as the jack-o\u2019-lantern mushroom, is a bright orange, bioluminescent fungus found mainly in North America.',
  alternates: { canonical: 'https://mushroomidentifiers.com/omphalotus-illudens' },
  openGraph: {
    type: 'article',
    title: "Omphalotus illudens (Jack-o'-Lantern Mushroom) - Identification Guide",
    description: 'Omphalotus illudens, commonly known as the jack-o\u2019-lantern mushroom, is a bright orange, bioluminescent fungus found mainly in North America.',
    url: 'https://mushroomidentifiers.com/omphalotus-illudens',
    images: [{ url: 'https://mushroomidentifiers.com/omphalotus-illudens-jack-o-lantern-mushroom-identification.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: "Omphalotus illudens (Jack-o'-Lantern Mushroom): Identification, Features, Habitat & Safety Guide",
      description: 'Omphalotus illudens, commonly known as the jack-o\u2019-lantern mushroom, is a bright orange, bioluminescent fungus found mainly in North America.',
      image: 'https://mushroomidentifiers.com/omphalotus-illudens-jack-o-lantern-mushroom-identification.webp',
      author: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: 'https://mushroomidentifiers.com/omphalotus-illudens',
      datePublished: '2026-04-11',
      dateModified: '2026-04-11',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: "Is jack-o'-lantern mushroom edible?", acceptedAnswer: { '@type': 'Answer', text: 'No, it is toxic and can cause severe gastrointestinal illness.' } },
        { '@type': 'Question', name: 'Why does Omphalotus illudens glow?', acceptedAnswer: { '@type': 'Answer', text: 'It produces light through a chemical reaction involving luciferin and luciferase, a natural bioluminescent process.' } },
        { '@type': 'Question', name: 'Can it kill you?', acceptedAnswer: { '@type': 'Answer', text: 'It is rarely fatal but can cause intense poisoning symptoms requiring medical attention.' } },
        { '@type': 'Question', name: 'How do you tell it apart from chanterelles?', acceptedAnswer: { '@type': 'Answer', text: 'Look for growth on wood (not soil), true gills (not ridges), and cluster formation.' } },
        { '@type': 'Question', name: 'Can AI identify this mushroom?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, modern tools and apps can help identify it using images, but always verify with expert sources.' } },
        { '@type': 'Question', name: 'What should I do if I eat one?', acceptedAnswer: { '@type': 'Answer', text: 'Seek medical help immediately. Do not wait for symptoms to worsen.' } },
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

export default function OmphalotusIlludensPage() {
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
                <span>Omphalotus illudens Jack-o&apos;-Lantern Mushroom</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#a855f720', color: '#a855f7' }}>Bioluminescent</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Omphalotus illudens</em> (Jack-o&apos;-Lantern Mushroom)
                </h1>
                <AuthorBlock updatedAt="Apr 11, 2026" />
                <LiveViewCount slug="/omphalotus-illudens" className="mb-2" />
              </div>

              {/* ── What is Omphalotus illudens? ── */}
              <Section>
                <H2 id="what-is-omphalotus-illudens">What is Omphalotus illudens?</H2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Omphalotus illudens</em>, commonly known as the jack-o&apos;-lantern mushroom, is a bright orange, bioluminescent fungus found mainly in North America. It is toxic and not edible, often mistaken for edible chanterelles due to its color. However, unlike chanterelles, it grows in clusters on wood and can cause severe gastrointestinal poisoning. Its unique glow in the dark (bioluminescence) makes it one of the most fascinating yet dangerous mushrooms in the wild. Accurate identification is crucial, and tools like a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identifier
                  </Link>{' '}
                  can help distinguish it from edible look-alikes.
                </p>
              </Section>

              {/* ── Featured Image 1 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/omphalotus-illudens-jack-o-lantern-mushroom-identification.webp"
                    alt="Omphalotus illudens jack-o'-lantern mushroom identification — bright orange clusters growing at tree base"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Omphalotus illudens (jack-o&apos;-lantern mushroom) clusters growing at the base of an oak tree.
                  Source: KeithMiklas, CC BY-SA 4.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />
              <TableOfContents />

              {/* ── Taxonomy ── */}
              <Section>
                <H2 id="taxonomy">Omphalotus illudens Scientific Classification &amp; Taxonomy</H2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Kingdom', 'Fungi'],
                    ['Phylum', 'Basidiomycota'],
                    ['Class', 'Agaricomycetes'],
                    ['Order', 'Agaricales'],
                    ['Family', 'Marasmiaceae'],
                    ['Genus', 'Omphalotus'],
                    ['Species', 'Omphalotus illudens'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <InfoBox>
                  <p className="text-sm">Closely related species include <em>Omphalotus olearius</em> (European jack-o&apos;-lantern). Both share bioluminescence and toxicity.</p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Omphalotus illudens Key Features (Identification Essentials)</H2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  Understanding its features is critical for safe mushroom identification:
                </p>

                <H3 id="visual-characteristics">Visual Characteristics</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Color: Bright orange to pumpkin-orange</li>
                  <li>Cap Shape: Convex → flat → slightly funnel-shaped</li>
                  <li>Cap Size: 5–20 cm wide</li>
                  <li>Gills: Sharp, deep, decurrent (run down the stem)</li>
                  <li>Stem: Central, firm, orange</li>
                </ul>

                <H3 id="bioluminescence">Bioluminescence</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Emits a faint green glow in dark environments</li>
                  <li>Caused by natural compounds like luciferin and luciferase</li>
                </ul>

                <H3 id="growth-pattern">Growth Pattern</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Grows in dense clusters</li>
                  <li>Often found at the base of trees or on decaying wood</li>
                </ul>
              </Section>

              {/* ── Image 2 — Bioluminescence ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/omphalotus-illudens-bioluminescent-mushroom-glow.webp"
                    alt="Omphalotus illudens bioluminescent mushroom glowing green in the dark"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Bioluminescence of Omphalotus — the characteristic greenish glow visible in darkness.
                  Source: The Brook, CC BY-SA 4.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Environment & Habitat ── */}
              <Section>
                <H2 id="habitat">Omphalotus illudens Environment &amp; Habitat</H2>
                <H3>Habitat &amp; Distribution</H3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Common in:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Eastern North America</li>
                  <li>Midwest USA</li>
                  <li>Southeastern forests</li>
                </ul>
                <p className="text-sm mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>Typically grows on:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Decaying hardwood stumps</li>
                  <li>Buried roots</li>
                  <li>Dead logs</li>
                </ul>

                <H3>Seasonality</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Late summer to fall (peak growth period)</li>
                </ul>

                <H3>Preferred Environment</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Moist woodland areas</li>
                  <li>Rich organic soil near tree bases</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Physical Dimensions ── */}
              <Section>
                <H2 id="dimensions">Omphalotus illudens Physical Dimensions &amp; Structure</H2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Cap Diameter', '5–20 cm'],
                    ['Stem Height', '5–15 cm'],
                    ['Stem Thickness', '1–3 cm'],
                    ['Gills Depth', 'Deep and crowded'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Smell, Taste & Texture ── */}
              <Section>
                <H2 id="smell-taste-texture">Smell, Taste &amp; Texture</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li><strong>Smell:</strong> Mild to slightly unpleasant</li>
                  <li><strong>Taste:</strong> Bitter (should NEVER be tasted intentionally)</li>
                  <li><strong>Texture:</strong> Fibrous and firm</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">Important: Never taste unknown mushrooms for identification.</p>
                </WarningBox>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Toxicity ── */}
              <Section>
                <H2 id="toxicity">Omphalotus illudens Toxicity &amp; Health Risks</H2>
                <WarningBox>
                  <p className="text-sm font-semibold">Yes — highly toxic (moderate severity). Not edible under any circumstances.</p>
                </WarningBox>

                <H3>Symptoms of Poisoning</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Nausea</li>
                  <li>Vomiting</li>
                  <li>Abdominal cramps</li>
                  <li>Diarrhea</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Symptoms usually appear within a few hours after ingestion.</p>

                <H3>Toxic Compounds</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Contains <strong>illudin S</strong>, a cytotoxic compound</li>
                </ul>
                <InfoBox>
                  <p className="text-sm">While rarely fatal, it can cause severe distress and dehydration. Unlike{' '}
                    <Link href="/amanita-phalloides-death-cap" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                      Death Cap (Amanita phalloides)
                    </Link>{' '}
                    which contains amatoxins, the toxins in jack-o&apos;-lantern mushroom are less lethal but still dangerous.
                  </p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Risk Level ── */}
              <Section>
                <H2 id="risk-level">Omphalotus illudens Risk Level Assessment</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Toxicity', 'High'],
                    ['Fatality Risk', 'Low to Moderate'],
                    ['Misidentification Risk', 'High'],
                    ['Edibility', '❌ Not edible'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold w-36 flex-shrink-0" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* ── Image 3 — Gill Detail ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/omphalotus-illudens-orange-mushroom-gill-detail.webp"
                    alt="Omphalotus illudens orange toxic mushroom gill and cap close-up detail"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Close-up of Omphalotus showing gill and cap detail — note the sharp, deep, true gills.
                  Source: Treetale, CC BY 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Similar Species ── */}
              <Section>
                <H2 id="similar-species">Similar Species (Critical Comparison)</H2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  One of the biggest dangers is confusion with edible mushrooms:
                </p>

                <H3>Chanterelles (<em>Cantharellus cibarius</em>)</H3>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-card)' }}>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Feature</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Jack-o&apos;-Lantern</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Chanterelle</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'var(--text-muted)' }}>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Color</td><td className="p-3">Bright orange</td><td className="p-3">Yellow/orange</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Growth</td><td className="p-3">Clusters on wood</td><td className="p-3">Scattered on soil</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Gills</td><td className="p-3">True gills</td><td className="p-3">False gills (ridges)</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Glow</td><td className="p-3">Yes (bioluminescent)</td><td className="p-3">No</td></tr>
                    </tbody>
                  </table>
                </div>

                <H3>Other False Lookalikes</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li><em>Omphalotus olearius</em> (European jack-o&apos;-lantern)</li>
                  <li>Some orange <em>Gymnopilus</em> species</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Growth Pattern & Life Cycle ── */}
              <Section>
                <H2 id="life-cycle">Growth Pattern &amp; Life Cycle</H2>
                <H3>Growth Behavior</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Saprotrophic fungus (feeds on decaying organic matter)</li>
                  <li>Breaks down wood and recycles nutrients</li>
                </ul>
                <H3>Life Cycle</H3>
                <ol className="list-decimal pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Spore release</li>
                  <li>Mycelium formation in wood</li>
                  <li>Fruiting body (mushroom)</li>
                  <li>Spore dispersal</li>
                </ol>
              </Section>

              <Divider />

              {/* ── Economic & Ecological Value ── */}
              <Section>
                <H2 id="ecological-value">Omphalotus illudens Economic &amp; Ecological Value</H2>
                <H3>Ecological Role</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Important decomposer in forest ecosystems</li>
                  <li>Helps recycle nutrients</li>
                </ul>
                <H3>Economic Value</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>No culinary value (toxic)</li>
                  <li>Studied in medicine due to illudin compounds</li>
                  <li>Potential anti-cancer research applications</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Pros and Cons ── */}
              <Section>
                <H2 id="pros-and-cons">Pros and Cons</H2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: '#22c55e10', border: '1px solid #22c55e30' }}>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>✅ Pros</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Unique bioluminescent properties</li>
                      <li>Important ecological role</li>
                      <li>Valuable in scientific research</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>❌ Cons</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Toxic and unsafe to eat</li>
                      <li>Easily confused with edible species</li>
                      <li>Can cause severe illness</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Regions ── */}
              <Section>
                <H2 id="regions">Regions Where It Is Found</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>🇺🇸 United States (East, Midwest, Southeast)</li>
                  <li>🇨🇦 Parts of Canada (less common)</li>
                  <li>Rare outside North America (related species exist elsewhere)</li>
                </ul>
              </Section>

              <Divider />

              {/* ── How to Identify ── */}
              <Section>
                <H2 id="field-guide">How to Identify Omphalotus illudens (Field Guide)</H2>
                <H3>Step-by-Step Identification</H3>
                <ol className="list-decimal pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Check color → bright orange</li>
                  <li>Observe growth → clustered on wood</li>
                  <li>Inspect gills → true, sharp, deep</li>
                  <li>Look for glow in darkness</li>
                  <li>Compare with chanterelles carefully</li>
                </ol>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  You can also use a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identification app
                  </Link>{' '}
                  to upload photos and confirm species safely. This helps reduce misidentification risks and supports beginners. For a deeper understanding of mushroom structures like gills and caps, check our{' '}
                  <Link href="/mushroom-parts-explained" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom parts explained
                  </Link>{' '}
                  guide.
                </p>
              </Section>

              <Divider />

              {/* ── Expert Tips ── */}
              <Section>
                <H2 id="expert-tips">Expert Tips for Safe Mushroom Identification</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Never rely on color alone</li>
                  <li>Always check habitat (wood vs soil)</li>
                  <li>Use multiple identification factors</li>
                  <li>Cross-check with field guides or experts</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">When in doubt → DO NOT CONSUME. For more on distinguishing deadly species, see our{' '}
                    <Link href="/death-cap-vs-destroying-angel" className="hover:underline font-medium" style={{ color: '#fca5a5' }}>
                      Death Cap vs Destroying Angel
                    </Link>{' '}comparison guide.
                  </p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── FAQ ── */}
              <Section>
                <H2 id="faq">Frequently Asked Questions</H2>
                {[
                  ["Is jack-o'-lantern mushroom edible?", 'No, it is toxic and can cause severe gastrointestinal illness.'],
                  ['Why does Omphalotus illudens glow?', 'It produces light through a chemical reaction involving luciferin and luciferase, a natural bioluminescent process.'],
                  ['Can it kill you?', 'It is rarely fatal but can cause intense poisoning symptoms requiring medical attention.'],
                  ['How do you tell it apart from chanterelles?', 'Look for growth on wood (not soil), true gills (not ridges), and cluster formation.'],
                  ['Can AI identify this mushroom?', 'Yes, modern tools and apps can help identify it using images, but always verify with expert sources.'],
                  ['What should I do if I eat one?', 'Seek medical help immediately. Do not wait for symptoms to worsen.'],
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
                  <em>Omphalotus illudens</em> (jack-o&apos;-lantern mushroom) is a perfect example of nature&apos;s beauty hiding danger. Its glowing appearance and vibrant color attract attention, but its toxicity makes it unsafe for consumption. Proper identification using habitat, structure, and expert tools is essential. Whether you&apos;re a beginner or an experienced forager, always prioritize safety and verification.
                </p>
              </Section>

              <Divider />
              <ViewTracker slug="/omphalotus-illudens" />
              <BlogComments slug="/omphalotus-illudens" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
