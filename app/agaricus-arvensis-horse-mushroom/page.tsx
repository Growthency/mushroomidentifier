import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import ArticleViewCount from '@/components/blog/ArticleViewCount'

export const metadata: Metadata = {
  title: 'Horse Mushroom (Agaricus arvensis) - Mushroom Identifier',
  description:
    'The Horse Mushroom (Agaricus arvensis) is a large, edible mushroom commonly found in grasslands and pastures.',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Horse Mushroom (Agaricus arvensis): Identification, Features, Habitat & Safety Guide',
      description: 'The Horse Mushroom (Agaricus arvensis) is a large, edible mushroom found in grasslands. Learn its cap, gills, ring, smell, and toxic look-alikes.',
      author: { '@type': 'Organization', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: 'https://mushroomidentifiers.com/agaricus-arvensis-horse-mushroom',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Is Horse Mushroom safe to eat?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, it is edible, but only when correctly identified. It has toxic look-alikes, so caution is required.' } },
        { '@type': 'Question', name: 'What does Horse Mushroom smell like?', acceptedAnswer: { '@type': 'Answer', text: 'It has a strong anise or almond-like smell, which helps distinguish it from toxic species.' } },
        { '@type': 'Question', name: 'Where does Horse Mushroom grow?', acceptedAnswer: { '@type': 'Answer', text: 'It grows in grasslands, pastures, and open meadows, often forming fairy rings.' } },
        { '@type': 'Question', name: 'What mushrooms look like Horse Mushroom?', acceptedAnswer: { '@type': 'Answer', text: 'The main look-alike is Agaricus xanthodermus, which is toxic and smells chemical instead of sweet.' } },
        { '@type': 'Question', name: 'Can AI identify Horse Mushroom?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, a mushroom identifier app can analyze features like cap, gills, and habitat to suggest matches, but results should always be verified.' } },
      ],
    },
  ],
}

