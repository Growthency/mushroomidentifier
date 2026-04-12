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
  title: 'Amanita pantherina (Amanita Lookalike Danger) - Identification Guide',
  description: 'Amanita pantherina, commonly known as the Panther Cap, is a toxic Amanita species known for its brown cap with white spots and strong potential for misidentification.',
  alternates: { canonical: 'https://mushroomidentifiers.com/amanita-pantherina' },
  openGraph: {
    type: 'article',
    title: 'Amanita pantherina (Amanita Lookalike Danger) - Identification Guide',
    description: 'Amanita pantherina, commonly known as the Panther Cap, is a toxic Amanita species known for its brown cap with white spots and strong potential for misidentification.',
    url: 'https://mushroomidentifiers.com/amanita-pantherina',
    images: [{ url: 'https://mushroomidentifiers.com/amanita-pantherina-panther-cap-identification.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Amanita pantherina: Identification, Features, Habitat & Safety Guide (Amanita Lookalike Danger)',
      description: 'Amanita pantherina, commonly known as the Panther Cap, is a toxic Amanita species known for its brown cap with white spots and strong potential for misidentification.',
      image: 'https://mushroomidentifiers.com/amanita-pantherina-panther-cap-identification.webp',
      author: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: 'https://mushroomidentifiers.com/amanita-pantherina',
      datePublished: '2026-04-10',
      dateModified: '2026-04-10',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Amanita pantherina?', acceptedAnswer: { '@type': 'Answer', text: 'Amanita pantherina is a toxic mushroom known as the Panther Cap, identified by its brown cap with white spots.' } },
        { '@type': 'Question', name: 'Is Amanita pantherina poisonous?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, it is toxic and can cause severe neurological symptoms.' } },
        { '@type': 'Question', name: 'How is Amanita pantherina different from Amanita muscaria?', acceptedAnswer: { '@type': 'Answer', text: 'It has a brown cap instead of red and is generally considered more toxic and dangerous.' } },
        { '@type': 'Question', name: 'Where does Amanita pantherina grow?', acceptedAnswer: { '@type': 'Answer', text: 'It grows in forests near trees like oak, pine, and spruce.' } },
        { '@type': 'Question', name: 'Can AI identify Amanita pantherina?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, a mushroom identifier app can analyze its features, but results should always be verified.' } },
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

export default function AmanitaPantherinaPage() {
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
                <span>Amanita pantherina Panther Cap</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#eab30820', color: '#eab308' }}>Psychoactive</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Amanita pantherina</em>: Identification, Features, Habitat &amp; Safety Guide (Amanita Lookalike Danger)
                </h1>
                <AuthorBlock updatedAt="Apr 10, 2026" />
                <LiveViewCount slug="/amanita-pantherina" className="mb-2" />
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Amanita pantherina</em>, commonly known as the Panther Cap, is a toxic Amanita species known for its brown cap with white spots and strong potential for misidentification. It contains psychoactive compounds similar to <em>Amanita muscaria</em>, but is considered more dangerous due to stronger toxicity and unpredictable effects. This mushroom is often mistaken for edible species, making it a major amanita lookalike danger. Accurate identification requires examining cap, gills, stem, ring, volva, and habitat, or using a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identifier
                  </Link>{' '}
                  for support.
                </p>
              </div>

              {/* ── Featured Image 1 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/amanita-pantherina-panther-cap-identification.webp"
                    alt="Amanita pantherina panther cap identification — brown cap with white spots toxic mushroom"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita pantherina (Panther Cap) showing the brown cap covered with white wart-like spots.
                  Source: George Chernilevsky, Public Domain, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />
              <TableOfContents />

              {/* ── Quick ID Summary ── */}
              <Section>
                <H2 id="identification-summary">Amanita pantherina Identification Summary</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Scientific Name', 'Amanita pantherina'],
                    ['Common Names', 'Panther Cap'],
                    ['Category', 'Toxic / Psychoactive Amanita'],
                    ['Risk Level', '🔴 High (dangerous)'],
                    ['Edibility', 'Poisonous'],
                    ['Key Features', 'Brown cap with white spots, white gills, ring + volva'],
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
                <H2 id="family-and-species">Amanita pantherina Family and Species</H2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Kingdom', 'Fungi'],
                    ['Division', 'Basidiomycota'],
                    ['Class', 'Agaricomycetes'],
                    ['Order', 'Agaricales'],
                    ['Family', 'Amanitaceae'],
                    ['Genus', 'Amanita'],
                    ['Species', 'Amanita pantherina'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  The Panther Cap belongs to the Amanitaceae family, a group containing both deadly toxic and psychoactive mushrooms. Within the Amanita genus, species are often identified by white gills, a ring (annulus), and a volva, making careful identification critical.
                </p>
              </Section>

              <Divider />

              {/* ── Dimensions ── */}
              <Section>
                <H2 id="dimensions">Amanita pantherina Dimensions</H2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Cap diameter', '5–12 cm'],
                    ['Stem height', '6–12 cm'],
                    ['Stem thickness', '1–2 cm'],
                    ['Volva size', 'Bulbous base with distinct rim'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  It is a medium-sized mushroom with a compact but well-defined structure.
                </p>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Amanita pantherina Key Features (Identification Characteristics)</H2>

                <H3 id="cap">Cap (Pileus)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Color: Brown to dark brown</li>
                  <li>Surface: Covered with white wart-like spots (veil remnants)</li>
                  <li>Shape: Convex → flat with age</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  These spots are remnants of the universal veil, similar to Fly Agaric but on a darker cap.
                </p>

                <H3 id="gills">Gills (Lamellae)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Color: White</li>
                  <li>Attachment: Free gills</li>
                  <li>Dense and crowded</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Gills remain white throughout maturity.
                </p>

                <H3 id="stem">Stem (Stipe)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>White, slender</li>
                  <li>Smooth or slightly fibrous</li>
                  <li>Bulbous base with defined margin</li>
                </ul>

                <H3 id="ring">Ring (Annulus)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Thin but visible</li>
                  <li>Located on upper stem</li>
                  <li>May persist or fade</li>
                </ul>

                <H3 id="volva">Volva (Basal Structure)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Bulbous base with distinct rim or collar</li>
                  <li>Not fully cup-shaped like deadly Amanitas</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">This feature helps distinguish it from other Amanita species.</p>
                </WarningBox>
              </Section>

              {/* ── Image 2 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/amanita-pantherina-brown-cap-white-spots-forest.webp"
                    alt="Amanita pantherina brown cap with white spots in forest habitat"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita pantherina growing in natural forest habitat — brown cap with white warts visible.
                  Source: James Lindsey, CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Color, Smell, Taste ── */}
              <Section>
                <H2 id="color-smell-taste">Amanita pantherina Color, Smell, and Taste</H2>
                <H3>Color</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Cap: Brown with white spots</li>
                  <li>Gills: White</li>
                  <li>Stem: White</li>
                </ul>
                <H3>Smell</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Mild or slightly unpleasant</li>
                  <li>Not a reliable identifier</li>
                </ul>
                <H3>Taste</H3>
                <WarningBox>
                  <p className="text-sm font-semibold">Not recommended — toxic. Never taste wild mushrooms for identification purposes.</p>
                </WarningBox>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Growth Pattern ── */}
              <Section>
                <H2 id="growth-pattern">Amanita pantherina Growth Pattern and Seasonality</H2>
                <H3>Growth Pattern</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Grows single or scattered</li>
                  <li>Occasionally in small groups</li>
                </ul>
                <H3>Seasonality</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Summer to autumn</li>
                  <li>Appears after rainfall</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Habitat ── */}
              <Section>
                <H2 id="habitat">Amanita pantherina Habitat, Environment &amp; Distribution</H2>
                <H3>Habitat</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Forests and woodland areas</li>
                  <li>Found near tree roots</li>
                </ul>
                <H3>Tree Association</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Oak</li>
                  <li>Beech</li>
                  <li>Pine</li>
                  <li>Spruce</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Forms mycorrhizal relationships with trees.
                </p>
                <H3>Environment</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Moist soil</li>
                  <li>Shaded forest floor</li>
                  <li>Temperate climates</li>
                </ul>
                <H3>Geographic Distribution</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Europe</li>
                  <li>North America</li>
                  <li>Asia</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Widely distributed in temperate regions.
                </p>
              </Section>

              <Divider />

              {/* ── Edibility & Safety ── */}
              <Section>
                <H2 id="edibility-safety">Edibility, Safety &amp; Risk Level</H2>
                <H3>Is it Edible?</H3>
                <WarningBox>
                  <p className="text-sm font-semibold">❌ Not edible. Amanita pantherina is classified as poisonous.</p>
                </WarningBox>
                <H3>Risk Level</H3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>🔴 High (toxic and psychoactive)</p>
                <H3>Toxicity</H3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Contains:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Ibotenic acid</li>
                  <li>Muscimol</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>These compounds affect the central nervous system, often more intensely than <em>Amanita muscaria</em>.</p>
                <H3>Symptoms</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Confusion and hallucinations</li>
                  <li>Delirium</li>
                  <li>Nausea and vomiting</li>
                  <li>Muscle spasms</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">Effects can be unpredictable and dangerous.</p>
                </WarningBox>
              </Section>

              {/* ── Image 3 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/amanita-pantherina-young-fruiting-body-stem-ring.webp"
                    alt="Amanita pantherina mushroom showing stem ring and volva detail"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita pantherina mature specimen showing stem structure and side profile.
                  Source: Archenzo, CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
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
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Amanita pantherina</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Amanita muscaria</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'var(--text-muted)' }}>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Cap</td><td className="p-3">Brown with white spots</td><td className="p-3">Red with white spots</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Toxicity</td><td className="p-3">Higher</td><td className="p-3">Moderate</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Volva</td><td className="p-3">Rimmed base</td><td className="p-3">Bulbous base</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Risk</td><td className="p-3">High</td><td className="p-3">Moderate</td></tr>
                    </tbody>
                  </table>
                </div>
                <H3>Common Confusions</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>
                    <Link href="/amanita-muscaria" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                      Amanita muscaria (Fly Agaric)
                    </Link>{' '}
                    — similar structure, different cap color
                  </li>
                  <li>Brown woodland mushrooms</li>
                  <li>Some edible species (rare but possible confusion)</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Amanita Lookalike Danger Explained ── */}
              <Section>
                <H2 id="lookalike-danger">Amanita Lookalike Danger Explained</H2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                  The Panther Cap is particularly dangerous because:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>It resembles <em>Amanita muscaria</em>, which some people wrongly consider safe</li>
                  <li>It shares similar features with other Amanita species</li>
                  <li>Visual differences can be subtle for beginners</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">Misidentification can lead to serious poisoning. Always verify with expert knowledge or a reliable{' '}
                    <Link href="/" className="hover:underline font-medium" style={{ color: '#fca5a5' }}>
                      wild mushroom identifier
                    </Link>.
                  </p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Economic Value ── */}
              <Section>
                <H2 id="economic-value">Economic Value and Uses</H2>
                <WarningBox>
                  <p className="text-sm font-semibold">No Safe Edible Value. This mushroom has no safe culinary use.</p>
                </WarningBox>
                <H3>Scientific Importance</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Studied for psychoactive compounds</li>
                  <li>Used in neurological research</li>
                  <li>Important in toxicology studies</li>
                </ul>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Benefits ── */}
              <Section>
                <H2 id="benefits">Benefits and Value</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Research in brain chemistry</li>
                  <li>Educational importance in mycology</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">No general consumption benefits.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Pros and Cons ── */}
              <Section>
                <H2 id="pros-and-cons">Pros and Cons</H2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: '#22c55e10', border: '1px solid #22c55e30' }}>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>✅ Pros</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Scientifically valuable</li>
                      <li>Important for ecological balance</li>
                      <li>Helps research toxic compounds</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                    <h4 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>❌ Cons</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Toxic and dangerous</li>
                      <li>Easily confused with other Amanita species</li>
                      <li>Causes unpredictable neurological effects</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── AI Identifier ── */}
              <Section>
                <H2 id="mushroom-identifier">How Our Mushroom Identifier Helps Identify Amanita pantherina?</H2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                  Our{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identification app
                  </Link>{' '}
                  uses AI and image recognition to analyze:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Cap color and white spots</li>
                  <li>Gill structure</li>
                  <li>Stem and ring</li>
                  <li>Volva base shape</li>
                  <li>Habitat</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  This helps distinguish <em>Amanita pantherina</em> from similar species, especially <em>Amanita muscaria</em>. For a deeper understanding of mushroom anatomy, check our{' '}
                  <Link href="/mushroom-parts-explained" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom parts explained
                  </Link>{' '}
                  guide. You can also learn about deadly lookalikes in our{' '}
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
                  ['What is Amanita pantherina?', 'Amanita pantherina is a toxic mushroom known as the Panther Cap, identified by its brown cap with white spots.'],
                  ['Is Amanita pantherina poisonous?', 'Yes, it is toxic and can cause severe neurological symptoms.'],
                  ['How is Amanita pantherina different from Amanita muscaria?', 'It has a brown cap instead of red and is generally considered more toxic and dangerous.'],
                  ['Where does Amanita pantherina grow?', 'It grows in forests near trees like oak, pine, and spruce.'],
                  ['Can AI identify Amanita pantherina?', 'Yes, a mushroom identifier app can analyze its features, but results should always be verified.'],
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
                  <em>Amanita pantherina</em> (Panther Cap) is a high-risk toxic mushroom that can easily be mistaken for other Amanita species. Its brown cap with white spots, combined with white gills, ring, and volva, makes it important to identify carefully.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  Understanding its features, habitat, and risks is essential for avoiding dangerous mistakes. Tools like a mushroom identifier can assist, but should always be used alongside expert knowledge.
                </p>
              </Section>

              <Divider />
              <ViewTracker slug="/amanita-pantherina" />
              <BlogComments slug="/amanita-pantherina" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
