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
  title: 'Chlorophyllum molybdites (Poisonous Lawn Mushroom) – Identification Guide',
  description:
    'Chlorophyllum molybdites, commonly known as the poisonous lawn mushroom or green-spored parasol, is one of the most frequently ingested toxic mushrooms worldwide.',
  alternates: { canonical: 'https://mushroomidentifiers.com/chlorophyllum-molybdites' },
  openGraph: {
    title: 'Chlorophyllum molybdites (Poisonous Lawn Mushroom) – Identification Guide',
    description: 'Complete identification guide for Chlorophyllum molybdites (green-spored parasol). Learn key features, green spore print, toxicity, habitat, and how to distinguish it from edible parasol mushrooms.',
    url: 'https://mushroomidentifiers.com/chlorophyllum-molybdites',
    images: [{ url: 'https://mushroomidentifiers.com/chlorophyllum-molybdites-poisonous-lawn-mushroom-identification.webp', width: 820, height: 550, alt: 'Chlorophyllum molybdites poisonous lawn mushroom identification guide' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chlorophyllum molybdites (Poisonous Lawn Mushroom) – Identification Guide',
    description: 'Complete identification guide for Chlorophyllum molybdites — green spore print, toxicity, habitat, and how to distinguish from edible parasol mushrooms.',
    images: ['https://mushroomidentifiers.com/chlorophyllum-molybdites-poisonous-lawn-mushroom-identification.webp'],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Chlorophyllum molybdites (Poisonous Lawn Mushroom) – Identification, Symptoms & Lookalikes","description":"Learn to identify Chlorophyllum molybdites (poisonous lawn mushroom) with this complete guide. Explore key features, green spore print, toxicity, habitat, lookalikes, and safety tips.","image":"https://mushroomidentifiers.com/chlorophyllum-molybdites-poisonous-lawn-mushroom-identification.webp","author":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/chlorophyllum-molybdites"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is Chlorophyllum molybdites edible?","acceptedAnswer":{"@type":"Answer","text":"No, it is toxic and should never be consumed. It is one of the most commonly ingested poisonous mushrooms worldwide and causes severe gastrointestinal illness."}},{"@type":"Question","name":"Why is it called the poisonous lawn mushroom?","acceptedAnswer":{"@type":"Answer","text":"Because it commonly grows in lawns, gardens, parks, and golf courses, and frequently causes poisoning when mistaken for edible parasol mushrooms."}},{"@type":"Question","name":"How do you identify Chlorophyllum molybdites quickly?","acceptedAnswer":{"@type":"Answer","text":"Look for a green spore print (the most reliable feature), greenish gills at maturity, and a large parasol-like white cap with brown scales. It typically grows in lawns and grassy areas, often in fairy rings."}},{"@type":"Question","name":"Can Chlorophyllum molybdites kill you?","acceptedAnswer":{"@type":"Answer","text":"It is rarely fatal but causes severe gastrointestinal illness including intense nausea, vomiting, diarrhea, and abdominal pain. Symptoms typically appear 1–3 hours after ingestion."}},{"@type":"Question","name":"What should I do if I eat Chlorophyllum molybdites?","acceptedAnswer":{"@type":"Answer","text":"Seek medical attention immediately. If possible, bring a sample or photo of the mushroom to help medical professionals confirm the species and provide appropriate treatment."}},{"@type":"Question","name":"Can AI identify this mushroom?","acceptedAnswer":{"@type":"Answer","text":"Yes, AI mushroom identification tools can assist by analyzing cap shape, color, scales, and growth pattern. However, the green spore print — the most reliable identification feature — requires a physical test, so always verify AI results with expert knowledge."}}]}]}

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

export default function ChlorophyllumMolybditesPage() {
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
            <span>Chlorophyllum molybdites Poisonous Lawn Mushroom Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>Very High Misidentification Risk</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Chlorophyllum molybdites</em> (Poisonous Lawn Mushroom) &ndash; Identification, Symptoms &amp; Lookalikes
            </h1>
            <AuthorBlock updatedAt="Apr 11, 2026" />
            <LiveViewCount slug="/chlorophyllum-molybdites" className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Chlorophyllum molybdites</em>, commonly known as the poisonous lawn mushroom or green-spored
              parasol, is one of the most frequently ingested toxic mushrooms worldwide. It commonly grows in
              lawns, gardens, and parks, where it is often mistaken for edible parasol mushrooms. However, it
              causes severe gastrointestinal poisoning, making correct identification critical. The most reliable
              feature is its <strong>green spore print</strong> and greenish gills at maturity, which clearly
              distinguish it from edible lookalikes.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/chlorophyllum-molybdites-poisonous-lawn-mushroom-identification.webp"
                alt="Chlorophyllum molybdites poisonous lawn mushroom identification — white cap with brown scales"
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
                    ['Family', 'Agaricaceae'],
                    ['Genus', 'Chlorophyllum'],
                    ['Species', 'Chlorophyllum molybdites'],
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
              Closely related to other parasol-like mushrooms but differs in toxicity and spore color. The genus
              <em> Chlorophyllum</em> includes both edible and toxic species, making careful identification essential.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Essentials)</H2>

            <H3 id="cap">Cap Characteristics</H3>
            <ul>
              <li><strong>Color:</strong> White with brown scales</li>
              <li><strong>Shape:</strong> Egg-shaped when young, convex, then flattening with age</li>
              <li><strong>Size:</strong> 8–25 cm diameter</li>
              <li><strong>Surface:</strong> Scaly, often cracked in mature specimens</li>
            </ul>

            <H3 id="gills">Gills (Critical Feature)</H3>
            <ul>
              <li><strong>Young:</strong> Start white</li>
              <li><strong>Mature:</strong> Turn greenish as spores develop</li>
              <li><strong>Attachment:</strong> Free from the stem</li>
              <li><strong>Density:</strong> Crowded</li>
            </ul>
            <WarningBox>
              The greenish gills at maturity are a critical warning sign. If you see any green tint on the
              gills of a parasol-like mushroom, do not consume it.
            </WarningBox>

            <H3 id="stem">Stem (Stipe)</H3>
            <ul>
              <li><strong>Height:</strong> Tall (10–20 cm)</li>
              <li><strong>Color:</strong> White</li>
              <li><strong>Ring:</strong> Movable, skirt-like ring on upper stem</li>
              <li><strong>Base:</strong> Bulbous</li>
              <li><strong>Texture:</strong> Smooth to slightly fibrous</li>
            </ul>

            <H3 id="spore-print">Spore Print (Most Important ID Marker)</H3>
            <ul>
              <li><strong>Color:</strong> Green (unique and definitive identifier)</li>
              <li>No other common parasol-like mushroom produces a green spore print</li>
            </ul>
            <WarningBox>
              <strong>Always take a spore print</strong> when identifying any parasol-like mushroom. Place the cap
              gill-side down on white paper for several hours. A green spore print confirms <em>Chlorophyllum
              molybdites</em> and means the mushroom is toxic.
            </WarningBox>
          </Section>

          {/* Second Image — Green Spores */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/chlorophyllum-molybdites-green-spores.webp"
                alt="Chlorophyllum molybdites green spores — green-spored parasol showing distinctive spore color"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Green spores on mature Chlorophyllum molybdites. Photo: Amyls33, CC0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Smell, Taste & Texture */}
          <Section>
            <H2 id="smell-taste-texture">Smell, Taste &amp; Texture</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Smell', items: ['Mild, sometimes unpleasant', 'Not as distinctive as other toxic species'] },
                { title: 'Taste', items: ['Not recommended (toxic)', '⚠️ Never taste unknown mushrooms'] },
                { title: 'Texture', items: ['Soft cap flesh', 'Fibrous stem', 'Scaly cap surface'] },
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
                ['Cap Diameter', '8–25 cm'],
                ['Stem Height', '10–20 cm'],
                ['Stem Thickness', '1–3 cm'],
                ['Gills', 'Free, crowded'],
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
                { title: 'Habitat', items: ['Lawns and gardens', 'Parks and golf courses', 'Grassy open areas'] },
                { title: 'Seasonality', items: ['Summer to early autumn', 'Often appears after rainfall'] },
                { title: 'Growth Pattern', items: ['In groups or fairy rings', 'Scattered across grassy areas'] },
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
              {['United States (very common)', 'South America', 'India', 'Australia', 'Tropical & subtropical regions worldwide'].map(r => (
                <span key={r} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {r}
                </span>
              ))}
            </div>
          </Section>

          {/* Third Image — Fairy Ring / Habitat */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/chlorophyllum-molybdites-fairy-ring-lawn.webp"
                alt="Chlorophyllum molybdites fairy ring growing in suburban lawn — poisonous lawn mushroom habitat"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Fairy ring on a suburban lawn. Photo: Mrs skippy, Public Domain, via Wikimedia Commons
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
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Common cause of poisoning</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">🔴</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>High Toxicity</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Severe GI irritation</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#f59e0b15', border: '1px solid #f59e0b40' }}>
                <div className="text-2xl mb-1">🟠</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#f59e0b' }}>Low Fatality Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Rarely fatal, but very severe</div>
              </div>
            </div>

            <H3>Toxic Effects</H3>
            <p className="mb-3">Causes severe gastrointestinal irritation through toxic compounds in the flesh and spores.</p>

            <H3>Symptoms of Poisoning</H3>
            <ul>
              <li>Nausea and intense vomiting</li>
              <li>Severe diarrhea</li>
              <li>Abdominal pain and cramping</li>
              <li>Dehydration from fluid loss</li>
            </ul>

            <H3>Onset Time</H3>
            <p>Usually <strong>1–3 hours</strong> after ingestion.</p>
            <WarningBox>
              Symptoms can be intense but are rarely fatal. However, severe dehydration from prolonged vomiting
              and diarrhea can be dangerous, especially in children, the elderly, or immunocompromised individuals.
              Seek medical attention immediately if poisoning is suspected.
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
                    ['Toxicity', '🔴 High', '#ef4444'],
                    ['Fatality Risk', '🟠 Low', '#f59e0b'],
                    ['Misidentification Risk', '🔴 Very High', '#ef4444'],
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
                    {['Feature', 'Poisonous Lawn Mushroom', 'Parasol Mushroom (Edible)'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Spore Print', 'Green', 'White'],
                    ['Gills', 'Greenish (mature)', 'White'],
                    ['Toxicity', 'Poisonous ☠️', 'Edible ✓'],
                    ['Habitat', 'Lawns, grassy areas', 'Forest edges, meadows'],
                    ['Cap Size', '8–25 cm', '10–30 cm'],
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
              <li><em>Macrolepiota procera</em> (Parasol Mushroom) — edible, white spore print, found in forest edges</li>
              <li>Other <em>Chlorophyllum</em> species — some edible, some not; spore print is critical</li>
              <li>
                <Link href="/agaricus-campestris" style={{ color: 'var(--accent)' }} className="hover:underline">
                  <em>Agaricus campestris</em> (Field Mushroom)
                </Link> — edible, brown spore print, smaller cap
              </li>
            </ul>
            <WarningBox>
              <strong>Spore print color is the most reliable difference.</strong> Always take a spore print when
              identifying any large parasol-like mushroom found growing in lawns or grassy areas.
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
                  <li>Saprotrophic fungus</li>
                  <li>Breaks down organic matter in soil</li>
                  <li>Supports nutrient recycling in grasslands</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Life Cycle</h4>
                <ul>
                  <li>Spores released into the environment</li>
                  <li>Mycelium develops underground</li>
                  <li>Fruiting bodies appear after rain</li>
                  <li>Spores disperse through wind</li>
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
                  <li>Helps recycle organic nutrients</li>
                  <li>Supports soil health in grasslands</li>
                  <li>Part of the natural decomposition cycle</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Economic Value</h4>
                <ul>
                  <li>No edible value (toxic)</li>
                  <li>Important in toxicology studies</li>
                  <li>Widely used in mycology education</li>
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
                  {['Easy to study due to abundance', 'Plays a role in ecosystem health', 'Distinctive green spore print aids identification'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Highly toxic — causes severe illness', 'Frequently mistaken for edible mushrooms', 'Common in residential areas (higher risk exposure)'].map(c => (
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
            <H2 id="safe-identification">How to Identify Chlorophyllum molybdites Safely</H2>
            <div className="space-y-3 mb-5">
              {[
                'Look for a large white cap with brown scales — parasol-like shape',
                'Check gills carefully — white when young, turning greenish at maturity',
                'Take a spore print — place cap gill-side down on white paper for a few hours; green = toxic',
                'Observe growth location — lawns, gardens, parks, and grassy areas are typical habitats',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{i + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</span>
                </div>
              ))}
            </div>
            <p>
              For extra safety, use a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
              or AI{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identification app</Link> to
              confirm species before handling or studying further. Always verify AI results with a physical spore print test.
            </p>

            <H3>Expert Identification Tips</H3>
            <ul>
              <li>Always confirm with a spore print — it is the single most reliable test</li>
              <li>Avoid relying only on appearance — many edible parasols look nearly identical</li>
              <li>Check habitat carefully — lawns vs forests can narrow down the species</li>
              <li>Compare multiple features before deciding</li>
            </ul>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2 id="faq">Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is Chlorophyllum molybdites edible?',
                  a: 'No, it is toxic and should never be consumed. It is one of the most commonly ingested poisonous mushrooms worldwide and causes severe gastrointestinal illness.',
                },
                {
                  q: 'Why is it called the poisonous lawn mushroom?',
                  a: 'Because it commonly grows in lawns, gardens, parks, and golf courses, and frequently causes poisoning when mistaken for edible parasol mushrooms.',
                },
                {
                  q: 'How do you identify it quickly?',
                  a: 'Look for a green spore print (the most reliable feature), greenish gills at maturity, and a large parasol-like white cap with brown scales. It typically grows in lawns and grassy areas, often in fairy rings.',
                },
                {
                  q: 'Can it kill you?',
                  a: 'It is rarely fatal but causes severe gastrointestinal illness including intense nausea, vomiting, diarrhea, and abdominal pain. Symptoms typically appear 1–3 hours after ingestion.',
                },
                {
                  q: 'What should I do if I eat it?',
                  a: 'Seek medical attention immediately. If possible, bring a sample or photo of the mushroom to help medical professionals confirm the species and provide appropriate treatment.',
                },
                {
                  q: 'Can AI identify this mushroom?',
                  a: 'Yes, AI mushroom identification tools can assist by analyzing cap shape, color, scales, and growth pattern. However, the green spore print requires a physical test, so always verify AI results with expert knowledge.',
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
                <em>Chlorophyllum molybdites</em> is one of the most commonly encountered toxic mushrooms in
                everyday environments. Its resemblance to edible parasol mushrooms makes it especially dangerous
                for beginners.
              </p>
              <p className="mt-3">
                Understanding its <strong>green spore print</strong>, habitat, and growth pattern is essential for
                safe identification. Combining field knowledge with a reliable{' '}
                <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
                can help prevent misidentification and ensure safer foraging practices.
              </p>
              <p className="mt-3">
                Learn more about{' '}
                <Link href="/mushroom-parts-explained" style={{ color: 'var(--accent)' }} className="hover:underline">
                  mushroom anatomy and identification features
                </Link>{' '}
                to build your knowledge, or explore our guide on{' '}
                <Link href="/why-are-mushrooms-growing-in-my-yard" style={{ color: 'var(--accent)' }} className="hover:underline">
                  why mushrooms grow in your yard
                </Link>{' '}
                to understand lawn mushroom growth patterns.
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/chlorophyllum-molybdites" />
          <ViewTracker slug="/chlorophyllum-molybdites" />
              <BlogComments slug="/chlorophyllum-molybdites" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
