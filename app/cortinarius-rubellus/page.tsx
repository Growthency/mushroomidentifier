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
  title: 'Cortinarius rubellus (Deadly Cortinarius) – Identification Guide',
  description:
    'Cortinarius rubellus, commonly known as the deadly cortinarius or deadly webcap, is one of the most dangerous poisonous mushrooms in the world.',
  alternates: { canonical: 'https://mushroomidentifiers.com/cortinarius-rubellus' },
  openGraph: {
    title: 'Cortinarius rubellus (Deadly Cortinarius) – Identification Guide',
    description: 'Complete identification guide for Cortinarius rubellus (deadly webcap). Learn key features, orellanine toxicity, delayed kidney failure symptoms, habitat, and critical safety information.',
    url: 'https://mushroomidentifiers.com/cortinarius-rubellus',
    images: [{ url: 'https://mushroomidentifiers.com/cortinarius-rubellus-deadly-webcap-identification.webp', width: 820, height: 550, alt: 'Cortinarius rubellus deadly webcap mushroom identification guide' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cortinarius rubellus (Deadly Cortinarius) – Identification Guide',
    description: 'Complete identification guide for Cortinarius rubellus — orellanine toxicity, delayed kidney failure, habitat, and critical safety information.',
    images: ['https://mushroomidentifiers.com/cortinarius-rubellus-deadly-webcap-identification.webp'],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Cortinarius rubellus (Deadly Cortinarius) – Identification, Toxicity & Lookalikes","description":"Learn to identify Cortinarius rubellus (deadly webcap) with this complete guide. Explore key features, orellanine toxicity, delayed kidney failure symptoms, habitat, lookalikes, and critical safety information.","image":"https://mushroomidentifiers.com/cortinarius-rubellus-deadly-webcap-identification.webp","author":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/cortinarius-rubellus"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is Cortinarius rubellus edible?","acceptedAnswer":{"@type":"Answer","text":"No, it is deadly poisonous and should never be eaten. It contains orellanine, a toxin that causes delayed kidney failure which can be fatal."}},{"@type":"Question","name":"Why is Cortinarius rubellus so dangerous?","acceptedAnswer":{"@type":"Answer","text":"Because it contains orellanine, which causes delayed kidney failure. Symptoms can take 2 to 14 days to appear, meaning serious organ damage may already be occurring before the person feels unwell, making early treatment extremely difficult."}},{"@type":"Question","name":"How long do symptoms take to appear?","acceptedAnswer":{"@type":"Answer","text":"Between 2 and 14 days after ingestion, making it one of the most deceptive poisonous mushrooms. The delayed onset means kidney damage is often severe by the time symptoms are noticed."}},{"@type":"Question","name":"Can Cortinarius rubellus kill you?","acceptedAnswer":{"@type":"Answer","text":"Yes, it can cause fatal kidney failure if untreated. Even with medical treatment, permanent kidney damage may occur, and some cases have required kidney transplants."}},{"@type":"Question","name":"Where does Cortinarius rubellus grow?","acceptedAnswer":{"@type":"Answer","text":"It grows in coniferous and mixed forests, especially in northern Europe (Scandinavia, UK) and parts of North America. It forms mycorrhizal relationships with tree roots and typically appears in late summer to autumn."}},{"@type":"Question","name":"Can AI identify this mushroom?","acceptedAnswer":{"@type":"Answer","text":"AI mushroom identification tools can help detect the rusty-orange color, cap shape, and habitat context. However, Cortinarius species are notoriously difficult to distinguish, so AI results must always be verified by an expert. Never rely on AI alone for any Cortinarius identification."}}]}]}

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

export default function CortinariusRubellusPage() {
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
            <span>Cortinarius rubellus Deadly Webcap Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Deadly</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Cortinarius rubellus</em> (Deadly Cortinarius) &ndash; Identification, Toxicity &amp; Lookalikes
            </h1>
            <AuthorBlock updatedAt="Apr 11, 2026" />
            <ArticleViewCount views={4730} className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Cortinarius rubellus</em>, commonly known as the deadly cortinarius or deadly webcap, is one of
              the most dangerous poisonous mushrooms in the world. It contains orellanine, a toxin that causes
              delayed kidney failure, often appearing days after ingestion — making it especially deceptive. Found
              in Europe and parts of North America, this mushroom can resemble edible species, increasing the risk
              of accidental poisoning.
            </p>
            <p className="text-base leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
              For accurate identification, focus on its rusty-orange color, fibrous cap, and cobweb-like veil
              (cortina) in young specimens. Because of its high risk and delayed symptoms, using a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
              or AI{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identification app</Link> is
              strongly recommended for safe foraging and verification.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/cortinarius-rubellus-deadly-webcap-identification.webp"
                alt="Cortinarius rubellus deadly webcap mushroom identification — rusty-orange cap in coniferous forest"
                width={820}
                height={550}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Photo: Andreas Kunze, CC BY-SA 3.0, via Wikimedia Commons
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
                    ['Family', 'Cortinariaceae'],
                    ['Genus', 'Cortinarius'],
                    ['Species', 'Cortinarius rubellus'],
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
              Part of the large <em>Cortinarius</em> genus, which contains thousands of species — many of which
              are extremely difficult to distinguish from one another. This genus includes several other deadly
              species, making it one of the most dangerous groups for foragers to encounter.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Essentials)</H2>

            <H3 id="cap">Cap Characteristics</H3>
            <ul>
              <li><strong>Color:</strong> Rusty-orange to reddish-brown</li>
              <li><strong>Shape:</strong> Convex, flattening with age, often with a slight central bump (umbo)</li>
              <li><strong>Surface:</strong> Dry, fibrous, sometimes scaly</li>
              <li><strong>Size:</strong> 3–8 cm diameter</li>
            </ul>

            <H3 id="gills">Gills</H3>
            <ul>
              <li><strong>Young:</strong> Initially pale, covered by cortina</li>
              <li><strong>Mature:</strong> Turn rusty-brown as spores develop</li>
              <li><strong>Spacing:</strong> Moderately spaced</li>
              <li><strong>Attachment:</strong> Adnate (broadly attached to stem)</li>
            </ul>

            <H3 id="stem">Stem (Stipe)</H3>
            <ul>
              <li><strong>Color:</strong> Yellowish-orange with darker fibers</li>
              <li><strong>Structure:</strong> Slender, fibrous</li>
              <li><strong>Cortina remnants:</strong> Often shows rusty spore traces from the veil</li>
            </ul>

            <H3 id="cortina">Cortina (Unique Feature)</H3>
            <ul>
              <li>Fine, cobweb-like structure visible in young mushrooms</li>
              <li>Leaves rusty spore traces on the upper stem as it collapses</li>
              <li>Distinguishes <em>Cortinarius</em> from most other genera</li>
            </ul>
            <WarningBox>
              The cortina (cobweb-like veil) is a hallmark of the <em>Cortinarius</em> genus. If you see
              a rusty-orange mushroom with cobweb veil remnants — treat it as potentially deadly and do not consume.
            </WarningBox>
          </Section>

          {/* Second Image — Detail */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/cortinarius-rubellus-cap-stem-detail.webp"
                alt="Cortinarius rubellus cap and stem detail — deadly cortinarius showing fibrous rusty-orange features"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Cortinarius rubellus detail. Photo: Danny Steven S., CC BY-SA 3.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Color, Smell & Taste */}
          <Section>
            <H2 id="color-smell-taste">Color, Smell &amp; Texture</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Color', items: ['Cap: Rusty-orange to reddish-brown', 'Gills: Pale → rusty-brown', 'Stem: Yellowish-orange'] },
                { title: 'Smell', items: ['Mild or slightly earthy', 'Not strongly distinctive'] },
                { title: 'Texture', items: ['Dry, fibrous cap surface', 'Slender fibrous stem', '⚠️ Do not taste — deadly toxic'] },
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
                ['Cap Diameter', '3–8 cm'],
                ['Stem Height', '5–10 cm'],
                ['Stem Thickness', '0.5–1.5 cm'],
                ['Gills', 'Rusty-brown'],
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
                { title: 'Habitat', items: ['Coniferous forests', 'Mixed woodlands', 'Near spruce, pine, and birch'] },
                { title: 'Seasonality', items: ['Late summer to autumn', 'Appears after rain periods'] },
                { title: 'Growth Pattern', items: ['Singly or in small groups', 'Mycorrhizal (associated with tree roots)'] },
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
              {['Sweden', 'Finland', 'United Kingdom', 'North America (less common)', 'Northern temperate regions'].map(r => (
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
                src="/cortinarius-rubellus-habitat-woodland.webp"
                alt="Cortinarius rubellus growing in woodland habitat near edible chanterelles — deadly webcap forest setting"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Cortinarius rubellus alongside Craterellus tubaeformis in woodland. Photo: Wkee4ager, CC BY-SA 4.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Toxicity & Health Risks */}
          <Section>
            <H2 id="toxicity">Toxicity &amp; Health Risks</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">☠️</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Deadly Poisonous</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Contains orellanine</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">🔴</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>High Fatality Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Causes kidney failure</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                <div className="text-2xl mb-1">⏱️</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#ef4444' }}>Delayed Onset</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>2–14 days before symptoms</div>
              </div>
            </div>

            <H3>Toxic Compound — Orellanine</H3>
            <p className="mb-3">Orellanine is a nephrotoxin (kidney-destroying toxin) that:</p>
            <ul>
              <li>Causes progressive, irreversible kidney damage</li>
              <li>Has a dangerously delayed onset (2–14 days after ingestion)</li>
              <li>Is not destroyed by cooking, drying, or freezing</li>
              <li>Has no known antidote — treatment is supportive only</li>
            </ul>

            <H3>Symptoms of Poisoning</H3>
            <ul>
              <li><strong>Early (2–14 days):</strong> Intense thirst, dry mouth, fatigue</li>
              <li><strong>Progressing:</strong> Nausea, vomiting, headache, muscle pain</li>
              <li><strong>Severe:</strong> Kidney failure, reduced urine output, back pain</li>
              <li><strong>Critical:</strong> Complete renal failure requiring dialysis or transplant</li>
            </ul>
            <WarningBox>
              <strong>Symptoms appear 2–14 days after ingestion</strong> — by which time severe kidney damage may
              already be occurring. This extreme delay makes Cortinarius rubellus one of the most deceptive and
              dangerous mushrooms in the world. Seek emergency medical help immediately if exposure is suspected.
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
                    {['Feature', 'Deadly Cortinarius', 'Edible Mushrooms'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Color', 'Rusty-orange', 'Variable (brown, white, etc.)'],
                    ['Veil', 'Cobweb-like cortina', 'Usually absent'],
                    ['Toxicity', 'Deadly ☠️', 'Safe ✓'],
                    ['Identification Difficulty', 'Very high', 'Easier with practice'],
                    ['Spore Color', 'Rusty-brown', 'Varies by species'],
                  ].map(([feat, deadly, edible], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{deadly}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{edible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Common Confusion Species</H3>
            <ul>
              <li><em>Cortinarius orellanus</em> (Fool&apos;s Webcap) — also deadly, contains orellanine</li>
              <li>Various small brown/orange forest mushrooms — many harmless species look similar</li>
              <li>Some edible <em>Cantharellus</em> and <em>Craterellus</em> species — can grow in the same habitat</li>
            </ul>
            <WarningBox>
              Many <em>Cortinarius</em> species are unsafe — <strong>avoid the entire genus if you are unsure</strong>.
              No edible mushroom is worth the risk of kidney failure.
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
                  <li>Mycorrhizal fungus</li>
                  <li>Forms symbiotic relationships with tree roots</li>
                  <li>Helps trees absorb nutrients from soil</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Life Cycle</h4>
                <ul>
                  <li>Spores disperse through wind</li>
                  <li>Mycelium forms connections with tree roots</li>
                  <li>Fruiting bodies appear in autumn</li>
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
                  <li>Supports forest ecosystems through mycorrhizal networks</li>
                  <li>Enhances nutrient exchange between soil and trees</li>
                  <li>Part of complex woodland fungal communities</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Economic Value</h4>
                <ul>
                  <li>No edible value (deadly toxic)</li>
                  <li>Important in toxicology research</li>
                  <li>Orellanine studied for medical applications</li>
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
                  {['Important ecological role in forest ecosystems', 'Significant scientific research value', 'Helps forest nutrient cycles through mycorrhizal networks'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Extremely toxic — can cause fatal kidney failure', 'Delayed symptoms (2–14 days) increase danger', 'Difficult to identify accurately — genus has thousands of species'].map(c => (
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
            <H2 id="safe-identification">How to Identify Cortinarius rubellus Safely</H2>
            <div className="space-y-3 mb-5">
              {[
                'Look for a rusty-orange cap with dry, fibrous surface',
                'Check for cortina (cobweb-like veil) remnants on the stem',
                'Observe rust-colored gills and rusty spore deposits',
                'Confirm woodland habitat — coniferous or mixed forests near tree roots',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{i + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</span>
                </div>
              ))}
            </div>
            <p>
              For safety, always use a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier free by photo</Link> tool
              or AI-based mushroom identification system to cross-check findings. <strong>Never rely on AI alone
              for <em>Cortinarius</em> identification</strong> — expert verification is essential.
            </p>

            <H3>Expert Identification Tips</H3>
            <ul>
              <li>Avoid picking small brown/orange mushrooms unless absolutely certain of identification</li>
              <li>Check for cortina remnants carefully — they may be faint on older specimens</li>
              <li>Use multiple identification features, never rely on a single trait</li>
              <li><strong>When in doubt — do not consume</strong></li>
            </ul>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2 id="faq">Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is Cortinarius rubellus edible?',
                  a: 'No, it is deadly poisonous and should never be eaten. It contains orellanine, a toxin that causes delayed kidney failure which can be fatal.',
                },
                {
                  q: 'Why is it so dangerous?',
                  a: 'Because it contains orellanine, which causes delayed kidney failure. Symptoms can take 2 to 14 days to appear, meaning severe organ damage may already be occurring before the person feels unwell.',
                },
                {
                  q: 'How long do symptoms take to appear?',
                  a: 'Between 2 and 14 days after ingestion, making it one of the most deceptive poisonous mushrooms. The delayed onset means kidney damage is often severe by the time symptoms are noticed.',
                },
                {
                  q: 'Can it kill you?',
                  a: 'Yes, it can cause fatal kidney failure if untreated. Even with medical treatment, permanent kidney damage may occur, and some cases have required kidney transplants.',
                },
                {
                  q: 'Where does it grow?',
                  a: 'In coniferous and mixed forests, especially in northern Europe (Scandinavia, UK) and parts of North America. It forms mycorrhizal relationships with tree roots.',
                },
                {
                  q: 'Can AI identify this mushroom?',
                  a: 'AI tools can help detect the rusty-orange color and habitat context, but Cortinarius species are notoriously difficult to distinguish. Never rely on AI alone for any Cortinarius identification — expert verification is essential.',
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
                <em>Cortinarius rubellus</em> is one of the most dangerous mushrooms due to its delayed toxicity
                and severe kidney damage effects. Its resemblance to harmless species makes it particularly risky
                for foragers.
              </p>
              <p className="mt-3">
                Understanding its color, cortina feature, and habitat is essential, but even experienced foragers
                should exercise extreme caution. Using a trusted{' '}
                <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
                adds an extra layer of safety and helps prevent life-threatening mistakes.
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

          <RelatedPosts currentSlug="/cortinarius-rubellus" />
          <BlogComments slug="/cortinarius-rubellus" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
