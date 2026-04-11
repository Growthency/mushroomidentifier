import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import ArticleViewCount from '@/components/blog/ArticleViewCount'

export const metadata: Metadata = {
  title: 'Lepiota brunneoincarnata (Toxic Small White Mushroom) – Identification Guide',
  description:
    'Lepiota brunneoincarnata, commonly known as a toxic small white mushroom or deadly dapperling, is a highly poisonous species responsible for severe and sometimes fatal mushroom poisoning',
  alternates: { canonical: 'https://mushroomidentifiers.com/lepiota-brunneoincarnata' },
  openGraph: {
    title: 'Lepiota brunneoincarnata (Toxic Small White Mushroom) – Identification Guide',
    description: 'Complete identification guide for Lepiota brunneoincarnata (deadly dapperling). Learn key features, amatoxin content, delayed liver failure symptoms, habitat, and critical safety information.',
    url: 'https://mushroomidentifiers.com/lepiota-brunneoincarnata',
    images: [{ url: 'https://mushroomidentifiers.com/lepiota-brunneoincarnata-deadly-dapperling-identification.webp', width: 820, height: 550, alt: 'Lepiota brunneoincarnata toxic small white mushroom identification guide' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lepiota brunneoincarnata (Toxic Small White Mushroom) – Identification Guide',
    description: 'Complete identification guide for Lepiota brunneoincarnata — amatoxin content, delayed liver failure, habitat, and critical safety information.',
    images: ['https://mushroomidentifiers.com/lepiota-brunneoincarnata-deadly-dapperling-identification.webp'],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Lepiota brunneoincarnata (Toxic Small White Mushroom) – Identification, Risks & Lookalikes","description":"Learn to identify Lepiota brunneoincarnata (deadly dapperling) with this complete guide. Explore key features, amatoxin content, delayed liver failure symptoms, habitat, lookalikes, and critical safety information.","image":"https://mushroomidentifiers.com/lepiota-brunneoincarnata-deadly-dapperling-identification.webp","author":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/lepiota-brunneoincarnata"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is Lepiota brunneoincarnata edible?","acceptedAnswer":{"@type":"Answer","text":"No, it is deadly poisonous and should never be eaten. It contains amatoxins that cause severe liver failure, which can be fatal without prompt medical treatment."}},{"@type":"Question","name":"What makes Lepiota brunneoincarnata so dangerous?","acceptedAnswer":{"@type":"Answer","text":"It contains amatoxins that cause severe liver failure. Symptoms are delayed by 6–24 hours after ingestion, and may temporarily improve before worsening, making early diagnosis extremely difficult."}},{"@type":"Question","name":"How long do symptoms take to appear?","acceptedAnswer":{"@type":"Answer","text":"Typically 6–24 hours after ingestion. The delayed onset means liver damage is often progressing silently before symptoms appear."}},{"@type":"Question","name":"Can Lepiota brunneoincarnata kill you?","acceptedAnswer":{"@type":"Answer","text":"Yes, it can be fatal without prompt medical treatment. Amatoxin poisoning causes progressive liver failure that can lead to death if not treated aggressively."}},{"@type":"Question","name":"Where does Lepiota brunneoincarnata grow?","acceptedAnswer":{"@type":"Answer","text":"It grows in grasslands, gardens, parks, and roadside areas, mainly in Europe, Asia, and parts of North Africa. It prefers disturbed soils and appears from summer to autumn."}},{"@type":"Question","name":"Can AI identify this mushroom?","acceptedAnswer":{"@type":"Answer","text":"AI mushroom identification tools can assist with detection, but small white Lepiota species are extremely difficult to distinguish from harmless species. AI results must always be verified by an expert. Never rely on AI alone for any small white mushroom identification."}}]}]}

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

export default function LepiotaBrunneoincarnataPage() {
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
            <span>Lepiota brunneoincarnata Deadly Dapperling Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Deadly</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Lepiota brunneoincarnata</em> (Toxic Small White Mushroom) &ndash; Identification, Risks &amp; Lookalikes
            </h1>
            <AuthorBlock updatedAt="Apr 11, 2026" />
            <ArticleViewCount views={5180} className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Lepiota brunneoincarnata</em>, commonly known as a toxic small white mushroom or deadly dapperling,
              is a highly poisonous species responsible for severe and sometimes fatal mushroom poisoning. It belongs
              to a group of small, white-to-brown mushrooms that are often overlooked but extremely dangerous. Found
              mainly in Europe and parts of Asia, it contains amatoxins, the same toxins found in deadly species like{' '}
              <em>Amanita phalloides</em>.
            </p>
            <p className="text-base leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
              For safe identification, it&apos;s critical to recognize its small size, scaly cap, white gills, and
              ring on the stem — but due to its similarity to harmless species, expert verification or a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
              / AI{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identification app</Link> is
              strongly recommended.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/lepiota-brunneoincarnata-deadly-dapperling-identification.webp"
                alt="Lepiota brunneoincarnata toxic small white mushroom identification — deadly dapperling with scaly cap"
                width={820}
                height={550}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Photo: Strobilomyces, CC BY-SA 3.0, via Wikimedia Commons
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
                    ['Family', 'Agaricaceae'],
                    ['Genus', 'Lepiota'],
                    ['Species', 'Lepiota brunneoincarnata'],
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
              Part of the <em>Lepiota</em> genus, which includes several toxic small mushrooms. Many species in this
              genus contain amatoxins and are responsible for fatal poisonings — making it one of the most dangerous
              groups of small mushrooms for foragers.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Essentials)</H2>

            <H3 id="cap">Cap Characteristics</H3>
            <ul>
              <li><strong>Color:</strong> White to cream with brownish scales or patches</li>
              <li><strong>Shape:</strong> Convex, flattening with age, often with a slight central bump</li>
              <li><strong>Surface:</strong> Dry, scaly</li>
              <li><strong>Size:</strong> 2–7 cm diameter</li>
            </ul>

            <H3 id="gills">Gills</H3>
            <ul>
              <li><strong>Color:</strong> White</li>
              <li><strong>Attachment:</strong> Free from the stem</li>
              <li><strong>Spacing:</strong> Crowded</li>
            </ul>

            <H3 id="stem">Stem (Stipe)</H3>
            <ul>
              <li><strong>Structure:</strong> Slender, fragile</li>
              <li><strong>Color:</strong> White with a small ring (annulus)</li>
              <li><strong>Base:</strong> Often slightly bulbous at base</li>
            </ul>

            <H3 id="overall">Overall Appearance</H3>
            <ul>
              <li>Small, delicate mushroom</li>
              <li>Easily overlooked but extremely dangerous</li>
            </ul>
            <WarningBox>
              Small white mushrooms with brown scales on the cap are potentially deadly. If you find a small
              white-to-brown mushroom with free gills and a ring on the stem — treat it as potentially fatal and
              do not consume.
            </WarningBox>
          </Section>

          {/* Second Image — Detail */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/lepiota-brunneoincarnata-cap-scales-detail.webp"
                alt="Lepiota brunneoincarnata cap scales and stem detail — deadly dapperling mushroom close-up identification"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Lepiota brunneoincarnata detail. Photo: Strobilomyces, CC BY-SA 4.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Color, Smell & Texture */}
          <Section>
            <H2 id="color-smell-taste">Color, Smell &amp; Texture</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Color', items: ['Cap: White with brownish tones', 'Gills: White', 'Stem: White'] },
                { title: 'Smell', items: ['Mild or slightly unpleasant', 'Not strongly distinctive'] },
                { title: 'Texture', items: ['Fragile, thin flesh', 'Dry scaly cap surface', '⚠️ Do not taste — deadly toxic'] },
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

          {/* Habitat & Distribution */}
          <Section>
            <H2 id="habitat">Environment &amp; Habitat</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { title: 'Habitat', items: ['Grasslands', 'Gardens and parks', 'Roadside areas', 'Disturbed soils'] },
                { title: 'Seasonality', items: ['Summer to autumn', 'Appears after warm rains'] },
                { title: 'Growth Pattern', items: ['Singly or in small scattered groups', 'Saprotrophic (decomposes organic material)'] },
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
              {['Spain', 'France', 'Italy', 'Turkey', 'Mediterranean regions', 'Temperate Asia'].map(r => (
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
                src="/lepiota-brunneoincarnata-habitat-grassland.webp"
                alt="Lepiota brunneoincarnata growing in grassland habitat — toxic small white mushroom in natural setting"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Lepiota brunneoincarnata in habitat. Photo: Murselin Guney (Beyrek), CC BY-SA 3.0, via Mushroom Observer
            </figcaption>
          </figure>

          <Divider />

          {/* Dimensions */}
          <Section>
            <H2 id="dimensions">Physical Dimensions &amp; Structure</H2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Cap Diameter', '2–7 cm'],
                ['Stem Height', '3–8 cm'],
                ['Stem Thickness', '0.3–1 cm'],
                ['Gills', 'White, free'],
              ].map(([label, val]) => (
                <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-lg font-bold mb-1" style={{ color: 'var(--accent)' }}>{val}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</div>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Toxicity & Health Risks */}
          <Section>
            <H2 id="toxicity">Toxicity &amp; Health Risks</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">☠️</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Deadly Poisonous</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Contains amatoxins</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">🔴</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>High Fatality Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Causes liver failure</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">⏱️</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Delayed Onset</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>6–24 hours before symptoms</div>
              </div>
            </div>

            <H3>Toxic Compound — Amatoxin</H3>
            <p className="mb-3">Amatoxins are hepatotoxins (liver-destroying toxins) that:</p>
            <ul>
              <li>Cause progressive, severe liver failure</li>
              <li>Have a dangerously delayed onset (6–24 hours after ingestion)</li>
              <li>Are not destroyed by cooking, drying, or freezing</li>
              <li>Have no known specific antidote — treatment is supportive only</li>
            </ul>

            <H3>Symptoms of Poisoning</H3>
            <ul>
              <li><strong>Early (6–24 hours):</strong> Severe vomiting and diarrhea</li>
              <li><strong>Progressing:</strong> Abdominal pain, dehydration</li>
              <li><strong>False recovery:</strong> Symptoms may temporarily improve before worsening</li>
              <li><strong>Severe:</strong> Liver failure, jaundice, coagulopathy</li>
              <li><strong>Critical:</strong> Multi-organ failure, possible death</li>
            </ul>
            <WarningBox>
              <strong>Symptoms may improve temporarily before worsening</strong> — this &ldquo;false recovery&rdquo;
              phase is extremely dangerous because liver damage progresses silently. If ingestion of any small
              white <em>Lepiota</em> is suspected, seek emergency medical help immediately — even if symptoms
              appear to resolve.
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
                    ['Toxicity', '🔴 Extreme', '#ef4444'],
                    ['Fatality Risk', '🔴 High', '#ef4444'],
                    ['Misidentification Risk', '🔴 Very High', '#ef4444'],
                    ['Edibility', '❌ Deadly poisonous', '#ef4444'],
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
                    {['Feature', 'Deadly Dapperling', 'Harmless Small Mushrooms'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Size', 'Small (2–7 cm)', 'Small'],
                    ['Cap', 'Scaly with brown patches', 'Smooth or lightly textured'],
                    ['Toxicity', 'Deadly ☠️', 'Non-toxic ✓'],
                    ['Gills', 'White, free, crowded', 'Variable'],
                    ['Identification', 'Extremely difficult', 'Easier with practice'],
                  ].map(([feat, deadly, harmless], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{deadly}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{harmless}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Common Confusion Species</H3>
            <ul>
              <li>Small edible mushrooms in grasslands</li>
              <li>Other <em>Lepiota</em> species (many are toxic)</li>
              <li><em>Macrolepiota</em> species (parasol mushrooms) — edible but larger</li>
            </ul>
            <WarningBox>
              <strong>Rule: Avoid eating small white mushrooms unless expertly identified.</strong> Many
              small <em>Lepiota</em> species are deadly — never assume a small white mushroom is safe.
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
                  <li>Saprotrophic</li>
                  <li>Decomposes organic material</li>
                  <li>Contributes to soil nutrient cycling</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Life Cycle</h4>
                <ul>
                  <li>Spores released from mature gills</li>
                  <li>Mycelium grows in soil</li>
                  <li>Fruiting bodies appear in summer–autumn</li>
                  <li>Spores disperse through wind</li>
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Economic & Ecological Value */}
          <Section>
            <H2 id="ecological-value">Economic &amp; Ecological Value</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Ecological Importance</h4>
                <ul>
                  <li>Breaks down organic matter</li>
                  <li>Supports soil ecosystems</li>
                  <li>Part of grassland fungal communities</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Economic Value</h4>
                <ul>
                  <li>No edible or commercial value</li>
                  <li>Important in toxicology and medical research</li>
                  <li>Studied for amatoxin poisoning treatments</li>
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
                  {['Ecological decomposer in grassland ecosystems', 'Scientific importance in toxicology research', 'Contributes to natural nutrient cycles'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Extremely toxic — can cause fatal liver failure', 'Easily misidentified as harmless species', 'High fatality risk with delayed symptoms'].map(c => (
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
            <H2 id="safe-identification">How to Identify Lepiota brunneoincarnata Safely</H2>
            <div className="space-y-3 mb-5">
              {[
                'Look for a small white cap with brownish scales or patches',
                'Check for a ring (annulus) on the slender stem',
                'Observe white, free, crowded gills',
                'Confirm small size (2–7 cm) and fragile structure in grassland or garden habitat',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{i + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</span>
                </div>
              ))}
            </div>
            <p>
              Always verify using a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier free by photo</Link> tool
              or AI-based mushroom identification system before making conclusions. <strong>Never rely on AI alone
              for small white mushroom identification</strong> — expert verification is essential.
            </p>

            <H3>Expert Identification Tips</H3>
            <ul>
              <li>Avoid all small white mushrooms unless certain of identification</li>
              <li>Check multiple features, not just appearance</li>
              <li>Be cautious in grassy environments — many deadly species grow there</li>
              <li><strong>When in doubt — do not touch or consume</strong></li>
            </ul>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2 id="faq">Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is Lepiota brunneoincarnata edible?',
                  a: 'No, it is deadly poisonous and should never be eaten. It contains amatoxins that cause severe liver failure, which can be fatal without prompt medical treatment.',
                },
                {
                  q: 'What makes it so dangerous?',
                  a: 'It contains amatoxins that cause severe liver failure. Symptoms are delayed by 6–24 hours, and may temporarily improve before worsening, making early diagnosis extremely difficult.',
                },
                {
                  q: 'How long do symptoms take to appear?',
                  a: 'Typically 6–24 hours after ingestion. The delayed onset means liver damage is often progressing silently before symptoms appear.',
                },
                {
                  q: 'Can it kill you?',
                  a: 'Yes, it can be fatal without prompt medical treatment. Amatoxin poisoning causes progressive liver failure that can lead to death.',
                },
                {
                  q: 'Where does it grow?',
                  a: 'In grasslands, gardens, parks, and roadside areas, mainly in Europe, Asia, and parts of North Africa. It prefers disturbed soils and appears from summer to autumn.',
                },
                {
                  q: 'Can AI identify this mushroom?',
                  a: 'AI tools can assist with detection, but small white Lepiota species are extremely difficult to distinguish from harmless species. Never rely on AI alone — expert verification is essential.',
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
                <em>Lepiota brunneoincarnata</em> is one of the most dangerous small mushrooms due to its amatoxin
                content and high fatality risk. Its small size and resemblance to harmless species make it especially
                risky for beginners.
              </p>
              <p className="mt-3">
                Understanding its cap structure, habitat, and toxic profile is essential for safe identification.
                Combining this knowledge with a reliable{' '}
                <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
                can significantly reduce the risk of dangerous mistakes.
              </p>
              <p className="mt-3">
                Learn more about other deadly species like{' '}
                <Link href="/amanita-phalloides-death-cap" style={{ color: 'var(--accent)' }} className="hover:underline">
                  Amanita phalloides (Death Cap)
                </Link>{' '}
                and{' '}
                <Link href="/galerina-marginata" style={{ color: 'var(--accent)' }} className="hover:underline">
                  Galerina marginata (Funeral Bell)
                </Link>{' '}
                to expand your knowledge of dangerous mushrooms to avoid.
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/lepiota-brunneoincarnata" />
          <BlogComments slug="/lepiota-brunneoincarnata" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
