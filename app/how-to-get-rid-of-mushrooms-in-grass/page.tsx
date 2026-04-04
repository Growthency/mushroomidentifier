import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import AuthorBlock from '@/components/blog/AuthorBlock'

export const metadata: Metadata = {
  title: 'How to Get Rid of Mushrooms in Grass (Easy Lawn Fix Guide)',
  description:
    'Learn how to remove mushrooms from your lawn fast. Fix moisture, soil, and drainage issues to stop mushrooms from coming back permanently.',
  alternates: {
    canonical: 'https://mushroomidentifiers.com/how-to-get-rid-of-mushrooms-in-grass',
  },
  openGraph: {
    title: 'How to Get Rid of Mushrooms in Grass (Easy Lawn Fix Guide)',
    description:
      'Learn how to remove mushrooms from your lawn fast. Fix moisture, soil, and drainage issues to stop mushrooms from coming back permanently.',
    url: 'https://mushroomidentifiers.com/how-to-get-rid-of-mushrooms-in-grass',
    images: [
      {
        url: 'https://mushroomidentifiers.com/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
        width: 800,
        height: 600,
        alt: 'how to get rid of mushrooms in grass fairy ring lawn removal',
      },
    ],
  },
}

const PAGE_URL = 'https://mushroomidentifiers.com/how-to-get-rid-of-mushrooms-in-grass'
const ORG_ID = 'https://mushroomidentifiers.com/#organization'

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      url: PAGE_URL,
      headline: 'How Do I Get Rid of Mushrooms in My Grass? (Complete Lawn Guide)',
      description: 'Learn how to remove mushrooms from your lawn fast. Fix moisture, soil, and drainage issues to stop mushrooms from coming back permanently.',
      datePublished: '2026-04-04',
      dateModified: '2026-04-04',
      inLanguage: 'en-US',
      image: {
        '@type': 'ImageObject',
        url: 'https://mushroomidentifiers.com/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
        width: 800,
        height: 600,
      },
      author: { '@type': 'Organization', '@id': ORG_ID, name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', '@id': ORG_ID, name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
      isPartOf: { '@type': 'WebSite', '@id': 'https://mushroomidentifiers.com/#website', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mushroomidentifiers.com/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://mushroomidentifiers.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'How to Get Rid of Mushrooms in Grass', item: PAGE_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Why do mushrooms keep coming back in my lawn?',
          acceptedAnswer: { '@type': 'Answer', text: 'Because the mycelium remains underground, and if moisture and organic matter are present, mushrooms will regrow. You need to remove the food source and fix drainage to stop them permanently.' },
        },
        {
          '@type': 'Question',
          name: 'Does vinegar kill mushrooms in grass?',
          acceptedAnswer: { '@type': 'Answer', text: 'Vinegar can kill visible mushrooms but may damage grass and does not eliminate underground fungi. It is a short-term fix that does not address the root cause.' },
        },
        {
          '@type': 'Question',
          name: 'Are mushrooms a sign of healthy soil?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, they indicate active decomposition and nutrient cycling, but excessive growth suggests moisture imbalance or too much organic matter in the soil.' },
        },
        {
          '@type': 'Question',
          name: 'Can I mow over mushrooms?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, but mowing can spread spores across your lawn. It is better to remove mushrooms by hand before mowing to prevent further spread.' },
        },
      ],
    },
  ],
}

/* ── Layout primitives ── */
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
const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-xl my-4" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}>
    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{children}</div>
  </div>
)
const TipBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-4" style={{ background: 'rgba(111,207,127,0.08)', border: '1px solid rgba(111,207,127,0.22)' }}>
    <span className="text-lg flex-shrink-0">👉</span>
    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{children}</p>
  </div>
)
const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-4" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.20)' }}>
    <span className="text-lg flex-shrink-0">☠️</span>
    <div className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{children}</div>
  </div>
)
const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 my-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', marginTop: '6px' }} />
        {item}
      </li>
    ))}
  </ul>
)
const ArticleImage = ({
  src, alt, width, height, caption, source, priority,
}: {
  src: string; alt: string; width: number; height: number;
  caption: string; source: string; priority?: boolean;
}) => (
  <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
    <div style={{ background: 'var(--bg-secondary)' }}>
      <Image
        src={src} alt={alt} width={width} height={height}
        sizes="(max-width: 768px) 100vw, 820px"
        className="w-full object-contain"
        style={{ maxHeight: '460px', objectFit: 'contain' }}
        priority={priority}
      />
    </div>
    <figcaption className="px-4 py-2.5 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
      {caption} — Source: {source}
    </figcaption>
  </figure>
)