export default function HorseMushroomPage() {
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
            <span>Agaricus arvensis Horse Mushroom</span>
          </nav>

          {/* Badge + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>Edible</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f9731620', color: '#f97316' }}>Medium Risk</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Horse Mushroom (<em>Agaricus arvensis</em>): Identification, Features, Habitat &amp; Safety Guide
            </h1>
            <AuthorBlock updatedAt="Mar 31, 2026" />
            <ArticleViewCount views={1860} className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The <strong style={{ color: 'var(--text-primary)' }}>Horse Mushroom (<em>Agaricus arvensis</em>)</strong> is a large, edible mushroom commonly found in grasslands and pastures. It is known for its white cap, pink-to-brown gills, strong anise-like smell, and prominent ring on the stem. While it is considered edible and popular among foragers, it closely resembles toxic look-alikes such as <em>Agaricus xanthodermus</em>. Correct identification requires examining cap, gills, stem, smell, habitat, and growth pattern, which tools like a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> can help analyze using AI and image recognition.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-12">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <Image
                src="/agaricus-arvensis-horse-mushroom.webp"
                alt="Agaricus arvensis horse mushroom identification — large white cap in grassland habitat"
                width={820}
                height={546}
                sizes="(max-width: 768px) 100vw, 820px"
                className="w-full object-cover"
                priority
                style={{ display: 'block' }}
              />
            </div>
            <figcaption className="text-center text-xs mt-3 space-y-1" style={{ color: 'var(--text-faint)' }}>
              <p><em>Agaricus arvensis</em> (Horse Mushroom) — large white cap specimen in natural habitat</p>
              <p>Source: commons.wikimedia.org/wiki/File:Horse_mushroom_(Agaricus_arvensis).jpg — CC BY 2.0, Rictor Norton &amp; David Allen</p>
            </figcaption>
          </figure>

          {/* ── Quick ID Summary Card ── */}
          <div className="rounded-2xl p-6 mb-10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="font-playfair text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Quick Identification Summary</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {[
                ['Scientific Name', 'Agaricus arvensis'],
                ['Common Names', 'Horse Mushroom, Snowball Mushroom'],
                ['Edibility', 'Edible (with caution)'],
                ['Risk Level', 'Medium — toxic look-alikes exist'],
                ['Key Features', 'Large white cap, pink → brown gills, anise smell, thick ring'],
                ['Found In', 'Grasslands, pastures, open meadows — Europe, North America, Asia'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="font-semibold flex-shrink-0 w-32" style={{ color: 'var(--text-primary)' }}>{label}:</span>
                  <span style={{ color: 'var(--text-muted)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div className="lg:hidden"><TableOfContents /></div>

          {/* ── Taxonomy ── */}
          <Section>
            <H2 id="family-species">Family and Species</H2>
            <div className="grid md:grid-cols-2 gap-4 my-5">
              <ComparisonTable
                headers={['Rank', 'Classification']}
                rows={[
                  ['Kingdom', 'Fungi'],
                  ['Division', 'Basidiomycota'],
                  ['Class', 'Agaricomycetes'],
                  ['Order', 'Agaricales'],
                  ['Family', 'Agaricaceae'],
                  ['Genus', 'Agaricus'],
                  ['Species', 'Agaricus arvensis'],
                ]}
              />
              <div className="p-5 rounded-xl flex flex-col justify-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The Horse Mushroom belongs to the <strong style={{ color: 'var(--text-primary)' }}>Agaricaceae</strong> family, the same broader group that includes many familiar gilled mushrooms. Within the genus <em>Agaricus</em>, species are often identified by their pink-to-brown gills, ring on the stem, and lack of a volva — but can still vary in smell, staining reaction, and habitat.
                </p>
              </div>
            </div>
          </Section>

          <Divider />

          {/* ── Dimensions ── */}
          <Section>
            <H2>Dimensions</H2>
            <p>The dimensions of Horse Mushroom are helpful because it is usually larger and more robust than many similar field mushrooms.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              {[
                { label: 'Cap Diameter', value: '8–20 cm', icon: '🍄' },
                { label: 'Stem Height', value: '5–15 cm', icon: '📏' },
                { label: 'Stem Width', value: '1.5–3 cm', icon: '⬛' },
                { label: 'Ring Size', value: 'Large & thick', icon: '💍' },
              ].map((d) => (
                <div key={d.label} className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl mb-2">{d.icon}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: 'var(--accent)' }}>{d.value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-faint)' }}>{d.label}</div>
                </div>
              ))}
            </div>
            <p>Its broad white cap, sturdy stem, and substantial double ring make it a fairly impressive mushroom in grassland habitats. Size alone should never be used for identification, but it supports other features such as gill color, smell, and growth pattern.</p>
          </Section>

          <Divider />

          {/* ── Key Features ── */}
          <Section>
            <H2>Key Features (Identification Characteristics)</H2>

            <H3>Cap (Pileus)</H3>
            <p>The cap is large, smooth, and white, often becoming slightly yellowish with age.</p>
            <ul>
              <li><strong>Shape:</strong> Convex when young → flat when mature</li>
              <li><strong>Surface:</strong> Smooth, sometimes slightly scaly</li>
              <li><strong>Size:</strong> 8–20 cm wide</li>
              <li><strong>Texture:</strong> Dry to slightly silky</li>
            </ul>
            <p>Cap color alone is not reliable — always combine with other features.</p>

            <H3>Gills (Lamellae)</H3>
            <p>The gills are free from the stem and change color as the mushroom matures.</p>
            <ul>
              <li><strong>Young stage:</strong> Pale pink</li>
              <li><strong>Mature stage:</strong> Dark brown</li>
              <li><strong>Attachment:</strong> Free gills (not touching the stem)</li>
            </ul>
            <p>This color progression is a key trait of many <em>Agaricus</em> species.</p>

            <H3>Stem (Stipe)</H3>
            <ul>
              <li><strong>Height:</strong> 5–15 cm</li>
              <li><strong>Structure:</strong> Solid, slightly bulbous at the base</li>
              <li><strong>Color:</strong> White, sometimes yellowish when handled</li>
            </ul>
            <p>The stem helps elevate the cap for better spore dispersal.</p>

            <H3>Ring (Annulus)</H3>
            <p>One of the most distinctive features of the Horse Mushroom is its large, double ring.</p>
            <ul>
              <li>Thick and hanging (skirt-like)</li>
              <li>Often persistent even in mature mushrooms</li>
              <li>May show a <strong>cogwheel-like pattern</strong> underneath</li>
            </ul>
            <InfoBox>The cogwheel ring pattern is a highly reliable identification feature unique to <em>Agaricus arvensis</em>.</InfoBox>

            <H3>Volva (Basal Cup)</H3>
            <p><strong>Absent</strong> in Horse Mushroom — no cup or sac at the base. This helps distinguish it from dangerous species like <em>Amanita</em>, which have a volva.</p>
          </Section>

          <Divider />

          {/* ── Cogwheel Ring Image ── */}
          <figure className="my-10">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <Image
                src="/agaricus-arvensis-cogwheel-ring-annulus.webp"
                alt="Agaricus arvensis horse mushroom identification — cogwheel ring annulus pattern on stem underside"
                width={820}
                height={408}
                className="w-full object-contain"
                style={{ display: 'block', maxHeight: '420px', objectFit: 'contain', padding: '12px' }}
              />
            </div>
            <figcaption className="text-center text-sm mt-3 space-y-1" style={{ color: 'var(--text-faint)' }}>
              <p><em>Agaricus arvensis</em> — the distinctive cogwheel (gear-tooth) pattern on the underside of the ring (annulus)</p>
              <p className="text-xs">Source: commons.wikimedia.org/wiki/File:A._arvensis_showing_cogwheel.jpg — CC BY 3.0, Frank Gardiner (Zonda Grattus)</p>
            </figcaption>
          </figure>

          {/* ── Color, Smell, Taste ── */}
          <Section>
            <H2>Color, Smell, and Taste</H2>
            <div className="grid md:grid-cols-3 gap-4 my-6">
              {[
                { title: 'Color', icon: '🎨', items: ['Cap: White to cream', 'Gills: Pink → chocolate brown', 'Stem: White'] },
                { title: 'Smell', icon: '👃', items: ['Strong anise or almond-like smell', 'Most reliable identification feature', 'Absent in toxic look-alikes'] },
                { title: 'Taste', icon: '👅', items: ['Mild and pleasant', 'Only tested by experts', 'Never rely on taste alone'] },
              ].map((col) => (
                <div key={col.title} className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-2xl mb-2">{col.icon}</p>
                  <p className="font-semibold mb-3 text-sm" style={{ color: 'var(--accent)' }}>{col.title}</p>
                  <ul className="space-y-1">
                    {col.items.map((item) => (
                      <li key={item} className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <InfoBox>👉 The <strong>anise smell</strong> is one of the most reliable features in distinguishing this species from toxic look-alikes.</InfoBox>
          </Section>

          <Divider />

          {/* ── Growth & Seasonality ── */}
          <Section>
            <H2>Growth Pattern and Seasonality</H2>

            <H3>Growth Pattern</H3>
            <ul>
              <li>Found single or in groups</li>
              <li>Often forms <strong>fairy rings</strong> in grass</li>
            </ul>

            <H3>Seasonality</H3>
            <ul>
              <li>Typically appears in <strong>late summer to autumn</strong></li>
              <li>Often after rainfall</li>
            </ul>
          </Section>

          <Divider />

          {/* ── Young Specimen Image ── */}
          <figure className="my-10">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <Image
                src="/agaricus-arvensis-young-specimen-grassland.webp"
                alt="Agaricus arvensis horse mushroom identification — young specimen emerging from grassland soil"
                width={546}
                height={820}
                className="w-full object-contain"
                style={{ display: 'block', maxHeight: '480px', objectFit: 'contain', padding: '12px' }}
              />
            </div>
            <figcaption className="text-center text-sm mt-3 space-y-1" style={{ color: 'var(--text-faint)' }}>
              <p>Young <em>Agaricus arvensis</em> specimen — convex cap shape at early growth stage in grassland</p>
              <p className="text-xs">Source: commons.wikimedia.org/wiki/File:Pieczarka_polowa_vongrzanka.JPG — CC BY-SA 3.0, Von.grzanka</p>
            </figcaption>
          </figure>

          {/* ── Habitat ── */}
          <Section>
            <H2>Habitat, Environment &amp; Distribution</H2>

            <div className="grid md:grid-cols-3 gap-4 my-6">
              {[
                { title: 'Habitat', icon: '🌿', items: ['Grasslands', 'Meadows', 'Pastures', 'Lawns'] },
                { title: 'Environment', icon: '☀️', items: ['Open, sunny areas', 'Nutrient-rich soil', 'Often near grazing land'] },
                { title: 'Distribution', icon: '🌍', items: ['Widely found in Europe', 'Common in North America', 'Present in parts of Asia'] },
              ].map((col) => (
                <div key={col.title} className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="text-2xl mb-2">{col.icon}</p>
                  <p className="font-semibold mb-3 text-sm" style={{ color: 'var(--accent)' }}>{col.title}</p>
                  <ul className="space-y-1">
                    {col.items.map((item) => (
                      <li key={item} className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p>It is not typically found in dense forests.</p>
          </Section>

          <Divider />

          {/* ── Edibility & Safety ── */}
          <Section>
            <H2>Edibility, Safety &amp; Risk Level</H2>

            <H3>Is it Edible?</H3>
            <p>Yes, Horse Mushroom is edible and considered high-quality.</p>

            <WarningBox>
              ⚠️ <strong>Medium risk</strong> due to similarity with toxic species. The biggest danger is confusion with <em>Agaricus xanthodermus</em> (Yellow Stainer) — toxic — and some <em>Amanita</em> species which are highly toxic.
            </WarningBox>

            <H3>Who Should Avoid It</H3>
            <ul>
              <li>Beginners without identification experience</li>
              <li>Anyone unsure about identification</li>
              <li>Children and pets should avoid all wild mushrooms</li>
            </ul>
          </Section>

          <Divider />

          {/* ── Look-Alikes ── */}
          <Section>
            <H2>Similar Species (Look-Alikes Comparison)</H2>
            <ComparisonTable
              headers={['Feature', 'Horse Mushroom', 'Yellow Stainer (A. xanthodermus)']}
              rows={[
                ['Smell', 'Sweet, anise-like', 'Chemical, phenol-like'],
                ['Color change', 'Slight yellowing', 'Bright yellow staining'],
                ['Edibility', 'Edible', 'Toxic'],
                ['Habitat', 'Grassland', 'Grassland, urban areas'],
              ]}
            />
            <InfoBox>👉 <strong>Smell is the easiest way to distinguish these two.</strong> A strong, sweet anise smell = Horse Mushroom. A chemical or ink-like smell = Yellow Stainer.</InfoBox>
          </Section>

          <Divider />

          {/* ── Benefits ── */}
          <Section>
            <H2>Benefits and Value</H2>
            <p>Horse Mushroom is valued mainly for its culinary quality, nutritional value, and ecological role.</p>

            <H3>Nutritional and Practical Benefits</H3>
            <ul>
              <li>Contains protein, fiber, vitamins, and minerals</li>
              <li>Popular in foraging because of its large size and good texture</li>
              <li>Often appreciated for its pleasant anise-like smell</li>
              <li>Can be used in a range of cooked dishes when correctly identified</li>
            </ul>

            <H3>Ecological Benefits</H3>
            <ul>
              <li>Helps break down organic matter in soil</li>
              <li>Supports nutrient cycling in grassland ecosystems</li>
              <li>Contributes to healthy fungal biodiversity in meadows and pastures</li>
            </ul>

            <WarningBox>Its benefits only matter when the mushroom is <strong>correctly identified</strong>. Always rely on a combination of cap, gills, stem, ring, smell, habitat, and staining behavior.</WarningBox>

            <H3>Economic Value and Uses</H3>
            <ul>
              <li>Used in culinary dishes</li>
              <li>Sometimes sold in local markets</li>
              <li>Rich in protein, vitamins, and minerals</li>
              <li>Plays a role in ecosystem nutrient recycling</li>
            </ul>
          </Section>

          <Divider />

          {/* ── Pros & Cons ── */}
          <Section>
            <H2>Pros and Cons</H2>
            <div className="grid md:grid-cols-2 gap-4 my-5">
              <div className="p-5 rounded-xl" style={{ background: '#22c55e10', border: '1px solid #22c55e30' }}>
                <p className="font-semibold mb-3" style={{ color: '#22c55e' }}>Pros</p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Edible and nutritious</li>
                  <li>Easy to recognize with experience</li>
                  <li>Strong smell helps identification</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
                <p className="font-semibold mb-3" style={{ color: '#ef4444' }}>Cons</p>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Dangerous look-alikes exist</li>
                  <li>Requires careful inspection</li>
                  <li>Not beginner-friendly</li>
                </ul>
              </div>
            </div>
          </Section>

          <Divider />

          {/* ── AI Identifier ── */}
          <Section>
            <H2>How Our Mushroom Identifier Helps Identify This Species</H2>
            <p>Our <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">AI-based mushroom identification</Link> tool uses computer vision to analyze:</p>
            <div className="grid md:grid-cols-2 gap-3 my-5">
              {['Cap shape and size', 'Gill color progression', 'Stem and ring structure', 'Habitat and growth pattern'].map((feat) => (
                <div key={feat} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{feat}</span>
                </div>
              ))}
            </div>
            <p>By comparing these features with a database of fungal species, the tool helps reduce confusion between Horse Mushroom and toxic look-alikes.</p>
          </Section>

          <Divider />

          {/* ── FAQ ── */}
          <Section>
            <H2>Frequently Asked Questions</H2>
            <div className="space-y-4">
              {[
                { q: 'Is Horse Mushroom safe to eat?', a: 'Yes, it is edible, but only when correctly identified. It has toxic look-alikes, so caution is required.' },
                { q: 'What does Horse Mushroom smell like?', a: 'It has a strong anise or almond-like smell, which helps distinguish it from toxic species like the Yellow Stainer.' },
                { q: 'Where does Horse Mushroom grow?', a: 'It grows in grasslands, pastures, and open meadows, often forming fairy rings. It is commonly found across Europe, North America, and parts of Asia.' },
                { q: 'What mushrooms look like Horse Mushroom?', a: 'The main look-alike is Agaricus xanthodermus (Yellow Stainer), which is toxic and smells chemical instead of sweet.' },
                { q: 'Can AI identify Horse Mushroom?', a: 'Yes, a mushroom identifier app can analyze features like cap, gills, ring, and habitat to suggest matches, but results should always be verified by an expert.' },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <summary className="px-5 py-4 cursor-pointer font-semibold text-base list-none flex justify-between items-center" style={{ color: 'var(--text-primary)' }}>
                    {faq.q}
                    <span style={{ color: 'var(--accent)', fontSize: '20px', lineHeight: 1 }}>+</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ── Final Thoughts ── */}
          <Section>
            <H2>Final Thoughts</H2>
            <p>
              The <strong>Horse Mushroom (<em>Agaricus arvensis</em>)</strong> is a well-known edible species, but it requires careful identification due to similar toxic fungi. Understanding its cap, gills, stem, ring, smell, and habitat is essential for safe recognition.
            </p>
            <p>
              Using a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> alongside field knowledge can significantly improve accuracy — helping you explore fungi safely while avoiding dangerous mistakes.
            </p>
            <WarningBox>⚠️ <strong>Golden Rule:</strong> If you are not 100% sure of your identification, never consume a wild mushroom.</WarningBox>
          </Section>

          <RelatedPosts currentSlug="/agaricus-arvensis-horse-mushroom" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Reusable components ── */
function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-10 space-y-4">{children}</section>
}
function Divider() {
  return <hr className="my-10 border-0 h-px" style={{ background: 'var(--border)' }} />
}
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
function WarningBox({ children }: { children: React.ReactNode }) {
  return <div className="p-5 rounded-xl my-5 text-sm leading-relaxed" style={{ background: '#f9731615', border: '1px solid #f9731640', color: 'var(--text-primary)' }}>{children}</div>
}
function InfoBox({ children }: { children: React.ReactNode }) {
  return <div className="p-5 rounded-xl my-5 text-sm leading-relaxed" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>{children}</div>
}
function ComparisonTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: 'var(--accent-bg)' }}>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3" style={{ color: ci === 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: ci === 0 ? 600 : 400, borderBottom: '1px solid var(--border)' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
