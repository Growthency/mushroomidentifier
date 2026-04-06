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
  title: 'Amanita bisporigera (destroying angel identification) - Mushroom Identifier',
  description:
    'Amanita bisporigera: The Deadly Destroying Angel! \ud83d\udc80 identify this lethal beauty before it\u2019s too late. Expert identification tips & warning signs inside!',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Amanita bisporigera (Destroying Angel): Identification, Features, Habitat & Safety Guide',
      description:
        'Learn destroying angel identification, features, habitat, and deadly toxicity of Amanita bisporigera. Understand key traits and safety warnings.',
      author: { '@type': 'Organization', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: 'https://mushroomidentifiers.com/amanita-bisporigera-destroying-angel',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How to identify Destroying Angel?', acceptedAnswer: { '@type': 'Answer', text: 'Identify it by a pure white cap, white gills, ring on the stem, and a volva at the base. These features distinguish it from edible mushrooms.' } },
        { '@type': 'Question', name: 'Why is Amanita bisporigera deadly?', acceptedAnswer: { '@type': 'Answer', text: 'It contains amatoxins that cause severe liver damage and can be fatal even in small amounts.' } },
        { '@type': 'Question', name: 'Where does Destroying Angel grow?', acceptedAnswer: { '@type': 'Answer', text: 'It grows in forests near hardwood trees such as oak, beech, and birch, especially in North America.' } },
        { '@type': 'Question', name: 'Can AI identify Destroying Angel?', acceptedAnswer: { '@type': 'Answer', text: 'A mushroom identifier can analyze cap, gills, stem, and habitat using AI, but results should always be verified.' } },
        { '@type': 'Question', name: 'Is Destroying Angel edible?', acceptedAnswer: { '@type': 'Answer', text: 'No, it is a deadly toxic mushroom and must never be consumed.' } },
        { '@type': 'Question', name: 'What mushrooms look like Destroying Angel?', acceptedAnswer: { '@type': 'Answer', text: 'It resembles young Agaricus mushrooms, but differs by having white gills and a volva at the base.' } },
        { '@type': 'Question', name: 'Why is the volva important?', acceptedAnswer: { '@type': 'Answer', text: 'The volva is a key feature of Amanita species and helps identify toxic mushrooms like Destroying Angel.' } },
      ],
    },
  ],
}

/* ── Layout primitives ── */
const Section = ({ children }: { children: React.ReactNode }) => <section className="mb-10">{children}</section>
const Divider = () => <hr className="my-10 border-0 border-t" style={{ borderColor: 'var(--border)' }} />
const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-playfair text-2xl md:text-3xl font-bold mb-4 mt-2" style={{ color: 'var(--text-primary)' }}>{children}</h2>
)
const H3 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h3 id={id} className="font-playfair text-xl font-bold mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>{children}</h3>
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

