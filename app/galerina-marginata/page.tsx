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
  title: 'Galerina marginata: Deadly Funeral Bell ID Guide',
  description: '⚠️ Galerina marginata looks harmless but kills. Learn to identify this deadly brown mushroom by cap, gills, ring and habitat before your next forage.',
  alternates: { canonical: 'https://mushroomidentifiers.com/galerina-marginata' },
  openGraph: {
    type: 'article',
    title: 'Galerina marginata: Deadly Funeral Bell ID Guide',
    description: '⚠️ Galerina marginata looks harmless but kills. Learn to identify this deadly brown mushroom by cap, gills, ring and habitat before your next forage.',
    url: 'https://mushroomidentifiers.com/galerina-marginata',
    images: [{ url: 'https://mushroomidentifiers.com/galerina-marginata-funeral-bell-identification.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Galerina marginata: Identification, Features, Habitat & Safety Guide (Small Brown Poisonous Mushroom)',
      description: '⚠️ Galerina marginata looks harmless but kills. Learn to identify this deadly brown mushroom by cap, gills, ring and habitat before your next forage.',
      image: 'https://mushroomidentifiers.com/galerina-marginata-funeral-bell-identification.webp',
      author: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', name: 'Mushroom Identifiers', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: 'https://mushroomidentifiers.com/galerina-marginata',
      datePublished: '2026-04-11',
      dateModified: '2026-04-11',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is Galerina marginata?', acceptedAnswer: { '@type': 'Answer', text: 'Galerina marginata is a small brown poisonous mushroom known as the Funeral Bell, found on decaying wood.' } },
        { '@type': 'Question', name: 'Is Galerina marginata deadly?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, it contains amatoxins and can cause fatal poisoning.' } },
        { '@type': 'Question', name: 'How do I identify Galerina marginata?', acceptedAnswer: { '@type': 'Answer', text: 'Look for a small brown mushroom growing on wood with brown gills and a thin stem.' } },
        { '@type': 'Question', name: 'What mushrooms look like Galerina marginata?', acceptedAnswer: { '@type': 'Answer', text: 'It is often confused with honey fungus (Armillaria) and other small brown mushrooms.' } },
        { '@type': 'Question', name: 'Can AI identify Galerina marginata?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, a mushroom identifier app can analyze features, but results must always be verified.' } },
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

export default function GalerinaMarginataPage() {
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
                <span>Galerina marginata Funeral Bell</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Deadly</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f9731620', color: '#f97316' }}>Amatoxin</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Galerina marginata</em>: Identification, Features, Habitat &amp; Safety Guide (Small Brown Poisonous Mushroom)
                </h1>
                <AuthorBlock updatedAt="Apr 11, 2026" />
                <LiveViewCount slug="/galerina-marginata" className="mb-2" />
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Galerina marginata</em>, commonly known as the Funeral Bell, is a small brown poisonous mushroom that contains deadly amatoxins, the same toxins found in the Death Cap. Despite its small size, it is extremely dangerous and often confused with edible mushrooms like honey fungus (Armillaria). It can be identified by its brown cap, brown gills, thin stem, and growth on wood. Because of its similarity to edible species, accurate mushroom identification — including habitat, cap, gills, and stem — is critical. Using a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identifier
                  </Link>{' '}
                  can help analyze these features, but expert confirmation is always required.
                </p>
              </div>

              {/* ── Featured Image 1 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/galerina-marginata-funeral-bell-identification.webp"
                    alt="Galerina marginata funeral bell identification — small brown poisonous mushroom growing on wood"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Galerina marginata (Funeral Bell) showing both cap forms fruiting from a rotting log.
                  Source: Dan Molter (shroomydan), CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />
              <TableOfContents />

              {/* ── Quick ID Summary ── */}
              <Section>
                <H2 id="identification-summary">Galerina marginata Identification Summary</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Scientific Name', 'Galerina marginata'],
                    ['Common Names', 'Funeral Bell, Deadly Galerina'],
                    ['Category', 'Toxic / Deadly Mushroom'],
                    ['Risk Level', '🔴 Deadly'],
                    ['Edibility', 'Poisonous (fatal)'],
                    ['Key Features', 'Small brown cap, brown gills, thin stem, grows on wood'],
                    ['Found In', 'Forests worldwide, especially on decaying wood'],
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
                <H2 id="family-and-species">Galerina marginata Family and Species</H2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Kingdom', 'Fungi'],
                    ['Division', 'Basidiomycota'],
                    ['Class', 'Agaricomycetes'],
                    ['Order', 'Agaricales'],
                    ['Family', 'Hymenogastraceae'],
                    ['Genus', 'Galerina'],
                    ['Species', 'Galerina marginata'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  Unlike Amanita species, this mushroom belongs to a different family but shares the same deadly toxin group (amatoxins), making it equally dangerous. For more on deadly Amanita toxins, see our guide on{' '}
                  <Link href="/amanita-phalloides-death-cap" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    Amanita phalloides (Death Cap)
                  </Link>.
                </p>
              </Section>

              <Divider />

              {/* ── Dimensions ── */}
              <Section>
                <H2 id="dimensions">Galerina marginata Dimensions</H2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Cap diameter', '1–5 cm'],
                    ['Stem height', '2–7 cm'],
                    ['Stem thickness', 'Very thin (0.2–0.6 cm)'],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>{k}</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  This is a small, delicate mushroom, often overlooked or mistaken for harmless species.
                </p>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Galerina marginata Key Features (Identification Characteristics)</H2>

                <H3 id="cap">Cap (Pileus)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Color: Yellow-brown to reddish-brown</li>
                  <li>Shape: Convex → flat</li>
                  <li>Surface: Smooth, slightly sticky when moist</li>
                </ul>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Cap color may change depending on moisture (hygrophanous).
                </p>

                <H3 id="gills">Gills (Lamellae)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Color: Yellowish → brown → rusty brown</li>
                  <li>Attachment: Attached to stem</li>
                  <li>Density: Moderately spaced</li>
                </ul>

                <H3 id="stem">Stem (Stipe)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Thin and fragile</li>
                  <li>Brownish or pale</li>
                  <li>May have a faint ring zone</li>
                </ul>

                <H3 id="ring">Ring (Annulus)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Often faint or absent</li>
                  <li>May appear as a subtle band</li>
                </ul>

                <H3 id="volva">Volva</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>❌ Absent</li>
                </ul>
                <InfoBox>
                  <p className="text-sm">This distinguishes it from Amanita species, which have a volva. Learn more about these structures in our{' '}
                    <Link href="/mushroom-parts-explained" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                      mushroom parts explained
                    </Link>{' '}guide.
                  </p>
                </InfoBox>
              </Section>

              {/* ── Image 2 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/galerina-marginata-small-brown-poisonous-mushroom-wood.webp"
                    alt="Galerina marginata small brown poisonous mushroom growing on decaying wood in forest"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Galerina marginata (Funeral Bell) growing on decaying wood in its natural forest habitat.
                  Source: Ryan Hodnett, CC BY-SA 4.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Color, Smell, Taste ── */}
              <Section>
                <H2 id="color-smell-taste">Galerina marginata Color, Smell, and Taste</H2>
                <H3>Color</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Cap: Brown to orange-brown</li>
                  <li>Gills: Brown</li>
                  <li>Stem: Pale brown</li>
                </ul>
                <H3>Smell</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Mild or slightly earthy</li>
                  <li>Not distinctive</li>
                </ul>
                <H3>Taste</H3>
                <WarningBox>
                  <p className="text-sm font-semibold">Never taste — deadly toxic. This mushroom contains the same amatoxins as the Death Cap.</p>
                </WarningBox>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Growth Pattern ── */}
              <Section>
                <H2 id="growth-pattern">Galerina marginata Growth Pattern and Seasonality</H2>
                <H3>Growth Pattern</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Grows in clusters or small groups</li>
                  <li>Found on wood (key identifier)</li>
                </ul>
                <H3>Seasonality</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Spring to autumn</li>
                  <li>Can appear year-round in mild climates</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Habitat ── */}
              <Section>
                <H2 id="habitat">Galerina marginata Habitat, Environment &amp; Distribution</H2>
                <H3>Habitat</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Decaying wood</li>
                  <li>Logs, stumps, tree roots</li>
                </ul>
                <H3>Environment</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Moist forest areas</li>
                  <li>Shaded woodland</li>
                </ul>
                <H3>Substrate (Important Identifier)</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Dead hardwood</li>
                  <li>Conifer wood</li>
                  <li>Moss-covered logs</li>
                </ul>
                <H3>Geographic Distribution</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>North America</li>
                  <li>Europe</li>
                  <li>Asia</li>
                  <li>Found worldwide</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Edibility & Safety ── */}
              <Section>
                <H2 id="edibility-safety">Galerina marginata Edibility, Safety &amp; Risk Level</H2>
                <H3>Is it Edible?</H3>
                <WarningBox>
                  <p className="text-sm font-semibold">❌ No — deadly poisonous. Galerina marginata is one of the most dangerous small mushrooms in the world.</p>
                </WarningBox>
                <H3>Risk Level</H3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>🔴 Deadly</p>
                <H3>Toxicity</H3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Contains amatoxins, which:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Destroy liver cells</li>
                  <li>Cause kidney failure</li>
                  <li>Lead to fatal poisoning</li>
                </ul>
                <H3>Symptoms</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Delayed onset (6–24 hours)</li>
                  <li>Vomiting and diarrhea</li>
                  <li>Temporary recovery</li>
                  <li>Severe liver failure</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">Immediate medical care is critical. The delayed onset of symptoms makes this mushroom especially treacherous.</p>
                </WarningBox>
              </Section>

              {/* ── Image 3 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/galerina-marginata-deadly-galerina-cap-stem-detail.webp"
                    alt="Galerina marginata deadly galerina mushroom cap and stem detail"
                    width={800}
                    height={530}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Galerina marginata specimen showing brown cap and thin stem structure.
                  Source: Strobilomyces, CC BY-SA 3.0, via Wikimedia Commons — commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Look-Alikes ── */}
              <Section>
                <H2 id="similar-species">Galerina marginata Similar Species (Look-Alikes Comparison)</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-card)' }}>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Feature</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Galerina marginata</th>
                        <th className="text-left p-3 font-semibold" style={{ color: 'var(--accent)' }}>Honey Fungus (Armillaria)</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'var(--text-muted)' }}>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Cap</td><td className="p-3">Brown, small</td><td className="p-3">Yellow-brown</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Gills</td><td className="p-3">Brown</td><td className="p-3">White</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Habitat</td><td className="p-3">Wood</td><td className="p-3">Wood</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Toxicity</td><td className="p-3">Deadly</td><td className="p-3">Edible</td></tr>
                      <tr style={{ borderTop: '1px solid var(--border)' }}><td className="p-3">Ring</td><td className="p-3">Weak or absent</td><td className="p-3">Prominent</td></tr>
                    </tbody>
                  </table>
                </div>
                <H3>Common Confusions</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Honey fungus (Armillaria)</li>
                  <li>Small brown mushrooms (&quot;LBMs&quot; — little brown mushrooms)</li>
                  <li>Other wood-growing fungi</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Small Brown Mushroom Danger ── */}
              <Section>
                <H2 id="small-brown-mushroom-danger">Small Brown Mushroom Danger Explained</H2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                  <em>Galerina marginata</em> is especially dangerous because:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>It looks like many harmless small brown mushrooms</li>
                  <li>It grows in clusters like edible species</li>
                  <li>It shares habitat with edible fungi</li>
                </ul>
                <WarningBox>
                  <p className="text-sm font-semibold">Small brown mushrooms are among the hardest to identify safely. When in doubt, never consume any LBM (little brown mushroom).</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Economic Value ── */}
              <Section>
                <H2 id="economic-value">Economic Value and Uses</H2>
                <WarningBox>
                  <p className="text-sm font-semibold">No Edible Value. This mushroom has no safe culinary use.</p>
                </WarningBox>
                <H3>Scientific Importance</H3>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Studied in toxicology</li>
                  <li>Helps understand amatoxin poisoning</li>
                  <li>Important in forensic mushroom identification</li>
                </ul>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Benefits ── */}
              <Section>
                <H2 id="benefits">Benefits and Value</H2>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Research value in medical science</li>
                  <li>Helps improve mushroom safety awareness</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Pros and Cons ── */}
              <Section>
                <H2 id="pros-and-cons">Galerina marginata Pros and Cons</H2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: '#22c55e10', border: '1px solid #22c55e30' }}>
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#22c55e' }}>✅ Pros</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Scientifically important</li>
                      <li>Helps study toxic compounds</li>
                      <li>Part of forest ecosystem</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                    <h3 className="text-sm font-bold mb-2" style={{ color: '#ef4444' }}>❌ Cons</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li>Extremely toxic</li>
                      <li>Easily confused with edible mushrooms</li>
                      <li>Responsible for fatal poisonings</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── AI Identifier ── */}
              <Section>
                <H2 id="mushroom-identifier">How Our Mushroom Identifier Helps Identify Galerina marginata?</H2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                  Our{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    free mushroom identifier app
                  </Link>{' '}
                  uses AI and image recognition to analyze:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Cap color and size</li>
                  <li>Gill color progression</li>
                  <li>Stem structure</li>
                  <li>Growth on wood</li>
                </ul>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  By combining these features, the tool helps distinguish <em>Galerina marginata</em> from edible look-alikes, reducing risk. For more on deadly Amanita lookalikes that share similar toxins, see our{' '}
                  <Link href="/death-cap-vs-destroying-angel" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    Death Cap vs Destroying Angel
                  </Link>{' '}
                  comparison guide.
                </p>
              </Section>

              <Divider />

              {/* ── FAQ ── */}
              <Section>
                <H2 id="faq">Frequently Asked Questions</H2>
                {[
                  ['What is Galerina marginata?', 'Galerina marginata is a small brown poisonous mushroom known as the Funeral Bell, found on decaying wood.'],
                  ['Is Galerina marginata deadly?', 'Yes, it contains amatoxins and can cause fatal poisoning.'],
                  ['How do I identify Galerina marginata?', 'Look for a small brown mushroom growing on wood with brown gills and a thin stem.'],
                  ['What mushrooms look like Galerina marginata?', 'It is often confused with honey fungus (Armillaria) and other small brown mushrooms.'],
                  ['Can AI identify Galerina marginata?', 'Yes, a mushroom identifier app can analyze features, but results must always be verified.'],
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
                  <em>Galerina marginata</em> (Funeral Bell) is one of the most dangerous small brown mushrooms due to its deadly toxins and similarity to edible species. Its growth on wood and brown coloration make it particularly easy to misidentify.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  Understanding its cap, gills, stem, habitat, and growth pattern is essential for safe identification. While a mushroom identifier can assist, it should always be used alongside expert knowledge.
                </p>
                <WarningBox>
                  <p className="text-sm font-semibold">Golden rule: Never consume small brown mushrooms unless absolutely certain of identification.</p>
                </WarningBox>
              </Section>

              <Divider />
              <ViewTracker slug="/galerina-marginata" />
              <BlogComments slug="/galerina-marginata" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
