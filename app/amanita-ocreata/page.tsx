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
  title: 'Amanita ocreata (Toxic Amanita Species): Identification Guide',
  description:
    'Amanita ocreata, commonly known as the Western Destroying Angel, is a highly toxic Amanita species found in North America.',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Amanita ocreata (Toxic Amanita Species): Identification, Features, Habitat & Safety Guide',
      description:
        'Amanita ocreata, commonly known as the Western Destroying Angel, is a highly toxic Amanita species found in North America. It contains deadly amatoxins that can cause severe liver and kidney failure.',
      image: 'https://mushroomidentifiers.com/amanita-ocreata-western-destroying-angel-identification.webp',
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
      mainEntityOfPage: 'https://mushroomidentifiers.com/amanita-ocreata',
      datePublished: '2026-04-10',
      dateModified: '2026-04-10',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Amanita ocreata?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Amanita ocreata is a deadly toxic mushroom known as the Western Destroying Angel, found mainly in California and western North America. It contains amatoxins that cause severe liver damage and can be fatal if consumed.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is Amanita ocreata dangerous?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Amanita ocreata contains amatoxins that destroy liver and kidney cells. Symptoms are delayed 6–24 hours after ingestion, meaning serious organ damage is already occurring before the person feels unwell. Without immediate medical treatment, poisoning can be fatal.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does Amanita ocreata grow?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Amanita ocreata grows in woodlands near oak trees, especially in California and the western United States. It forms mycorrhizal relationships with oak and other hardwood species, and typically appears from winter to early spring after rainfall.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I identify Amanita ocreata?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Look for a white to creamy white cap (5–12 cm), pure white free gills, a white stem with a fragile ring, and most importantly a large cup-like volva at the base. The volva is often hidden underground and must be carefully dug up to check.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can AI identify Amanita ocreata?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A mushroom identifier app can analyze cap color, white gills, stem structure, ring and volva presence, and habitat context to help distinguish Amanita ocreata from edible look-alikes. However, AI results must always be verified by an expert — never consume a wild mushroom based solely on an app.',
          },
        },
        {
          '@type': 'Question',
          name: 'What mushrooms look similar to Amanita ocreata?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Amanita ocreata can be confused with Agaricus species (field mushrooms), immature white puffballs, and other white Amanita species. The key differences are the presence of a volva and pure white gills, which edible look-alikes typically lack.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I do if I suspect Amanita ocreata poisoning?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Seek immediate emergency medical help. Do not wait for symptoms to worsen — the delayed onset means liver damage is already progressing. If possible, bring a photo or sample of the mushroom for the medical team to identify.',
          },
        },
      ],
    },
  ],
}

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