export default function DestroyingAngelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

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
            <span>Amanita bisporigera Destroying Angel Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Deadly</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Amanita bisporigera</em> (Destroying Angel): Identification, Features, Habitat &amp; Safety Guide
            </h1>
            <AuthorBlock updatedAt="Mar 31, 2026" />
            <ArticleViewCount views={3450} className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Amanita bisporigera</em>, commonly known as the Destroying Angel, is one of the most dangerous
              toxic mushrooms in North America. It is responsible for many fatal poisonings due to its potent
              amatoxins. Because it closely resembles edible white mushrooms, accurate destroying angel
              identification requires careful examination of all mushroom parts.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/amanita-bisporigera-destroying-angel-identification.webp"
                alt="Amanita bisporigera destroying angel identification — pure white mushroom in forest"
                width={615}
                height={820}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Amanita bisporigera (Destroying Angel) in natural habitat. Photo: Dan Molter (shroomydan), CC BY-SA 3.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          <TableOfContents />

          {/* Quick ID Summary */}
          <Section>
            <H2 id="quick-id-summary">Quick Identification Summary</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Scientific Name', 'Amanita bisporigera'],
                ['Common Names', 'Destroying Angel'],
                ['Category', 'Dangerous / Toxic Mushrooms'],
                ['Risk Level', '🔴 Deadly'],
                ['Edibility', 'Poisonous (fatal)'],
                ['Key Features', 'Pure white cap, white gills, ring + volva, bulbous base'],
                ['Found In', 'Forests near hardwood trees in North America'],
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
            <H2>Family and Species</H2>
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
                    ['Species', 'Amanita bisporigera'],
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
              The Destroying Angel belongs to the Amanitaceae family, which includes several of the most deadly
              mushroom species. Members of this genus are typically identified by a combination of white gills, a
              ring (annulus), and a volva, making them critical in mycology and mushroom safety identification.
            </p>
          </Section>

          <Divider />

          {/* Dimensions */}
          <Section>
            <H2>Dimensions</H2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Cap Diameter', '5–10 cm'],
                ['Stem Height', '7–12 cm'],
                ['Stem Thickness', '1–2 cm'],
                ['Volva Size', 'Prominent, sac-like at base'],
              ].map(([label, val]) => (
                <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-lg font-bold mb-1" style={{ color: 'var(--accent)' }}>{val}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-4">
              The Destroying Angel is usually medium-sized but appears elegant and delicate, which can make it
              misleadingly harmless in appearance.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2>Key Features (Identification Characteristics)</H2>

            <H3>Cap (Pileus)</H3>
            <ul>
              <li><strong>Shape:</strong> Convex when young, flattening at maturity</li>
              <li><strong>Color:</strong> Pure white</li>
              <li><strong>Surface:</strong> Smooth, sometimes slightly sticky when moist</li>
            </ul>
            <p className="mt-2">The clean white cap is one of its most noticeable features.</p>

            <H3>Gills (Lamellae)</H3>
            <ul>
              <li><strong>Color:</strong> Pure white — does not change with age</li>
              <li><strong>Attachment:</strong> Free gills</li>
              <li><strong>Density:</strong> Crowded</li>
            </ul>
            <p className="mt-2">Unlike edible mushrooms, the gills remain white throughout maturity.</p>

            <H3>Stem (Stipe)</H3>
            <ul>
              <li><strong>Color:</strong> White</li>
              <li><strong>Structure:</strong> Slender, smooth</li>
              <li><strong>Base:</strong> Bulbous and enclosed in a volva</li>
            </ul>

            <H3>Ring (Annulus)</H3>
            <ul>
              <li>Present on upper stem</li>
              <li>Thin, skirt-like</li>
              <li>May disappear with age</li>
            </ul>

            <H3>Volva (Basal Cup)</H3>
            <ul>
              <li>Large, sac-like structure</li>
              <li>Found at the base of the stem</li>
              <li>Often hidden underground</li>
            </ul>
            <WarningBox>
              <strong>This is the most important identification feature.</strong> Always dig up the base to check for the volva — missing it is the most common fatal mistake.
            </WarningBox>
          </Section>

          {/* Second Image — ring/skirt detail */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/destroying-angel-ring-skirt-amanita-bisporigera.webp"
                alt="Destroying angel ring skirt — Amanita bisporigera annulus detail on stem"
                width={615}
                height={820}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Skirt-like ring (annulus) on Destroying Angel stem. Photo: Eli T. (mythical_mold), CC BY 4.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Color, Smell, Taste */}
          <Section>
            <H2>Color, Smell, and Taste</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Color', items: ['Cap: Pure white', 'Gills: White', 'Stem: White'] },
                { title: 'Smell', items: ['Mild or slightly unpleasant', 'Not strong like edible Agaricus species'] },
                { title: 'Taste', items: ['⚠️ Not recommended', 'Tasting toxic mushrooms is dangerous'] },
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
            <H2>Growth Pattern and Seasonality</H2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Growth Pattern</h4>
                <ul>
                  <li>Usually grows single or scattered</li>
                  <li>Occasionally in small groups</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Seasonality</h4>
                <ul>
                  <li>Summer to fall</li>
                  <li>Appears after rainfall</li>
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
                { title: 'Habitat', items: ['Forests and woodland areas', 'Moist soil'] },
                { title: 'Environment', items: ['Shaded areas', 'Nutrient-rich soil'] },
                { title: 'Tree Association', items: ['Oak', 'Beech', 'Birch'] },
              ].map(({ title, items }) => (
                <div key={title} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>{title}</h4>
                  <ul>
                    {items.map(i => <li key={i} className="text-sm" style={{ color: 'var(--text-muted)' }}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mb-4">Forms mycorrhizal relationships with tree roots.</p>

            <H3>Geographic Distribution</H3>
            <ul>
              <li>Primarily found in North America</li>
              <li>Common in the eastern United States</li>
              <li>Also present in parts of Canada</li>
            </ul>
          </Section>

          {/* Third Image */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/amanita-bisporigera-white-cap-forest-habitat.webp"
                alt="Amanita bisporigera white cap in forest habitat — destroying angel mushroom"
                width={615}
                height={820}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Amanita bisporigera showing pure white cap in forest habitat. Photo: Louis, CC0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Edibility & Risk */}
          <Section>
            <H2>Edibility, Safety &amp; Risk Level</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {[
                { icon: '❌', label: 'Not Edible', sub: 'Extremely poisonous', color: '#ef4444' },
                { icon: '🔴', label: 'Deadly Risk', sub: 'Extremely high risk', color: '#ef4444' },
                { icon: '☠️', label: 'Amatoxins', sub: 'Destroys liver & kidney', color: '#ef4444' },
              ].map(({ icon, label, sub, color }) => (
                <div key={label} className="p-4 rounded-xl text-center" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="font-semibold text-sm mb-1" style={{ color }}>{label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{sub}</div>
                </div>
              ))}
            </div>

            <H3>Toxicity</H3>
            <p className="mb-3">Contains amatoxins, which:</p>
            <ul>
              <li>Destroy liver cells</li>
              <li>Cause delayed symptoms (6–24 hours after ingestion)</li>
              <li>Lead to organ failure — often fatal</li>
            </ul>

            <H3>Symptoms</H3>
            <ul>
              <li>Delayed onset: 6–24 hours after ingestion</li>
              <li>Vomiting and diarrhea</li>
              <li>Severe liver damage and organ failure</li>
            </ul>
            <WarningBox>
              <strong>Immediate medical attention is critical.</strong> Do not wait for symptoms to worsen — toxic damage progresses silently.
            </WarningBox>
          </Section>

          <Divider />

          {/* Look-alikes */}
          <Section>
            <H2>Similar Species (Look-Alikes Comparison)</H2>
            <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Feature', 'Destroying Angel', 'Edible Look-Alike'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Color', 'Pure white', 'Often off-white or brownish'],
                    ['Gills', 'White (no change)', 'Pink → brown at maturity'],
                    ['Volva', 'Present', 'Absent'],
                    ['Ring', 'Present', 'May vary'],
                    ['Risk', 'Deadly ☠️', 'Safe ✓'],
                  ].map(([feat, da, edible], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{da}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{edible}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Common Confusions</H3>
            <ul>
              <li>Young <em>Agaricus</em> species</li>
              <li>White field mushrooms</li>
              <li>Puffballs (early stage confusion)</li>
            </ul>
          </Section>

          <Divider />

          {/* Benefits */}
          <Section>
            <H2>Benefits and Value</H2>
            <WarningBox>No Edible Benefits — Destroying Angel has no safe culinary or medicinal use.</WarningBox>
            <H3>Scientific Importance</H3>
            <ul>
              <li>Important in toxicology research</li>
              <li>Used to study amatoxin poisoning mechanisms</li>
              <li>Helps improve medical treatments and awareness</li>
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
                  {['Scientifically valuable', 'Important in ecological systems', 'Educational importance in mycology'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Extremely toxic — potentially fatal', 'Easily confused with edible mushrooms', 'Responsible for fatal poisonings'].map(c => (
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
            <H2>How Our Mushroom Identifier Helps Identify Destroying Angel</H2>
            <p className="mb-4">Our <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">identify deadly mushrooms online</Link> tool uses AI and image recognition to analyze:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                'Pure white cap',
                'White gills (no color change)',
                'Ring on stem',
                'Volva at base',
                'Woodland habitat',
                'Seasonal context',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>→</span> {f}
                </div>
              ))}
            </div>
            <p>
              By combining these features, the system helps distinguish Destroying Angel from edible look-alikes,
              reducing identification errors. Always verify AI results with an expert before any decision.
            </p>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2>Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                { q: 'How to identify Destroying Angel?', a: 'Look for a pure white mushroom with white gills that do not change color, a ring on the stem, and a sac-like volva at the base. Always dig up the base to check for the volva.' },
                { q: 'Why is Amanita bisporigera deadly?', a: 'It contains amatoxins that cause severe liver failure and can be fatal even in small amounts. Symptoms are delayed by 6–24 hours, meaning organ damage is occurring before the person feels unwell.' },
                { q: 'Where does Destroying Angel grow?', a: 'It grows in forests near hardwood trees like oak and beech, especially in North America. It is common in the eastern United States and parts of Canada.' },
                { q: 'What mushrooms look like Destroying Angel?', a: 'It resembles young Agaricus mushrooms and white field mushrooms, but differs by having permanently white gills and a volva at the base.' },
                { q: 'Can AI identify Destroying Angel?', a: 'Yes, a mushroom identifier app can detect key features, but results must always be verified by an expert before any contact or consumption decision.' },
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

          {/* Final Thoughts */}
          <Section>
            <H2>Final Thoughts</H2>
            <InfoBox>
              <p>
                The Destroying Angel (<em>Amanita bisporigera</em>) is one of the most dangerous mushrooms in
                the world. Its simple white appearance makes it especially risky for beginners who may mistake it
                for edible white mushrooms.
              </p>
              <p className="mt-3">
                Understanding its cap, gills, stem, ring, and volva, along with its habitat and growth pattern,
                is essential for safe identification. Using a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">toxic fungal species identifier</Link> can help analyze features, but
                should always be combined with expert knowledge.{' '}
                <strong>When in doubt — do not touch or consume.</strong>
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/amanita-bisporigera-destroying-angel" />
          <BlogComments slug="/amanita-bisporigera-destroying-angel" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
