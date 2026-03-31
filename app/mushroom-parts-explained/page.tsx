import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import TableOfContents, { TocHeading } from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'

export const metadata: Metadata = {
  title: 'Mushroom Parts Explained: Cap, Gills, Stem, Ring, Volva',
  description:
    'Understanding mushroom anatomy is the foundation of accurate mushroom identification. A mushroom is not the entire organism — it is the visible fruiting body of fungi within the Kingdom Fungi.',
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Mushroom Parts Explained: Cap, Gills, Stem, Ring, Volva',
      description:
        'Learn mushroom anatomy with a clear guide to cap, gills, stem, ring, and volva. Understand how these fungal structures help with mushroom identification and safety.',
      author: { '@type': 'Organization', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/' },
      publisher: { '@type': 'Organization', name: 'Mushroom Identifier', url: 'https://mushroomidentifiers.com/', email: 'support@mushroomidentifiers.com' },
      mainEntityOfPage: 'https://mushroomidentifiers.com/',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What are the main parts of a mushroom?', acceptedAnswer: { '@type': 'Answer', text: 'The main parts of a mushroom are the cap, gills, stem, ring, and volva. These fungal structures help with spore production, protection, growth, and mushroom identification.' } },
        { '@type': 'Question', name: 'What is the function of mushroom gills?', acceptedAnswer: { '@type': 'Answer', text: 'Mushroom gills are thin structures under the cap that produce and release spores. They are one of the most important features used in mycology and mushroom identification.' } },
        { '@type': 'Question', name: 'What is a mushroom stem?', acceptedAnswer: { '@type': 'Answer', text: 'The mushroom stem, also called the stipe, supports the cap and helps elevate the spore-producing surface for better spore dispersal. Stem shape, texture, and thickness are useful identification traits.' } },
        { '@type': 'Question', name: 'What is a mushroom ring?', acceptedAnswer: { '@type': 'Answer', text: 'A mushroom ring, or annulus, is a remnant of the partial veil that once protected the gills during early growth. Its presence or absence can help distinguish fungal species.' } },
        { '@type': 'Question', name: 'What is a volva in mushrooms?', acceptedAnswer: { '@type': 'Answer', text: 'The volva is a cup-like structure at the base of some mushrooms formed by the universal veil. It is especially important in identifying Amanita species and other potentially toxic mushrooms.' } },
        { '@type': 'Question', name: 'Why is mushroom anatomy important for identification?', acceptedAnswer: { '@type': 'Answer', text: 'Mushroom anatomy helps identify species by combining features such as cap shape, gill attachment, stem structure, ring, volva, and habitat. Looking at all parts together improves identification accuracy.' } },
        { '@type': 'Question', name: 'Can mushroom parts help distinguish toxic species?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Features like a volva, ring, white gills, and a bulbous base can help distinguish potentially toxic mushrooms from edible look-alikes. These traits are critical in safe mushroom identification.' } },
        { '@type': 'Question', name: 'How does a mushroom identifier use cap, gills, stem, ring, and volva?', acceptedAnswer: { '@type': 'Answer', text: 'A mushroom identifier uses AI and image recognition to analyze mushroom parts such as the cap, gills, stem, ring, and volva. It compares these features with labeled fungal species to return likely matches.' } },
      ],
    },
  ],
}

