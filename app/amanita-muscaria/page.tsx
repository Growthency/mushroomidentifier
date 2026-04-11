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
  title: 'Amanita muscaria: (Mushroom with White Spots) - Identification Guide',
  description: 'Amanita muscaria, commonly known as the Fly Agaric, is one of the most recognizable mushrooms in the world due to its bright red cap with white spots.',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Amanita muscaria: Identification, Features, Habitat & Safety Guide (Mushroom with White Spots)',
      description: 'Amanita muscaria, commonly known as the Fly Agaric, is one of the most recognizable mushrooms in the world due to its bright red cap with white spots.',
      image: 'https://mushroomidentifiers.com/amanita-muscaria-fly-agaric-identification.webp',
      author: {
        '@type': 'Organization',
        name: 'Mushroom Identifiers',
        url: 'https://mushroomidentifiers.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mushroom Identifiers',
        url: 'https://mushroomidentifiers.com/',
        email: 'support@mushroomidentifiers.com',
      },
      mainEntityOfPage: 'https://mushroomidentifiers.com/amanita-muscaria',
      datePublished: '2026-04-10',
      dateModified: '2026-04-10',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Amanita muscaria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Amanita muscaria is a red mushroom with white spots, commonly known as Fly Agaric, found in forests worldwide.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Amanita muscaria poisonous?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, it is toxic and can cause neurological symptoms, but it is not usually deadly.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why does Amanita muscaria have white spots?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The white spots are remnants of the universal veil that covered the mushroom during early growth.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does Amanita muscaria grow?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It grows in forests near trees like birch, pine, and spruce.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can AI identify Amanita muscaria?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, a mushroom identifier app can easily recognize it due to its distinct appearance.',
          },
        },
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

