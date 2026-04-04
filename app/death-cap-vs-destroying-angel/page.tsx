import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import ArticleViewCount from '@/components/blog/ArticleViewCount'

export const metadata: Metadata = {
  title: 'Death Cap vs Destroying Angel Identification: Full Guide 2026',
  description:
    'Compare Death Cap vs Destroying Angel mushrooms. Learn key differences, identification tips, habitat, and deadly risks to avoid toxic look-alikes.',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline:
        'Death Cap vs Destroying Angel: Key Differences, Identification & Safety Guide',
      description:
        'Compare Death Cap and Destroying Angel mushrooms by cap color, gills, ring, volva, habitat, toxicity, and look-alikes. Learn safe identification differences.',
      author: {
        '@type': 'Organization',
        name: 'Mushroom Identifier',
        url: 'https://mushroomidentifiers.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mushroom Identifier',
        url: 'https://mushroomidentifiers.com/',
        email: 'support@mushroomidentifiers.com',
      },
      mainEntityOfPage: 'https://mushroomidentifiers.com/death-cap-vs-destroying-angel',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the difference between Death Cap and Destroying Angel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The main difference is cap color and species grouping. Death Cap, Amanita phalloides, usually has a greenish or olive cap, while Destroying Angel species such as Amanita bisporigera and Amanita virosa are usually pure white. Both have white gills, a ring, a volva, and deadly amatoxins.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which is more dangerous, Death Cap or Destroying Angel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Both are extremely dangerous and should be considered equally deadly. Death Cap and Destroying Angel contain amatoxins that can cause severe liver and kidney failure even in small amounts.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I identify a Death Cap mushroom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Death Cap identification relies on a greenish to pale olive cap, white free gills, a ring on the stem, and a volva at the base. It is commonly found in woodland habitats near hardwood trees such as oak and beech.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I identify a Destroying Angel mushroom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Destroying Angel identification relies on a pure white cap, white gills, a ring on the stem, and a cup-like volva at the base. It often grows in forest habitats and can resemble edible white mushrooms.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is the volva important in identifying toxic Amanita mushrooms?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The volva is one of the most important features because it helps confirm the mushroom belongs to the Amanita genus. It appears as a cup or sac at the base and is often hidden underground, so the full base should always be checked.',
          },
        },
        {
          '@type': 'Question',
          name: 'What mushrooms are commonly confused with Death Cap or Destroying Angel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'These toxic mushrooms are often confused with Agaricus species, immature puffballs, and other pale or white edible mushrooms. A key warning sign is the combination of white gills and a volva at the base.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can a mushroom identifier tell the difference between Death Cap and Destroying Angel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A mushroom identifier can use AI and image recognition to compare cap color, gills, stem, ring, volva, and habitat. However, it should only be used as a research aid and never as the sole basis for safety decisions.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I do if I suspect Death Cap or Destroying Angel poisoning?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Seek immediate emergency medical help. Symptoms may be delayed, but serious liver damage can begin before obvious signs appear, so fast treatment is critical.',
          },
        },
      ],
    },
  ],
}