export default function MushroomsInGrassPage() {
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
            <span>How to Get Rid of Mushrooms in Grass</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Lawn Guide</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>Lawn Care</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              How Do I Get Rid of Mushrooms in My Grass? (Complete Lawn Guide)
            </h1>
            <AuthorBlock />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Mushrooms in grass are caused by underground fungal networks called mycelium, which thrive in moist soil rich in organic matter. To get rid of them effectively, you need to remove visible mushrooms, reduce moisture, improve soil drainage, and eliminate decaying material like roots and thatch. Simply removing mushrooms is not enough—long-term control comes from changing the lawn conditions that allow fungi to grow.
            </p>
          </div>

          {/* Featured Image — Fairy Ring */}
          <ArticleImage
            src="/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp"
            alt="how to get rid of mushrooms in grass fairy ring lawn fungal growth removal"
            width={800}
            height={600}
            caption="Fairy ring — a classic sign of underground mycelium spreading through lawn grass. Photo by David Gough (Aviddoghug), Public Domain, via Wikimedia Commons"
            source="commons.wikimedia.org/wiki/File:Fairy_Ring_0004.JPG"
            priority
          />

          <Divider />
          <TableOfContents />

          {/* ── Why Mushrooms Grow ── */}
          <Section>
            <H2 id="why-mushrooms-grow-in-grass">Why Mushrooms Grow in Grass</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Mushrooms are the visible fruiting bodies of fungi, formed when underground mycelium finds ideal conditions such as moisture, shade, and organic nutrients. Common lawn fungi break down dead roots, wood fragments, and organic debris, which is why they often appear after rain or heavy watering.
            </p>

            <H3 id="excess-moisture-poor-drainage">🌱 Excess Moisture &amp; Poor Drainage</H3>
            <p className="mb-3" style={{ color: 'var(--text-muted)' }}>
              Excess water creates the perfect environment for fungal growth, allowing mycelium to expand and produce mushrooms rapidly. Lawns that stay damp for long periods—especially after rain—encourage fungal fruiting cycles.
            </p>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Key factors:</p>
            <BulletList items={[
              'Overwatering or frequent irrigation',
              'Poor soil drainage or compacted soil',
              'Low-lying areas where water collects',
              'Watering at night (reduces evaporation)',
              'Clay-heavy soil holding moisture',
            ]} />
            <TipBox>Moisture control is the #1 factor in stopping mushrooms.</TipBox>

            <H3 id="decaying-organic-matter">🌿 Decaying Organic Matter (Fungal Food Source)</H3>
            <p className="mb-3" style={{ color: 'var(--text-muted)' }}>
              Fungi feed on organic matter decomposition, meaning mushrooms often grow where nutrients are available from buried materials.
            </p>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Common sources:</p>
            <BulletList items={[
              'Dead tree roots and stumps',
              'Buried wood or construction debris',
              'Thick thatch layer (dead grass)',
              'Fallen leaves and mulch buildup',
              'Old compost or organic-rich soil',
            ]} />
            <TipBox>Removing these reduces the food supply for fungi.</TipBox>

            {/* Marasmius oreades close-up image */}
            <ArticleImage
              src="/how-to-get-rid-of-mushrooms-in-grass-marasmius-oreades-lawn-mushroom.webp"
              alt="marasmius oreades mushrooms growing in lawn grass how to remove lawn mushrooms"
              width={820}
              height={547}
              caption="Marasmius oreades (fairy ring champignon) — one of the most common mushroom species found growing in lawns and garden grass. Photo by Strobilomyces, CC BY-SA 3.0, via Wikimedia Commons"
              source="commons.wikimedia.org/wiki/File:Marasmius_oreades_garden_050829B.JPG"
            />

            <H3 id="shade-poor-airflow">🌳 Shade, Poor Airflow &amp; Low Sunlight</H3>
            <p className="mb-3" style={{ color: 'var(--text-muted)' }}>
              Shaded lawns create a cool, damp microclimate, which supports fungal growth and slows evaporation.
            </p>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Contributing factors:</p>
            <BulletList items={[
              'Dense tree canopy',
              'Overgrown shrubs and hedges',
              'Limited sunlight exposure',
              'Poor air circulation',
            ]} />
            <TipBox>Sunlight helps dry soil and disrupt fungal growth cycles.</TipBox>
          </Section>

          <Divider />

          {/* ── Step-by-Step Removal ── */}
          <Section>
            <H2 id="how-to-remove-mushrooms-from-lawn">Step-by-Step: How to Remove Mushrooms from Lawn</H2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              To eliminate mushrooms effectively, you need both immediate removal and long-term lawn correction.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: '✂️',
                  id: 'remove-mushrooms-before-spore-release',
                  title: 'Remove Mushrooms Before Spore Release',
                  desc: 'Mushrooms reproduce through spores, which spread easily across your lawn if left untreated.',
                  label: 'Best practices:',
                  items: [
                    'Pick mushrooms by hand (remove cap + stem)',
                    'Use gloves to avoid contact with unknown species',
                    'Dispose in sealed bags (not compost)',
                    'Remove early before spores release',
                  ],
                  tip: 'This prevents further spread of fungi.',
                },
                {
                  icon: '💧',
                  id: 'adjust-watering-habits',
                  title: 'Adjust Watering Habits',
                  desc: 'Controlling water is essential because fungi depend on moisture for growth.',
                  label: 'What to do:',
                  items: [
                    'Water deeply but less frequently',
                    'Allow soil to dry between watering',
                    'Water early morning (not evening)',
                    'Monitor rainfall before watering',
                  ],
                  tip: 'Balanced watering disrupts fungal lifecycle conditions.',
                },
                {
                  icon: '🌬️',
                  id: 'improve-soil-aeration-drainage',
                  title: 'Improve Soil Aeration &amp; Drainage',
                  desc: 'Compacted soil traps moisture and limits oxygen, which encourages fungal activity.',
                  label: 'Solutions:',
                  items: [
                    'Core aeration (improves oxygen flow)',
                    'Add sand or organic amendments',
                    'Break up compacted soil layers',
                    'Level uneven ground',
                  ],
                  tip: 'Aeration reduces moisture retention and improves soil health.',
                },
                {
                  icon: '🍂',
                  id: 'remove-thatch-organic-debris',
                  title: 'Remove Thatch &amp; Organic Debris',
                  desc: 'Thatch acts as both a moisture trap and food source for fungi.',
                  label: 'Removal methods:',
                  items: [
                    'Dethatching with rake or machine',
                    'Regular leaf cleanup',
                    'Removing old roots and wood',
                    'Reducing organic buildup',
                  ],
                  tip: 'Less organic matter = less fungal growth.',
                },
                {
                  icon: '☀️',
                  id: 'increase-sunlight-airflow',
                  title: 'Increase Sunlight &amp; Airflow',
                  desc: 'Improving environmental conditions makes your lawn less suitable for fungi.',
                  label: 'How to improve:',
                  items: [
                    'Trim tree branches',
                    'Thin dense shrubs',
                    'Increase lawn exposure to sunlight',
                    'Improve airflow across lawn',
                  ],
                  tip: 'Dry, sunny lawns are unfavorable for mushrooms.',
                },
              ].map((step) => (
                <div key={step.id} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 id={step.id} className="font-playfair text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {step.icon} <span dangerouslySetInnerHTML={{ __html: step.title }} />
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>{step.label}</p>
                  <BulletList items={step.items} />
                  <TipBox>{step.tip}</TipBox>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ── Fungicide ── */}
          <Section>
            <H2 id="should-you-use-fungicide">Should You Use Fungicide?</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Fungicides target fungi but often fail to eliminate mycelium in soil, making them a short-term solution.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-4">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
                <h3 className="font-semibold mb-3 text-sm" style={{ color: '#ef4444' }}>⚠️ Limitations of Fungicides</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Chemical treatments do not address the root cause of mushroom growth.</p>
                <BulletList items={[
                  'Temporary results only',
                  'Mushrooms return if conditions remain',
                  'Can harm beneficial soil microbes',
                  'Expensive for repeated use',
                ]} />
                <TipBox>Fungicides treat symptoms, not the underlying ecosystem.</TipBox>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(111,207,127,0.07)', border: '1px solid rgba(111,207,127,0.20)' }}>
                <h3 className="font-semibold mb-3 text-sm" style={{ color: 'var(--accent)' }}>✅ When Fungicide May Help</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>In rare cases, fungicides can be part of lawn management.</p>
                <BulletList items={[
                  'Severe recurring fungal outbreaks',
                  'Professional lawn care treatment plans',
                  'Large commercial landscapes',
                ]} />
                <TipBox>Always combine with moisture and soil control.</TipBox>
              </div>
            </div>
          </Section>

          <Divider />

          {/* ── Natural Prevention ── */}
          <Section>
            <H2 id="natural-ways-to-prevent-mushrooms">Natural Ways to Prevent Mushrooms</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Natural lawn care focuses on creating conditions that fungi do not prefer.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <H3 id="improve-soil-balance">🌿 Improve Soil Balance</H3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Healthy soil reduces fungal dominance.</p>
                <BulletList items={[
                  'Add nitrogen fertilizer (breaks down organic matter faster)',
                  'Maintain balanced soil nutrients',
                  'Avoid excessive compost buildup',
                ]} />
                <TipBox>Balanced soil reduces fungal food availability.</TipBox>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <H3 id="maintain-lawn-health">🌾 Maintain Lawn Health</H3>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>A strong lawn resists fungal overgrowth.</p>
                <BulletList items={[
                  'Regular mowing (not too short)',
                  'Proper fertilization',
                  'Overseeding weak areas',
                  'Soil testing for balance',
                ]} />
                <TipBox>Healthy grass competes with fungi.</TipBox>
              </div>
            </div>
          </Section>

          <Divider />

          {/* ── Quick Fix vs Long-Term ── */}
          <Section>
            <H2 id="quick-fix-vs-long-term-solution">Quick Fix vs Long-Term Solution</H2>
            <div className="overflow-x-auto my-5">
              <table className="w-full text-sm border-collapse" style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: 'var(--accent-bg)' }}>
                    {['Approach', 'Result', 'Effectiveness'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold" style={{ color: 'var(--accent)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Removing mushrooms', 'Immediate visual removal', 'Short-term'],
                    ['Fixing drainage', 'Reduces moisture', 'Long-term'],
                    ['Removing organic matter', 'Cuts fungal food source', 'Long-term'],
                    ['Fungicide use', 'Temporary control', 'Limited'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-xs" style={{
                          color: j === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                          fontWeight: j === 0 ? 600 : 400,
                          ...(j === 2 && cell === 'Long-term' ? { color: 'var(--accent)', fontWeight: 600 } : {}),
                          ...(j === 2 && cell === 'Short-term' ? { color: '#f97316', fontWeight: 600 } : {}),
                          ...(j === 2 && cell === 'Limited' ? { color: '#ef4444', fontWeight: 600 } : {}),
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Divider />

          {/* ── Are Lawn Mushrooms Dangerous ── */}
          <Section>
            <H2 id="are-lawn-mushrooms-dangerous">Are Lawn Mushrooms Dangerous?</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Most lawn mushrooms are harmless, but some can be toxic or deadly.
            </p>

            {/* Third image — Marasmius oreades close-up */}
            <ArticleImage
              src="/mushrooms-in-lawn-grass-mycelium-fungal-growth-removal.webp"
              alt="mushrooms in lawn grass mycelium fungal growth removal how to get rid of lawn mushrooms"
              width={800}
              height={600}
              caption="Marasmius oreades — a common lawn mushroom species. Always identify before handling; some mushrooms growing in grass can be toxic. Photo by Archenzo, CC BY-SA 3.0, via Wikimedia Commons"
              source="commons.wikimedia.org/wiki/File:Marasmius_oreades.JPG"
            />

            <WarningBox>
              <p className="font-semibold mb-1">Toxic Mushroom Risk</p>
              <p className="mb-2">Some species growing in lawns may belong to dangerous groups such as:</p>
              <ul className="space-y-1">
                <li>• <em>Amanita phalloides</em> (Death Cap)</li>
                <li>• Other toxic fungi with similar appearance to edible species</li>
              </ul>
              <p className="mt-2">Never consume wild mushrooms without proper identification by an expert.</p>
            </WarningBox>
          </Section>

          <Divider />

          {/* ── People Also Ask / FAQ ── */}
          <Section>
            <H2 id="people-also-ask">People Also Ask</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Why do mushrooms keep coming back in my lawn?',
                  a: 'Because the mycelium remains underground, and if moisture and organic matter are present, mushrooms will regrow. You need to remove the food source and fix drainage to stop them permanently.',
                },
                {
                  q: 'Does vinegar kill mushrooms in grass?',
                  a: 'Vinegar can kill visible mushrooms but may damage grass and does not eliminate underground fungi. It is a short-term fix that does not address the root cause.',
                },
                {
                  q: 'Are mushrooms a sign of healthy soil?',
                  a: 'Yes, they indicate active decomposition and nutrient cycling, but excessive growth suggests moisture imbalance or too much organic matter in the soil.',
                },
                {
                  q: 'Can I mow over mushrooms?',
                  a: 'Yes, but mowing can spread spores across your lawn. It is better to remove mushrooms by hand before mowing to prevent further spread.',
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <h3 className="font-playfair font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
                    ❓ {item.q}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </Section>

          <RelatedPosts currentSlug="/how-to-get-rid-of-mushrooms-in-grass" />
        </article>
      </div>
    </>
  )
}
