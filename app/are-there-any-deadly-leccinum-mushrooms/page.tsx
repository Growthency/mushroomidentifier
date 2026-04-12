import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import IdentifyBanner from '@/components/blog/IdentifyBanner'
import TableOfContents from '@/components/blog/TableOfContents'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import LiveViewCount from '@/components/blog/LiveViewCount'
import ViewTracker from '@/components/blog/ViewTracker'

export const metadata: Metadata = {
  title: 'Are There Any Deadly Leccinum Mushrooms?',
  description:
    'There are no confirmed deadly species in the genus Leccinum. However, that does not automatically make them safe. Several Leccinum mushrooms have been linked to gastrointestinal poisoning, especially when undercooked, eaten in large amounts, or misidentified.',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Are There Any Deadly Leccinum Mushrooms?',
      description:
        'There are no confirmed deadly species in the genus Leccinum. However, that does not automatically make them safe. Several Leccinum mushrooms have been linked to gastrointestinal poisoning, especially when undercooked, eaten in large amounts, or misidentified.',
      image: [
        'https://mushroomidentifiers.com/leccinum-scabrum-birch-bolete-identification.webp',
        'https://mushroomidentifiers.com/leccinum-aurantiacum-orange-birch-bolete.webp',
        'https://mushroomidentifiers.com/leccinum-mushroom-pores-cross-section-identification.webp',
      ],
      author: { '@type': 'Organization', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/' },
      publisher: {
        '@type': 'Organization',
        name: 'Mushroom Identifier',
        url: 'https://mushroomidentifiers.com/',
        email: 'support@mushroomidentifiers.com',
        logo: { '@type': 'ImageObject', url: 'https://mushroomidentifiers.com/logo.png' },
      },
      datePublished: '2026-04-05',
      dateModified: '2026-04-05',
      mainEntityOfPage: 'https://mushroomidentifiers.com/are-there-any-deadly-leccinum-mushrooms',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can Leccinum kill you?',
          acceptedAnswer: { '@type': 'Answer', text: 'No confirmed fatal cases exist from Leccinum mushrooms, but they can cause significant digestive illness, especially when eaten raw or undercooked.' },
        },
        {
          '@type': 'Question',
          name: 'Are all boletes safe to eat?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. While many boletes are edible, some species cause stomach upset, bitter taste, or gastrointestinal reactions. Proper identification and full cooking are essential.' },
        },
        {
          '@type': 'Question',
          name: 'Why do some people react differently to Leccinum?',
          acceptedAnswer: { '@type': 'Answer', text: 'Individual differences in digestion, cooking methods used, and species variation within the Leccinum genus all contribute to variable reactions among people who consume these mushrooms.' },
        },
        {
          '@type': 'Question',
          name: 'Is Leccinum safe for beginners?',
          acceptedAnswer: { '@type': 'Answer', text: 'Not always. Beginners should focus on easier, clearly identifiable species first. Leccinum requires careful species-level identification and must always be thoroughly cooked before eating.' },
        },
        {
          '@type': 'Question',
          name: 'Are there any deadly Leccinum mushrooms?',
          acceptedAnswer: { '@type': 'Answer', text: 'There are no scientifically verified fatal poisonings directly caused by Leccinum species. However, several species have caused serious gastrointestinal illness, particularly when undercooked or misidentified.' },
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
const TipBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-5" style={{ background: '#22c55e15', border: '1px solid #22c55e40' }}>
    <span className="text-xl flex-shrink-0">👉</span>
    <div style={{ color: 'var(--text-muted)' }}>{children}</div>
  </div>
)