const TOC_HEADINGS: TocHeading[] = [
  { id: 'intro-anatomy', text: 'Introduction to Mushroom Anatomy and Fungal Structure', level: 2 },
  { id: 'why-parts-matter', text: 'Why Mushroom Parts Matter in Identification', level: 3 },
  { id: 'safety-importance', text: 'Safety and Identification Importance', level: 3 },
  { id: 'complete-overview', text: 'Complete Overview of Mushroom Parts', level: 2 },
  { id: 'five-key-parts', text: 'The Five Key Mushroom Parts', level: 3 },
  { id: 'how-parts-work', text: 'How These Parts Work Together', level: 3 },
  { id: 'veil-structures', text: 'Veil Structures Explained', level: 3 },
  { id: 'cap-section', text: 'Mushroom Cap (Pileus): Shape, Surface Texture, and Identification Features', level: 2 },
  { id: 'cap-shapes', text: 'Cap Shapes and Growth Stages', level: 3 },
  { id: 'cap-surface', text: 'Cap Surface and Texture', level: 3 },
  { id: 'cap-color', text: 'Cap Color and Its Limitations', level: 3 },
  { id: 'gills-section', text: 'Mushroom Gills (Lamellae): Spore Production and Variations', level: 2 },
  { id: 'gill-function', text: 'Function of Gills', level: 3 },
  { id: 'gill-types', text: 'Types of Gill Attachment', level: 3 },
  { id: 'gills-vs-pores', text: 'Gills vs Pores vs Teeth', level: 3 },
  { id: 'stem-section', text: 'Mushroom Stem (Stipe): Structure, Function, and Identification Clues', level: 2 },
  { id: 'stem-variations', text: 'Stem Structure Variations', level: 3 },
  { id: 'stem-base', text: 'Stem and Base Connection', level: 3 },
  { id: 'ring-section', text: 'Mushroom Ring (Annulus): Veil Remnants and Identification Importance', level: 2 },
  { id: 'ring-forms', text: 'How the Ring Forms', level: 3 },
  { id: 'ring-types', text: 'Types of Mushroom Rings', level: 3 },
  { id: 'volva-section', text: 'Mushroom Volva (Basal Cup): The Most Important Safety Feature', level: 2 },
  { id: 'volva-forms', text: 'How the Volva Forms', level: 3 },
  { id: 'volva-types', text: 'Types of Volva Structures', level: 3 },
  { id: 'volva-critical', text: 'Why the Volva is Critical for Identification', level: 3 },
  { id: 'additional-structures', text: 'Additional Mushroom Structures (Advanced Mycology)', level: 2 },
  { id: 'mycelium', text: 'Mycelium and Hyphae', level: 3 },
  { id: 'spore-print', text: 'Spore Print', level: 3 },
  { id: 'accurate-id', text: 'How Mushroom Parts Help in Accurate Identification', level: 2 },
  { id: 'common-mistakes', text: 'Common Mistakes When Identifying Mushroom Parts', level: 2 },
  { id: 'dangerous-lookalikes', text: 'Dangerous Look-Alikes Based on Mushroom Structure', level: 2 },
  { id: 'field-checklist', text: 'Beginner Field Checklist for Mushroom Parts', level: 2 },
  { id: 'faq', text: 'FAQ: Mushroom Parts Explained', level: 2 },
  { id: 'final-thoughts', text: 'Final Thoughts', level: 2 },
]

