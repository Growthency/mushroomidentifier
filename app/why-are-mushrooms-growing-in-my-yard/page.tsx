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
  title: 'Why Are Mushrooms Growing in My Yard?',
  description:
    'Mushrooms grow in your yard because underground fungi (mycelium) are actively breaking down organic matter in moist, shaded soil.',
  alternates: {
    canonical: 'https://mushroomidentifiers.com/why-are-mushrooms-growing-in-my-yard',
  },
  openGraph: {
    type: 'article',
    title: 'Why Are Mushrooms Growing in My Yard?',
    description:
      'Mushrooms grow in your yard because underground fungi (mycelium) are actively breaking down organic matter in moist, shaded soil.',
    url: 'https://mushroomidentifiers.com/why-are-mushrooms-growing-in-my-yard',
    images: [
      {
        url: 'https://mushroomidentifiers.com/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
        width: 640,
        height: 480,
        alt: 'why are mushrooms growing in my yard fairy ring lawn grass fungi',
      },
    ],
  },
}

const PAGE_URL = 'https://mushroomidentifiers.com/why-are-mushrooms-growing-in-my-yard'
const ORG_ID = 'https://mushroomidentifiers.com/#organization'

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      url: PAGE_URL,
      headline: 'Why Are Mushrooms Growing in My Yard? (Expert Investigation Guide)',
      description: 'Mushrooms grow in your yard because underground fungi (mycelium) are actively breaking down organic matter in moist, shaded soil.',
      datePublished: '2026-04-04',
      dateModified: '2026-04-04',
      inLanguage: 'en-US',
      image: {
        '@type': 'ImageObject',
        url: 'https://mushroomidentifiers.com/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
        width: 640,
        height: 480,
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
        { '@type': 'ListItem', position: 3, name: 'Why Are Mushrooms Growing in My Yard?', item: PAGE_URL },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Why do mushrooms suddenly appear overnight?',
          acceptedAnswer: { '@type': 'Answer', text: 'Because mushrooms grow quickly when moisture, temperature, and nutrients align, often after rain.' },
        },
        {
          '@type': 'Question',
          name: 'Are mushrooms a sign of healthy soil?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, they often indicate active decomposition and microbial life, but too many suggest excess moisture or organic buildup.' },
        },
        {
          '@type': 'Question',
          name: 'Can mushrooms spread across my lawn?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes, through spores and underground mycelium networks.' },
        },
        {
          '@type': 'Question',
          name: 'Do mushrooms damage grass?',
          acceptedAnswer: { '@type': 'Answer', text: 'No, they do not harm grass directly, but they indicate conditions that may affect lawn health.' },
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
const CheckList = ({ items, color = 'var(--accent)' }: { items: string[]; color?: string }) => (
  <ul className="space-y-2 my-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        <span className="flex-shrink-0 mt-0.5" style={{ color }}>✓</span>
        {item}
      </li>
    ))}
  </ul>
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

