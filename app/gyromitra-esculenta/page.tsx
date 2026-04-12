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
  title: 'Gyromitra esculenta (False Morel) - Identification Guide | Mushroom Identifier',
  description:
    'Gyromitra esculenta, commonly known as the false morel, is a highly controversial wild mushroom that resembles edible morels but contains dangerous toxins. Learn identification, toxicity, habitat, and how to tell it apart from true morels.',
  alternates: { canonical: 'https://mushroomidentifiers.com/gyromitra-esculenta' },
  openGraph: {
    title: 'Gyromitra esculenta (False Morel) - Identification Guide',
    description: 'Complete identification guide for Gyromitra esculenta (false morel). Learn key features, toxicity, habitat, and how to distinguish it from true morels.',
    url: 'https://mushroomidentifiers.com/gyromitra-esculenta',
    images: [{ url: 'https://mushroomidentifiers.com/gyromitra-esculenta-false-morel-identification.webp', width: 820, height: 550, alt: 'Gyromitra esculenta false morel identification guide' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gyromitra esculenta (False Morel) - Identification Guide',
    description: 'Complete identification guide for Gyromitra esculenta — features, toxicity, habitat, and how to distinguish from true morels.',
    images: ['https://mushroomidentifiers.com/gyromitra-esculenta-false-morel-identification.webp'],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Gyromitra esculenta (False Morel): Identification, Toxicity, Habitat & Safety Guide","description":"Learn to identify Gyromitra esculenta (false morel) with this complete guide. Explore key features, toxicity, habitat, look-alikes, and how to distinguish it from true morels.","author":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/gyromitra-esculenta"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is Gyromitra esculenta poisonous?","acceptedAnswer":{"@type":"Answer","text":"Yes. Gyromitra esculenta contains gyromitrin, which converts to monomethylhydrazine (MMH) in the body. This compound can cause severe liver damage and has been linked to fatalities. It should not be eaten raw under any circumstances."}},{"@type":"Question","name":"How to tell false morel from true morel?","acceptedAnswer":{"@type":"Answer","text":"True morels (Morchella) have a uniformly pitted, honeycomb-like cap that is completely hollow inside. False morels (Gyromitra) have an irregularly wrinkled, brain-like cap that is chambered inside rather than fully hollow. Cutting the mushroom in half is the most reliable way to tell them apart."}},{"@type":"Question","name":"Where does Gyromitra esculenta grow?","acceptedAnswer":{"@type":"Answer","text":"Gyromitra esculenta grows in coniferous and mixed forests, often near pine, spruce, and fir trees. It prefers sandy or disturbed soils and appears in spring, often at the same time as true morels."}},{"@type":"Question","name":"Can you eat false morels after cooking?","acceptedAnswer":{"@type":"Answer","text":"In some Nordic and Eastern European countries, Gyromitra esculenta is consumed after repeated parboiling and drying, which reduces but does not eliminate gyromitrin. However, this practice is considered risky and is not recommended, as toxic residues may remain and individual sensitivity varies."}},{"@type":"Question","name":"Can AI identify Gyromitra esculenta?","acceptedAnswer":{"@type":"Answer","text":"A mushroom identifier app can detect the brain-like cap shape, color, and growth pattern of Gyromitra esculenta. However, AI results should always be treated as a research aid and not as final safety confirmation — expert verification is essential."}},{"@type":"Question","name":"What are the symptoms of Gyromitra poisoning?","acceptedAnswer":{"@type":"Answer","text":"Symptoms typically appear 6–12 hours after ingestion and include nausea, vomiting, abdominal pain, diarrhea, dizziness, and fatigue. In severe cases, liver and kidney damage can occur, potentially leading to death."}},{"@type":"Question","name":"Why is Gyromitra esculenta called false morel?","acceptedAnswer":{"@type":"Answer","text":"It is called false morel because its wrinkled, irregular cap superficially resembles true morels (Morchella species). However, its brain-like shape, chambered interior, and dangerous toxin content make it fundamentally different from the edible true morel."}}]}]}

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

export default function GyromitraEsculentaPage() {
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
            <span>Gyromitra esculenta False Morel Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Deadly</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Gyromitra esculenta</em> (False Morel): Identification, Toxicity, Habitat &amp; Safety Guide
            </h1>
            <AuthorBlock updatedAt="Apr 11, 2026" />
            <LiveViewCount slug="/gyromitra-esculenta" className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Gyromitra esculenta</em>, commonly known as the false morel, is a highly controversial wild
              mushroom that superficially resembles edible true morels but contains dangerous toxins. Found in
              spring across coniferous forests in the Northern Hemisphere, this species is responsible for serious
              poisonings and fatalities. Accurate identification is essential to avoid confusing it with the prized{' '}
              <Link href="/morchella-esculenta" style={{ color: 'var(--accent)' }} className="hover:underline">true morel (<em>Morchella esculenta</em>)</Link>.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/gyromitra-esculenta-false-morel-identification.webp"
                alt="Gyromitra esculenta false morel identification — brain-like wrinkled cap in forest setting"
                width={820}
                height={550}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Photo: Lebrac, CC BY-SA 3.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          <TableOfContents />

          {/* Quick ID Summary */}
          <Section>
            <H2 id="quick-id-summary">Quick Identification Summary</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Scientific Name', 'Gyromitra esculenta'],
                ['Common Names', 'False Morel, Brain Mushroom, Turban Fungus'],
                ['Category', 'Toxic / Controversial Mushrooms'],
                ['Risk Level', '🔴 Toxic — Potentially Deadly'],
                ['Edibility', 'Poisonous (contains gyromitrin)'],
                ['Key Features', 'Brain-like wrinkled cap, chambered interior, brittle whitish stem'],
                ['Found In', 'Coniferous forests, sandy soils, disturbed ground near pine and spruce'],
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
                    ['Division', 'Ascomycota'],
                    ['Class', 'Pezizomycetes'],
                    ['Order', 'Pezizales'],
                    ['Family', 'Discinaceae'],
                    ['Genus', 'Gyromitra'],
                    ['Species', 'Gyromitra esculenta'],
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
              Unlike true morels which belong to Morchellaceae (Ascomycota), Gyromitra esculenta belongs to the
              Discinaceae family. Despite the species name &ldquo;esculenta&rdquo; meaning &ldquo;edible,&rdquo; this mushroom is toxic and
              should be treated with extreme caution.
            </p>
          </Section>

          <Divider />

          {/* Dimensions */}
          <Section>
            <H2 id="dimensions">Dimensions</H2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Cap Width', '3–12 cm'],
                ['Cap Height', '3–8 cm'],
                ['Stem Height', '3–7 cm'],
                ['Stem Thickness', '2–4 cm'],
              ].map(([label, val]) => (
                <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-lg font-bold mb-1" style={{ color: 'var(--accent)' }}>{val}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4">
              The false morel is a medium-sized mushroom with a disproportionately large, irregularly shaped cap
              sitting on a relatively short, stout stem. Its unusual proportions and brain-like appearance make
              it visually distinctive once you know what to look for.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Characteristics)</H2>

            <H3 id="cap">Cap (Pileus)</H3>
            <ul>
              <li><strong>Shape:</strong> Irregularly wrinkled, lobed, and brain-like</li>
              <li><strong>Color:</strong> Reddish-brown to dark brown, sometimes yellowish-brown</li>
              <li><strong>Surface:</strong> Deeply convoluted with folds and ridges, not pitted like true morels</li>
              <li><strong>Attachment:</strong> Attached to stem at several points, not fused at the base like morels</li>
            </ul>
            <p className="mt-2">The wrinkled, brain-like cap is the most distinctive feature and the key to distinguishing it from the honeycomb-patterned true morel.</p>

            <H3 id="interior">Interior (Cross-Section)</H3>
            <ul>
              <li><strong>Structure:</strong> Chambered with cottony tissue inside</li>
              <li><strong>Not hollow:</strong> Unlike true morels, which are completely hollow when cut in half</li>
            </ul>
            <WarningBox>
              The most reliable way to tell a false morel from a true morel is to cut it in half lengthwise.
              True morels are completely hollow inside; false morels have chambered, cottony tissue.
            </WarningBox>

            <H3 id="stem">Stem (Stipe)</H3>
            <ul>
              <li><strong>Color:</strong> Whitish to pale cream</li>
              <li><strong>Structure:</strong> Thick, irregularly shaped, often grooved or folded</li>
              <li><strong>Texture:</strong> Brittle, sometimes chambered inside</li>
            </ul>

            <H3 id="spores">Spore Print</H3>
            <ul>
              <li><strong>Color:</strong> Cream to pale yellow</li>
              <li><strong>Shape:</strong> Elliptical with two oil droplets</li>
            </ul>
          </Section>

          {/* Second Image */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/gyromitra-esculenta-brain-like-cap.webp"
                alt="Gyromitra esculenta brain-like wrinkled cap close-up showing convoluted surface texture"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Close-up of Gyromitra esculenta showing brain-like cap. Photo: Lukas, CC BY-SA 2.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


          {/* Color, Smell, Taste */}
          <Section>
            <H2 id="color-smell-taste">Color, Smell, and Taste</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Color', items: ['Cap: Reddish-brown to dark brown', 'Stem: Whitish to pale cream', 'Interior: Whitish with chambered tissue'] },
                { title: 'Smell', items: ['Pleasant, mushroom-like aroma', 'Some describe a faintly fruity scent'] },
                { title: 'Taste', items: ['Mild when raw', '⚠️ Do not taste — contains toxic gyromitrin'] },
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
                  <li>Grows solitary or in small groups</li>
                  <li>Often found on or near decaying wood</li>
                  <li>Prefers sandy, disturbed soils</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Seasonality</h4>
                <ul>
                  <li>Spring (March–May in Northern Hemisphere)</li>
                  <li>Appears at the same time as true morels</li>
                  <li>Fruiting triggered by warming soil temperatures</li>
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

          {/* Habitat */}
          <Section>
            <H2 id="habitat">Habitat, Environment &amp; Distribution</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { title: 'Habitat', items: ['Coniferous and mixed forests', 'Disturbed ground, roadsides, burn sites'] },
                { title: 'Environment', items: ['Sandy or gravelly soil', 'Near decaying wood or stumps'] },
                { title: 'Tree Association', items: ['Pine', 'Spruce', 'Fir', 'Occasionally hardwoods'] },
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
            <ul>
              <li>Widespread across Europe (especially Nordic countries, Eastern Europe)</li>
              <li>Common in North America (northern states, Canada)</li>
              <li>Found in parts of Asia (Turkey, Iran)</li>
            </ul>
            <p className="mt-2">
              Gyromitra esculenta is one of the most commonly encountered spring fungi in boreal and temperate coniferous forests.
            </p>
          </Section>

          {/* Third Image */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/gyromitra-esculenta-habitat-forest.webp"
                alt="Gyromitra esculenta growing in natural forest habitat near coniferous trees in Estonia"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Gyromitra esculenta in natural habitat. Photo: Marko Vainu, CC BY-SA 4.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Edibility & Risk */}
          <Section>
            <H2 id="edibility-safety">Edibility, Safety &amp; Risk Level</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">❌</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Not Edible (Raw)</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Contains gyromitrin toxin</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">🔴</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>High Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Fatalities documented</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">☠️</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Gyromitrin (MMH)</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Damages liver &amp; kidneys</div>
              </div>
            </div>

            <H3>Toxicity</H3>
            <p className="mb-3">Contains gyromitrin, which is converted to monomethylhydrazine (MMH) in the body:</p>
            <ul>
              <li>MMH is a known carcinogen and organ toxin</li>
              <li>Damages the liver, kidneys, and central nervous system</li>
              <li>Toxic levels vary between individual mushrooms and regions</li>
              <li>Even vapors from cooking raw specimens can be harmful</li>
            </ul>

            <H3>Symptoms of Poisoning</H3>
            <ul>
              <li>Onset: 6–12 hours after ingestion</li>
              <li>Nausea, vomiting, severe abdominal pain, diarrhea</li>
              <li>Dizziness, headache, fatigue</li>
              <li>In severe cases: jaundice, liver failure, kidney failure, death</li>
            </ul>
            <WarningBox>
              <strong>Seek emergency medical help immediately</strong> if you suspect Gyromitra poisoning. Delayed
              symptoms mean organ damage may already be progressing before you feel seriously ill.
            </WarningBox>

            <H3>Cultural Consumption Controversy</H3>
            <p className="mb-3">
              In Finland, Sweden, and parts of Eastern Europe, Gyromitra esculenta is traditionally consumed after
              repeated parboiling (boiling in large volumes of water, discarding the water each time) or prolonged
              drying. This reduces but does not fully eliminate gyromitrin.
            </p>
            <WarningBox>
              Even after traditional preparation, toxic residues may remain. Individual sensitivity varies widely,
              and cumulative exposure may increase risk. This practice is strongly discouraged by most mycological
              societies and health authorities.
            </WarningBox>
          </Section>

          <Divider />

          {/* Look-alikes Comparison */}
          <Section>
            <H2 id="look-alikes">Similar Species (Look-Alikes Comparison)</H2>
            <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Feature', 'Gyromitra esculenta (False Morel)', 'Morchella esculenta (True Morel)'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Cap Shape', 'Brain-like, irregularly wrinkled', 'Honeycomb pattern with uniform pits'],
                    ['Interior', 'Chambered, cottony tissue', 'Completely hollow'],
                    ['Cap Color', 'Reddish-brown to dark brown', 'Yellowish-brown to gray-brown'],
                    ['Cap Attachment', 'Attached at multiple points', 'Fused to stem at base'],
                    ['Stem', 'Short, thick, sometimes grooved', 'Smooth to granular, evenly shaped'],
                    ['Risk', 'Toxic ☠️', 'Edible ✓ (when cooked)'],
                  ].map(([feat, gyr, mor], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{gyr}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{mor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Other Gyromitra Species</H3>
            <ul>
              <li><strong>Gyromitra infula</strong> — saddle-shaped cap, found in autumn on decaying wood</li>
              <li><strong>Gyromitra gigas</strong> — larger, paler, found near snowmelt areas</li>
              <li><strong>Verpa bohemica</strong> — cap hangs freely like a thimble, different from Gyromitra</li>
            </ul>
          </Section>

          <Divider />

          {/* Benefits */}
          <Section>
            <H2 id="benefits">Benefits and Value</H2>
            <WarningBox>No safe edible or medicinal value — Gyromitra esculenta should not be consumed without expert guidance and carries significant risk even after preparation.</WarningBox>

            <H3>Scientific Importance</H3>
            <ul>
              <li>Extensively studied in toxicology for its unique gyromitrin compound</li>
              <li>Research into MMH has applications in pharmaceutical and industrial chemistry</li>
              <li>Important in mycology education for teaching the concept of toxic look-alikes</li>
              <li>Plays an ecological role in forest decomposition cycles</li>
            </ul>
          </Section>

          <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


          {/* Pros & Cons */}
          <Section>
            <H2 id="pros-cons">Pros and Cons</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#22c55e' }}>Pros</h4>
                <ul className="space-y-2">
                  {['Scientifically valuable for toxicology research', 'Important in forest ecosystem decomposition', 'Educational value — teaches look-alike awareness', 'Cultural significance in Nordic cuisine traditions'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Toxic — contains carcinogenic gyromitrin (MMH)', 'Easily confused with edible true morels', 'Even cooking vapors can cause poisoning', 'Responsible for serious poisonings and fatalities', 'Traditional preparation does not fully eliminate toxins'].map(c => (
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
            <H2 id="ai-identification">How Our Mushroom Identifier Helps Identify False Morel</H2>
            <p className="mb-4">
              Our <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> uses
              AI-powered image recognition to analyze:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                'Brain-like cap shape',
                'Cap color and texture',
                'Wrinkled vs. pitted surface',
                'Stem structure and color',
                'Growth habitat context',
                'Seasonal timing',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>→</span> {f}
                </div>
              ))}
            </div>
            <p className="mb-4">
              By combining these visual features, the system helps distinguish false morels from
              true morels, reducing the risk of dangerous misidentification. For best results,
              upload a clear photo showing the cap surface and a cross-section if available.
            </p>
            <p>
              Try our <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">free mushroom identifier by photo</Link> to
              analyze any mushroom you find — but always verify AI results with an expert before making any consumption decision.
            </p>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2 id="faq">Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is Gyromitra esculenta poisonous?',
                  a: 'Yes. Gyromitra esculenta contains gyromitrin, which converts to monomethylhydrazine (MMH) in the body. This compound can cause severe liver damage and has been linked to fatalities. It should not be eaten raw under any circumstances.',
                },
                {
                  q: 'How to tell false morel from true morel?',
                  a: 'True morels (Morchella) have a uniformly pitted, honeycomb-like cap that is completely hollow inside. False morels (Gyromitra) have an irregularly wrinkled, brain-like cap that is chambered inside rather than fully hollow. Cutting the mushroom in half is the most reliable way to tell them apart.',
                },
                {
                  q: 'Where does Gyromitra esculenta grow?',
                  a: 'It grows in coniferous and mixed forests, often near pine, spruce, and fir trees. It prefers sandy or disturbed soils and appears in spring, often at the same time as true morels.',
                },
                {
                  q: 'Can you eat false morels after cooking?',
                  a: 'In some Nordic and Eastern European countries, it is consumed after repeated parboiling or drying. However, this practice is considered risky — toxic residues may remain and individual sensitivity varies. Most health authorities advise against consumption.',
                },
                {
                  q: 'What are the symptoms of Gyromitra poisoning?',
                  a: 'Symptoms typically appear 6–12 hours after ingestion and include nausea, vomiting, abdominal pain, diarrhea, dizziness, and fatigue. In severe cases, liver and kidney damage can occur, potentially leading to death.',
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

          {/* Interlinking Section */}
          <Section>
            <H2 id="related-guides">Related Mushroom Guides</H2>
            <p className="mb-4">
              Explore more species identification guides to build your knowledge:
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/morchella-esculenta" style={{ color: 'var(--accent)' }} className="hover:underline">
                  Morchella esculenta (True Morel) — Identification &amp; Edibility Guide
                </Link>{' '}
                — Learn the key differences between true morels and false morels
              </li>
              <li>
                <Link href="/mushroom-parts-explained" style={{ color: 'var(--accent)' }} className="hover:underline">
                  Mushroom Parts Explained — Cap, Gills, Stem &amp; More
                </Link>{' '}
                — Understand the anatomy that makes identification possible
              </li>
              <li>
                <Link href="/mushroom-identifier-book" style={{ color: 'var(--accent)' }} className="hover:underline">
                  Best Mushroom Identification Books
                </Link>{' '}
                — Recommended field guides for foragers
              </li>
            </ul>
          </Section>

          <Divider />

          {/* Final Thoughts */}
          <Section>
            <H2 id="final-thoughts">Final Thoughts</H2>
            <InfoBox>
              <p>
                <em>Gyromitra esculenta</em> (false morel) is one of the most dangerous spring mushrooms due to
                its resemblance to the highly prized true morel. Its brain-like cap, chambered interior, and
                presence of gyromitrin toxin set it apart from the honeycomb-patterned, hollow true morel.
                Understanding these differences is critical for anyone foraging in spring.
              </p>
              <p className="mt-3">
                Using a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier tool</Link> can
                help analyze features, but it should always be combined with expert knowledge and the
                simple cross-section test. When it comes to wild mushrooms — <strong>if in doubt, do not touch or consume.</strong>
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/gyromitra-esculenta" />
          <ViewTracker slug="/gyromitra-esculenta" />
              <BlogComments slug="/gyromitra-esculenta" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