export default function MushroomPartsExplainedPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <article className="max-w-4xl mx-auto px-5 md:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: 'var(--text-faint)' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:underline" style={{ color: 'var(--accent)' }}>Blog</Link>
            <span>/</span>
            <span>Mushroom Parts Explained</span>
          </nav>

          {/* Category badge + Title */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
              Mycology Guide
            </span>
            <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Mushroom Parts Explained: Cap, Gills, Stem, Ring &amp; Volva
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Understanding mushroom anatomy is the foundation of accurate mushroom identification. A mushroom is not the entire organism — it is the visible <strong style={{ color: 'var(--text-primary)' }}>fruiting body</strong> of fungi within the Kingdom Fungi.
            </p>
          </div>

          {/* Featured Image */}
          <figure className="mb-12">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <Image
                src="/parts of mushrooms.webp"
                alt="Mushroom parts explained — diagram of cap, gills, stem, ring, and volva anatomy"
                width={900}
                height={520}
                className="w-full object-cover"
                priority
                style={{ display: 'block' }}
              />
            </div>
            <figcaption className="text-center text-xs mt-3" style={{ color: 'var(--text-faint)' }}>
              Complete mushroom anatomy diagram — cap (pileus), gills (lamellae), stem (stipe), ring (annulus), and volva
            </figcaption>
          </figure>

          {/* ── SECTION 1: Introduction ── */}
          <Section>
            <H2>Introduction to Mushroom Anatomy and Fungal Structure (Mycology Basics)</H2>
            <p>
              Beneath the surface lies a network of <strong>mycelium</strong>, made of microscopic <strong>hyphae</strong>, which spreads through soil, wood, or organic matter. The mushroom&apos;s job is simple: produce and disperse spores. To do this efficiently, fungi have evolved specialized structures — the cap (pileus), gills (lamellae), stem (stipe), ring (annulus), and volva — each playing a role in reproduction and protection.
            </p>

            <H3>Why Mushroom Parts Matter in Identification</H3>
            <p>In mycology, identifying a mushroom correctly depends on combining multiple features. Two mushrooms may share the same cap color, but differ in:</p>
            <ul>
              <li>Gill attachment (free, attached, decurrent)</li>
              <li>Presence of a ring or volva</li>
              <li>Stem structure and base</li>
              <li>Habitat and substrate (soil, hardwood, conifer wood, moss)</li>
            </ul>
            <p>This is why modern tools like a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> use AI and computer vision to analyze the full fungal structure rather than relying on a single image or feature.</p>

            <H3>Safety and Identification Importance</H3>
            <p>Some of the most dangerous fungi, including species in the <em>Amanita</em> group, look similar to edible mushrooms. Features like a volva at the base or a ring on the stem can be critical indicators of toxicity. Understanding mushroom anatomy is not just about learning — it is essential for safe identification of wild fungi.</p>
          </Section>

          <Divider />

          <TableOfContents headings={TOC_HEADINGS} />

          {/* ── SECTION 2: Complete Overview Table ── */}
          <Section>
            <H2>Complete Overview of Mushroom Parts (Cap, Gills, Stem, Ring, Volva Explained Together)</H2>
            <p>Before diving into each part, it helps to understand how the main structures work together as a system.</p>

            <H3>The Five Key Mushroom Parts</H3>
            <ComparisonTable
              headers={['Part', 'Scientific Name', 'Function']}
              rows={[
                ['Cap', 'Pileus', 'Protects spore-producing structures'],
                ['Gills', 'Lamellae', 'Produce and release spores'],
                ['Stem', 'Stipe', 'Elevates cap for spore dispersal'],
                ['Ring', 'Annulus', 'Remnant of partial veil'],
                ['Volva', 'Volva', 'Base from universal veil'],
              ]}
            />

            <H3>How These Parts Work Together</H3>
            <div className="grid md:grid-cols-2 gap-4 my-5">
              {[
                { icon: '🍄', label: 'Cap', desc: 'Protects the delicate spore-producing surface' },
                { icon: '📋', label: 'Gills', desc: 'Generate and release spores into the air' },
                { icon: '📏', label: 'Stem', desc: 'Lifts the cap higher to improve dispersal' },
                { icon: '💍', label: 'Ring', desc: 'Shows the mushroom\'s growth stage' },
                { icon: '🥚', label: 'Volva', desc: 'Reveals early developmental structures' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <H3>Veil Structures Explained</H3>
            <p>Mushrooms develop with protective layers called veils:</p>
            <ul>
              <li><strong>Partial veil</strong> → covers gills → becomes the ring (annulus)</li>
              <li><strong>Universal veil</strong> → surrounds entire mushroom → becomes the volva</li>
            </ul>
            <InfoBox>These features are extremely important in identifying toxic vs edible species.</InfoBox>

            <H3>How AI Uses These Structures</H3>
            <p>A <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier app</Link> analyzes cap shape and texture, gill structure, stem features, ring and volva presence, and habitat and growth pattern. By combining all these entities, AI can narrow down possible fungal species matches more accurately.</p>
          </Section>

          <Divider />

          {/* ── SECTION 3: Cap ── */}
          <Section>
            <H2>Mushroom Cap (Pileus): Shape, Surface Texture, and Identification Features</H2>
            <p>The mushroom cap (pileus) is the most visible and often the most photographed part of a mushroom. It plays a key role in protecting the gills or pores where spores are produced.</p>

            <H3>Cap Shapes and Growth Stages</H3>
            <p>Mushroom caps change shape as they mature:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
              {[
                { shape: 'Convex', stage: 'Young stage' },
                { shape: 'Bell-shaped', stage: 'Early growth' },
                { shape: 'Flat / Expanded', stage: 'Mature stage' },
                { shape: 'Umbonate', stage: 'Raised center' },
              ].map((s) => (
                <div key={s.shape} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: 'var(--accent)' }}>{s.shape}</p>
                  <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{s.stage}</p>
                </div>
              ))}
            </div>

            <H3>Cap Surface and Texture</H3>
            <p>The cap surface can vary widely:</p>
            <ul>
              <li><strong>Smooth</strong> → common in many edible mushrooms</li>
              <li><strong>Scaly or warty</strong> → often linked to veil remnants</li>
              <li><strong>Slimy or sticky</strong> → influenced by moisture</li>
              <li><strong>Dry and fibrous</strong> → typical in certain woodland fungi</li>
            </ul>
            <p>For example, some <em>Amanita</em> species have warty caps due to remnants of the universal veil.</p>

            <H3>Cap Color and Its Limitations</H3>
            <p>Cap color is useful but unreliable on its own because it changes based on age, moisture, sun exposure, and environmental conditions. This is why a wild mushroom identifier by picture does not rely only on color.</p>

            <H3>How AI Identifies the Cap</H3>
            <p>A <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> uses image recognition to analyze shape geometry, color distribution, surface texture, and edge structure. These features are compared with labeled fungal datasets to identify likely species.</p>
          </Section>

          <Divider />

          {/* ── Gills Image ── */}
          <figure className="my-10">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <Image
                src="/mushroom-gills-lamellae-underside.webp"
                alt="Mushroom parts explained — close-up of mushroom gills (lamellae) underside showing spore-producing surface"
                width={707}
                height={820}
                className="w-full object-contain"
                style={{ display: 'block', maxHeight: '440px', objectFit: 'contain', padding: '12px' }}
              />
            </div>
            <figcaption className="text-center text-sm mt-3 space-y-1" style={{ color: 'var(--text-faint)' }}>
              <p>Close-up of mushroom gills (lamellae) — <em>Lactarius subdulcis</em> showing gill attachment and spacing</p>
              <p className="text-xs">Source: commons.wikimedia.org/wiki/File:Lact.sub.jpg — CC BY 3.0, Zonda Grattus</p>
            </figcaption>
          </figure>

          {/* ── SECTION 4: Gills ── */}
          <Section>
            <H2>Mushroom Gills (Lamellae): Spore Production, Gill Attachment, and Variations</H2>
            <p>The gills (lamellae) are the most important reproductive structure in many mushrooms. They are located beneath the cap and are responsible for spore production and dispersal.</p>

            <H3>Function of Gills</H3>
            <p>Gills increase surface area, allowing mushrooms to produce and release millions of spores into the environment. These spores help fungi reproduce and spread.</p>

            <H3>Types of Gill Attachment</H3>
            <p>Gill attachment is a key identification feature:</p>
            <ul>
              <li><strong>Free gills</strong> → not attached to the stem</li>
              <li><strong>Attached gills</strong> → directly connected</li>
              <li><strong>Decurrent gills</strong> → extend down the stem</li>
            </ul>
            <p>This single feature can immediately narrow down fungal species groups.</p>

            <H3>Other Important Gill Traits</H3>
            <ul>
              <li><strong>Spacing</strong> → crowded vs widely spaced</li>
              <li><strong>Thickness</strong> → thin vs thick</li>
              <li><strong>Color changes</strong> → white to pink to brown in some species</li>
            </ul>

            <H3>Gills vs Pores vs Teeth</H3>
            <p>Not all fungi have gills:</p>
            <ComparisonTable
              headers={['Fungi Type', 'Underside Structure']}
              rows={[
                ['Boletes', 'Pores (spongy underside)'],
                ['Tooth fungi', 'Spines or teeth'],
                ['Polypores', 'Tubes'],
              ]}
            />
            <p>Recognizing these differences is critical in mushroom classification.</p>

            <H3>How AI Uses Gill Patterns</H3>
            <p>A <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier app</Link> analyzes gill spacing and pattern, attachment type, color and contrast, and underside structure. These patterns are among the strongest indicators in AI mushroom identification systems.</p>
          </Section>

          <Divider />

          {/* ── SECTION 5: Stem ── */}
          <Section>
            <H2>Mushroom Stem (Stipe): Structure, Function, and Identification Clues</H2>
            <p>The stem (stipe) supports the cap and plays a crucial role in positioning the mushroom for effective spore dispersal.</p>

            <H3>Stem Structure Variations</H3>
            <p>Stems can vary significantly:</p>
            <ul>
              <li>Hollow vs solid</li>
              <li>Smooth or fibrous texture</li>
              <li>Thin or thick</li>
              <li>Straight or curved</li>
            </ul>
            <p>These variations provide strong identification signals.</p>

            <H3>Stem and Base Connection</H3>
            <p>The base of the stem connects to:</p>
            <ul>
              <li>Mycelium underground</li>
              <li>Basal bulb in some species</li>
              <li>Volva in certain toxic fungi</li>
            </ul>
            <p>This area is often overlooked but extremely important.</p>

            <H3>Role of the Stem</H3>
            <ul>
              <li>Elevates the cap for better airflow</li>
              <li>Supports reproductive structures</li>
              <li>Helps spores spread more efficiently</li>
            </ul>

            <H3>Identification Clues from the Stem</H3>
            <p>Look for: color changes, presence of a ring (annulus), bulb or swelling at the base, and surface texture. These features help distinguish between similar-looking mushrooms.</p>

            <H3>How AI Identifies the Stem</H3>
            <p>A <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> evaluates length and thickness, surface texture, connection to cap, and base structure. Combining stem features with cap and gill data improves accuracy in identifying wild fungi.</p>
          </Section>

          <Divider />

          {/* ── Cap & Stem Anatomy Image ── */}
          <figure className="my-10">
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <Image
                src="/mushroom-parts-cap-stem-anatomy.webp"
                alt="Mushroom parts explained — Amanita mushroom showing cap, stem, and volva anatomy structure"
                width={820}
                height={651}
                className="w-full object-contain"
                style={{ display: 'block', maxHeight: '440px', objectFit: 'contain', padding: '12px' }}
              />
            </div>
            <figcaption className="text-center text-sm mt-3 space-y-1" style={{ color: 'var(--text-faint)' }}>
              <p><em>Amanita jacksonii</em> — clearly showing cap, stem, and volva emerging from universal veil</p>
              <p className="text-xs">Source: commons.wikimedia.org/wiki/File:Amanita_stirps_Hemibapha_45069.jpg — CC BY-SA 3.0, hrdb via Mushroom Observer</p>
            </figcaption>
          </figure>

          {/* ── SECTION 6: Ring ── */}
          <Section>
            <H2>Mushroom Ring (Annulus): Veil Remnants and Identification Importance</H2>
            <p>The mushroom ring (annulus) is a circular band found on the stem (stipe). It forms from the partial veil, a protective membrane that covers the gills (lamellae) during early growth stages.</p>

            <H3>How the Ring Forms</H3>
            <p>When a young mushroom develops:</p>
            <ul>
              <li>The partial veil protects the gills</li>
              <li>As the cap expands, the veil tears</li>
              <li>The remaining tissue forms a ring around the stem</li>
            </ul>
            <p>This makes the ring a key indicator of a mushroom&apos;s growth stage.</p>

            <H3>Types of Mushroom Rings</H3>
            <p>Rings vary across species:</p>
            <ul>
              <li><strong>Thick and prominent</strong> (easy to see)</li>
              <li><strong>Thin and fragile</strong> (may disappear quickly)</li>
              <li><strong>Double rings</strong> (layered structures)</li>
              <li><strong>Movable rings</strong> (can slide along the stem)</li>
            </ul>
            <p>In some mushrooms, the ring may fade or vanish as the mushroom matures.</p>

            <H3>Why the Ring Matters in Identification</H3>
            <p>The presence or absence of a ring is a strong diagnostic feature:</p>
            <ul>
              <li>Many edible mushrooms → may have no ring or a simple ring</li>
              <li>Some toxic species → have a distinct ring + volva combination</li>
            </ul>
            <InfoBox>Many <em>Amanita</em> species show both ring and volva — this is a critical warning sign.</InfoBox>

            <H3>How AI Detects the Ring</H3>
            <p>A <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> uses image recognition to detect the circular band on the stem, texture difference from the rest of the stem, and position relative to cap and base. These features help the system distinguish between closely related fungal species.</p>
          </Section>

          <Divider />

          {/* ── SECTION 7: Volva ── */}
          <Section>
            <H2>Mushroom Volva (Basal Cup): The Most Important Safety Feature</H2>
            <p>The volva is a cup-like or sac-like structure at the base of a mushroom. It forms from the universal veil, which initially surrounds the entire young mushroom.</p>

            <H3>How the Volva Forms</H3>
            <ul>
              <li>The mushroom starts enclosed in a universal veil</li>
              <li>As it grows, the veil breaks apart</li>
              <li>The remaining tissue stays at the base → forming the volva</li>
            </ul>

            <H3>Types of Volva Structures</H3>
            <p>Volvas can appear as:</p>
            <ul>
              <li><strong>Cup-shaped</strong> (clearly visible)</li>
              <li><strong>Sac-like</strong> (wrapped around the base)</li>
              <li><strong>Bulbous base</strong> (thickened stem bottom)</li>
            </ul>
            <p>In many cases, the volva is partially or completely buried underground, making it easy to miss.</p>

            <H3>Why the Volva is Critical for Identification</H3>
            <p>The volva is one of the most important features in mushroom safety:</p>
            <ul>
              <li>Common in <em>Amanita</em> species</li>
              <li>Often associated with toxic mushrooms</li>
              <li>Rare in many edible species</li>
            </ul>
            <WarningBox>⚠️ Missing the volva is one of the biggest mistakes beginners make when identifying wild fungi.</WarningBox>

            <H3>How to Properly Check for a Volva</H3>
            <div className="space-y-3 my-5">
              {['Gently dig around the base of the stem', 'Avoid pulling the mushroom directly', 'Expose the full base before photographing'].map((step, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{i + 1}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{step}</span>
                </div>
              ))}
            </div>

            <H3>How AI Identifies the Volva</H3>
            <p>A <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier app</Link> analyzes base shape and structure, presence of cup-like formations, and relationship between stem and surrounding substrate. This helps prevent confusion between dangerous look-alike species.</p>
          </Section>

          <Divider />

          {/* ── SECTION 8: Additional Structures ── */}
          <Section>
            <H2>Additional Mushroom Structures (Advanced Mycology Entities)</H2>
            <p>Beyond the main five parts, several additional structures are important for deeper fungal identification.</p>

            <H3>Mycelium and Hyphae</H3>
            <ul>
              <li><strong>Mycelium</strong> → underground network of fungi</li>
              <li>Made of microscopic threads called <strong>hyphae</strong></li>
              <li>Connects fungi to soil, wood, and plant roots</li>
            </ul>
            <p>This network is responsible for nutrient absorption and ecological roles.</p>

            <H3>Spore Print</H3>
            <p>A spore print is created by placing a mushroom cap on paper to collect spores. Key uses:</p>
            <ul>
              <li>Identifying spore color groups</li>
              <li>Distinguishing similar species</li>
              <li>Confirming classification</li>
            </ul>

            <H3>Veil Remnants</H3>
            <p>Fragments of the universal veil may appear as warts or patches on the cap. Common in some toxic mushrooms, these remnants are important clues in species identification.</p>
          </Section>

          <Divider />

          {/* ── SECTION 9: How Parts Help Identification ── */}
          <Section>
            <H2>How Mushroom Parts Help in Accurate Identification</H2>
            <p>Correct identification requires combining all features together — not relying on a single trait.</p>

            <H3>Key Identification Combination</H3>
            <ComparisonTable
              headers={['Features Combined', 'What It Reveals']}
              rows={[
                ['Cap + Gills', 'Structure and spore type'],
                ['Stem + Ring', 'Developmental stage'],
                ['Volva + Base', 'Safety indicators'],
                ['Habitat + Substrate', 'Ecological context'],
              ]}
            />

            <H3>Role of Habitat and Environment</H3>
            <p>Fungi grow in specific environments:</p>
            <ul>
              <li><strong>Forest soil</strong> → mycorrhizal species</li>
              <li><strong>Hardwood logs</strong> → wood-rotting fungi</li>
              <li><strong>Conifer wood</strong> → specialized fungal groups</li>
              <li><strong>Moss or leaf litter</strong> → moisture-loving species</li>
            </ul>
            <p>This is why a wild mushroom identifier by picture includes location and habitat input.</p>

            <H3>How AI Combines All Features</H3>
            <p>A <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link> uses cap analysis, gill pattern recognition, stem structure detection, ring and volva identification, and habitat and seasonality data. This multi-layer analysis improves species matching accuracy.</p>
          </Section>

          <Divider />

          {/* ── SECTION 10: Common Mistakes ── */}
          <Section>
            <H2>Common Mistakes When Identifying Mushroom Parts</H2>
            <p>Even experienced foragers can make mistakes. Here are the most common ones:</p>

            <div className="space-y-4 my-6">
              {[
                { num: '1', title: 'Ignoring the Base (Volva)', desc: 'Failing to check the base can lead to missing a volva, which is critical for identifying toxic Amanita species.' },
                { num: '2', title: 'Relying Only on Cap Color', desc: 'Cap color changes with age, weather, and sun exposure. It should never be used alone.' },
                { num: '3', title: 'Confusing Gills with Pores', desc: 'Many beginners mistake pores (boletes) for gills, or teeth fungi for gilled mushrooms.' },
                { num: '4', title: 'Missing Ring or Veil Remnants', desc: 'Some mushrooms lose their ring over time, making identification harder.' },
                { num: '5', title: 'Ignoring Habitat Context', desc: 'Not noting whether the mushroom grows on soil, wood, or moss can lead to incorrect identification.' },
              ].map((item) => (
                <div key={item.num} className="flex gap-4 p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: '#ef444420', color: '#ef4444' }}>{item.num}</span>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Divider />

          {/* ── SECTION 11: Dangerous Look-Alikes ── */}
          <Section>
            <H2>Dangerous Look-Alikes Based on Mushroom Structure</H2>
            <p>Certain structural patterns are linked to high-risk mushrooms.</p>

            <H3>Amanita Pattern (High Risk)</H3>
            <WarningBox>
              ⚠️ <strong>Look for:</strong> White gills + Ring on stem + Volva at base → This combination is often associated with toxic species.
            </WarningBox>

            <H3>Puffball vs Young Gilled Mushrooms</H3>
            <ul>
              <li><strong>Puffballs</strong> → solid inside</li>
              <li><strong>Young gilled mushrooms</strong> → developing internal structures</li>
            </ul>

            <H3>Chanterelles vs Look-Alikes</H3>
            <ul>
              <li><strong>True chanterelles</strong> → ridges (not true gills)</li>
              <li><strong>False chanterelles</strong> → true gills</li>
            </ul>
            <p>Understanding these differences improves both manual and AI-based identification.</p>
          </Section>

          <Divider />

          {/* ── SECTION 12: Field Checklist ── */}
          <Section>
            <H2>Beginner Field Checklist for Mushroom Parts</H2>
            <p>Before using a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link>, collect complete data:</p>

            <div className="grid md:grid-cols-2 gap-6 my-6">
              <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="font-semibold mb-3" style={{ color: 'var(--accent)' }}>👁 What to Observe</p>
                <ul className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Cap shape, color, texture</li>
                  <li>Gills, pores, or teeth</li>
                  <li>Stem structure</li>
                  <li>Ring presence</li>
                  <li>Volva or base</li>
                  <li>Habitat (soil, wood, moss)</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="font-semibold mb-3" style={{ color: 'var(--accent)' }}>📷 What to Photograph</p>
                <ul className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <li>Top view (cap)</li>
                  <li>Underside (gills)</li>
                  <li>Side profile</li>
                  <li>Stem and base</li>
                  <li>Surrounding environment</li>
                </ul>
              </div>
            </div>
            <p>This improves results when using a mushroom identifier app.</p>
          </Section>

          <Divider />

          {/* ── FAQ ── */}
          <Section>
            <H2>FAQ: Mushroom Parts Explained</H2>
            <div className="space-y-4">
              {[
                { q: 'What are the main parts of a mushroom?', a: 'The main parts are the cap, gills, stem, ring, and volva, each playing a role in spore production and identification.' },
                { q: 'What is the function of mushroom gills?', a: 'Gills produce and release spores, enabling fungi to reproduce and spread.' },
                { q: 'What is a mushroom ring?', a: 'The ring (annulus) is a remnant of the partial veil that once protected the gills.' },
                { q: 'What is a volva in mushrooms?', a: 'The volva is a cup-like structure at the base, often found in toxic species, making it critical for identification.' },
                { q: 'How do mushroom parts help identify species?', a: 'By combining cap shape, gill structure, stem features, ring, volva, and habitat, both experts and AI mushroom identifiers can narrow down species accurately.' },
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
              Learning <strong>mushroom parts explained</strong> — cap, gills, stem, ring, and volva — gives you a powerful foundation in mycology and fungal identification.
            </p>
            <p>When combined with tools like a <Link href="/" style={{ color: 'var(--accent)' }} className="hover:underline">mushroom identifier</Link>, this knowledge helps you:</p>
            <ul>
              <li>Identify mushrooms more accurately</li>
              <li>Avoid dangerous look-alikes</li>
              <li>Understand fungal ecology</li>
              <li>Explore nature with confidence</li>
            </ul>
            <InfoBox>Always remember: use identification tools as guidance, not final proof, especially when dealing with wild mushrooms.</InfoBox>
          </Section>

          <RelatedPosts currentSlug="/mushroom-parts-explained" />

        </article>
      </div>
    </>
  )
}

/* ── Reusable components ──────────────────────────────────────── */
function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-10 space-y-4">{children}</section>
}
function Divider() {
  return <hr className="my-10 border-0 h-px" style={{ background: 'var(--border)' }} />
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-playfair text-2xl md:text-3xl font-bold mt-8 mb-3" style={{ color: 'var(--text-primary)' }}>{children}</h2>
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-playfair text-xl font-semibold mt-5 mb-2" style={{ color: 'var(--text-primary)' }}>{children}</h3>
}
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