export default function AmanitaMuscariaPage() {
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
                <span>Amanita muscaria Fly Agaric</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f9731620', color: '#f97316' }}>Toxic</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#eab30820', color: '#eab308' }}>Psychoactive</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Amanita muscaria</em>: Identification, Features, Habitat &amp; Safety Guide (Mushroom with White Spots)
                </h1>
                <AuthorBlock updatedAt="Apr 10, 2026" />
                <ArticleViewCount views={1850} className="mb-2" />
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Amanita muscaria</em>, commonly known as the Fly Agaric, is one of the most recognizable mushrooms in the world due to its bright red cap with white spots. It belongs to the Amanita genus and is considered toxic, though not typically deadly like other Amanita species. It contains psychoactive compounds such as ibotenic acid and muscimol, which can cause neurological symptoms. This mushroom is commonly found in forests and is associated with trees like birch and pine. Proper identification using features like cap, gills, stem, ring, and volva is essential, and tools like a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identifier
                  </Link>{' '}
                  can assist in recognizing it safely.
                </p>
              </div>

              {/* ── Featured Image 1 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/amanita-muscaria-fly-agaric-identification.webp"
                    alt="Amanita muscaria fly agaric identification — red cap with white spots mushroom"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita muscaria (Fly Agaric) showing three growth stages — the iconic red cap with white spots.
                  Source: Onderwijsgek, CC BY-SA 3.0 NL, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />
              <TableOfContents />

              {/* ── Quick ID Summary ── */}
              <Section>
                <H2 id="identification-summary">Amanita muscaria Identification Summary</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Scientific Name', 'Amanita muscaria'],
                    ['Common Names', 'Fly Agaric, Red Mushroom with White Spots'],
                    ['Category', 'Toxic / Psychoactive Mushroom'],
                    ['Risk Level', '🟠 Moderate to High'],
                    ['Edibility', 'Poisonous (not safe to consume raw)'],
                    ['Key Features', 'Red cap with white warts, white gills, ring + volva'],
                    ['Found In', 'Forests across Europe, North America, and Asia'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold w-28 flex-shrink-0" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Taxonomy ── */}
              <Section>
                <H2 id="family-and-species">Amanita muscaria Family and Species</H2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Kingdom', 'Fungi'],
                    ['Division', 'Basidiomycota'],
                    ['Class', 'Agaricomycetes'],
                    ['Order', 'Agaricales'],
                    ['Family', 'Amanitaceae'],
                    ['Genus', 'Amanita'],
                    ['Species', 'Amanita muscaria'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  This species belongs to the Amanitaceae family, which includes both deadly toxic and psychoactive fungi. Unlike species such as{' '}
                  <Link href="/amanita-phalloides-death-cap" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    Amanita phalloides
                  </Link>, this mushroom is not usually fatal but still poses health risks.
                </p>
              </Section>

              <Divider />

              {/* ── Dimensions ── */}
              <Section>
                <H2 id="dimensions">Amanita muscaria Dimensions</H2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Cap diameter', '8–20 cm'],
                    ['Stem height', '10–25 cm'],
                    ['Stem thickness', '1–3 cm'],
                    ['Volva size', 'Bulbous base with fragments'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  The Fly Agaric is a large and visually striking mushroom, making it easy to recognize compared to many other species.
                </p>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Amanita muscaria Key Features (Identification Characteristics)</H2>

                <H3 id="cap">Cap (Pileus)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Bright red to orange-red color</li>
                  <li>Covered with white wart-like spots (veil remnants)</li>
                  <li>Shape: Convex → flat with age</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  These white spots are remnants of the universal veil.
                </p>

                <H3 id="gills">Gills (Lamellae)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Color: White</li>
                  <li>Attachment: Free gills</li>
                  <li>Dense and evenly spaced</li>
                </ul>

                <H3 id="stem">Stem (Stipe)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>White, tall, and slender</li>
                  <li>Slightly bulbous base</li>
                  <li>Smooth or slightly fibrous</li>
                </ul>

                <H3 id="ring">Ring (Annulus)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Large, hanging ring on upper stem</li>
                  <li>Often prominent</li>
                </ul>

                <H3 id="volva">Volva (Basal Structure)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Bulbous base with fragmented rings</li>
                  <li>Less cup-like than deadly Amanita species</li>
                </ul>
              </Section>

              {/* ── Image 2 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/amanita-muscaria-red-cap-white-spots-forest.webp"
                    alt="Amanita muscaria red mushroom with white spots in forest habitat"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita muscaria growing in a forest near birch trees — typical woodland habitat.
                  Source: Quartl, CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Color, Smell, Taste ── */}
              <Section>
                <H2 id="color-smell-taste">Amanita muscaria Color, Smell, and Taste</H2>
                <H3>Color</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Cap: Bright red with white spots</li>
                  <li>Gills: White</li>
                  <li>Stem: White</li>
                </ul>
                <H3>Smell</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Mild or slightly earthy</li>
                  <li>Not strongly distinctive</li>
                </ul>
                <H3>Taste</H3>
                <WarningBox>
                  <p className="text-sm font-semibold">Not recommended — toxic and psychoactive. Never taste wild mushrooms for identification purposes.</p>
                </WarningBox>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Growth Pattern ── */}
              <Section>
                <H2 id="growth-pattern">Growth Pattern and Seasonality</H2>
                <H3>Growth Pattern</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Grows single or scattered</li>
                  <li>Sometimes in groups</li>
                </ul>
                <H3>Seasonality</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Late summer to autumn</li>
                  <li>Appears after rainfall</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Habitat ── */}
              <Section>
                <H2 id="habitat">Amanita muscaria Habitat, Environment &amp; Distribution</H2>
                <H3>Habitat</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Forests and woodland</li>
                  <li>Near tree roots</li>
                </ul>
                <H3>Tree Association</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Birch</li>
                  <li>Pine</li>
                  <li>Spruce</li>
                  <li>Fir</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Forms mycorrhizal relationships with trees.
                </p>
                <H3>Environment</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Moist soil</li>
                  <li>Cool climates</li>
                  <li>Shaded forest areas</li>
                </ul>
                <H3>Geographic Distribution</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Europe</li>
                  <li>North America</li>
                  <li>Asia</li>
                  <li>Parts of South America</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Edibility & Safety ── */}
              <Section>
                <H2 id="edibility-safety">Edibility, Safety &amp; Risk Level</H2>
                <H3>Is it Edible?</H3>
                <WarningBox>
                  <p className="text-sm font-semibold">❌ Not safe in raw form. Amanita muscaria is classified as poisonous.</p>
                </WarningBox>
                <H3>Risk Level</H3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>🟠 Moderate to High (toxic, psychoactive)</p>
                <H3>Toxicity</H3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Contains:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Ibotenic acid</li>
                  <li>Muscimol</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>These compounds affect the central nervous system.</p>
                <H3>Symptoms</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Nausea and vomiting</li>
                  <li>Confusion and hallucinations</li>
                  <li>Drowsiness</li>
                  <li>Muscle twitching</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Symptoms vary depending on dose.</p>
              </Section>

              {/* ── Image 3 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/amanita-muscaria-mushroom-gills-ring-detail.webp"
                    alt="Amanita muscaria mushroom showing partial veil ring and gill detail"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita muscaria showing partial veil and ring detail on the stem.
                  Source: Tony Wills, CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Look-Alikes ── */}
              <Section>
                <H2 id="similar-species">Similar Species (Look-Alikes Comparison)</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-card)' }}>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Feature</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Amanita muscaria</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Other Amanita</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'var(--text-muted)' }}>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Cap</td><td className="p-3">Red with white spots</td><td className="p-3">White or green</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Toxicity</td><td className="p-3">Moderate</td><td className="p-3">Often deadly</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Volva</td><td className="p-3">Bulbous</td><td className="p-3">Cup-like</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Risk</td><td className="p-3">Moderate</td><td className="p-3">High</td></tr>
                    </tbody>
                  </table>
                </div>
                <H3>Common Confusions</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Other red or orange mushrooms</li>
                  <li>Some Amanita species (less common confusion due to unique look)</li>
                </ul>
                <InfoBox>
                  <p className="text-sm">
                    For detailed comparison with deadly Amanita species, see our guide on{' '}
                    <Link href="/death-cap-vs-destroying-angel" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                      Death Cap vs Destroying Angel
                    </Link>.
                  </p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Economic Value ── */}
              <Section>
                <H2 id="economic-value">Economic Value and Uses</H2>
                <H3>Cultural and Historical Importance</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Used in traditional rituals in some cultures</li>
                  <li>Appears in folklore, art, and media</li>
                </ul>
                <H3>Scientific Importance</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Studied for its psychoactive compounds</li>
                  <li>Used in neurological research</li>
                </ul>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Benefits ── */}
              <Section>
                <H2 id="benefits">Amanita muscaria Benefits and Value</H2>
                <WarningBox>
                  <p className="text-sm font-semibold">No safe general consumption benefits. This mushroom should never be eaten casually.</p>
                </WarningBox>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Research value in neuroscience</li>
                  <li>Cultural symbolism</li>
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
                      <li>Easily recognizable</li>
                      <li>Important in research</li>
                      <li>Cultural significance</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>❌ Cons</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Toxic</li>
                      <li>Causes hallucinations and illness</li>
                      <li>Unsafe for consumption</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── AI Identifier ── */}
              <Section>
                <H2 id="mushroom-identifier">How Our Mushroom Identifier Helps Identify Amanita muscaria?</H2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                  Our{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identification app
                  </Link>{' '}
                  uses AI and image recognition to detect:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Red cap with white spots</li>
                  <li>White gills</li>
                  <li>Ring and stem structure</li>
                  <li>Forest habitat</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  This helps distinguish it from other toxic Amanita species. For a deeper understanding of mushroom anatomy, check our{' '}
                  <Link href="/mushroom-parts-explained" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom parts explained
                  </Link>{' '}
                  guide.
                </p>
              </Section>

              <Divider />

              {/* ── FAQ ── */}
              <Section>
                <H2 id="faq">Frequently Asked Questions</H2>
                {[
                  ['What is Amanita muscaria?', 'Amanita muscaria is a red mushroom with white spots, commonly known as Fly Agaric, found in forests worldwide.'],
                  ['Is Amanita muscaria poisonous?', 'Yes, it is toxic and can cause neurological symptoms, but it is not usually deadly.'],
                  ['Why does Amanita muscaria have white spots?', 'The white spots are remnants of the universal veil that covered the mushroom during early growth.'],
                  ['Where does Amanita muscaria grow?', 'It grows in forests near trees like birch, pine, and spruce.'],
                  ['Can AI identify Amanita muscaria?', 'Yes, a mushroom identifier app can easily recognize it due to its distinct appearance.'],
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
                  Amanita muscaria is one of the most iconic mushrooms due to its bright red cap and white spots, but it should never be considered safe for casual consumption. While not as deadly as other{' '}
                  <Link href="/amanita-virosa-mushroom" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    Amanita species
                  </Link>, it still poses serious health risks.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  Understanding its structure, habitat, and chemical properties helps ensure safe identification. Using a mushroom identifier can assist, but knowledge and caution are always essential.
                </p>
              </Section>

              <Divider />
              <BlogComments slug="/amanita-muscaria" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
