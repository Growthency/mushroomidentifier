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
  title: 'Agaricus xanthodermus (Yellow Stainer Mushroom) – Identification Guide',
  description:
    'Agaricus xanthodermus, commonly called the yellow stainer, is a widespread toxic mushroom often mistaken for edible species in the same genus, such as Agaricus bisporus.',
  alternates: { canonical: 'https://mushroomidentifiers.com/agaricus-xanthodermus' },
  openGraph: {
    title: 'Agaricus xanthodermus (Yellow Stainer Mushroom) – Identification Guide',
    description: 'Complete identification guide for Agaricus xanthodermus (yellow stainer). Learn key features, toxicity, yellow staining reaction, habitat, and how to distinguish it from edible Agaricus species.',
    url: 'https://mushroomidentifiers.com/agaricus-xanthodermus',
    images: [{ url: 'https://mushroomidentifiers.com/agaricus-xanthodermus-yellow-stainer-identification.webp', width: 820, height: 550, alt: 'Agaricus xanthodermus yellow stainer mushroom identification guide' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agaricus xanthodermus (Yellow Stainer Mushroom) – Identification Guide',
    description: 'Complete identification guide for Agaricus xanthodermus — features, toxicity, yellow staining reaction, and how to distinguish from edible Agaricus species.',
    images: ['https://mushroomidentifiers.com/agaricus-xanthodermus-yellow-stainer-identification.webp'],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Agaricus xanthodermus (Yellow Stainer Mushroom) – Identification, Toxicity & Lookalikes","description":"Learn to identify Agaricus xanthodermus (yellow stainer) with this complete guide. Explore key features, yellow staining reaction, toxicity, habitat, lookalikes, and safety tips.","image":"https://mushroomidentifiers.com/agaricus-xanthodermus-yellow-stainer-identification.webp","author":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/agaricus-xanthodermus"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is Agaricus xanthodermus edible?","acceptedAnswer":{"@type":"Answer","text":"No, it is toxic and causes gastrointestinal distress including nausea, vomiting, abdominal cramps, and diarrhea. It should not be consumed."}},{"@type":"Question","name":"What does the yellow stainer smell like?","acceptedAnswer":{"@type":"Answer","text":"It has a strong chemical or phenol-like smell, similar to ink or disinfectant. This unpleasant odor becomes more pronounced when the flesh is cut or cooked."}},{"@type":"Question","name":"How do I know if my mushroom is a yellow stainer?","acceptedAnswer":{"@type":"Answer","text":"Look for bright yellow staining when the cap or stem base is bruised or cut, a strong chemical or phenol-like smell, and a white cap with gills that change from pink to chocolate brown. These three features together confirm yellow stainer identification."}},{"@type":"Question","name":"Can Agaricus xanthodermus kill you?","acceptedAnswer":{"@type":"Answer","text":"It is rarely fatal but can cause severe gastrointestinal discomfort and illness. Symptoms usually appear within 30 minutes to 2 hours after ingestion."}},{"@type":"Question","name":"Where is Agaricus xanthodermus commonly found?","acceptedAnswer":{"@type":"Answer","text":"It is found worldwide in lawns, gardens, parks, and woodland edges. It is especially common in Europe, North America, and Australia, fruiting in late summer to autumn."}},{"@type":"Question","name":"Can AI identify this mushroom?","acceptedAnswer":{"@type":"Answer","text":"Yes, AI mushroom identification tools can help detect the yellow stainer from images by analyzing cap shape, color, and staining patterns. However, AI results should always be verified with expert knowledge, especially since the yellow staining reaction may not always be visible in photos."}}]}]}

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

export default function AgaricusXanthodermusPage() {
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
            <span>Agaricus xanthodermus Yellow Stainer Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>High Misidentification Risk</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Agaricus xanthodermus</em> (Yellow Stainer Mushroom) &ndash; Identification, Toxicity &amp; Lookalikes
            </h1>
            <AuthorBlock updatedAt="Apr 11, 2026" />
            <LiveViewCount slug="/agaricus-xanthodermus" className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Agaricus xanthodermus</em>, commonly called the yellow stainer, is a widespread toxic mushroom
              often mistaken for edible species in the same genus, such as <em>Agaricus bisporus</em>. It is known
              for its rapid yellow staining when bruised or cut and a distinct chemical or phenol-like smell.
              Found in gardens, parks, and woodland edges, this species frequently causes gastrointestinal
              poisoning when accidentally consumed.
            </p>
            <p className="text-base leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
              If your goal is to identify this mushroom safely, focus on yellow staining at the base, unpleasant
              odor, and habitat patterns. For beginners and even experienced foragers, using a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
              or AI <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identification app</Link> can
              significantly reduce misidentification risks and improve accuracy in the field.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/agaricus-xanthodermus-yellow-stainer-identification.webp"
                alt="Agaricus xanthodermus yellow stainer mushroom identification — white cap specimen in forest"
                width={820}
                height={550}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Photo: James K. Lindsey, CC BY-SA 3.0, via Wikimedia Commons
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
                    ['Genus', 'Agaricus'],
                    ['Species', 'Agaricus xanthodermus'],
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
              Part of the <em>Agaricus</em> genus, which includes both edible and toxic species. The yellow stainer
              is one of the most commonly encountered toxic members of this genus, making it particularly important
              to learn for anyone foraging for edible <em>Agaricus</em> species like the field mushroom or button mushroom.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Essentials)</H2>

            <H3 id="cap">Cap Characteristics</H3>
            <ul>
              <li><strong>Color:</strong> White to off-white</li>
              <li><strong>Shape:</strong> Convex when young, flattening with age</li>
              <li><strong>Surface:</strong> Smooth, sometimes slightly scaly</li>
              <li><strong>Size:</strong> 5–15 cm diameter</li>
            </ul>

            <H3 id="yellow-staining">Yellow Staining Reaction (Critical ID Feature)</H3>
            <p className="mb-3">Bright yellow staining appears:</p>
            <ul>
              <li>At the base of the stem when cut or scratched</li>
              <li>On cap edges when bruised</li>
              <li>Fades to brown over time</li>
            </ul>
            <WarningBox>
              The yellow staining reaction is the single most important identification feature. Always bruise
              the base of the stem when checking any white <em>Agaricus</em> mushroom — bright chrome-yellow
              staining is a clear warning sign.
            </WarningBox>

            <H3 id="stem">Stem (Stipe)</H3>
            <ul>
              <li><strong>Color:</strong> White, firm, cylindrical</li>
              <li><strong>Base:</strong> Enlarged, bulb-like</li>
              <li><strong>Staining:</strong> Often shows strong yellow staining when cut at the base</li>
            </ul>

            <H3 id="gills">Gills</H3>
            <ul>
              <li><strong>Attachment:</strong> Free from stem</li>
              <li><strong>Color progression:</strong> Pink when young, changing to chocolate brown as spores mature</li>
              <li><strong>Density:</strong> Crowded</li>
            </ul>
          </Section>

          {/* Second Image — Yellow Staining */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/yellow-stainer-mushroom-staining-reaction.webp"
                alt="Yellow stainer mushroom staining reaction — bright yellow discoloration when cut open"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Yellow staining reaction when cut. Photo: frankenstoen, CC BY 2.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Smell, Taste & Texture */}
          <Section>
            <H2 id="smell-taste-texture">Smell, Taste &amp; Texture</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Smell', items: ['Strong phenol or antiseptic odor', 'Chemical, ink-like scent', 'More pronounced when cooked'] },
                { title: 'Taste', items: ['Not recommended (toxic)', '⚠️ Do not taste — causes illness'] },
                { title: 'Texture', items: ['Firm flesh', 'Slightly fibrous stem', 'Smooth cap surface'] },
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
            <WarningBox>
              The chemical smell is one of the easiest ways to identify the yellow stainer. If a white <em>Agaricus</em> mushroom
              smells like phenol, ink, or disinfectant instead of a pleasant mushroom aroma — do not eat it.
            </WarningBox>
          </Section>

          <Divider />

          {/* Dimensions */}
          <Section>
            <H2 id="dimensions">Physical Dimensions &amp; Structure</H2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Cap Diameter', '5–15 cm'],
                ['Stem Height', '5–12 cm'],
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
                { title: 'Habitat', items: ['Lawns and gardens', 'Parks and roadsides', 'Woodland edges'] },
                { title: 'Seasonality', items: ['Late summer to autumn', 'Appears after rain periods'] },
                { title: 'Growth Pattern', items: ['Singly or in groups', 'Sometimes in fairy rings'] },
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
              {['United Kingdom', 'United States', 'Australia', 'Europe', 'Widely distributed globally'].map(r => (
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
                src="/agaricus-xanthodermus-habitat-lawn.webp"
                alt="Agaricus xanthodermus growing in lawn habitat — young yellow stainer specimens in grass"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Young Agaricus xanthodermus specimens in grass. Photo: frankenstoen, CC BY 2.0, via Wikimedia Commons
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
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Causes gastrointestinal illness</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">🔴</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Moderate–High Toxicity</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Phenolic compounds</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#f59e0b15', border: '1px solid #f59e0b40' }}>
                <div className="text-2xl mb-1">🟠</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#f59e0b' }}>Low Fatality Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Rarely fatal, but very unpleasant</div>
              </div>
            </div>

            <H3>Toxic Compounds</H3>
            <p className="mb-3">Contains phenolic compounds that cause gastrointestinal irritation and distress.</p>

            <H3>Symptoms of Poisoning</H3>
            <ul>
              <li>Nausea and vomiting</li>
              <li>Abdominal cramps</li>
              <li>Diarrhea</li>
              <li>General discomfort and sweating</li>
            </ul>

            <H3>Onset Time</H3>
            <p>Usually within <strong>30 minutes to 2 hours</strong> after ingestion.</p>
            <WarningBox>
              Not typically fatal, but highly unpleasant and can be severe in sensitive individuals.
              If you suspect poisoning, seek medical attention and bring a sample of the mushroom if possible.
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
                    {['Feature', 'Yellow Stainer (A. xanthodermus)', 'Edible Agaricus (e.g., Button Mushroom)'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Smell', 'Chemical / phenol', 'Pleasant, mushroom-like'],
                    ['Staining', 'Bright yellow', 'Minimal or none'],
                    ['Habitat', 'Lawns, disturbed soil', 'Cultivated or natural fields'],
                    ['Cap Color', 'White to off-white', 'White to brown'],
                    ['Toxicity', 'Toxic ☠️', 'Edible ✓'],
                  ].map(([feat, ys, edible], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{ys}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{edible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Common Confused Species</H3>
            <ul>
              <li>
                <Link href="/agaricus-campestris" style={{ color: 'var(--accent)' }} className="hover:underline">
                  <em>Agaricus campestris</em> (Field Mushroom)
                </Link> — edible, lacks yellow staining and chemical smell
              </li>
              <li><em>Agaricus bisporus</em> (Button Mushroom / Portobello) — edible, commercially cultivated, no yellow staining</li>
              <li>
                <Link href="/agaricus-arvensis-horse-mushroom" style={{ color: 'var(--accent)' }} className="hover:underline">
                  <em>Agaricus arvensis</em> (Horse Mushroom)
                </Link> — edible, may show slight yellowing but smells of anise, not phenol
              </li>
            </ul>
            <WarningBox>
              The yellow staining + phenol smell clearly separates the yellow stainer from all edible <em>Agaricus</em> species.
              Always check both features before consuming any white <em>Agaricus</em> mushroom.
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
                  <li>Saprotrophic (decomposes organic matter)</li>
                  <li>Plays a role in soil nutrient recycling</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Life Cycle</h4>
                <ul>
                  <li>Spore release from mature gills</li>
                  <li>Mycelium growth in soil</li>
                  <li>Fruiting body appears in favorable conditions</li>
                  <li>Spore dispersal by wind</li>
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
                  <li>Helps break down organic matter</li>
                  <li>Supports soil ecosystems</li>
                  <li>Part of the natural nutrient cycle</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Economic Value</h4>
                <ul>
                  <li>No culinary value (toxic)</li>
                  <li>Occasionally studied for fungal biology</li>
                  <li>Important in mycology education</li>
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
                  {['Easy to identify once learned (staining + smell)', 'Important ecological decomposer', 'Widely studied species in mycology'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Toxic — causes gastrointestinal illness', 'Commonly misidentified as edible Agaricus', 'Grows in areas where people commonly forage'].map(c => (
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
            <H2 id="safe-identification">How to Identify Agaricus xanthodermus Safely</H2>
            <div className="space-y-3 mb-5">
              {[
                'Check for bright yellow staining — bruise or cut the base of the stem',
                'Smell for chemical/phenol odor — if it smells like ink or disinfectant, avoid it',
                'Observe gill color change — pink when young, chocolate brown when mature',
                'Inspect the base of the stem carefully — yellow staining is strongest here',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{i + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</span>
                </div>
              ))}
            </div>
            <p>
              For better accuracy, upload images to our{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier free by photo</Link> tool
              for AI-powered confirmation. Always cross-check multiple features before deciding on edibility.
            </p>

            <H3>Expert Identification Tips</H3>
            <ul>
              <li>Always bruise the base to test the yellow reaction</li>
              <li>Avoid relying on appearance alone — many edible <em>Agaricus</em> look similar</li>
              <li>Smell is a key identifier — the phenol odor is unmistakable</li>
              <li>Cross-check multiple features before deciding</li>
            </ul>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2 id="faq">Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is Agaricus xanthodermus edible?',
                  a: 'No, it is toxic and causes gastrointestinal distress including nausea, vomiting, abdominal cramps, and diarrhea. It should not be consumed.',
                },
                {
                  q: 'What does the yellow stainer smell like?',
                  a: 'It has a strong chemical or phenol-like smell, similar to ink or disinfectant. This unpleasant odor becomes more pronounced when the flesh is cut or cooked.',
                },
                {
                  q: 'How do I know if my mushroom is a yellow stainer?',
                  a: 'Look for bright yellow staining when the cap or stem base is bruised or cut, a strong chemical or phenol-like smell, and a white cap with gills that change from pink to chocolate brown.',
                },
                {
                  q: 'Can it kill you?',
                  a: 'It is rarely fatal but can cause severe gastrointestinal discomfort and illness. Symptoms usually appear within 30 minutes to 2 hours after ingestion.',
                },
                {
                  q: 'Where is it commonly found?',
                  a: 'In lawns, gardens, parks, and woodland edges worldwide. It is especially common in Europe, North America, and Australia, fruiting in late summer to autumn.',
                },
                {
                  q: 'Can AI identify this mushroom?',
                  a: 'Yes, AI mushroom identification tools can help detect it from images by analyzing cap shape, color, and staining patterns. However, AI results should always be verified with expert knowledge.',
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
                <em>Agaricus xanthodermus</em> is one of the most commonly encountered toxic mushrooms in everyday
                environments like gardens and parks. Its resemblance to edible <em>Agaricus</em> species makes it
                particularly risky for beginners.
              </p>
              <p className="mt-3">
                Understanding its yellow staining reaction, chemical smell, and habitat is essential for safe
                identification. Pairing this knowledge with a reliable{' '}
                <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
                can help prevent dangerous mistakes and improve foraging confidence.
              </p>
              <p className="mt-3">
                Learn more about{' '}
                <Link href="/mushroom-parts-explained" style={{ color: 'var(--accent)' }} className="hover:underline">
                  mushroom anatomy and identification features
                </Link>{' '}
                to build your knowledge, or check out our{' '}
                <Link href="/mushroom-identifier-book" style={{ color: 'var(--accent)' }} className="hover:underline">
                  recommended mushroom identification books
                </Link>{' '}
                for in-depth field guides.
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/agaricus-xanthodermus" />
          <ViewTracker slug="/agaricus-xanthodermus" />
              <BlogComments slug="/agaricus-xanthodermus" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