export default function LeccinumPage() {
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
                <span>Are There Any Deadly Leccinum Mushrooms?</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>Edibility Guide</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>Forager Safety</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  Are There Any Deadly Leccinum Mushrooms?
                </h1>
                <AuthorBlock updatedAt="Apr 5, 2026" />
                <LiveViewCount slug="/are-there-any-deadly-leccinum-mushrooms" className="mb-2" />
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  There are no confirmed deadly species in the genus <em>Leccinum</em>. However, that does not
                  automatically make them safe. Several Leccinum mushrooms have been linked to gastrointestinal
                  poisoning, especially when undercooked, eaten in large amounts, or misidentified. For foragers, the
                  real risk is not fatal toxicity—but false confidence, lookalikes, and preparation mistakes.
                </p>
              </div>

              {/* Hero Image */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full">
                  <Image
                    src="/leccinum-scabrum-birch-bolete-identification.webp"
                    alt="Leccinum scabrum birch bolete identification — brown cap with scaber stem in forest"
                    width={820}
                    height={560}
                    sizes="(max-width: 768px) 100vw, 820px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  <em>Leccinum scabrum</em> (Birch Bolete) — Photo: Jean-Pol GRANDMONT, CC BY-SA 3.0, via Wikimedia Commons
                  &nbsp;|&nbsp; Source: commons.wikimedia.org/wiki/File:Leccinum_scabrum_JPG7.jpg
                </figcaption>
              </figure>

              <Divider />
              <TableOfContents />
              <Divider />

              {/* Section 1 — What is Leccinum */}
              <Section>
                <H2 id="what-is-leccinum">What Is Leccinum? (Understanding the Genus)</H2>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  <em>Leccinum</em> is a genus of bolete mushrooms in the family Boletaceae, commonly referred to as
                  scaber-stalk boletes. These fungi are widely distributed across Europe, North America, and parts of
                  Asia, typically forming symbiotic relationships (mycorrhiza) with trees like birch, oak, and aspen.
                </p>
                <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                  Unlike gilled mushrooms, <em>Leccinum</em> species belong to a group where the underside of the cap
                  consists of tiny pores (tubes) instead of gills. This alone places them in a different identification
                  category than many deadly mushrooms. For anyone learning{' '}
                  <Link href="/" className="underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identification
                  </Link>
                  , understanding this structural difference is the first critical step.
                </p>

                <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="px-5 py-3 font-semibold text-sm" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}>
                    🔍 Core Identification Features
                  </div>
                  <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {[
                      ['Cap (pileus)', 'Brown, orange, reddish, or tan — often smooth or slightly velvety'],
                      ['Underside', 'Sponge-like pores instead of gills'],
                      ['Stem (stipe)', 'Covered in rough, dark scabers (tiny dot-like scales)'],
                      ['Flesh reaction', 'May bruise or change color when cut'],
                      ['Spore print', 'Olive-brown'],
                      ['Habitat', 'Found near host trees (birch, oak, aspen)'],
                    ].map(([label, val]) => (
                      <li key={label} className="flex gap-3 px-5 py-3 text-sm">
                        <span className="font-semibold w-36 flex-shrink-0" style={{ color: 'var(--accent)' }}>{label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <TipBox>These features work together. A correct identification always requires multiple matching traits, not just one.</TipBox>
              </Section>

              <Divider />

              {/* Section 2 — Are Any Deadly */}
              <Section>
                <H2 id="are-any-deadly">Are Any Leccinum Mushrooms Deadly?</H2>

                <H3 id="no-confirmed-fatal">⚠️ No Confirmed Fatal Species</H3>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  There are no scientifically verified fatal poisonings directly caused by <em>Leccinum</em> species.
                  This separates them clearly from highly toxic genera like{' '}
                  <Link href="/amanita-phalloides-death-cap" className="underline font-medium" style={{ color: 'var(--accent)' }}>
                    Amanita phalloides
                  </Link>
                  , which contains some of the most dangerous mushrooms in the world. From a research and mycology
                  standpoint, <em>Leccinum</em> is generally categorized as:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Non-lethal genus</li>
                  <li>Conditionally edible or cautionary</li>
                  <li>Variable in human tolerance</li>
                </ul>

                {/* Image 2 */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full">
                    <Image
                      src="/leccinum-aurantiacum-orange-birch-bolete.webp"
                      alt="Leccinum aurantiacum orange birch bolete — reddish orange cap Leccinum species in woodland"
                      width={820}
                      height={560}
                      sizes="(max-width: 768px) 100vw, 820px"
                      className="w-full object-cover"
                      style={{ maxHeight: '420px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    <em>Leccinum aurantiacum</em> (Orange Birch Bolete) — Photo: Hans Hillewaert, CC BY-SA 4.0, via Wikimedia Commons
                    &nbsp;|&nbsp; Source: commons.wikimedia.org/wiki/File:Leccinum_aurantiacum.jpg
                  </figcaption>
                </figure>

                <H3 id="not-safe">🚨 But "Non-Deadly" Doesn't Mean Safe</H3>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  Even though they are not deadly, several <em>Leccinum</em> species have caused food poisoning
                  incidents, particularly in Europe and North America.
                </p>
                <WarningBox>
                  <p className="font-semibold mb-2">🤢 Reported Symptoms Include:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Nausea and vomiting</li>
                    <li>Abdominal cramps</li>
                    <li>Diarrhea</li>
                    <li>Digestive discomfort</li>
                  </ul>
                </WarningBox>
                <TipBox>These symptoms are usually temporary but can be severe, especially in sensitive individuals.</TipBox>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* Section 3 — Why Do Some Cause Illness */}
              <Section>
                <H2 id="why-cause-illness">Why Do Some Leccinum Mushrooms Cause Illness?</H2>

                <H3 id="improper-cooking">🍳 Improper Cooking Is the Biggest Risk</H3>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  One of the most important findings across field reports and mycological guides is that <em>Leccinum</em>{' '}
                  mushrooms <strong>must be fully cooked</strong> before consumption. Raw or undercooked specimens may contain:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Heat-sensitive toxins</li>
                  <li>Compounds that irritate the digestive system</li>
                </ul>
                <TipBox>Proper cooking significantly reduces risk, but does not guarantee tolerance for everyone.</TipBox>

                <H3 id="species-differences">🧬 Species-Level Differences Matter</H3>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  The genus <em>Leccinum</em> includes multiple species, and not all behave the same way. Common examples:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    { name: 'Leccinum scabrum', note: 'Birch Bolete — widely eaten in Europe' },
                    { name: 'Leccinum aurantiacum', note: 'Orange Birch Bolete — edible with caution' },
                    { name: 'Leccinum versipelle', note: 'Orange Oak Bolete — occasional poisoning reported' },
                  ].map(s => (
                    <div key={s.name} className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}><em>{s.name}</em></p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{s.note}</p>
                    </div>
                  ))}
                </div>
                <TipBox>This variability is why blanket assumptions about edibility are risky.</TipBox>

                <H3 id="misidentification">⚠️ Misidentification &amp; Lookalike Risk</H3>
                <p className="mb-3" style={{ color: 'var(--text-muted)' }}>
                  While <em>Leccinum</em> itself is not deadly, incorrect identification can still lead to serious danger. For example:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Confusing a bolete with a toxic non-bolete species</li>
                  <li>Ignoring subtle differences in pore color or bruising</li>
                  <li>Overlooking environmental clues (tree association, habitat)</li>
                </ul>
                <TipBox>Many mushroom poisoning cases happen due to human error, not the species itself.</TipBox>
              </Section>

              <Divider />

              {/* Section 4 — Comparison Table */}
              <Section>
                <H2 id="leccinum-vs-deadly">Leccinum vs Deadly Mushrooms (Clear Comparison)</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--accent-bg)' }}>
                        {['Feature', 'Leccinum', 'Deadly Mushrooms (e.g. Amanita)'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--accent)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Underside', 'Pores (tube layer)', 'Gills'],
                        ['Stem', 'Scabers (rough dots)', 'Smooth or ring/volva'],
                        ['Toxicity', 'Non-lethal, may cause GI upset', 'Can be fatal'],
                        ['Example', 'Leccinum scabrum', 'Amanita phalloides'],
                      ].map(([feat, lec, dead], i) => (
                        <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{lec}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{dead}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TipBox>Learning these structural differences is critical for safe identification.</TipBox>
              </Section>

              <Divider />

              {/* Section 5 — Are They Edible */}
              <Section>
                <H2 id="are-edible">Are Leccinum Mushrooms Edible?</H2>

                <H3 id="conditionally-edible">✅ Conditionally Edible</H3>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  Some <em>Leccinum</em> species are consumed in different regions, especially <em>Leccinum scabrum</em> and{' '}
                  <em>Leccinum aurantiacum</em>. They are often included in traditional foraging practices across Europe
                  and North America.
                </p>

                <InfoBox>
                  <p className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>⚠️ Practical Safety Guidelines</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Always cook thoroughly — no raw consumption</li>
                    <li>Avoid large portions initially</li>
                    <li>Test tolerance with small amounts</li>
                    <li>Avoid mixing multiple unknown species</li>
                    <li>Do not consume if identification is uncertain</li>
                  </ul>
                </InfoBox>
                <TipBox>"Edible" in mushroom terms often means safe with conditions, not universally safe.</TipBox>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* Section 6 — How to Safely Identify */}
              <Section>
                <H2 id="how-to-identify">How to Safely Identify Leccinum</H2>

                {/* Image 3 */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full">
                    <Image
                      src="/leccinum-mushroom-pores-cross-section-identification.webp"
                      alt="Leccinum mushroom pores cross section identification — cut Leccinum aurantiacum showing internal tube structure"
                      width={820}
                      height={560}
                      sizes="(max-width: 768px) 100vw, 820px"
                      className="w-full object-cover"
                      style={{ maxHeight: '420px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    <em>Leccinum aurantiacum</em> cross-section showing internal tube/pore structure — Photo: Walter J. Pilsak, CC BY-SA 3.0, via Wikimedia Commons
                    &nbsp;|&nbsp; Source: commons.wikimedia.org/wiki/File:Rotkappe-Querschnitt.jpg
                  </figcaption>
                </figure>

                <H3 id="identification-checklist">🔎 Identification Checklist</H3>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>To improve accuracy, confirm multiple features:</p>
                <div className="space-y-2 mb-6">
                  {[
                    'Sponge-like pores (not gills)',
                    'Rough stem with dark scabers',
                    'Association with specific trees (birch, aspen, oak)',
                    'Cap color and texture',
                    'Flesh reaction when cut (color change or staining)',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <H3 id="expert-advice">🧠 Expert-Level Advice</H3>
                <ul className="list-disc list-inside space-y-1 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  <li>Never rely on a single photo match</li>
                  <li>Compare multiple field guides</li>
                  <li>Observe the entire environment, not just the mushroom</li>
                  <li>Avoid identifying young or damaged specimens</li>
                </ul>
                <TipBox>
                  Identification is a process, not a guess. Use a trusted{' '}
                  <Link href="/" className="underline font-medium" style={{ color: 'var(--accent)' }}>
                    mushroom identification
                  </Link>{' '}
                  tool as a starting point, then cross-reference with printed field guides.
                </TipBox>
              </Section>

              <Divider />

              {/* Section 7 — What Experts Say */}
              <Section>
                <H2 id="what-experts-say">What Experts Say About Leccinum</H2>
                <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
                  Mycologists and field guides often describe <em>Leccinum</em> as:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {[
                    'A non-deadly genus with caution required',
                    'Safe when properly cooked (for some species)',
                    'Variable in human digestion and tolerance',
                    'Not recommended for beginners without guidance',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-sm flex-shrink-0">🍄</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <TipBox>This is why many guides avoid labeling them simply as "safe".</TipBox>
              </Section>

              <Divider />

              {/* Section 8 — FAQ */}
              <Section>
                <H2 id="people-also-ask">People Also Ask</H2>
                <div className="space-y-4">
                  {[
                    {
                      q: 'Can Leccinum kill you?',
                      a: 'No confirmed fatal cases exist, but they can cause significant digestive illness, especially when eaten raw or undercooked.',
                    },
                    {
                      q: 'Are all boletes safe to eat?',
                      a: 'No. While many boletes are edible, some are bitter or cause stomach upset. Always identify carefully and cook fully.',
                    },
                    {
                      q: 'Why do some people react differently to Leccinum?',
                      a: (
                        <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                          <li>Individual digestion</li>
                          <li>Cooking methods</li>
                          <li>Species variation</li>
                        </ul>
                      ),
                    },
                    {
                      q: 'Is Leccinum safe for beginners?',
                      a: 'Not always. Beginners should focus on easier, clearly identifiable species first.',
                    },
                  ].map(({ q, a }) => (
                    <details key={q} className="rounded-xl overflow-hidden group" style={{ border: '1px solid var(--border)' }}>
                      <summary
                        className="flex items-center gap-3 px-5 py-4 cursor-pointer font-semibold text-sm select-none"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                      >
                        <span className="text-base flex-shrink-0" style={{ color: 'var(--accent)' }}>❓</span>
                        {q}
                      </summary>
                      <div className="px-5 py-4 text-sm" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>
                        {a}
                      </div>
                    </details>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* Final Verdict */}
              <Section>
                <H2 id="final-verdict">Final Verdict</H2>
                <div className="space-y-3">
                  {[
                    'Leccinum mushrooms are not deadly, but they are not risk-free.',
                    'The biggest risks come from misidentification, undercooking, and individual sensitivity.',
                    'Treat them as "conditionally edible with caution", not guaranteed safe food.',
                  ].map((point, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-base flex-shrink-0">👉</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{point}</span>
                    </div>
                  ))}
                </div>
              </Section>

          <ViewTracker slug="/are-there-any-deadly-leccinum-mushrooms" />
              <BlogComments slug="/are-there-any-deadly-leccinum-mushrooms" />
            </article>

            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