export default function WhyMushroomsInYardPage() {
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
            <span>Why Are Mushrooms Growing in My Yard?</span>
          </nav>

          {/* Badges + Title */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Yard Guide</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>Expert Investigation</span>
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Why Are Mushrooms Growing in My Yard? (Expert Investigation Guide)
            </h1>
            <AuthorBlock updatedAt="Apr 4, 2026" />
            <ArticleViewCount views={2510} className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Mushrooms grow in your yard because underground fungi (mycelium) are actively breaking down organic matter in moist, shaded soil. When conditions like high moisture, decaying roots, and low sunlight are present, fungi produce visible mushrooms (fruiting bodies). They are not random—they&apos;re a sign your soil ecosystem is active, but sometimes unbalanced.
            </p>
          </div>

          {/* Hero Image */}
          <ArticleImage
            src="/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp"
            alt="why are mushrooms growing in my yard fairy ring lawn grass fungi yard investigation"
            width={640}
            height={480}
            caption="Fairy rings at Tantallon — visible fungal growth patterns showing underground mycelium activity in lawn grass. Photo by M J Richardson, CC BY-SA 2.0, via geograph.org.uk / Wikimedia Commons"
            source="commons.wikimedia.org/wiki/File:Fairy_rings_at_Tantallon_-_geograph.org.uk_-_492140.jpg"
            priority
          />

          <Divider />
          <TableOfContents />

          {/* ── What Mushrooms Mean ── */}
          <Section>
            <H2 id="what-mushrooms-in-your-yard-actually-mean">What Mushrooms in Your Yard Actually Mean</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              From a research perspective, mushrooms are not the problem—they are the result of fungal activity beneath the surface. The real organism is the mycelium, a network of microscopic threads (hyphae) that live in soil and feed on organic material like dead roots, wood, and compost.
            </p>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              When environmental conditions align, this mycelium produces mushrooms to release spores, which help fungi reproduce and spread.
            </p>
            <div className="rounded-2xl p-5 my-4" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>In simple terms:</p>
              <p className="text-base font-bold" style={{ color: 'var(--accent)' }}>
                Mushrooms = visible signal of underground biological activity
              </p>
            </div>
          </Section>

          <Divider />

          {/* ── Main Reasons ── */}
          <Section>
            <H2 id="main-reasons-mushrooms-are-growing-in-your-yard">Main Reasons Mushrooms Are Growing in Your Yard</H2>

            {/* Moisture */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <H3 id="excess-moisture-water-retention">🌧️ Excess Moisture and Water Retention</H3>
              <p className="mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                Mushrooms thrive in wet environments, and moisture is the primary trigger for fungal growth.
              </p>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Common causes:</p>
              <BulletList items={[
                'Overwatering lawns or gardens',
                'Heavy rainfall or poor drainage',
                'Compacted soil trapping water',
                'Watering at night (low evaporation)',
                'Low-lying areas holding moisture',
              ]} />
              <TipBox>Moist soil allows mycelium to grow and produce mushrooms rapidly.</TipBox>
            </div>

            {/* Organic Matter */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <H3 id="decaying-organic-matter-fungi-food-source">🌿 Decaying Organic Matter (Fungi Food Source)</H3>
              <p className="mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                Fungi are natural decomposers. They break down organic materials in your yard.
              </p>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Typical sources:</p>
              <BulletList items={[
                'Buried tree roots or old stumps',
                'Dead grass (thatch layer)',
                'Fallen leaves and mulch',
                'Wood chips or compost',
                'Construction debris underground',
              ]} />
              <TipBox>The more organic material present, the more food fungi have.</TipBox>
            </div>

            {/* Second image */}
            <ArticleImage
              src="/why-are-mushrooms-growing-in-my-yard-mushrooms-in-grass-close-up.webp"
              alt="mushrooms growing in yard grass close-up unidentified lawn fungi moist soil"
              width={900}
              height={598}
              caption="Unidentified mushrooms growing in a residential lawn — a common sign of active mycelium in moist, organic-rich soil. Photo by J.smith, CC BY-SA 3.0, via Wikimedia Commons"
              source="commons.wikimedia.org/wiki/File:Mushrooms_in_the_grass.jpg"
            />

            {/* Shade */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <H3 id="shade-low-sunlight-poor-airflow">🌳 Shade, Low Sunlight &amp; Poor Airflow</H3>
              <p className="mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                Shaded areas create a cool, damp microclimate, ideal for fungal growth.
              </p>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Key factors:</p>
              <BulletList items={[
                'Dense trees blocking sunlight',
                'Overgrown shrubs',
                'Poor airflow across lawn',
                'Constant shade during the day',
              ]} />
              <TipBox>Sunlight naturally dries soil and limits fungal activity.</TipBox>
            </div>

            {/* Soil Conditions */}
            <div className="rounded-2xl p-5 mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <H3 id="soil-conditions-ecosystem-imbalance">🧱 Soil Conditions &amp; Ecosystem Imbalance</H3>
              <p className="mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                Mushrooms often indicate soil conditions that favor fungi over grass.
              </p>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Contributing factors:</p>
              <BulletList items={[
                'Nutrient imbalance in soil',
                'High organic content',
                'Poor soil structure',
                'Lack of aeration',
              ]} />
              <TipBox>Fungi are part of a natural soil ecosystem, not always harmful.</TipBox>
            </div>
          </Section>

          <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


          {/* ── Are Mushrooms Dangerous ── */}
          <Section>
            <H2 id="are-mushrooms-in-your-yard-dangerous">Are Mushrooms in Your Yard Dangerous?</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Most lawn mushrooms are harmless, but some can be toxic.
            </p>
            <WarningBox>
              <p className="font-semibold mb-2">Known dangerous species:</p>
              <ul className="space-y-1 mb-3">
                <li>• <em>Amanita phalloides</em> (Death Cap)</li>
                <li>• Other lookalike toxic fungi</li>
              </ul>
              <p>Never eat mushrooms from your yard unless properly identified.</p>
            </WarningBox>
            <div className="rounded-2xl p-4 my-4" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                💡 Not sure what species appeared in your yard? Use our{' '}
                <Link href="/" className="font-semibold underline underline-offset-2" style={{ color: 'var(--accent)' }}>
                  free mushroom identifier app
                </Link>{' '}
                — upload a photo for instant AI-powered species analysis and toxicity warnings.
              </p>
            </div>
          </Section>

          <Divider />

          {/* ── Should You Worry ── */}
          <Section>
            <H2 id="should-you-be-worried-about-lawn-mushrooms">Should You Be Worried About Lawn Mushrooms?</H2>
            <div className="grid sm:grid-cols-2 gap-5 mb-4">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(111,207,127,0.07)', border: '1px solid rgba(111,207,127,0.20)' }}>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--accent)' }}>✅ Usually Harmless</h3>
                <CheckList items={[
                  'Do not damage grass',
                  'Help break down organic matter',
                  'Improve nutrient cycling',
                ]} />
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.20)' }}>
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#f97316' }}>⚠️ When to Take Action</h3>
                <CheckList color="#f97316" items={[
                  'Frequent mushroom outbreaks',
                  'Unsafe for kids or pets',
                  'Aesthetic concerns',
                  'Signs of excessive moisture',
                ]} />
              </div>
            </div>
            <TipBox>Mushrooms are more of a symptom than a problem.</TipBox>
          </Section>

          <Divider />

          {/* ── Root Cause Checklist ── */}
          <Section>
            <H2 id="how-to-identify-the-root-cause">How to Identify the Root Cause (Quick Checklist)</H2>
            <div className="overflow-x-auto my-5">
              <table className="w-full text-sm border-collapse" style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: 'var(--accent-bg)' }}>
                    {['Symptom', 'Likely Cause', 'Fix'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold" style={{ color: 'var(--accent)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Mushrooms after rain', 'Excess moisture', 'Improve drainage'],
                    ['Mushrooms near trees', 'Decaying roots', 'Remove organic material'],
                    ['Mushrooms in shade', 'Low sunlight', 'Trim trees'],
                    ['Mushrooms year-round', 'Soil imbalance', 'Aerate + improve soil'],
                  ].map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-xs" style={{
                          color: j === 0 ? 'var(--text-primary)' : j === 2 ? 'var(--accent)' : 'var(--text-muted)',
                          fontWeight: j === 0 ? 600 : j === 2 ? 600 : 400,
                        }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


          {/* ── Scientific Insight ── */}
          <Section>
            <H2 id="scientific-insight-the-role-of-mycelium">Scientific Insight: The Role of Mycelium</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              From a biological perspective, fungi play a critical role in ecosystems.
            </p>

            {/* Third image */}
            <ArticleImage
              src="/why-are-mushrooms-growing-in-my-yard-marasmius-oreades-lawn-species.webp"
              alt="marasmius oreades lawn yard mushroom species mycelium underground fungi soil decomposition"
              width={450}
              height={600}
              caption="Marasmius oreades (fairy ring champignon) — one of the most common yard mushroom species, forming rings through underground mycelium networks. Photo by Jose Angel Urquia Goitia, CC BY-SA 4.0, via Wikimedia Commons"
              source="commons.wikimedia.org/wiki/File:Marasmius_oreades_2.jpg"
            />

            <BulletList items={[
              'Mycelium breaks down organic matter into nutrients',
              'Helps recycle carbon and nitrogen',
              'Supports soil structure and plant health',
              'Connects plant roots in some ecosystems',
            ]} />
            <TipBox>Removing mushrooms does not remove fungi — the mycelium remains underground.</TipBox>
          </Section>

          <Divider />

          {/* ── People Also Ask / FAQ ── */}
          <Section>
            <H2 id="people-also-ask">People Also Ask</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'Why do mushrooms suddenly appear overnight?',
                  a: 'Because mushrooms grow quickly when moisture, temperature, and nutrients align, often after rain.',
                },
                {
                  q: 'Are mushrooms a sign of healthy soil?',
                  a: 'Yes, they often indicate active decomposition and microbial life, but too many suggest excess moisture or organic buildup.',
                },
                {
                  q: 'Can mushrooms spread across my lawn?',
                  a: 'Yes, through spores and underground mycelium networks.',
                },
                {
                  q: 'Do mushrooms damage grass?',
                  a: 'No, they do not harm grass directly, but they indicate conditions that may affect lawn health.',
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

          <Divider />

          {/* ── Final Insight ── */}
          <Section>
            <H2 id="final-insight">Final Insight (Research Perspective)</H2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Mushrooms in your yard are not random—they are a biological signal of moisture, organic matter, and fungal activity. Instead of trying to eliminate them completely, focus on adjusting soil conditions, improving drainage, and reducing organic buildup.
            </p>
            <div className="rounded-2xl p-5" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}>
              <p className="text-base font-semibold text-center" style={{ color: 'var(--accent)' }}>
                👉 Control the environment, and mushrooms will naturally decline.
              </p>
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              If you find an unknown mushroom species in your yard and want to know whether it is safe, use our{' '}
              <Link href="/" className="font-semibold underline underline-offset-2" style={{ color: 'var(--accent)' }}>
                mushroom identifier by picture
              </Link>{' '}
              — upload a photo from multiple angles and get an instant AI analysis with toxicity warnings.
            </p>
          </Section>

          <RelatedPosts currentSlug="/why-are-mushrooms-growing-in-my-yard" />
          <BlogComments slug="/why-are-mushrooms-growing-in-my-yard" />
            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
