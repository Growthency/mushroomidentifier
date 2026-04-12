import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import IdentifyBanner from '@/components/blog/IdentifyBanner'
import TableOfContents from '@/components/blog/TableOfContents'
import AuthorBlock from '@/components/blog/AuthorBlock'
import BlogSidebar from '@/components/blog/BlogSidebar'
import BlogComments from '@/components/blog/BlogComments'
import ArticleViewCount from '@/components/blog/ArticleViewCount'

export const metadata: Metadata = {
  title: 'Morchella esculenta (True Morel) \u2013 Identification Guide',
  description: 'Morchella esculenta, commonly known as the true morel, is one of the most sought-after edible wild mushrooms in the world.',
  alternates: { canonical: 'https://mushroomidentifiers.com/morchella-esculenta' },
  openGraph: {
    title: 'Morchella esculenta (True Morel) \u2013 Identification Guide',
    description: 'Morchella esculenta, commonly known as the true morel, is one of the most sought-after edible wild mushrooms in the world.',
    url: 'https://mushroomidentifiers.com/morchella-esculenta',
    images: [{ url: 'https://mushroomidentifiers.com/morchella-esculenta-true-morel-identification.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {"@context":"https://schema.org","@graph":[{"@type":"Article","headline":"Morchella esculenta (True Morel) \u2013 Identification, Edibility & Lookalikes","description":"Morchella esculenta, commonly known as the true morel, is one of the most sought-after edible wild mushrooms in the world.","image":["https://mushroomidentifiers.com/morchella-esculenta-true-morel-identification.webp","https://mushroomidentifiers.com/morel-mushroom-hollow-interior.webp","https://mushroomidentifiers.com/morchella-esculenta-habitat-forest.webp"],"author":{"@type":"Organization","name":"Mushroom Identifiers","url":"https://mushroomidentifiers.com/"},"publisher":{"@type":"Organization","name":"Mushroom Identifiers","url":"https://mushroomidentifiers.com/","email":"support@mushroomidentifiers.com"},"mainEntityOfPage":"https://mushroomidentifiers.com/morchella-esculenta","datePublished":"2026-04-11","dateModified":"2026-04-11"},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Are true morels safe to eat?","acceptedAnswer":{"@type":"Answer","text":"Yes, but only when properly identified and cooked."}},{"@type":"Question","name":"What do morels taste like?","acceptedAnswer":{"@type":"Answer","text":"They have a rich, earthy, and nutty flavor."}},{"@type":"Question","name":"How do you identify a true morel?","acceptedAnswer":{"@type":"Answer","text":"By its honeycomb cap and completely hollow interior."}},{"@type":"Question","name":"Can beginners forage morels?","acceptedAnswer":{"@type":"Answer","text":"Yes, with proper guidance and verification tools."}},{"@type":"Question","name":"Where do morels grow?","acceptedAnswer":{"@type":"Answer","text":"In forests, near trees, and in disturbed soil areas."}},{"@type":"Question","name":"Can AI identify morel mushrooms?","acceptedAnswer":{"@type":"Answer","text":"Yes, AI tools can help, but always confirm manually."}}]}]}

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
const SafeBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-5" style={{ background: '#22c55e12', border: '1px solid #22c55e35' }}>
    <span className="text-xl flex-shrink-0">&#x2705;</span>
    <div style={{ color: '#86efac' }}>{children}</div>
  </div>
)
const InfoBox = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-xl my-5" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-hover)' }}>
    <div style={{ color: 'var(--text-muted)' }}>{children}</div>
  </div>
)
const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-xl my-5" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
    <span className="text-xl flex-shrink-0">&#x26A0;&#xFE0F;</span>
    <div style={{ color: '#fca5a5' }}>{children}</div>
  </div>
)

export default function MorchellaEsculentaPage() {
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
                <span>Morchella esculenta True Morel</span>
              </nav>

              {/* Badges + Title */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>Edible</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#eab30820', color: '#eab308' }}>Gourmet</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#f9731620', color: '#f97316' }}>Lookalike Risk</span>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Species Guide</span>
                </div>
                <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                  <em>Morchella esculenta</em> (True Morel) &ndash; Identification, Edibility &amp; Lookalikes
                </h1>
                <AuthorBlock updatedAt="Apr 11, 2026" />
                <ArticleViewCount views={5230} className="mb-2" />
              </div>

              {/* Featured Image */}
              <figure className="mb-10 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="relative w-full" style={{ maxHeight: '480px' }}>
                  <Image
                    src="/morchella-esculenta-true-morel-identification.webp"
                    alt="Morchella esculenta true morel mushroom identification — honeycomb cap and stem specimen"
                    width={820}
                    height={550}
                    sizes="(max-width: 768px) 100vw, 820px"
                    className="w-full object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                </div>
                <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                  Morchella esculenta (True Morel). Photo: Holger Krisp, CC BY 3.0, via Wikimedia Commons
                </figcaption>
              </figure>

              <TableOfContents />

              {/* ── What is Morchella esculenta? ── */}
              <Section>
                <H2 id="what-is-morchella-esculenta">What is Morchella esculenta?</H2>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Morchella esculenta</em>, commonly known as the true morel, is one of the most sought-after edible wild mushrooms in the world. It is easily recognized by its honeycomb-like cap, hollow interior, and earthy flavor, making it a favorite among foragers and chefs. True morels grow in spring across temperate regions and are considered safe when properly cooked.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  For identification, the most important features are a fully hollow interior from cap to stem, a sponge-like honeycomb cap, and growth on soil rather than wood. Because false morels like <em>Gyromitra esculenta</em> can be toxic, accurate identification is essential. Many foragers now use a <Link href="/" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identifier</Link> tool or AI mushroom identification app alongside field knowledge for extra safety.
                </p>
              </Section>

              <Divider />

              {/* ── Scientific Classification ── */}
              <Section>
                <H2 id="scientific-classification">Scientific Classification &amp; Taxonomy</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <tbody>
                      {([
                        ['Kingdom', 'Fungi'],
                        ['Phylum', 'Ascomycota'],
                        ['Class', 'Pezizomycetes'],
                        ['Order', 'Pezizales'],
                        ['Family', 'Morchellaceae'],
                        ['Genus', 'Morchella'],
                        ['Species', 'Morchella esculenta'],
                      ] as const).map(([rank, name], i) => (
                        <tr key={rank} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold w-36" style={{ color: 'var(--accent)' }}>{rank}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}><em>{name}</em></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  True morels belong to the <em>Morchella</em> genus, a group of fungi known for their distinctive structure and culinary value. Several closely related species exist, often grouped as the &ldquo;morel complex,&rdquo; with slight variations in color and habitat.
                </p>
              </Section>

              <Divider />

              {/* ── Key Features ── */}
              <Section>
                <H2 id="key-features">Key Features (Identification Essentials)</H2>

                <H3 id="cap-characteristics">Cap Characteristics</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The cap of a true morel is distinctly honeycombed, with a network of ridges and pits forming a sponge-like structure. It ranges in color from pale yellow to golden brown and is usually oval or egg-shaped. This unique surface pattern is one of the most reliable identification features.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Shape:</strong> Oval or egg-shaped, honeycombed</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Color:</strong> Pale yellow to golden brown</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Surface:</strong> Network of ridges and pits</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Height:</strong> 3&ndash;10 cm</li>
                </ul>

                <H3 id="interior-structure">Interior Structure (Most Important Feature)</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  A defining characteristic of true morels is that they are completely hollow inside, from the tip of the cap down through the stem. When sliced lengthwise, there should be no cottony or chambered material inside&mdash;this helps distinguish them from toxic false morels.
                </p>

                {/* Hollow interior image */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full" style={{ maxHeight: '460px' }}>
                    <Image
                      src="/morel-mushroom-hollow-interior.webp"
                      alt="Morel mushroom hollow interior — Morchella esculenta cross-section showing completely hollow structure"
                      width={820}
                      height={550}
                      className="w-full object-cover"
                      style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    Cross-section of Morchella esculenta showing hollow interior. Photo: TOMMES-WIKI, CC BY-SA 3.0, via Wikimedia Commons
                  </figcaption>
                </figure>

                <H3 id="stem">Stem (Stipe)</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The stem is short, thick, and white to cream-colored, supporting the cap seamlessly. It is attached directly to the cap without gaps, forming a continuous hollow chamber. The texture is slightly grainy but firm.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm list-disc pl-5" style={{ color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Shape:</strong> Short, thick, continuous with cap</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Color:</strong> White to cream</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Interior:</strong> Completely hollow</li>
                  <li><strong style={{ color: 'var(--text-primary)' }}>Height:</strong> 2&ndash;6 cm</li>
                </ul>
              </Section>

              <Divider />

              {/* ── Color, Smell & Texture ── */}
              <Section>
                <H2 id="color-smell-texture">Color, Smell &amp; Texture</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  True morels have a mild, earthy aroma and a pleasant, nutty taste when cooked. The flesh is delicate yet slightly firm, making it ideal for saut&eacute;ing or drying. The color varies depending on age and environment but generally stays within yellow to brown tones.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {([
                    ['Color', 'Pale yellow to golden brown cap, white stem'],
                    ['Smell', 'Mild, earthy, pleasant aroma'],
                    ['Texture', 'Delicate yet firm, ideal for cooking'],
                  ] as const).map(([label, desc]) => (
                    <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Habitat & Environment ── */}
              <Section>
                <H2 id="habitat-distribution">Environment &amp; Habitat</H2>

                <H3 id="habitat">Habitat &amp; Distribution</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  True morels are widely found across Europe, North America, and Asia, particularly in temperate climates. They grow in association with trees like elm, ash, apple, and oak, often appearing in disturbed soils or post-fire environments.
                </p>

                {/* Habitat image */}
                <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <div className="relative w-full" style={{ maxHeight: '460px' }}>
                    <Image
                      src="/morchella-esculenta-habitat-forest.webp"
                      alt="Morchella esculenta habitat — true morel mushrooms growing in natural forest floor environment"
                      width={820}
                      height={550}
                      className="w-full object-cover"
                      style={{ maxHeight: '460px', objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </div>
                  <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
                    Morchella esculenta grouping in natural habitat. Photo: DrewHeath, CC BY-SA 4.0, via Wikimedia Commons
                  </figcaption>
                </figure>

                <H3 id="seasonality">Seasonality</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  They are a spring mushroom, typically appearing between March and May. Their growth is closely linked to soil temperature and moisture, often emerging after rain and warming conditions.
                </p>

                <H3 id="growth-pattern">Growth Pattern</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Morels grow singly or in scattered groups, usually on soil rather than wood. They are often found near tree roots, in leaf litter, or in areas that have recently experienced environmental disturbance.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                  {([
                    ['Regions', 'Europe, North America, Asia'],
                    ['Trees', 'Elm, ash, apple, oak'],
                    ['Season', 'Spring (March\u2013May)'],
                    ['Growth', 'Solitary or scattered on disturbed soil'],
                  ] as const).map(([label, val]) => (
                    <div key={label} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold w-20 flex-shrink-0" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Physical Dimensions ── */}
              <Section>
                <H2 id="physical-dimensions">Physical Dimensions &amp; Structure</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Feature</th>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Measurement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['Cap Height', '3\u201310 cm'],
                        ['Stem Height', '2\u20136 cm'],
                        ['Overall Height', '5\u201315 cm'],
                        ['Structure', 'Fully hollow'],
                      ] as const).map(([feat, val], i) => (
                        <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--accent)' }}>{feat}</td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  Their lightweight yet structured form makes them easy to identify once key features are understood.
                </p>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Edibility & Nutrition ── */}
              <Section>
                <H2 id="edibility-nutrition">Edibility &amp; Nutritional Value</H2>

                <SafeBox>
                  <p className="text-sm font-semibold">Is Morchella esculenta edible? Yes &mdash; highly edible and considered a gourmet delicacy.</p>
                </SafeBox>

                <H3 id="culinary-uses">Culinary Uses</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Morels are used in saut&eacute;ed dishes, sauces, risottos, and gourmet recipes. They are often dried to preserve flavor and rehydrated for cooking. Their unique texture and earthy taste make them a prized ingredient in fine dining.
                </p>

                <H3 id="nutritional-benefits">Nutritional Benefits</H3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  They are rich in protein, fiber, antioxidants, and vitamins, supporting a balanced diet.
                </p>

                <WarningBox>
                  <p className="text-sm"><strong>Important:</strong> Morels must always be cooked before eating. Raw morels contain hydrazine compounds that are destroyed by heat.</p>
                </WarningBox>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  {([
                    ['Protein', 'High plant-based protein content'],
                    ['Iron', 'Significant iron per serving'],
                    ['Vitamin D', 'Natural source of vitamin D'],
                  ] as const).map(([label, desc]) => (
                    <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-xs font-semibold block mb-1" style={{ color: 'var(--accent)' }}>{label}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Risk Level ── */}
              <Section>
                <H2 id="risk-level">Risk Level Assessment</H2>
                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Factor</th>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['Edibility', 'Excellent'],
                        ['Toxicity Risk', 'Moderate (misidentification risk)'],
                        ['Fatality Risk', 'High if confused with false morels'],
                        ['Identification Difficulty', 'Moderate'],
                      ] as const).map(([factor, level], i) => (
                        <tr key={factor} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--accent)' }}>{factor}</td>
                          <td className="px-4 py-3" style={{ color: factor === 'Edibility' ? '#86efac' : '#fca5a5' }}>{level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <WarningBox>
                  <p className="text-sm">While safe when correctly identified, confusion with toxic false morels (<em>Gyromitra esculenta</em>) can be dangerous. Always verify with a reliable <Link href="/" className="font-medium underline" style={{ color: '#fca5a5' }}>mushroom identification app</Link>.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── Similar Species ── */}
              <Section>
                <H2 id="similar-species">Similar Species (Critical Comparison)</H2>
                <H3 id="true-vs-false-morel">True Morel vs False Morel</H3>
                <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid var(--border)' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        {['Feature', 'True Morel (M. esculenta)', 'False Morel (Gyromitra)'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-primary)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {([
                        ['Cap', 'Honeycomb pattern', 'Brain-like, wrinkled'],
                        ['Interior', 'Completely hollow', 'Chambered, cottony'],
                        ['Shape', 'Symmetrical, uniform', 'Irregular, lumpy'],
                        ['Attachment', 'Cap attached at base', 'Cap hangs free'],
                        ['Toxicity', 'Edible (cook first)', 'Toxic (gyromitrin)'],
                      ] as const).map(([feat, morel, fmorel], i) => (
                        <tr key={feat} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)' }}>
                          <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{feat}</td>
                          <td className="px-4 py-3" style={{ color: '#86efac' }}>{morel}</td>
                          <td className="px-4 py-3" style={{ color: '#fca5a5' }}>{fmorel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The most common dangerous lookalike is <em>Gyromitra esculenta</em>, which has a wrinkled, brain-like cap and is not fully hollow inside. For more on identifying dangerous species, see our <Link href="/amanita-phalloides-death-cap" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>death cap identification guide</Link>.
                </p>
              </Section>

              <Divider />

              {/* ── Growth Pattern & Life Cycle ── */}
              <Section>
                <H2 id="growth-lifecycle">Growth Pattern &amp; Life Cycle</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  True morels are partially mycorrhizal, meaning they can form relationships with tree roots but also act as decomposers. Their life cycle includes spore dispersal, underground mycelium growth, and seasonal fruiting triggered by environmental conditions.
                </p>
                <InfoBox>
                  <p className="text-sm"><strong style={{ color: 'var(--text-primary)' }}>Did you know?</strong> Morels are one of the few mushrooms that frequently appear in areas after forest fires, earning them the nickname &ldquo;fire morels.&rdquo; The disturbed soil and reduced competition create ideal growing conditions.</p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Regions ── */}
              <Section>
                <H2 id="regions">Regions Where It Is Found</H2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  True morels are widely distributed and especially common in temperate forests and grasslands:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {([
                    ['United States', 'Midwest, Pacific Northwest'],
                    ['Canada', 'British Columbia, Ontario'],
                    ['France', 'Prized in French cuisine'],
                    ['China', 'Major commercial harvest'],
                    ['Turkey', 'Significant wild harvest'],
                    ['India', 'Himalayan foothills'],
                  ] as const).map(([country, detail]) => (
                    <div key={country} className="p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>{country}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{detail}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Economic & Ecological Value ── */}
              <Section>
                <H2 id="economic-ecological-value">Economic &amp; Ecological Value</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  True morels have high economic value due to their demand in global markets. They are often sold fresh or dried at premium prices. Ecologically, they contribute to nutrient cycling and may support tree health through symbiotic relationships. Understanding <Link href="/mushroom-parts-explained" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom parts and anatomy</Link> helps appreciate these ecological roles.
                </p>
              </Section>

              <Divider />

              <div className="not-prose"><IdentifyBanner /></div>


              {/* ── Pros and Cons ── */}
              <Section>
                <H2 id="pros-cons">Pros and Cons</H2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ background: '#22c55e08', border: '1px solid #22c55e25' }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: '#86efac' }}>Pros</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Highly edible and flavorful</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Nutritionally beneficial</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Valuable in culinary markets</li>
                      <li className="flex gap-2"><span style={{ color: '#22c55e' }}>&#x2713;</span> Dries well for long-term storage</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: '#ef444408', border: '1px solid #ef444425' }}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: '#fca5a5' }}>Cons</h4>
                    <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Seasonal and unpredictable</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Easily confused with toxic false morels</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Must be cooked before eating</li>
                      <li className="flex gap-2"><span style={{ color: '#ef4444' }}>&#x2717;</span> Difficult to cultivate commercially</li>
                    </ul>
                  </div>
                </div>
              </Section>

              <Divider />

              {/* ── How to Identify Safely ── */}
              <Section>
                <H2 id="how-to-identify">How to Identify Morchella esculenta Safely</H2>
                <H3 id="step-by-step">Step-by-Step Identification</H3>
                <div className="space-y-3">
                  {([
                    ['1', 'Look for honeycomb cap structure', 'Network of ridges and pits forming a sponge-like pattern'],
                    ['2', 'Cut open \u2014 confirm completely hollow interior', 'Slice lengthwise: no cottony or chambered material inside'],
                    ['3', 'Check cap attachment', 'Cap should be attached at the base of the stem, not hanging free'],
                    ['4', 'Confirm growth on soil, not wood', 'Found near tree roots in leaf litter or disturbed soil'],
                    ['5', 'Observe spring seasonality', 'Typically appears March\u2013May after rain and warming'],
                  ] as const).map(([step, title, desc]) => (
                    <div key={step} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{step}</span>
                      <div>
                        <span className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>{title}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <InfoBox>
                  <p className="text-sm">For better accuracy, use a <Link href="/" className="font-medium underline" style={{ color: 'var(--accent)' }}>mushroom identifier free by photo</Link> tool or AI-based mushroom identification system to confirm findings.</p>
                </InfoBox>
              </Section>

              <Divider />

              {/* ── Expert Tips ── */}
              <Section>
                <H2 id="expert-tips">Expert Identification Tips</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Always slice the mushroom lengthwise to verify its hollow structure. Avoid any specimen with irregular folds or internal chambers. Cross-check multiple features and never rely on appearance alone. For a comprehensive visual reference, explore our <Link href="/mushroom-identifier-book" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identification book</Link> recommendations.
                </p>
                <WarningBox>
                  <p className="text-sm">False morels (<em>Gyromitra esculenta</em>) contain gyromitrin, a toxin that can cause severe illness or death. Always cut your morel in half lengthwise to verify the completely hollow interior before consuming.</p>
                </WarningBox>
              </Section>

              <Divider />

              {/* ── FAQs ── */}
              <Section>
                <H2 id="faqs">People Also Ask (FAQs)</H2>
                <div className="space-y-3">
                  {([
                    { q: 'Are true morels safe to eat?', a: 'Yes, but only when properly identified and cooked. Raw morels contain compounds that are destroyed by heat, so they must always be thoroughly cooked before consumption.' },
                    { q: 'What do morels taste like?', a: 'They have a rich, earthy, and nutty flavor with a unique meaty texture. Their taste intensifies significantly when dried and rehydrated.' },
                    { q: 'How do you identify a true morel?', a: 'By its honeycomb-patterned cap and completely hollow interior when sliced lengthwise. The cap should be attached at the base, not hanging free.' },
                    { q: 'Can beginners forage morels?', a: 'Yes, with proper guidance and verification tools. The hollow interior test is simple and reliable, but beginners should always double-check with experienced foragers.' },
                    { q: 'Where do morels grow?', a: 'In temperate forests worldwide, near trees like elm, ash, apple, and oak. They often appear in spring in disturbed soil or post-fire areas.' },
                    { q: 'Can AI identify morel mushrooms?', a: 'Yes, AI tools can help with initial identification, but always confirm manually by slicing the mushroom open to check for a hollow interior.' },
                  ] as const).map(({ q, a }) => (
                    <details key={q} className="rounded-xl overflow-hidden group" style={{ border: '1px solid var(--border)' }}>
                      <summary className="px-5 py-4 cursor-pointer font-semibold text-sm flex items-center justify-between select-none" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', listStyle: 'none' }}>
                        <span>{q}</span>
                        <span className="ml-3 flex-shrink-0 transition-transform duration-200 group-open:rotate-45" style={{ color: 'var(--accent)' }}>+</span>
                      </summary>
                      <div className="px-5 py-4 text-sm leading-relaxed" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                        {a}
                      </div>
                    </details>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* ── Final Thoughts ── */}
              <Section>
                <H2 id="final-thoughts">Final Thoughts</H2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  <em>Morchella esculenta</em> is one of the most prized wild mushrooms due to its unique appearance and exceptional flavor. While relatively easy to identify compared to many species, caution is still essential due to toxic lookalikes.
                </p>
                <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--text-muted)' }}>
                  By combining field knowledge with a reliable <Link href="/" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>mushroom identifier tool</Link>, you can safely enjoy foraging and avoid dangerous mistakes.
                </p>
              </Section>

              <Divider />
              <BlogComments slug="/morchella-esculenta" />

            </article>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
