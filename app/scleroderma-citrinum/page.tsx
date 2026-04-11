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
  title: 'Scleroderma citrinum (Earthball Mushroom) – Identification Guide',
  description:
    'Scleroderma citrinum, commonly known as the earthball mushroom, is a toxic, puffball-like fungus found in woodlands, gardens, and sandy soils across many parts of the world.',
  alternates: { canonical: 'https://mushroomidentifiers.com/scleroderma-citrinum' },
  openGraph: {
    title: 'Scleroderma citrinum (Earthball Mushroom) – Identification Guide',
    description: 'Complete identification guide for Scleroderma citrinum (common earthball). Learn key features, dark interior, toxicity, habitat, and how to distinguish it from edible puffballs.',
    url: 'https://mushroomidentifiers.com/scleroderma-citrinum',
    images: [{ url: 'https://mushroomidentifiers.com/scleroderma-citrinum-earthball-mushroom-identification.webp', width: 820, height: 550, alt: 'Scleroderma citrinum earthball mushroom identification guide' }],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scleroderma citrinum (Earthball Mushroom) – Identification Guide',
    description: 'Complete identification guide for Scleroderma citrinum — features, dark interior, toxicity, and how to distinguish from edible puffballs.',
    images: ['https://mushroomidentifiers.com/scleroderma-citrinum-earthball-mushroom-identification.webp'],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Scleroderma citrinum (Earthball Mushroom) – Identification, Toxicity & Lookalikes","description":"Learn to identify Scleroderma citrinum (earthball mushroom) with this complete guide. Explore key features, dark interior, toxicity, habitat, lookalikes, and how to distinguish it from edible puffballs.","image":"https://mushroomidentifiers.com/scleroderma-citrinum-earthball-mushroom-identification.webp","author":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifier","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/scleroderma-citrinum"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is earthball mushroom edible?","acceptedAnswer":{"@type":"Answer","text":"No, Scleroderma citrinum is toxic and should not be eaten. It causes gastrointestinal symptoms including nausea, vomiting, diarrhea, and abdominal discomfort."}},{"@type":"Question","name":"How do you tell if it is an earthball or puffball?","acceptedAnswer":{"@type":"Answer","text":"Cut it open vertically. An earthball (Scleroderma citrinum) has a dark purple-black marbled interior and thick tough skin. An edible puffball has a pure white interior and thin smooth skin when young."}},{"@type":"Question","name":"Can Scleroderma citrinum kill you?","acceptedAnswer":{"@type":"Answer","text":"It is rarely fatal but causes unpleasant gastrointestinal illness including nausea, vomiting, and diarrhea. Medical attention should be sought if consumed."}},{"@type":"Question","name":"Where does Scleroderma citrinum grow?","acceptedAnswer":{"@type":"Answer","text":"It grows in woodlands, heathlands, sandy soils, and garden edges. It is an ectomycorrhizal fungus that forms relationships with tree roots, commonly found near oak, birch, and pine trees."}},{"@type":"Question","name":"What happens if you eat an earthball mushroom?","acceptedAnswer":{"@type":"Answer","text":"You may experience nausea, vomiting, diarrhea, and stomach pain. Symptoms usually appear within a few hours of ingestion. Seek medical attention if poisoning is suspected."}},{"@type":"Question","name":"Can AI identify earthball mushrooms?","acceptedAnswer":{"@type":"Answer","text":"Yes, AI mushroom identification tools can help detect earthball mushrooms from images by analyzing the round shape, warty surface texture, and color. However, the most reliable test is cutting the mushroom open to check the interior color, which requires physical examination."}}]}]}

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

export default function SclerodermaClitrinumPage() {
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
            <span>Scleroderma citrinum Earthball Mushroom Identification</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#ef444420', color: '#ef4444' }}>Toxic</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>High Misidentification Risk</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              <em>Scleroderma citrinum</em> (Earthball Mushroom) &ndash; Identification, Toxicity &amp; Lookalikes
            </h1>
            <AuthorBlock updatedAt="Apr 11, 2026" />
            <ArticleViewCount views={3950} className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <em>Scleroderma citrinum</em>, commonly known as the earthball mushroom, is a toxic, puffball-like
              fungus found in woodlands, gardens, and sandy soils across many parts of the world. Unlike true
              puffballs, it has a thick, tough outer skin and dark, purplish-black spore mass inside. It is not
              edible and can cause gastrointestinal poisoning if consumed. Proper identification is essential
              because beginners often confuse it with edible puffballs.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '480px' }}>
              <Image
                src="/scleroderma-citrinum-earthball-mushroom-identification.webp"
                alt="Scleroderma citrinum earthball mushroom identification — round yellowish-brown specimen with warty surface"
                width={820}
                height={550}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Photo: Jorg Hempel, CC BY-SA 2.0 DE, via Wikimedia Commons
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
                    ['Order', 'Boletales'],
                    ['Family', 'Sclerodermataceae'],
                    ['Genus', 'Scleroderma'],
                    ['Species', 'Scleroderma citrinum'],
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
              Related to other earthball species and distinct from true puffballs like <em>Lycoperdon</em>.
              Despite its superficial resemblance to edible puffballs, <em>Scleroderma citrinum</em> belongs to
              a completely different order (Boletales), highlighting why visual identification alone is unreliable.
            </p>
          </Section>

          <Divider />

          {/* Key Features */}
          <Section>
            <H2 id="key-features">Key Features (Identification Essentials)</H2>

            <H3 id="exterior">Outer Appearance (Peridium)</H3>
            <ul>
              <li><strong>Color:</strong> Yellowish to brown</li>
              <li><strong>Surface:</strong> Rough, cracked, wart-like texture</li>
              <li><strong>Shape:</strong> Round or irregular (2–10 cm wide)</li>
              <li><strong>Skin:</strong> Thick and tough — much thicker than edible puffball skin</li>
            </ul>

            <H3 id="interior">Interior (Gleba) — Critical ID Feature</H3>
            <ul>
              <li><strong>Young:</strong> White, quickly darkening</li>
              <li><strong>Mature:</strong> Dark purple to black with white veins (marbled appearance)</li>
              <li><strong>Not uniform</strong> like the pure white interior of edible puffballs</li>
            </ul>
            <WarningBox>
              <strong>Always cut open any puffball-like mushroom before consuming.</strong> If the interior is
              dark, marbled, or anything other than pure white — it is not an edible puffball. This simple
              cross-section test is the safest way to avoid earthball poisoning.
            </WarningBox>

            <H3 id="structure">Structure</H3>
            <ul>
              <li>Thick, tough outer skin (peridium)</li>
              <li>No visible stem (or very short, rudimentary base)</li>
              <li>Attached to soil by root-like mycelial cords</li>
            </ul>
          </Section>

          {/* Second Image — Cross-Section */}
          <figure className="my-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="relative w-full" style={{ maxHeight: '460px' }}>
              <Image
                src="/scleroderma-citrinum-cross-section-dark-interior.webp"
                alt="Scleroderma citrinum cross-section showing dark purple-black spore mass interior — earthball vs puffball identification"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Cross-section showing dark spore mass. Photo: Hans-Martin Scheibner, CC BY-SA 3.0, via Wikimedia Commons
            </figcaption>
          </figure>

          <Divider />

          {/* Smell, Taste & Texture */}
          <Section>
            <H2 id="smell-taste-texture">Smell, Taste &amp; Texture</H2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Smell', items: ['Slightly unpleasant or rubbery', 'Earthy, sometimes metallic'] },
                { title: 'Taste', items: ['Not recommended (toxic)', '⚠️ Never taste wild mushrooms'] },
                { title: 'Texture', items: ['Hard, tough outer skin', 'Powdery spore mass inside when mature', 'Firm and dense when young'] },
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
                ['Diameter', '2–10 cm'],
                ['Shape', 'Round, irregular'],
                ['Skin Thickness', 'Thick & tough'],
                ['Interior', 'Dark, powdery spores'],
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
                { title: 'Habitat', items: ['Woodlands and heathlands', 'Sandy soils', 'Garden edges and paths'] },
                { title: 'Seasonality', items: ['Summer to late autumn', 'Appears after warm rain'] },
                { title: 'Growth Pattern', items: ['Singly or in clusters', 'Often near tree roots (ectomycorrhizal)'] },
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
              {['United Kingdom', 'United States', 'Europe', 'Asia', 'Widely distributed in temperate regions'].map(r => (
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
                src="/scleroderma-citrinum-habitat-woodland.webp"
                alt="Scleroderma citrinum growing in woodland habitat — common earthball near tree roots on forest floor"
                width={820}
                height={550}
                className="w-full object-cover"
                style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
              Scleroderma citrinum in woodland habitat, UK. Photo: Stu&apos;s Images, CC BY-SA 3.0, via Wikimedia Commons
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
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Causes GI illness</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#f59e0b15', border: '1px solid #f59e0b40' }}>
                <div className="text-2xl mb-1">🟠</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#f59e0b' }}>Moderate Toxicity</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Gastrointestinal irritation</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: '#22c55e15', border: '1px solid #22c55e40' }}>
                <div className="text-2xl mb-1">🟢</div>
                <div className="font-semibold text-sm mb-1" style={{ color: '#22c55e' }}>Low Fatality Risk</div>
                <div className="text-xs" style={{ color: 'var(--text-faint)' }}>Rarely fatal</div>
              </div>
            </div>

            <H3>Toxic Effects</H3>
            <p className="mb-3">Causes gastrointestinal irritation through toxic compounds in the flesh and spores.</p>

            <H3>Symptoms of Poisoning</H3>
            <ul>
              <li>Nausea and vomiting</li>
              <li>Diarrhea</li>
              <li>Abdominal discomfort and cramping</li>
            </ul>

            <H3>Onset Time</H3>
            <p>Usually within <strong>a few hours</strong> after ingestion.</p>
            <WarningBox>
              Rarely fatal but unpleasant and avoidable. The key to prevention is always cutting open any
              puffball-like mushroom before consumption — if the interior is not pure white, do not eat it.
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
                    ['Toxicity', '🟠 Moderate', '#f59e0b'],
                    ['Fatality Risk', '🟢 Low', '#22c55e'],
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
                    {['Feature', 'Earthball (S. citrinum)', 'True Puffball (Edible)'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Interior', 'Dark, marbled', 'Pure white (young)'],
                    ['Skin', 'Thick, rough', 'Thin, smooth'],
                    ['Toxicity', 'Toxic ☠️', 'Edible ✓'],
                    ['Texture', 'Firm, tough', 'Soft, spongy'],
                    ['Spore Color', 'Dark purple-black', 'Olive-brown'],
                  ].map(([feat, eb, pb], i) => (
                    <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                      <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{eb}</td>
                      <td className="px-4 py-3" style={{ color: '#86efac' }}>{pb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>Common Lookalikes</H3>
            <ul>
              <li><em>Lycoperdon perlatum</em> (Common Puffball) — edible when young and white inside</li>
              <li><em>Bovista</em> species — edible, thin-skinned, white interior</li>
              <li>Other <em>Scleroderma</em> species — also toxic, similar appearance</li>
            </ul>
            <WarningBox>
              <strong>Always cut open</strong> any puffball-like mushroom before eating. This is the safest and
              most reliable test — pure white interior means edible puffball; dark or marbled interior means toxic earthball.
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
                  <li>Ectomycorrhizal fungus</li>
                  <li>Forms symbiotic relationships with tree roots</li>
                  <li>Helps trees absorb water and nutrients</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Life Cycle</h4>
                <ul>
                  <li>Spore release through cracks in outer skin</li>
                  <li>Mycelium connects with tree roots</li>
                  <li>Fruiting body develops at soil surface</li>
                  <li>Spores disperse through wind and rain</li>
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
                  <li>Improves soil health and structure</li>
                  <li>Helps trees grow through symbiotic nutrient exchange</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--accent)' }}>Economic Value</h4>
                <ul>
                  <li>No culinary value (toxic)</li>
                  <li>Studied for ecological roles in forestry</li>
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
                  {['Important ecological role in forest ecosystems', 'Easy to recognize with practice (thick skin + dark interior)', 'Helps tree nutrient cycles through mycorrhizal networks'].map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>Cons</h4>
                <ul className="space-y-2">
                  {['Toxic and inedible', 'Easily confused with edible puffballs by beginners', 'Can cause gastrointestinal illness if consumed'].map(c => (
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
            <H2 id="safe-identification">How to Identify Scleroderma citrinum Safely</H2>
            <div className="space-y-3 mb-5">
              {[
                'Check the outer skin — rough, thick, and wart-like texture indicates earthball',
                'Cut open vertically — dark purple-black marbled interior confirms it is NOT an edible puffball',
                'Observe growth location — near tree roots in woodlands or sandy soils',
                'Avoid if interior is not pure white — only puffballs with a completely white interior are safe to eat',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{i + 1}</span>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{step}</span>
                </div>
              ))}
            </div>
            <p>
              For better accuracy, use a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">wild mushroom identifier</Link> tool
              or AI-based{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identification app</Link> to
              confirm findings. Always verify with the cross-section test.
            </p>

            <H3>Expert Identification Tips</H3>
            <ul>
              <li>Always slice the mushroom vertically to check interior color</li>
              <li>Never rely on outer appearance alone — thick skin is a clue but not definitive</li>
              <li>Check internal color carefully — any darkness means toxic</li>
              <li>Cross-reference with multiple features before deciding</li>
            </ul>
          </Section>

          <Divider />

          {/* FAQ */}
          <Section>
            <H2 id="faq">Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is earthball mushroom edible?',
                  a: 'No, Scleroderma citrinum is toxic and should not be eaten. It causes gastrointestinal symptoms including nausea, vomiting, diarrhea, and abdominal discomfort.',
                },
                {
                  q: 'How do you tell if it is an earthball or puffball?',
                  a: 'Cut it open vertically. An earthball has a dark purple-black marbled interior and thick tough skin. An edible puffball has a pure white interior and thin smooth skin when young.',
                },
                {
                  q: 'Can Scleroderma citrinum kill you?',
                  a: 'It is rarely fatal but causes unpleasant gastrointestinal illness including nausea, vomiting, and diarrhea. Medical attention should be sought if consumed.',
                },
                {
                  q: 'Where does it grow?',
                  a: 'In woodlands, heathlands, sandy soils, and garden edges. It is an ectomycorrhizal fungus commonly found near oak, birch, and pine trees.',
                },
                {
                  q: 'What happens if you eat it?',
                  a: 'You may experience nausea, vomiting, diarrhea, and stomach pain. Symptoms usually appear within a few hours of ingestion.',
                },
                {
                  q: 'Can AI identify earthball mushrooms?',
                  a: 'Yes, AI tools can help detect earthball mushrooms from images by analyzing the round shape, warty surface, and color. However, the most reliable test is cutting the mushroom open to check the interior, which requires physical examination.',
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
                <em>Scleroderma citrinum</em> is a common but often misunderstood mushroom that can easily be
                mistaken for edible puffballs. Its dark interior, tough skin, and toxic nature make it important
                to identify correctly.
              </p>
              <p className="mt-3">
                Combining field knowledge with a reliable{' '}
                <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> tool
                ensures safer exploration and helps prevent accidental poisoning.
              </p>
              <p className="mt-3">
                Learn more about{' '}
                <Link href="/mushroom-parts-explained" style={{ color: 'var(--accent)' }} className="hover:underline">
                  mushroom anatomy and identification features
                </Link>{' '}
                to build your knowledge, or explore our{' '}
                <Link href="/mushroom-identifier-book" style={{ color: 'var(--accent)' }} className="hover:underline">
                  recommended mushroom identification books
                </Link>{' '}
                for in-depth field guides.
              </p>
            </InfoBox>
          </Section>

          <RelatedPosts currentSlug="/scleroderma-citrinum" />
          <BlogComments slug="/scleroderma-citrinum" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