export default function AmanitaOcreatePage() {
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
                <span>Amanita ocreata Western Destroying Angel</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Deadly</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Amanita ocreata</em>: Identification, Features, Habitat &amp; Safety Guide (Toxic Amanita Species)
                </h1>
                <AuthorBlock updatedAt="Apr 10, 2026" />
                <ArticleViewCount views={2341} className="mb-2" />
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Amanita ocreata</em>, commonly known as the Western Destroying Angel, is a highly toxic Amanita
                  species found in North America. It contains deadly amatoxins that can cause severe liver and kidney
                  failure, often leading to fatal outcomes if untreated. This mushroom is typically identified by its
                  white cap, white gills, ring on the stem, and a volva at the base, making it similar to other
                  dangerous Amanita species. Accurate identification requires examining all{' '}
                  <Link href="/mushroom-parts-explained" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom parts
                  </Link>{' '}
                  (cap, gills, stem, ring, volva) together or using a{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identifier
                  </Link>{' '}
                  as a supporting tool.
                </p>
              </div>

              {/* ── Featured Image 1 ── */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/amanita-ocreata-western-destroying-angel-identification.webp"
                    alt="Amanita ocreata Western Destroying Angel identification — white cap toxic mushroom California"
                    width={820}
                    height={615}
                    sizes="(max-width: 768px) 100vw, 820px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita ocreata (Western Destroying Angel) — white cap and stem in natural habitat.
                  Photo: Ryane Snow / Mushroom Observer, CC BY-SA 3.0, via Wikimedia Commons —
                  mushroomobserver.org · commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />
              <TableOfContents />

              {/* ── Quick ID Summary ── */}
              <Section>
                <H2 id="quick-id-summary">Amanita ocreata Identification Summary</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ['Scientific Name', 'Amanita ocreata'],
                    ['Common Names', 'Western Destroying Angel'],
                    ['Category', 'Toxic Amanita Species'],
                    ['Risk Level', '🔴 Deadly'],
                    ['Edibility', 'Poisonous (fatal)'],
                    ['Key Features', 'White cap, white gills, ring + volva, bulbous base'],
                    ['Found In', 'Western North America, especially California'],
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
                <H2 id="family-species">Family and Species</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Kingdom',  'Fungi'],
                        ['Division', 'Basidiomycota'],
                        ['Class',    'Agaricomycetes'],
                        ['Order',    'Agaricales'],
                        ['Family',   'Amanitaceae'],
                        ['Genus',    'Amanita'],
                        ['Species',  'Amanita ocreata'],
                      ].map(([rank, name], i) => (
                        <tr key={rank} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold w-36" style={{ color: 'var(--accent)' }}>{rank}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}><em>{name}</em></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4" style={{ color: 'var(--text-muted)' }}>
                  This species belongs to the Amanitaceae family, which includes some of the most dangerous fungi in
                  mycology. Members of the <em>Amanita</em> genus are known for their volva, ring, and white gills —
                  key identification features that are also shared by the closely related{' '}
                  <Link href="/amanita-bisporigera-destroying-angel" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    Amanita bisporigera (Destroying Angel)
                  </Link>.
                </p>
              </Section>

              <Divider />

              {/* ── Dimensions ── */}
              <Section>
                <H2 id="dimensions"><em>Amanita ocreata</em> Dimensions</H2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ['Cap Diameter',    '5–12 cm'],
                    ['Stem Height',     '8–20 cm'],
                    ['Stem Thickness',  '1–3 cm'],
                    ['Volva Size',      'Large, cup-like'],
                  ].map(([label, val]) => (
                    <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="text-lg font-bold mb-1" style={{ color: 'var(--accent)' }}>{val}</div>
                      <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4" style={{ color: 'var(--text-muted)' }}>
                  The mushroom is relatively tall with a slender but sturdy stem and a prominent base.
                </p>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features"><em>Amanita ocreata</em> Key Features (Identification Characteristics)</H2>

                <H3 id="cap">Cap (Pileus)</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li><strong>Shape:</strong> Convex when young, flattening with age</li>
                  <li><strong>Color:</strong> White to creamy white</li>
                  <li><strong>Surface:</strong> Smooth, sometimes slightly sticky when wet</li>
                </ul>

                <H3 id="gills">Gills (Lamellae)</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li><strong>Color:</strong> Pure white</li>
                  <li><strong>Attachment:</strong> Free gills (not attached to stem)</li>
                  <li><strong>Density:</strong> Crowded</li>
                </ul>
                <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
                  Gills remain white throughout maturity — a critical warning sign when combined with other features.
                </p>

                <H3 id="stem">Stem (Stipe)</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li>White and smooth in color</li>
                  <li>Slender with a slightly bulbous base</li>
                  <li>Firm structure throughout</li>
                </ul>

                <H3 id="ring">Ring (Annulus)</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li>Present on the upper portion of stem</li>
                  <li>Thin and fragile in texture</li>
                  <li>May disappear or become torn with age</li>
                </ul>

                <H3 id="volva">Volva (Basal Cup)</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li>Large, cup-like structure surrounding the base</li>
                  <li>Often hidden partially underground</li>
                  <li>Must be carefully dug up to reveal</li>
                </ul>
                <WarningBox>
                  <strong>The volva is the most important feature for identifying toxic Amanita mushrooms.</strong> Always
                  dig up the base — missing the volva is the most common fatal mistake in mushroom identification.
                </WarningBox>
              </Section>

              {/* ── Featured Image 2 ── */}
              <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '460px' }}>
                  <Image
                    src="/amanita-ocreata-white-cap-gills-volva.webp"
                    alt="Amanita ocreata white cap gills and volva detail — Western Destroying Angel toxic mushroom identification features"
                    width={820}
                    height={615}
                    className="w-full object-cover"
                    style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita ocreata showing white cap and gills — key identification features of the Western Destroying Angel.
                  Photo: Ron Pastorino / Mushroom Observer, CC BY-SA 3.0, via Wikimedia Commons —
                  mushroomobserver.org · commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Color, Smell, Taste ── */}
              <Section>
                <H2 id="color-smell-taste"><em>Amanita ocreata</em> Color, Smell, and Taste</H2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: 'Color',  items: ['Cap: White to off-white', 'Gills: Pure white', 'Stem: White'] },
                    { title: 'Smell',  items: ['Mild when young', 'Slightly unpleasant in older specimens', 'Not particularly distinctive'] },
                    { title: 'Taste',  items: ['⚠️ Never taste — highly toxic', 'Not a reliable identification method'] },
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

              {/* ── Growth Pattern ── */}
              <Section>
                <H2 id="growth-pattern"><em>Amanita ocreata</em> Growth Pattern and Seasonality</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Growth Pattern</h4>
                    <ul style={{ color: 'var(--text-muted)' }}>
                      <li>Typically grows single or scattered</li>
                      <li>Rarely forms dense clusters</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Seasonality</h4>
                    <ul style={{ color: 'var(--text-muted)' }}>
                      <li>Winter to early spring (key difference from other Amanitas)</li>
                      <li>Often appears after rainfall</li>
                    </ul>
                  </div>
                </div>
                <InfoBox>
                  <strong>Important:</strong> Unlike many other toxic Amanita species that fruit in summer and autumn,
                  <em> Amanita ocreata</em> appears in winter to early spring — an important seasonal distinction for
                  identification in California and the western US.
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Habitat ── */}
              <Section>
                <H2 id="habitat">Habitat, Environment &amp; Distribution</H2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { title: 'Habitat',          items: ['Woodland and forest areas', 'Near tree roots', 'Coastal and inland forest zones'] },
                    { title: 'Tree Association', items: ['Oak trees (especially in California)', 'Other hardwood species', 'Forms mycorrhizal relationships'] },
                    { title: 'Environment',      items: ['Moist soil after rainfall', 'Shaded environments', 'Well-drained woodland floor'] },
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
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li>Western United States (primary range)</li>
                  <li>Especially abundant in California</li>
                  <li>Rare outside North America</li>
                </ul>
                <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
                  <em>Amanita ocreata</em> forms mycorrhizal relationships with oak trees, meaning it lives in a
                  symbiotic association with tree roots. This makes oak woodlands the most likely habitat to
                  encounter this dangerous species.
                </p>
              </Section>

              {/* ── Featured Image 3 ── */}
              <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '460px' }}>
                  <Image
                    src="/amanita-ocreata-habitat-california-oak-woodland.webp"
                    alt="Amanita ocreata habitat California oak woodland — Western Destroying Angel growing in natural forest environment"
                    width={820}
                    height={615}
                    className="w-full object-cover"
                    style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Amanita ocreata in its natural California oak woodland habitat (Rockville Hills Regional Park, Solano County, CA).
                  Photo: Ron Pastorino / Mushroom Observer, CC BY-SA 3.0, via Wikimedia Commons —
                  mushroomobserver.org · commons.wikimedia.org
                </figcaption>
              </figure>

              <Divider />

              {/* ── Edibility & Risk ── */}
              <Section>
                <H2 id="edibility">Edibility, Safety &amp; Risk Level</H2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                    <div className="text-2xl mb-1">❌</div>
                    <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Not Edible</div>
                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Extremely poisonous</div>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                    <div className="text-2xl mb-1">🔴</div>
                    <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Deadly Risk</div>
                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Very high risk</div>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                    <div className="text-2xl mb-1">☠️</div>
                    <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Amatoxins</div>
                    <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Destroys liver &amp; kidney</div>
                  </div>
                </div>

                <H3>Toxicity</H3>
                <p className="mb-3" style={{ color: 'var(--text-muted)' }}>
                  <em>Amanita ocreata</em> contains amatoxins, which:
                </p>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li>Destroy liver cells progressively</li>
                  <li>Cause kidney failure</li>
                  <li>Lead to fatal poisoning even in small amounts</li>
                </ul>

                <H3>Symptoms (Critical Awareness)</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li>Delayed onset: 6–24 hours after ingestion</li>
                  <li>Initial phase: vomiting and diarrhea</li>
                  <li>Temporary false recovery phase (person may seem to improve)</li>
                  <li>Severe liver and kidney failure follows</li>
                </ul>
                <WarningBox>
                  <strong>Immediate medical treatment is critical.</strong> The delayed onset means serious organ
                  damage is already progressing before symptoms appear. Do not wait — call emergency services
                  immediately if poisoning is suspected.
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Look-alikes ── */}
              <Section>
                <H2 id="look-alikes">Similar Species (Look-Alikes Comparison)</H2>
                <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        {['Feature', 'Amanita ocreata', 'Edible Look-Alike'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Gills',   'White',   'Pink → brown (Agaricus)'],
                        ['Volva',   'Present', 'Absent'],
                        ['Ring',    'Present', 'May vary'],
                        ['Smell',   'Mild',    'Pleasant'],
                        ['Season',  'Winter – early spring', 'Varies'],
                        ['Risk',    'Deadly ☠️', 'Safe ✓'],
                      ].map(([feat, bad, good], i) => (
                        <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                          <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{bad}</td>
                          <td className="px-4 py-3" style={{ color: '#86efac' }}>{good}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <H3>Common Confusions</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li><em>Agaricus</em> species (common field mushrooms)</li>
                  <li>Immature white puffballs</li>
                  <li>Other white <em>Amanita</em> species</li>
                </ul>
                <p className="mt-3" style={{ color: 'var(--text-muted)' }}>
                  For a detailed comparison between related deadly Amanita species, see our guide on{' '}
                  <Link href="/death-cap-vs-destroying-angel" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    Death Cap vs Destroying Angel
                  </Link>.
                </p>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Economic Value ── */}
              <Section>
                <H2 id="value">Economic Value and Uses</H2>
                <WarningBox>
                  <strong>No Edible or Commercial Value.</strong> <em>Amanita ocreata</em> has no safe culinary use whatsoever.
                  Any attempt to prepare or consume this mushroom is extremely dangerous.
                </WarningBox>

                <H3>Scientific Importance</H3>
                <ul style={{ color: 'var(--text-muted)' }}>
                  <li>Studied extensively in toxicology research</li>
                  <li>Helps advance understanding of amatoxin poisoning mechanisms</li>
                  <li>Important for medical and forensic mycology studies</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Pros & Cons ── */}
              <Section>
                <H2 id="pros-cons">Pros and Cons</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    <h4 className="font-semibold mb-3 text-sm" style={{ color: '#22c55e' }}>Pros</h4>
                    <ul className="space-y-2">
                      {[
                        'Scientifically valuable for toxicology research',
                        'Important role in forest ecosystem balance',
                        'Advances mycology knowledge and safety education',
                      ].map(p => (
                        <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                          <span style={{ color: '#22c55e' }}>✓</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                    <ul className="space-y-2">
                      {[
                        'Highly toxic — potentially fatal even in small amounts',
                        'Easily misidentified with edible white mushrooms',
                        'Responsible for severe poisoning cases in western US',
                      ].map(c => (
                        <li key={c} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                          <span style={{ color: '#ef4444' }}>✗</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── AI Identifier ── */}
              <Section>
                <H2 id="ai-identifier">How Our Mushroom Identifier Helps Identify <em>Amanita ocreata</em></H2>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  Our{' '}
                  <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identifier by picture
                  </Link>{' '}
                  uses AI and image recognition to analyze:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    'Cap color and shape',
                    'White gill detection',
                    'Stem structure',
                    'Ring presence',
                    'Volva at base',
                    'Habitat and season context',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--accent)' }}>→</span> {f}
                    </div>
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)' }}>
                  By combining these features, the tool helps distinguish <em>Amanita ocreata</em> from edible
                  look-alikes, improving identification accuracy. However, AI results should always be verified
                  by an expert before any consumption decision.
                </p>
              </Section>

              <Divider />

              {/* ── FAQ ── */}
              <Section>
                <H2 id="faq">Frequently Asked Questions</H2>
                <div className="space-y-4">
                  {[
                    {
                      q: 'What is Amanita ocreata?',
                      a: 'Amanita ocreata is a deadly toxic mushroom known as the Western Destroying Angel, found mainly in California and western North America. It contains amatoxins that cause severe liver damage and can be fatal if consumed.',
                    },
                    {
                      q: 'Why is Amanita ocreata dangerous?',
                      a: 'It contains amatoxins that destroy liver and kidney cells. Symptoms are delayed 6–24 hours after ingestion, meaning serious organ damage is already occurring before the person feels unwell. Without immediate medical treatment, poisoning can be fatal.',
                    },
                    {
                      q: 'Where does Amanita ocreata grow?',
                      a: 'It grows in woodlands near oak trees, especially in California and the western United States. It typically appears from winter to early spring after rainfall — an important distinction from other Amanita species.',
                    },
                    {
                      q: 'How can I identify Amanita ocreata?',
                      a: 'Look for a white to creamy white cap (5–12 cm), pure white free gills, a white stem with a fragile ring, and most importantly a large cup-like volva at the base. The volva is often hidden underground and must be carefully dug up.',
                    },
                    {
                      q: 'Can AI identify Amanita ocreata?',
                      a: 'Yes, a mushroom identifier app can analyze its features, but results must always be verified by an expert. Never consume a wild mushroom based solely on an app result.',
                    },
                  ].map(({ q, a }) => (
                    <details key={q} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                      <summary className="px-5 py-4 cursor-pointer font-semibold flex items-center justify-between select-none" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', listStyle: 'none' }}>
                        <span>{q}</span>
                        <span className="ml-3 flex-shrink-0" style={{ color: 'var(--accent)' }}>+</span>
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
                <InfoBox>
                  <p>
                    <em>Amanita ocreata</em> (Western Destroying Angel) is one of the most dangerous mushrooms in
                    North America. Its simple white appearance makes it highly deceptive and easy to confuse with
                    edible species. Understanding its cap, gills, stem, ring, volva, habitat, and seasonality is
                    essential for safe identification.
                  </p>
                  <p className="mt-3">
                    Using a{' '}
                    <Link href="/" className="hover:underline font-medium" style={{ color: 'var(--accent)' }}>
                      free mushroom identifier app
                    </Link>{' '}
                    can help analyze these features, but it should always be used alongside expert knowledge and
                    field guides. When it comes to wild mushrooms —{' '}
                    <strong>if in doubt, do not touch or consume.</strong>
                  </p>
                </InfoBox>
              </Section>

              <RelatedPosts currentSlug="/amanita-ocreata" />
              <BlogComments slug="/amanita-ocreata" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
