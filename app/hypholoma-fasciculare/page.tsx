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
  title: 'Hypholoma fasciculare (Sulfur Tuft) – Identification Guide',
  description:
    'Hypholoma fasciculare, commonly known as the sulfur tuft, is a toxic woodland mushroom that grows in dense clusters on decaying wood.',
  alternates: { canonical: 'https://mushroomidentifiers.com/hypholoma-fasciculare' },
  openGraph: {
    title: 'Hypholoma fasciculare (Sulfur Tuft) – Identification Guide',
    description: 'Complete identification guide for Hypholoma fasciculare (sulfur tuft). Learn key features, greenish gills, toxicity, habitat, and how to distinguish it from edible wood mushrooms.',
    url: 'https://mushroomidentifiers.com/hypholoma-fasciculare',
    images: [{ url: 'https://mushroomidentifiers.com/hypholoma-fasciculare-sulfur-tuft-identification.webp', width: 820, height: 550, alt: 'Hypholoma fasciculare sulfur tuft mushroom identification guide' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hypholoma fasciculare (Sulfur Tuft) – Identification Guide',
    description: 'Complete identification guide for Hypholoma fasciculare — greenish gills, toxicity, habitat, and how to distinguish from edible wood mushrooms.',
    images: ['https://mushroomidentifiers.com/hypholoma-fasciculare-sulfur-tuft-identification.webp'],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Hypholoma fasciculare (Sulfur Tuft) – Identification, Toxicity & Lookalikes","description":"Learn to identify Hypholoma fasciculare (sulfur tuft) with this complete guide. Explore key features, greenish gills, toxicity, habitat, lookalikes, and safety tips.","image":"https://mushroomidentifiers.com/hypholoma-fasciculare-sulfur-tuft-identification.webp","author":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/hypholoma-fasciculare"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is sulfur tuft edible?","acceptedAnswer":{"@type":"Answer","text":"No, Hypholoma fasciculare is toxic and should not be consumed. It causes gastrointestinal symptoms including nausea, vomiting, diarrhea, and abdominal cramps."}},{"@type":"Question","name":"Why is it called sulfur tuft?","acceptedAnswer":{"@type":"Answer","text":"Because of its bright sulfur-yellow color and its clustered (tufted) growth pattern. The mushrooms grow in tight groups on decaying wood, forming distinctive yellow tufts."}},{"@type":"Question","name":"How can I identify Hypholoma fasciculare quickly?","acceptedAnswer":{"@type":"Answer","text":"Look for bright sulfur-yellow caps with a darker orange-brown center, greenish to olive gills, and dense clustered growth on decaying wood or tree stumps. The bitter taste is also a key warning sign, though tasting is not recommended."}},{"@type":"Question","name":"Can sulfur tuft kill you?","acceptedAnswer":{"@type":"Answer","text":"It is rarely fatal but causes severe gastrointestinal symptoms including intense nausea, vomiting, diarrhea, and abdominal cramps. Symptoms typically appear within a few hours of ingestion."}},{"@type":"Question","name":"What should I do if I eat sulfur tuft?","acceptedAnswer":{"@type":"Answer","text":"Seek medical help immediately. If possible, bring a sample or photo of the mushroom to help medical professionals confirm the species and provide appropriate treatment."}},{"@type":"Question","name":"Can AI identify sulfur tuft mushrooms?","acceptedAnswer":{"@type":"Answer","text":"Yes, AI mushroom identification tools can assist by analyzing the bright yellow color, clustered growth pattern, and habitat on wood. However, gill color confirmation requires close inspection, so always verify AI results with expert knowledge."}}]}]}

/* ── Reusable layout primitives ── */
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

export default function HypholomaFascicularePage() {
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
            <span>Hypholoma fasciculare Sulfur Tuft Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>High Misidentification Risk</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Hypholoma fasciculare</em> (Sulfur Tuft) &ndash; Identification, Toxicity &amp; Lookalikes
            </h1>
            <AuthorBlock updatedAt="Apr 11, 2026" />
            <LiveViewCount slug="/hypholoma-fasciculare" className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Hypholoma fasciculare</em>, commonly known as the sulfur tuft, is a toxic woodland mushroom
              that grows in dense clusters on decaying wood. It is easily recognized by its bright yellow color,
              greenish gills, and bitter taste, but it is often mistaken for edible species by beginners. Found
              across Europe, North America, and Asia, this mushroom plays an important ecological role as a
              decomposer but is unsafe to eat due to compounds that cause gastrointestinal poisoning.
            </p>
            <p className="text-base leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
              If your goal is accurate identification, focus on clustered growth on wood, sulfur-yellow caps,
              and olive-green gills. For added safety, many foragers now use a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
              or AI{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identification app</Link> to
              confirm species and avoid toxic lookalikes.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/hypholoma-fasciculare-sulfur-tuft-identification.webp"
                alt="Hypholoma fasciculare sulfur tuft mushroom identification — bright yellow clustered caps on wood"
                width={820}
                height={550}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Photo: Alan Rockefeller, CC BY-SA 4.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          <TableOfContents />

          {/* Taxonomy */}
          <Section>
            <H2 id="scientific-classification">Scientific Classification &amp; Taxonomy</H2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Kingdom', 'Fungi'],
                    ['Phylum', 'Basidiomycota'],
                    ['Class', 'Agaricomycetes'],
                    ['Order', 'Agaricales'],
                    ['Family', 'Strophariaceae'],
                    ['Genus', 'Hypholoma'],
                    ['Species', 'Hypholoma fasciculare'],
                  ].map(([rank, name], i) => (
                    <tr key={rank} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold w-36" style={{ color: 'var(--accent)' }}>{rank}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}><em>{name}</em></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Closely related to other <em>Hypholoma</em> species, some of which are edible or mildly toxic. The
              sulfur tuft belongs to the Strophariaceae family and is one of the most common wood-decomposing
              mushrooms in temperate forests worldwide.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Essentials)</H2>

            <H3 id="cap">Cap Characteristics</H3>
            <ul>
              <li><strong>Color:</strong> Sulfur-yellow with darker orange or reddish center</li>
              <li><strong>Shape:</strong> Convex when young, flattening with age</li>
              <li><strong>Size:</strong> 2–6 cm diameter</li>
              <li><strong>Surface:</strong> Smooth, sometimes slightly sticky when wet</li>
            </ul>

            <H3 id="gills">Gills (Important ID Feature)</H3>
            <ul>
              <li><strong>Young:</strong> Start pale yellow</li>
              <li><strong>Mature:</strong> Turn greenish to olive (key identification feature)</li>
              <li><strong>Attachment:</strong> Crowded and attached to the stem</li>
            </ul>
            <WarningBox>
              The greenish to olive-colored gills are the most reliable identification feature. Edible lookalikes
              typically have white, cream, or brown gills — never greenish. Always check gill color carefully.
            </WarningBox>

            <H3 id="stem">Stem (Stipe)</H3>
            <ul>
              <li><strong>Color:</strong> Slender, yellowish</li>
              <li><strong>Base:</strong> Often darker toward the base (brownish)</li>
              <li><strong>Ring:</strong> No prominent ring</li>
              <li><strong>Texture:</strong> Fibrous, sometimes curved</li>
            </ul>

            <H3 id="growth">Growth Pattern</H3>
            <ul>
              <li>Grows in tight clusters (tufts) — rarely solitary</li>
              <li>Almost always found on wood (stumps, logs, buried roots)</li>
            </ul>
          </Section>

          {/* Second Image — Green Gills */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/sulfur-tuft-greenish-gills-identification.webp"
                alt="Sulfur tuft greenish gills identification — Hypholoma fasciculare showing olive-green gill color"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Greenish gills of Hypholoma fasciculare. Photo: MichalPL, CC BY-SA 4.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Color, Smell & Taste */}
          <Section>
            <H2 id="color-smell-taste">Color, Smell &amp; Taste</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Color', items: ['Cap: Bright sulfur-yellow', 'Center: Darker orange-brown', 'Gills: Greenish to olive'] },
                { title: 'Smell', items: ['Mild, sometimes earthy', 'Not strongly distinctive'] },
                { title: 'Taste', items: ['Extremely bitter (key warning sign)', '⚠️ Never taste mushrooms intentionally'] },
              ].map(({ title, items }) => (
                <div key={title} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--accent)' }}>{title}</h4>
                  <ul className="space-y-1">
                    {items.map(item => (
                      <li key={item} className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Dimensions */}
          <Section>
            <H2 id="dimensions">Physical Dimensions &amp; Structure</H2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Cap Diameter', '2–6 cm'],
                ['Stem Height', '3–10 cm'],
                ['Stem Thickness', '0.3–1 cm'],
                ['Growth', 'Dense clusters'],
              ].map(([label, val]) => (
                <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-lg font-bold mb-1" style={{ color: 'var(--accent)' }}>{val}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</div>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


          {/* Habitat & Distribution */}
          <Section>
            <H2 id="habitat">Environment &amp; Habitat</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { title: 'Habitat', items: ['Decaying logs and stumps', 'Woodland floors', 'Buried tree roots'] },
                { title: 'Seasonality', items: ['Spring to late autumn', 'Can appear year-round in mild climates'] },
                { title: 'Growth Behavior', items: ['Saprotrophic fungus', 'Breaks down dead wood', 'Always on or near wood'] },
              ].map(({ title, items }) => (
                <div key={title} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>{title}</h4>
                  <ul>
                    {items.map(i => <li key={i} className="text-sm" style={{ color: 'var(--text-muted)' }}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <H3>Geographic Distribution</H3>
            <div className="flex flex-wrap gap-3 mt-3">
              {['United Kingdom', 'United States', 'Europe', 'Asia', 'Common in temperate forests worldwide'].map(r => (
                <span key={r} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {r}
                </span>
              ))}
            </div>
          </Section>

          {/* Third Image — Habitat */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/hypholoma-fasciculare-habitat-decaying-wood.webp"
                alt="Hypholoma fasciculare growing on decaying wood in woodland — sulfur tuft habitat identification"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Sulfur tuft growing on decaying wood. Photo: Norbert Nagel, CC BY-SA 3.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Toxicity & Health Risks */}
          <Section>
            <H2 id="toxicity">Toxicity &amp; Health Risks</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">❌</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Not Edible</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Causes GI poisoning</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">🔴</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Moderate–High Toxicity</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Digestive system irritants</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#f59e0b15', border: '1px solid #f59e0b40' }}>
                <div className="text-2xl mb-1">🟠</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#f59e0b' }}>Low Fatality Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Rarely fatal, severe discomfort</div>
              </div>
            </div>

            <H3>Toxic Compounds</H3>
            <p className="mb-3">Contains compounds that irritate the digestive system and can cause significant gastrointestinal distress.</p>

            <H3>Symptoms of Poisoning</H3>
            <ul>
              <li>Nausea and vomiting</li>
              <li>Diarrhea</li>
              <li>Abdominal cramps</li>
              <li>General malaise</li>
            </ul>

            <H3>Onset Time</H3>
            <p>Typically within <strong>a few hours</strong> after ingestion.</p>
            <WarningBox>
              Rarely fatal but can cause severe discomfort. If you suspect poisoning from sulfur tuft,
              seek medical attention immediately and bring a sample or photo of the mushroom.
            </WarningBox>
          </Section>

          <Divider />

          {/* Risk Level Assessment */}
          <Section>
            <H2 id="risk-assessment">Risk Level Assessment</H2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Toxicity', '🔴 Moderate–High', '#ef4444'],
                    ['Fatality Risk', '🟠 Low', '#f59e0b'],
                    ['Misidentification Risk', '🔴 High', '#ef4444'],
                    ['Edibility', '❌ Not edible', '#ef4444'],
                  ].map(([factor, level, color], i) => (
                    <tr key={factor} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold w-44" style={{ color: 'var(--accent)' }}>{factor}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color }}>{level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Divider />

          {/* Look-alikes Comparison */}
          <Section>
            <H2 id="lookalikes">Similar Species (Critical Comparison)</H2>
            <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Feature', 'Sulfur Tuft (Toxic)', 'Edible Wood Mushrooms'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Color', 'Bright sulfur-yellow', 'Brown, honey-colored'],
                    ['Gills', 'Greenish to olive', 'White to cream'],
                    ['Taste', 'Bitter', 'Mild, pleasant'],
                    ['Growth', 'Dense clusters on wood', 'Clusters or scattered'],
                    ['Toxicity', 'Toxic ☠️', 'Edible ✓'],
                  ].map(([feat, toxic, edible], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{toxic}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{edible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Common Confusion Species</H3>
            <ul>
              <li><em>Hypholoma capnoides</em> (Conifer Tuft) — edible, grayish gills (not greenish), grows on conifer wood</li>
              <li><em>Kuehneromyces mutabilis</em> (Sheathed Woodtuft) — edible but risky lookalike, brown cap, ring on stem</li>
              <li>
                <Link href="/galerina-marginata" style={{ color: 'var(--accent)' }} className="hover:underline">
                  <em>Galerina marginata</em> (Funeral Bell)
                </Link> — deadly, brown cap, ring on stem — important to distinguish
              </li>
            </ul>
            <WarningBox>
              Gill color (greenish in sulfur tuft) is the key difference from edible lookalikes. Always check
              gills carefully before consuming any wood-growing mushroom.
            </WarningBox>
          </Section>

          <Divider />

          {/* Growth Pattern & Life Cycle */}
          <Section>
            <H2 id="growth-life-cycle">Growth Pattern &amp; Life Cycle</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Ecological Role</h4>
                <ul>
                  <li>Saprotrophic — decomposes dead wood</li>
                  <li>Essential for nutrient cycling in forests</li>
                  <li>Helps break down fallen trees and stumps</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Life Cycle</h4>
                <ul>
                  <li>Spores disperse through wind</li>
                  <li>Mycelium colonizes dead wood</li>
                  <li>Fruiting bodies appear in clusters</li>
                  <li>Spores released from mature gills</li>
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


          {/* Economic & Ecological Value */}
          <Section>
            <H2 id="ecological-value">Economic &amp; Ecological Value</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Ecological Importance</h4>
                <ul>
                  <li>Breaks down dead wood efficiently</li>
                  <li>Recycles nutrients back into soil</li>
                  <li>Supports forest ecosystem health</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Economic Value</h4>
                <ul>
                  <li>No edible or commercial value</li>
                  <li>Important in ecological research</li>
                  <li>Studied for wood decomposition processes</li>
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Pros & Cons */}
          <Section>
            <H2 id="pros-cons">Pros and Cons</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#22c55e' }}>Pros</h4>
                <ul className="space-y-2">
                  {['Important wood decomposer in forest ecosystems', 'Easy to spot due to bright yellow color', 'Widely studied and well-documented species'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Toxic — causes gastrointestinal illness', 'Easily mistaken for edible wood mushrooms', 'Common in areas where foragers search for edible species'].map(c => (
                    <li key={c} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#ef4444' }}>✗</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Safe Identification Steps */}
          <Section>
            <H2 id="safe-identification">How to Identify Hypholoma fasciculare Safely</H2>
            <div className="space-y-3 mb-5">
              {[
                'Look for bright yellow caps with a darker orange-brown center',
                'Check gills carefully — greenish to olive color confirms sulfur tuft',
                'Confirm growth on decaying wood — stumps, logs, or buried roots',
                'Observe the clustered (tufted) growth pattern — almost never grows alone',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{i + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</span>
                </div>
              ))}
            </div>
            <p>
              For improved accuracy, use a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier free by photo</Link> tool
              or AI-based mushroom identification system to analyze photos and confirm species.
            </p>

            <H3>Expert Identification Tips</H3>
            <ul>
              <li>Always check gill color carefully — greenish gills are the strongest warning sign</li>
              <li>Avoid relying on color alone — many edible mushrooms also grow on wood</li>
              <li>Confirm habitat (wood vs soil) to narrow down species</li>
              <li>Compare with similar species, especially <em>Hypholoma capnoides</em></li>
            </ul>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2 id="faq">Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is sulfur tuft edible?',
                  a: 'No, Hypholoma fasciculare is toxic and should not be consumed. It causes gastrointestinal symptoms including nausea, vomiting, diarrhea, and abdominal cramps.',
                },
                {
                  q: 'Why is it called sulfur tuft?',
                  a: 'Because of its bright sulfur-yellow color and its clustered (tufted) growth pattern. The mushrooms grow in tight groups on decaying wood, forming distinctive yellow tufts.',
                },
                {
                  q: 'How can I identify it quickly?',
                  a: 'Look for bright sulfur-yellow caps with a darker center, greenish to olive gills, and dense clustered growth on decaying wood or tree stumps.',
                },
                {
                  q: 'Can it kill you?',
                  a: 'It is rarely fatal but causes severe gastrointestinal symptoms. Seek medical attention immediately if you suspect poisoning.',
                },
                {
                  q: 'What should I do if I eat it?',
                  a: 'Seek medical help immediately. If possible, bring a sample or photo of the mushroom to help with identification and treatment.',
                },
                {
                  q: 'Can AI identify sulfur tuft mushrooms?',
                  a: 'Yes, AI tools can assist by analyzing the bright yellow color, clustered growth, and habitat. However, gill color confirmation requires close inspection, so always verify AI results with expert knowledge.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <summary className="px-5 py-4 cursor-pointer font-semibold flex items-center justify-between select-none" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', listStyle: 'none' }}>
                    <span>{q}</span>
                    <span className="ml-3 flex-shrink-0 transition-transform duration-200" style={{ color: 'var(--accent)' }}>+</span>
                  </summary>
                  <div className="px-5 py-4 text-sm leading-relaxed" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Final Thoughts */}
          <Section>
            <H2 id="final-thoughts">Final Thoughts</H2>
            <InfoBox>
              <p>
                <em>Hypholoma fasciculare</em> is a common but toxic woodland mushroom that plays a valuable
                ecological role while posing risks to foragers. Its bright yellow color, clustered growth, and
                greenish gills make it identifiable with practice.
              </p>
              <p className="mt-3">
                Combining field knowledge with a reliable{' '}
                <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
                can significantly reduce misidentification and ensure safer mushroom exploration.
              </p>
              <p className="mt-3">
                Learn more about{' '}
                <Link href="/mushroom-parts-explained" style={{ color: 'var(--accent)' }} className="hover:underline">
                  mushroom anatomy and identification features
                </Link>{' '}
                to build your knowledge, or check our guide on{' '}
                <Link href="/galerina-marginata" style={{ color: 'var(--accent)' }} className="hover:underline">
                  Galerina marginata (Funeral Bell)
                </Link>{' '}
                — another dangerous wood-growing species to watch out for.
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/hypholoma-fasciculare" />
          <ViewTracker slug="/hypholoma-fasciculare" />
              <BlogComments slug="/hypholoma-fasciculare" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
