import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'

export const metadata: Metadata = {
  title: 'Amanita phalloides (death cap identification) - Mushroom Identifier',
  description:
    'Amanita bisporigera, commonly known as the Destroying Angel, is one of the most dangerous toxic mushrooms in North America.',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Amanita phalloides (Death Cap): Identification, Features, Habitat & Safety Guide',
      description:
        'Learn death cap identification with this guide to Amanita phalloides. Explore key features, habitat, toxic risk, look-alikes, and safety information.',
      author: {
        '@type': 'Organization',
        name: 'Mushroom Identifier',
        url: 'https://mushroomidentifiers.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mushroom Identifier',
        url: 'https://mushroomidentifiers.com/',
        email: 'support@mushroomidentifiers.com',
      },
      mainEntityOfPage: 'https://mushroomidentifiers.com/',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How to identify a Death Cap mushroom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Death cap identification relies on a greenish to pale yellow cap, pure white gills, a ring on the stem, and a cup-like volva at the base. Checking the full base is essential because the volva is one of the most important warning signs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is Amanita phalloides so dangerous?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Amanita phalloides is dangerous because it contains amatoxins that can cause severe liver and kidney damage. It is responsible for many fatal mushroom poisonings worldwide and even small amounts can be deadly.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where does Death Cap grow?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Death Cap grows in woodland habitats, usually near hardwood trees such as oak, beech, birch, and chestnut. It forms mycorrhizal relationships with tree roots and is commonly found in late summer and autumn.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can AI identify Death Cap?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A mushroom identifier can use AI and image recognition to analyze cap color, white gills, stem structure, ring, volva, and habitat clues. However, results should always be treated as a research aid and not as final safety confirmation.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I do if I suspect Death Cap poisoning?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If Death Cap poisoning is suspected, seek immediate emergency medical help. Do not wait for symptoms to worsen, because toxic effects may be delayed while serious liver damage is already developing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Amanita phalloides edible?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Amanita phalloides is a deadly toxic mushroom and must never be eaten. It has no safe edible use and can be fatal even in small quantities.',
          },
        },
        {
          '@type': 'Question',
          name: 'What mushrooms look similar to Death Cap?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Death Cap can be confused with some edible Agaricus species, immature puffballs, and other pale mushrooms. The key difference is the combination of white gills, a ring, and a volva at the base.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is the volva important in death cap identification?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The volva is important because it is one of the strongest identification features of Amanita phalloides. It appears as a cup-like structure at the base and helps distinguish Death Cap from many edible look-alikes.',
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

export default function DeathCapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <article className="max-w-4xl mx-auto px-5 md:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: 'var(--text-faint)' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:underline" style={{ color: 'var(--accent)' }}>Blog</Link>
            <span>/</span>
            <span>Amanita phalloides Death Cap Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Deadly</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Amanita phalloides</em> (Death Cap): Identification, Features, Habitat &amp; Safety Guide
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Amanita phalloides</em>, commonly known as the Death Cap, is one of the most dangerous toxic
              mushrooms in the world. It is responsible for the majority of fatal mushroom poisonings due to its
              highly potent toxins. Because it closely resembles edible mushrooms, accurate death cap
              identification requires careful examination of all mushroom parts.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/amanita-phalloides-death-cap-identification.webp"
                alt="Amanita phalloides death cap identification — three specimens in forest"
                width={820}
                height={615}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Photo: JeddBham64, CC BY-SA 4.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          <TableOfContents />

          {/* Quick ID Summary */}
          <Section>
            <H2 id="quick-id-summary">Quick Identification Summary</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Scientific Name', 'Amanita phalloides'],
                ['Common Names', 'Death Cap'],
                ['Category', 'Dangerous / Toxic Mushrooms'],
                ['Risk Level', '🔴 Deadly'],
                ['Edibility', 'Poisonous (fatal)'],
                ['Key Features', 'Greenish cap, white gills, ring + volva, bulbous base'],
                ['Found In', 'Forests near oak, beech, birch, and other hardwood trees'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="text-xs font-semibold w-28 flex-shrink-0" style={{ color: 'var(--accent)' }}>{label}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{value}</span>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* Taxonomy */}
          <Section>
            <H2 id="family-species">Family and Species</H2>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Kingdom', 'Fungi'],
                    ['Division', 'Basidiomycota'],
                    ['Class', 'Agaricomycetes'],
                    ['Order', 'Agaricales'],
                    ['Family', 'Amanitaceae'],
                    ['Genus', 'Amanita'],
                    ['Species', 'Amanita phalloides'],
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
              The Death Cap belongs to the Amanitaceae family, which includes several of the most toxic mushroom
              species. Members of this genus are often identified by the combination of white gills, a ring, and a
              volva, making them especially important in mycology and mushroom safety.
            </p>
          </Section>

          <Divider />

          {/* Dimensions */}
          <Section>
            <H2 id="dimensions">Dimensions</H2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Cap Diameter', '5–15 cm'],
                ['Stem Height', '8–15 cm'],
                ['Stem Thickness', '1–2.5 cm'],
                ['Volva Size', 'Prominent, cup-like at base'],
              ].map(([label, val]) => (
                <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-lg font-bold mb-1" style={{ color: 'var(--accent)' }}>{val}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4">
              The Death Cap is a medium to large mushroom, often appearing elegant but deceptively simple. Its
              proportions are similar to many edible species, which increases the risk of misidentification.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Characteristics)</H2>

            <H3 id="cap">Cap (Pileus)</H3>
            <ul>
              <li><strong>Shape:</strong> Convex when young, flattening at maturity</li>
              <li><strong>Color:</strong> Greenish, olive, yellow-green, sometimes pale</li>
              <li><strong>Surface:</strong> Smooth, slightly sticky when wet</li>
            </ul>
            <p className="mt-2">Cap color can vary, making it unreliable as a standalone feature.</p>

            <H3 id="gills">Gills (Lamellae)</H3>
            <ul>
              <li><strong>Color:</strong> Pure white</li>
              <li><strong>Attachment:</strong> Free gills</li>
              <li><strong>Density:</strong> Crowded</li>
            </ul>
            <p className="mt-2">White gills are a critical warning sign when combined with other features.</p>

            <H3 id="stem">Stem (Stipe)</H3>
            <ul>
              <li><strong>Color:</strong> White</li>
              <li><strong>Structure:</strong> Smooth, slender</li>
              <li><strong>Base:</strong> Bulbous and enclosed in a volva</li>
            </ul>

            <H3 id="ring">Ring (Annulus)</H3>
            <ul>
              <li>Present on the upper stem</li>
              <li>Thin, skirt-like</li>
              <li>May become fragile with age</li>
            </ul>

            <H3 id="volva">Volva (Basal Cup)</H3>
            <ul>
              <li>Large, cup-like structure at base</li>
              <li>Often partially buried underground</li>
              <li>One of the most important identification features</li>
            </ul>
            <WarningBox>
              Always check the base — missing the volva is the most common fatal mistake.
            </WarningBox>
          </Section>

          {/* Second Image */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/death-cap-volva-base-amanita-phalloides.webp"
                alt="Death cap volva base — Amanita phalloides bulbous base and ring on stem"
                width={615}
                height={819}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Death cap stem showing ring and bulbous base. Photo: Archenzo, CC BY-SA 3.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Color, Smell, Taste */}
          <Section>
            <H2 id="color-smell-taste">Color, Smell, and Taste</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Color', items: ['Cap: Greenish to pale yellow', 'Gills: Pure white', 'Stem: White'] },
                { title: 'Smell', items: ['Mild when young', 'Slightly sweet or unpleasant in older specimens'] },
                { title: 'Taste', items: ['Not distinctive', '⚠️ Tasting is dangerous — not recommended'] },
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

          {/* Growth Pattern */}
          <Section>
            <H2 id="growth-pattern">Growth Pattern and Seasonality</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Growth Pattern</h4>
                <ul>
                  <li>Typically grows single or scattered</li>
                  <li>Occasionally in small groups</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Seasonality</h4>
                <ul>
                  <li>Late summer to autumn</li>
                  <li>Appears after rain</li>
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Habitat */}
          <Section>
            <H2>Habitat, Environment &amp; Distribution</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { title: 'Habitat', items: ['Woodland areas', 'Near hardwood trees'] },
                { title: 'Environment', items: ['Moist soil', 'Shaded forest areas'] },
                { title: 'Tree Association', items: ['Oak', 'Beech', 'Birch', 'Chestnut'] },
              ].map(({ title, items }) => (
                <div key={title} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>{title}</h4>
                  <ul>
                    {items.map(i => <li key={i} className="text-sm" style={{ color: 'var(--text-muted)' }}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mb-4">The Death Cap forms mycorrhizal relationships with trees.</p>

            <H3>Geographic Distribution</H3>
            <ul>
              <li>Native to Europe</li>
              <li>Widespread in North America</li>
              <li>Found in parts of Asia and Australia</li>
            </ul>
            <p className="mt-2">It has spread globally due to human activity.</p>
          </Section>

          {/* Third Image */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/amanita-phalloides-young-specimen-greenish-cap.webp"
                alt="Amanita phalloides young specimen showing greenish cap in natural habitat"
                width={820}
                height={615}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Young Amanita phalloides specimen showing greenish cap. Photo: Wikimedia Commons, CC BY-SA 3.0
            </figcaption>
          </figure>

          <Divider />

          {/* Edibility & Risk */}
          <Section>
            <H2>Edibility, Safety &amp; Risk Level</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">❌</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Not Edible</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Highly poisonous</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">🔴</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Deadly Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Extremely high risk</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">☠️</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Amatoxins</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Destroys liver & kidney</div>
              </div>
            </div>

            <H3>Toxicity</H3>
            <p className="mb-3">Contains amatoxins, which:</p>
            <ul>
              <li>Destroy liver and kidney cells</li>
              <li>Cause delayed symptoms (6–24 hours after ingestion)</li>
              <li>Often lead to fatal poisoning even in small amounts</li>
            </ul>

            <H3>Symptoms (Important for Awareness)</H3>
            <ul>
              <li>Delayed onset: 6–24 hours after ingestion</li>
              <li>Severe vomiting and diarrhea</li>
              <li>Liver and kidney failure</li>
            </ul>
            <WarningBox>
              <strong>Immediate medical attention is required.</strong> Do not wait for symptoms to worsen — liver damage progresses silently.
            </WarningBox>
          </Section>

          <Divider />

          {/* Look-alikes Comparison */}
          <Section>
            <H2>Similar Species (Look-Alikes Comparison)</H2>
            <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Feature', 'Death Cap (Amanita phalloides)', 'Edible Look-Alike'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Gills', 'White', 'Often pink or brown'],
                    ['Volva', 'Present', 'Usually absent'],
                    ['Ring', 'Present', 'May vary'],
                    ['Smell', 'Mild', 'Often pleasant'],
                    ['Risk', 'Deadly ☠️', 'Safe ✓'],
                  ].map(([feat, dc, edible], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{dc}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{edible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Common Confusions</H3>
            <ul>
              <li>Young <em>Agaricus</em> species</li>
              <li>Puffballs (when immature)</li>
              <li>Some edible field mushrooms</li>
            </ul>
          </Section>

          <Divider />

          {/* Benefits */}
          <Section>
            <H2>Benefits and Value</H2>
            <WarningBox>No Edible or Medicinal Benefits — the Death Cap has no safe consumption value.</WarningBox>

            <H3>Scientific Importance</H3>
            <ul>
              <li>Widely studied in toxicology and medicine</li>
              <li>Helps researchers understand liver toxicity mechanisms</li>
              <li>Important in mycology education and safety awareness</li>
            </ul>
          </Section>

          <Divider />

          {/* Pros & Cons */}
          <Section>
            <H2>Pros and Cons</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#22c55e' }}>Pros</h4>
                <ul className="space-y-2">
                  {['Scientifically valuable', 'Important for ecosystem balance', 'Educational importance in mycology'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Highly toxic — potentially fatal', 'Easy to misidentify with edible species', 'Responsible for most mushroom-related deaths worldwide'].map(c => (
                    <li key={c} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#ef4444' }}>✗</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

          {/* AI Identifier */}
          <Section>
            <H2>How Our Mushroom Identifier Helps Identify Death Cap</H2>
            <p className="mb-4">
              Our <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">AI mushroom species checker</Link> uses computer vision to analyze:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                'Cap color and shape',
                'Gill color (white detection)',
                'Stem structure',
                'Presence of ring and volva',
                'Habitat (forest + tree association)',
                'Seasonal context',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>→</span> {f}
                </div>
              ))}
            </div>
            <p>
              By combining these features, the system helps distinguish Death Cap from edible look-alikes,
              reducing risk. However, AI results should always be verified by an expert before any consumption decision.
            </p>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2>Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'How to identify a Death Cap mushroom?',
                  a: 'Look for white gills, a ring on the stem, and a volva at the base, along with a greenish cap. Always dig up the base to check for the cup-like volva — it is one of the most important identification features.',
                },
                {
                  q: 'Why is Amanita phalloides so dangerous?',
                  a: 'It contains amatoxins that damage the liver and can be fatal even in small amounts. Symptoms are delayed by 6–24 hours, meaning serious organ damage is already occurring before the person feels unwell.',
                },
                {
                  q: 'Where does Death Cap grow?',
                  a: 'It grows in forests near hardwood trees like oak, beech, and birch. It forms mycorrhizal relationships with tree roots and commonly appears in late summer and autumn.',
                },
                {
                  q: 'Can AI identify Death Cap?',
                  a: 'Yes, a mushroom identifier app can detect key features, but results must always be verified by an expert before any contact or consumption decision.',
                },
                {
                  q: 'What should I do if I suspect poisoning?',
                  a: 'Seek immediate medical help — do not wait for symptoms to worsen. If possible, bring a sample or photo of the mushroom for the medical team.',
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
            <H2>Final Thoughts</H2>
            <InfoBox>
              <p>
                The Death Cap (<em>Amanita phalloides</em>) is one of the most dangerous mushrooms on Earth. Its
                resemblance to edible species makes it especially risky for beginners. Understanding its cap, gills,
                stem, ring, and volva, along with habitat and seasonality, is critical for safe identification.
              </p>
              <p className="mt-3">
                Using a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">wild mushroom identification tool</Link> can help analyze features, but it should always be combined with expert
                knowledge. When it comes to wild mushrooms — <strong>if in doubt, do not touch or consume.</strong>
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/amanita-phalloides-death-cap" />

        </article>
      </div>
    </>
  )
}