export default function DeathCapVsDestroyingAngelPage() {
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

          {/* ── Breadcrumb ─────────────────────────────────── */}
          <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--text-faint)' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:underline" style={{ color: 'var(--accent)' }}>Blog</Link>
            <span>/</span>
            <span>Death Cap vs Destroying Angel</span>
          </nav>

          {/* ── Category & Title ───────────────────────────── */}
          <div className="mb-6">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: '#ef444420', color: '#ef4444' }}
            >
              Toxic Mushrooms
            </span>
            <h1
              className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Death Cap vs Destroying Angel: Key Differences, Identification &amp; Safety Guide
            </h1>
            <AuthorBlock updatedAt="Mar 31, 2026" />
            <ArticleViewCount views={3920} className="mb-2" />
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The difference between the <strong style={{ color: 'var(--text-primary)' }}>Death Cap</strong> (<em>Amanita phalloides</em>) and the <strong style={{ color: 'var(--text-primary)' }}>Destroying Angel</strong> (<em>Amanita bisporigera</em>, <em>Amanita virosa</em>) comes down to cap color, shape, and subtle structural features — but both are among the most deadly toxic mushrooms in the world.
            </p>
          </div>

          {/* ── Featured Image ─────────────────────────────── */}
          <div
            className="relative rounded-2xl overflow-hidden mb-12"
            style={{ border: '1px solid var(--border)' }}
          >
            <Image
              src="/death-cap-vs-destroying-angel-comparison.webp"
              alt="Death Cap vs Destroying Angel mushroom comparison guide"
              width={900}
              height={520}
              sizes="(max-width: 768px) 100vw, 900px"
              className="w-full object-cover"
              priority
              style={{ display: 'block' }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 px-5 py-3 text-xs"
              style={{
                background: 'linear-gradient(to top, rgba(6,18,9,0.85), transparent)',
                color: 'rgba(245,240,232,0.75)',
              }}
            >
              Death Cap vs Destroying Angel — visual comparison of two deadly Amanita species
            </div>
          </div>

          {/* ── Intro Body ─────────────────────────────────── */}
          <Section>
            <p>
              The Death Cap typically has a <strong>greenish or olive cap</strong>, while Destroying Angels are usually <strong>pure white</strong>. However, both share dangerous traits like white gills, a ring (annulus), and a volva (basal cup), making them extremely easy to confuse with edible mushrooms. Accurate identification requires analyzing multiple mushroom parts together — not just appearance — which is why tools like a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link>{' '}
              use AI to compare features such as cap, gills, stem, and habitat.
            </p>
          </Section>

          <Divider />

          <div className="lg:hidden"><TableOfContents /></div>

          {/* ── Introduction ───────────────────────────────── */}
          <Section>
            <H2>Introduction: Why Comparing Death Cap and Destroying Angel Matters</H2>
            <H3>What Are Death Cap and Destroying Angel Mushrooms?</H3>
            <p>
              The Death Cap and Destroying Angel belong to the <em>Amanita</em> genus within the <em>Amanitaceae</em> family, a group known for containing some of the most toxic fungi in the Kingdom Fungi. These mushrooms are part of the fungal fruiting body, which grows above ground to release spores, while the main organism exists underground as mycelium.
            </p>
            <ul>
              <li><strong>Death Cap (<em>Amanita phalloides</em>)</strong> → greenish or pale cap</li>
              <li><strong>Destroying Angel (<em>Amanita bisporigera</em>, <em>Amanita virosa</em>)</strong> → pure white</li>
            </ul>
            <p>Despite visual differences, both share nearly identical toxic compounds (amatoxins).</p>

            <H3>Why These Are the Most Dangerous Toxic Mushrooms</H3>
            <p>Both mushrooms contain amatoxins, which are among the most potent natural toxins in fungi. These compounds:</p>
            <ul>
              <li>Block protein synthesis in cells</li>
              <li>Cause severe liver and kidney failure</li>
              <li>Have delayed symptoms, making early diagnosis difficult</li>
            </ul>
            <p>Even small amounts can be fatal, which is why these species are responsible for a large percentage of mushroom poisoning deaths worldwide.</p>

            <H3>Common Confusion Between Amanita Species</H3>
            <p>The biggest danger comes from misidentification. Many edible mushrooms share similar traits:</p>
            <ul>
              <li>White or pale caps</li>
              <li>Smooth surfaces</li>
              <li>Growth in similar environments</li>
            </ul>
            <p>This makes <em>Amanita</em> species especially risky for beginners.</p>

            <H3>Importance of Correct Mushroom Identification</H3>
            <p>Correct identification depends on combining:</p>
            <ul>
              <li>Cap (pileus)</li>
              <li>Gills (lamellae)</li>
              <li>Stem (stipe)</li>
              <li>Ring (annulus)</li>
              <li>Volva (basal cup)</li>
              <li>Habitat and environment</li>
            </ul>
            <p>
              This is exactly how an <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">online wild mushroom identifier</Link> works — analyzing multiple features together rather than relying on a single visual clue.
            </p>
          </Section>

          <Divider />

          {/* ── Quick Comparison Table ─────────────────────── */}
          <Section>
            <H2>Quick Comparison Table: Death Cap vs Destroying Angel</H2>
            <H3>Side-by-Side Comparison</H3>
            <ComparisonTable
              headers={['Feature', 'Death Cap (Amanita phalloides)', 'Destroying Angel (A. bisporigera / virosa)']}
              rows={[
                ['Cap Color', 'Greenish, olive, yellow', 'Pure white'],
                ['Gills', 'White, free', 'White, free'],
                ['Stem', 'White, bulbous base', 'White, slender'],
                ['Ring', 'Present', 'Present (often fragile)'],
                ['Volva', 'Large, cup-like', 'Large, sac-like'],
                ['Smell', 'Mild or slightly sweet', 'Mild to unpleasant'],
                ['Habitat', 'Hardwood forests', 'Woodland (hardwood + conifer)'],
                ['Risk Level', '🔴 Deadly', '🔴 Deadly'],
              ]}
            />

            <WarningBox>
              <strong>Fast Identification Summary (Beginner Friendly)</strong>
              <ul className="mt-2 space-y-1">
                <li>Greenish cap → likely Death Cap</li>
                <li>Pure white mushroom → likely Destroying Angel</li>
                <li>Both have white gills + ring + volva → <strong>extremely dangerous</strong></li>
              </ul>
              <p className="mt-2">⚠️ Never rely on color alone — always check the base (volva).</p>
            </WarningBox>
          </Section>

          <Divider />

          {/* ── Death Cap Image ────────────────────────────── */}
          <figure className="my-10">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
            >
              <Image
                src="/amanita-phalloides-death-cap-mushroom.webp"
                alt="Death Cap vs Destroying Angel — Amanita phalloides greenish olive cap identification"
                width={820}
                height={615}
                className="w-full object-contain"
                style={{ display: 'block', maxHeight: '420px', objectFit: 'contain', padding: '12px' }}
              />
            </div>
            <figcaption
              className="text-center text-sm mt-3"
              style={{ color: 'var(--text-faint)' }}
            >
              <em>Amanita phalloides</em> (Death Cap) — note the distinctive greenish-olive cap color. Image: Wikimedia Commons / CC BY-SA 3.0
            </figcaption>
          </figure>

          {/* ── Scientific Classification ──────────────────── */}
          <Section>
            <H2>Scientific Classification and Taxonomy</H2>
            <H3>Amanita Genus and Amanitaceae Family</H3>
            <p>Both mushrooms belong to:</p>
            <ul>
              <li><strong>Family:</strong> Amanitaceae</li>
              <li><strong>Genus:</strong> Amanita</li>
            </ul>
            <p>This genus is one of the most important groups in mycology because it contains both highly toxic and visually deceptive species.</p>

            <H3>Species Breakdown</H3>
            <ul>
              <li><em>Amanita phalloides</em> → Death Cap</li>
              <li><em>Amanita bisporigera</em> → Destroying Angel (North America)</li>
              <li><em>Amanita virosa</em> → Destroying Angel (Europe)</li>
            </ul>
            <p>Although different species, they share similar morphology, same toxic compounds (amatoxins), and comparable ecological roles.</p>

            <H3>Role in Mycology and Fungal Classification</H3>
            <p>In fungal classification, <em>Amanita</em> species are identified by:</p>
            <ul>
              <li>Presence of universal veil → volva</li>
              <li>Presence of partial veil → ring</li>
              <li>White spores and gills</li>
            </ul>
            <p>These traits make them critical examples in fungal taxonomy and identification training.</p>
          </Section>

          <Divider />

          {/* ── Key Identification Differences ────────────── */}
          <Section>
            <H2>Key Identification Differences (Cap, Gills, Stem, Ring, Volva)</H2>

            <H3>Cap Color and Shape</H3>
            <ul>
              <li><strong>Death Cap:</strong> greenish, olive, sometimes pale yellow</li>
              <li><strong>Destroying Angel:</strong> pure white</li>
            </ul>
            <p>Cap shape for both: Convex (young) → flat (mature)</p>

            <H3>Gills (Lamellae)</H3>
            <p>
              Both have white, free gills that do not change color with age. This is a key warning sign, especially when compared to edible mushrooms like <em>Agaricus</em>, which have pink → brown gills.
            </p>

            <H3>Stem (Stipe) and Base</H3>
            <ul>
              <li><strong>Death Cap:</strong> thicker stem, bulbous base</li>
              <li><strong>Destroying Angel:</strong> slender stem</li>
            </ul>
            <p>Both have a basal bulb enclosed in a volva.</p>

            <H3>Ring (Annulus)</H3>
            <p>Present in both species — more persistent in Death Cap, more fragile in Destroying Angel.</p>

            <H3>Volva (Basal Cup) — Most Important Feature</H3>
            <p>Both species have a volva, which:</p>
            <ul>
              <li>Appears as a cup at the base</li>
              <li>May be hidden underground</li>
              <li>Is the most critical identification feature</li>
            </ul>
            <WarningBox>
              ⚠️ Missing the volva is the most common cause of fatal misidentification.
            </WarningBox>
          </Section>

          <Divider />

          {/* ── Color, Smell, Visual Differences ──────────── */}
          <Section>
            <H2>Color, Smell, and Visual Differences</H2>

            <H3>Cap Color Variation</H3>
            <ul>
              <li><strong>Death Cap</strong> → greenish, olive, sometimes pale</li>
              <li><strong>Destroying Angel</strong> → consistently white</li>
            </ul>
            <p>However, lighting and age can affect appearance.</p>

            <H3>Smell Differences</H3>
            <ul>
              <li><strong>Death Cap</strong> → mild, slightly sweet</li>
              <li><strong>Destroying Angel</strong> → faint or unpleasant</li>
            </ul>
            <p>Smell is helpful but not always reliable.</p>

            <H3>Appearance at Different Growth Stages</H3>
            <p>Both species change shape as they grow:</p>
            <ul>
              <li>Young → egg-shaped (enclosed in veil)</li>
              <li>Mature → cap opens, ring visible</li>
              <li>Old → structures degrade</li>
            </ul>
            <p>At early stages, both can look like white eggs, making them easily confused with edible species.</p>
          </Section>

          <Divider />

          {/* ── Destroying Angel Image ─────────────────────── */}
          <figure className="my-10">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
            >
              <Image
                src="/amanita-virosa-destroying-angel-mushroom.webp"
                alt="Death Cap vs Destroying Angel — Amanita virosa pure white destroying angel in forest"
                width={820}
                height={546}
                className="w-full object-contain"
                style={{ display: 'block', maxHeight: '420px', objectFit: 'contain', padding: '12px' }}
              />
            </div>
            <figcaption
              className="text-center text-sm mt-3"
              style={{ color: 'var(--text-faint)' }}
            >
              <em>Amanita virosa</em> (Destroying Angel) — pure white throughout, from cap to stem. Image: Wikimedia Commons / CC BY-SA 4.0
            </figcaption>
          </figure>

          {/* ── Habitat ───────────────────────────────────── */}
          <Section>
            <H2>Habitat, Environment &amp; Geographic Distribution</H2>
            <p>
              Understanding where these mushrooms grow is a powerful clue in mushroom identification. Both Death Cap and Destroying Angel are mycorrhizal fungi, meaning they form symbiotic relationships with tree roots.
            </p>

            <H3>Death Cap Habitat (Amanita phalloides)</H3>
            <p>Primarily found in hardwood forests, commonly associated with:</p>
            <ul>
              <li>Oak trees</li>
              <li>Beech</li>
              <li>Chestnut</li>
            </ul>
            <p>Grows in moist, nutrient-rich soil.</p>

            <H3>Geographic Distribution — Death Cap</H3>
            <ul>
              <li>Native to Europe</li>
              <li>Widely spread in North America</li>
              <li>Found in Australia and parts of Asia</li>
            </ul>
            <p>It has expanded globally due to human activity, especially through tree planting.</p>

            <H3>Destroying Angel Habitat (Amanita bisporigera / virosa)</H3>
            <p>Found in woodlands and forests, associated with both:</p>
            <ul>
              <li>Hardwood trees (oak, birch)</li>
              <li>Conifer trees (pine, spruce)</li>
            </ul>
            <ul>
              <li><em>Amanita bisporigera</em> → North America</li>
              <li><em>Amanita virosa</em> → Europe and parts of Asia</li>
            </ul>

            <H3>Environmental Conditions</H3>
            <p>Both species prefer shaded forest environments, moist soil conditions, and areas with organic matter and tree roots.</p>

            <H3>Key Habitat Differences</H3>
            <ComparisonTable
              headers={['Feature', 'Death Cap', 'Destroying Angel']}
              rows={[
                ['Tree Preference', 'Mostly hardwood', 'Hardwood + conifer'],
                ['Distribution', 'Global spread', 'Region-specific species'],
                ['Habitat', 'Dense forests', 'Mixed woodland'],
              ]}
            />
          </Section>

          <Divider />

          {/* ── Growth Pattern ────────────────────────────── */}
          <Section>
            <H2>Growth Pattern and Seasonality</H2>

            <H3>Growth Pattern</H3>
            <p>Both mushrooms typically grow single or scattered, occasionally in small groups, rarely in dense clusters. This differs from some edible mushrooms that grow in large groups.</p>

            <H3>Seasonality</H3>
            <p>Late summer to autumn is the main season. Growth increases after rainfall and warm temperatures.</p>

            <H3>Climate Influence</H3>
            <p>Fruiting depends on soil moisture, temperature fluctuations, and seasonal rainfall. This is why sightings often spike after rain followed by warm days.</p>
          </Section>

          <Divider />

          {/* ── Toxicity ──────────────────────────────────── */}
          <Section>
            <H2>Toxicity Comparison: Which Is More Dangerous?</H2>

            <H3>Amatoxins and Their Effects</H3>
            <p>Both mushrooms contain amatoxins, which are among the most dangerous natural toxins. These toxins:</p>
            <ul>
              <li>Block RNA polymerase II</li>
              <li>Stop protein production in cells</li>
              <li>Lead to cell death, especially in the liver</li>
            </ul>

            <H3>Effects on the Human Body</H3>
            <ul>
              <li>Severe liver damage</li>
              <li>Kidney failure</li>
              <li>Internal bleeding</li>
              <li>Organ shutdown</li>
            </ul>
            <p>Even a small amount can be fatal.</p>

            <H3>Symptoms of Poisoning</H3>
            <p>Symptoms appear in stages:</p>
            <div className="grid md:grid-cols-4 gap-4 my-6">
              {[
                { phase: '1. Delay', time: '6–24 hours', desc: 'No symptoms', color: '#6b7280' },
                { phase: '2. GI Phase', time: 'Hours later', desc: 'Vomiting, diarrhea', color: '#f97316' },
                { phase: '3. Recovery', time: 'Temporary', desc: 'Symptoms may improve', color: '#eab308' },
                { phase: '4. Organ Failure', time: 'Days later', desc: 'Severe organ damage', color: '#ef4444' },
              ].map((s) => (
                <div
                  key={s.phase}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'var(--bg-card)', border: `1px solid ${s.color}40` }}
                >
                  <div className="text-xs font-bold mb-1" style={{ color: s.color }}>{s.phase}</div>
                  <div className="text-xs mb-2" style={{ color: 'var(--text-faint)' }}>{s.time}</div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <WarningBox>
              ⚠️ This delay makes poisoning especially dangerous — damage may be severe before you feel sick.
            </WarningBox>

            <H3>Which Is More Dangerous?</H3>
            <InfoBox>
              👉 <strong>Both are equally deadly.</strong> Same toxin (amatoxins), similar fatality risk, same medical emergency level. There is no &quot;safer&quot; option between them.
            </InfoBox>
          </Section>

          <Divider />

          {/* ── Look-Alikes ───────────────────────────────── */}
          <Section>
            <H2>Similar Edible Look-Alikes and Misidentification Risks</H2>
            <p>One of the biggest dangers is confusing these mushrooms with edible species.</p>

            <H3>Common Edible Look-Alikes</H3>
            <ul>
              <li>Agaricus species (field mushrooms)</li>
              <li>Puffballs (when young)</li>
              <li>Some white woodland mushrooms</li>
            </ul>

            <H3>Why Misidentification Happens</H3>
            <ul>
              <li>Similar cap color (white or pale)</li>
              <li>Smooth appearance</li>
              <li>Growth in similar environments</li>
            </ul>

            <H3>Key Differences from Edible Mushrooms</H3>
            <ComparisonTable
              headers={['Feature', 'Amanita (Toxic)', 'Agaricus (Edible)']}
              rows={[
                ['Gills', 'White', 'Pink → brown'],
                ['Volva', 'Present', 'Absent'],
                ['Smell', 'Mild / unpleasant', 'Pleasant'],
                ['Risk', 'Deadly', 'Safe'],
              ]}
            />

            <WarningBox>
              ⚠️ <strong>Most Important Warning Sign:</strong> White gills + volva = danger. This combination should always be treated as high risk.
            </WarningBox>
          </Section>

          <Divider />

          {/* ── How to Identify ───────────────────────────── */}
          <Section>
            <H2>How to Safely Identify Death Cap vs Destroying Angel</H2>

            <H3>Step-by-Step Identification Checklist</H3>
            <p>Before identifying any mushroom:</p>
            <div className="space-y-3 my-5">
              {[
                'Check cap color and shape',
                'Look under cap → gills',
                'Examine stem and ring',
                'Dig around base → check for volva',
                'Observe habitat and nearby trees',
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>{step}</span>
                </div>
              ))}
            </div>

            <H3>Why the Volva is Critical</H3>
            <p>The volva (basal cup) confirms <em>Amanita</em> genus, is often hidden underground, and is the most reliable safety feature. Always expose the base before identifying.</p>

            <H3>Combine Multiple Features</H3>
            <p>Never rely on one trait. Always combine: Cap + gills, Stem + ring, Volva + habitat. This multi-feature approach is essential for accurate mushroom identification.</p>
          </Section>

          <Divider />

          {/* ── Mushroom Identifier ───────────────────────── */}
          <Section>
            <H2>How a Mushroom Identifier Helps Distinguish Them</H2>
            <p>
              Modern tools like a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> use AI and image recognition to analyze:
            </p>
            <ul>
              <li>Cap color and texture</li>
              <li>Gill structure (white, free gills)</li>
              <li>Stem and ring presence</li>
              <li>Volva at base</li>
              <li>Habitat and environment</li>
            </ul>

            <H3>How AI Improves Identification</H3>
            <ul>
              <li>Compares features with thousands of fungal species</li>
              <li>Detects patterns humans may miss</li>
              <li>Reduces confusion between look-alike mushrooms</li>
            </ul>

            <H3>Limitations of AI</H3>
            <InfoBox>
              A mushroom identifier cannot guarantee safety, cannot detect chemical toxicity, and should be used as a support tool — not a final decision. Always verify with an expert mycologist.
            </InfoBox>
          </Section>

          <Divider />

          {/* ── Emergency ─────────────────────────────────── */}
          <Section>
            <H2>What to Do If You Suspect Poisoning</H2>

            <H3>Early Warning Signs</H3>
            <ul>
              <li>Vomiting</li>
              <li>Diarrhea</li>
              <li>Abdominal pain</li>
            </ul>

            <H3>Emergency Steps</H3>
            <div
              className="p-5 rounded-2xl my-4"
              style={{ background: '#ef444415', border: '2px solid #ef444440' }}
            >
              <p className="font-bold text-base mb-2" style={{ color: '#ef4444' }}>🚨 Emergency Protocol</p>
              <ol className="space-y-2 list-decimal list-inside" style={{ color: 'var(--text-primary)' }}>
                <li>Seek immediate medical help — do not wait</li>
                <li>Do not induce vomiting unless instructed</li>
                <li>Inform doctors about mushroom exposure</li>
                <li>Bring a sample of the mushroom if safe to do so</li>
              </ol>
            </div>

            <H3>Why Immediate Action Matters</H3>
            <p>Because symptoms are delayed, internal damage may already be severe before you feel sick. Early treatment is the only thing that can prevent fatal organ failure.</p>
          </Section>

          <Divider />

          {/* ── FAQ ───────────────────────────────────────── */}
          <Section>
            <H2>FAQ: Death Cap vs Destroying Angel</H2>
            <div className="space-y-4">
              {[
                {
                  q: 'What is the difference between Death Cap and Destroying Angel?',
                  a: 'The main difference is cap color — Death Cap is greenish, while Destroying Angel is pure white. Both share deadly traits like white gills, ring, and volva.',
                },
                {
                  q: 'Which mushroom is more dangerous?',
                  a: 'Both are equally dangerous because they contain the same amatoxins and can be fatal.',
                },
                {
                  q: 'How can I identify a Destroying Angel?',
                  a: 'Look for a pure white mushroom with white gills, a ring, and a volva at the base, typically in forest environments.',
                },
                {
                  q: 'Can AI identify toxic mushrooms?',
                  a: 'Yes, a mushroom identifier app can analyze features, but results must always be verified by experts.',
                },
                {
                  q: 'Where do Death Cap mushrooms grow?',
                  a: 'They grow in hardwood forests, especially near oak, beech, and chestnut trees.',
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
                >
                  <summary
                    className="px-5 py-4 cursor-pointer font-semibold text-base list-none flex justify-between items-center"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {faq.q}
                    <span style={{ color: 'var(--accent)', fontSize: '20px', lineHeight: 1 }}>+</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ── Instagram Embed ───────────────────────────── */}
          <Section>
            <H2>See It in the Wild</H2>
            <p>A real-world look at these deadly mushrooms — shared on Instagram to help foragers recognize the danger in the field.</p>
            <div className="flex justify-center my-6">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink="https://www.instagram.com/p/CUFMyzPoRda/"
                data-instgrm-version="14"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  maxWidth: '540px',
                  width: '100%',
                  minWidth: '326px',
                }}
              />
            </div>
            <Script src="//www.instagram.com/embed.js" strategy="lazyOnload" />
          </Section>

          <Divider />

          {/* ── Final Thoughts ────────────────────────────── */}
          <Section>
            <H2>Final Thoughts</H2>
            <p>
              The comparison between Death Cap and Destroying Angel highlights how small visual differences can hide extreme danger. Both mushrooms share critical traits — white gills, ring, volva, and deadly amatoxins — making them among the most hazardous fungi in the world.
            </p>
            <p>
              Learning their differences, habitat, and structure is essential for safe identification. While tools like a{' '}
              <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link>{' '}
              can help analyze features, they should always be used alongside expert knowledge.
            </p>
            <WarningBox>
              ⚠️ <strong>Golden Rule:</strong> If you are not 100% sure, never consume a wild mushroom.
            </WarningBox>
          </Section>

          {/* ── Back to Blog ──────────────────────────────── */}
          <div className="mt-14 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent)' }}
            >
              ← Back to Blog
            </Link>
          </div>

          <RelatedPosts currentSlug="/death-cap-vs-destroying-angel" />

            </article>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Reusable layout components ─────────────────────────────── */

function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-10 space-y-4">{children}</section>
}

function Divider() {
  return <hr className="my-10 border-0 h-px" style={{ background: 'var(--border)' }} />
}

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-playfair text-2xl md:text-3xl font-bold mt-8 mb-3"
      style={{ color: 'var(--text-primary)' }}
    >
      {children}
    </h2>
  )
}

function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="font-playfair text-xl font-semibold mt-5 mb-2"
      style={{ color: 'var(--text-primary)' }}
    >
      {children}
    </h3>
  )
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-5 rounded-xl my-5 text-sm leading-relaxed"
      style={{
        background: '#f9731615',
        border: '1px solid #f9731640',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-5 rounded-xl my-5 text-sm leading-relaxed"
      style={{
        background: 'var(--accent-bg)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </div>
  )
}

function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: string[][]
}) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: 'var(--accent-bg)' }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold"
                style={{
                  color: 'var(--accent)',
                  borderBottom: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{ background: ri % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3"
                  style={{
                    color: ci === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: ci === 0 ? 600 : 400,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
