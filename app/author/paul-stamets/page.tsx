import type { Metadata } from 'next'
import Link from 'next/link'
import NextImage from 'next/image'
import {
  Microscope, BookOpen, Award, MapPin, Leaf, TreePine,
  Shield, Eye, Fingerprint, Sprout, Home, ChevronRight,
  Quote, TriangleAlert as AlertTriangle, GraduationCap, Sparkles,
  Info, Camera,
} from 'lucide-react'

/**
 * Author page — Paul Stamets.
 *
 * Long-form, single-scroll layout mirroring the site's existing
 * typography (Playfair for headings, Inter for body) and accent palette
 * (emerald green, soft mint backgrounds). Structured for both human
 * readability and rich-result eligibility via a Person JSON-LD block.
 *
 * IMPORTANT: page content states that the platform is "inspired by"
 * Stamets' published work, not authored or endorsed by him — see the
 * bottom disclaimer. Do not remove that disclaimer without legal review.
 */

const PAGE_URL = 'https://mushroomidentifiers.com/author/paul-stamets'

export const metadata: Metadata = {
  title: 'Paul Stamets — Mycologist, Researcher & Author',
  description:
    "Paul Stamets is one of the most recognized figures in modern mycology. Explore his decades of fungal research, mushroom identification methodology, and influence on our AI-powered identification platform.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'profile',
    title: 'Paul Stamets — Mycologist, Researcher & Author',
    description:
      "Profile of Paul Stamets: decades of mycology research, mushroom identification frameworks, safety education, and influence on modern fungal science.",
    url: PAGE_URL,
    images: [
      {
        url: 'https://mushroomidentifiers.com/author-paul-stamets.webp',
        width: 1200,
        height: 630,
        alt: 'Paul Stamets — Mycologist, Researcher & Author',
      },
    ],
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${PAGE_URL}#person`,
  name: 'Paul Stamets',
  jobTitle: 'Mycologist, Researcher & Author',
  description:
    "Mycologist, researcher, and author recognized for decades of work in fungal biology, mushroom identification, and environmental advocacy.",
  image: 'https://mushroomidentifiers.com/author-paul-stamets.webp',
  url: PAGE_URL,
  sameAs: [],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'The Evergreen State College',
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
  },
  knowsAbout: [
    'Mycology',
    'Mushroom identification',
    'Mushroom cultivation',
    'Fungal taxonomy',
    'Mycelium networks',
    'Mushroom toxicology',
    'Ecosystem restoration',
  ],
  nationality: { '@type': 'Country', name: 'United States' },
}

/* ═════════ Reusable section components ═════════════════════════════════ */

function Section({
  children,
  alt = false,
  id,
}: { children: React.ReactNode; alt?: boolean; id?: string }) {
  return (
    <section
      id={id}
      className="py-14 sm:py-20 px-6"
      style={{ background: alt ? 'var(--bg-secondary)' : 'var(--bg-primary)' }}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  )
}

function SectionHeading({
  eyebrow, title, subtitle,
}: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 sm:mb-12">
      {eyebrow && (
        <p
          className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
          style={{ color: 'var(--accent)' }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base sm:text-lg leading-relaxed max-w-3xl"
          style={{ color: 'var(--text-muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ═════════ Page ═══════════════════════════════════════════════════════ */

export default function PaulStametsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <div className="pt-24 pb-4 px-6">
          <div className="max-w-5xl mx-auto">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs flex-wrap"
              style={{ color: 'var(--text-faint)' }}
            >
              <Link href="/" className="inline-flex items-center gap-1 hover:opacity-80">
                <Home className="w-3 h-3" /> Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/about" className="hover:opacity-80">About</Link>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: 'var(--text-muted)' }}>Paul Stamets</span>
            </nav>
          </div>
        </div>

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="px-6 pt-4 pb-12 sm:pb-20 relative overflow-hidden">
          {/* Ambient glow behind hero for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{ background: 'radial-gradient(circle at 30% 20%, rgba(16,185,129,0.12), transparent 50%)' }}
          />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid md:grid-cols-[auto,1fr] gap-8 sm:gap-12 items-center">

              {/* Portrait */}
              <div className="relative mx-auto md:mx-0">
                {/* Accent ring */}
                <div
                  className="absolute -inset-3 rounded-full opacity-30 blur-xl"
                  style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
                  aria-hidden="true"
                />
                <div
                  className="relative rounded-full overflow-hidden"
                  style={{
                    width: 220,
                    height: 220,
                    border: '4px solid var(--accent)',
                    boxShadow: '0 20px 40px -12px rgba(16,185,129,0.35)',
                  }}
                >
                  <NextImage
                    src="/author-paul-stamets.webp"
                    alt="Paul Stamets — Mycologist, Researcher & Author"
                    width={440}
                    height={440}
                    priority
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                  />
                </div>
                {/* Verified-expert badge */}
                <div
                  className="absolute -bottom-2 -right-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  <Award className="w-3.5 h-3.5" /> Expert
                </div>
              </div>

              {/* Text column */}
              <div className="text-center md:text-left">
                <p
                  className="text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
                  style={{ color: 'var(--accent)' }}
                >
                  Featured Mycologist
                </p>
                <h1
                  className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Paul Stamets
                </h1>
                <p
                  className="text-lg sm:text-xl mb-6"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Mycologist, Researcher &amp; Author
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'var(--accent-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  >
                    <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    United States
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'var(--accent-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  >
                    <GraduationCap className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    The Evergreen State College
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'var(--accent-bg)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  >
                    <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    Published Author
                  </span>
                </div>

                {/* Pull quote (opening hook) */}
                <blockquote
                  className="relative pl-5 py-1"
                  style={{ borderLeft: '3px solid var(--accent)' }}
                >
                  <Quote
                    className="absolute -top-2 -left-2 w-4 h-4 opacity-60"
                    style={{ color: 'var(--accent)' }}
                  />
                  <p
                    className="text-sm sm:text-base italic leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Decades of research, education, and environmental advocacy
                    shaping how the world identifies fungi — and why safety
                    comes first.
                  </p>
                </blockquote>
              </div>
            </div>

            {/* Stat strip */}
            <div
              className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl p-5"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              {[
                { icon: Microscope, label: 'Decades', sub: 'in mycology research' },
                { icon: BookOpen,   label: 'Books',   sub: 'on fungi &amp; cultivation' },
                { icon: TreePine,   label: 'Forests', sub: 'Pacific Northwest focus' },
                { icon: Shield,     label: 'Safety',  sub: 'public education' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center">
                  <stat.icon className="w-6 h-6 mb-2" style={{ color: 'var(--accent)' }} />
                  <p
                    className="font-playfair text-xl sm:text-2xl font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-[11px] sm:text-xs mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                    dangerouslySetInnerHTML={{ __html: stat.sub }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ──────────────────────────────────────────────────── */}
        <Section alt id="about">
          <SectionHeading
            eyebrow="About"
            title="A life in modern mycology"
          />
          <div
            className="space-y-5 text-base sm:text-lg leading-relaxed max-w-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            <p>
              Paul Stamets is one of the most recognized figures in modern
              mycology, known for his decades of work in fungal research,
              education, and environmental advocacy.
            </p>
            <p>
              He has dedicated his career to studying the role of fungi in
              ecosystems, with a particular focus on{' '}
              <strong style={{ color: 'var(--text-primary)' }}>mushroom identification</strong>,{' '}
              cultivation, and the ecological importance of mycelium networks.
            </p>
            <p>
              Based in the United States, his work has influenced both
              scientific communities and public understanding of fungi
              worldwide.
            </p>
          </div>
        </Section>

        {/* ── EDUCATION ───────────────────────────────────────────────── */}
        <Section id="education">
          <SectionHeading
            eyebrow="Education"
            title="Scientific background"
          />
          <div
            className="p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start gap-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
            >
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3
                className="font-playfair text-xl sm:text-2xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                The Evergreen State College
              </h3>
              <p
                className="text-sm mb-3"
                style={{ color: 'var(--text-muted)' }}
              >
                Biological Sciences · Olympia, Washington, USA
              </p>
              <p
                className="leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                Paul Stamets studied at The Evergreen State College, where he
                focused on biological sciences and developed a deep interest
                in fungi. Although much of his expertise comes from{' '}
                <strong>field research and decades of hands-on study</strong>,
                his work is widely referenced in mycological literature and
                education.
              </p>
            </div>
          </div>
        </Section>

        {/* ── RESEARCH & FIELDWORK ────────────────────────────────────── */}
        <Section alt id="research">
          <SectionHeading
            eyebrow="Research &amp; Fieldwork"
            title="Where his work happens"
            subtitle="Over his career, Paul Stamets has worked extensively across diverse ecosystems, combining ecological field study with taxonomic rigor."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ecosystems */}
            <div
              className="p-6 sm:p-7 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
              >
                <TreePine className="w-5 h-5" />
              </div>
              <h3
                className="font-playfair text-xl sm:text-2xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Ecosystems studied
              </h3>
              <ul className="space-y-3">
                {[
                  'Temperate forests of the Pacific Northwest (USA)',
                  'Old-growth forest systems rich in fungal biodiversity',
                  'Wood-decay and soil-based fungal habitats',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Leaf className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Focus areas */}
            <div
              className="p-6 sm:p-7 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
              >
                <Microscope className="w-5 h-5" />
              </div>
              <h3
                className="font-playfair text-xl sm:text-2xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Research focus areas
              </h3>
              <ul className="space-y-3">
                {[
                  'Mushroom identification and taxonomy',
                  'Mycelium networks and ecosystem health',
                  'Medicinal and functional fungi',
                  'Fungal roles in soil regeneration and decomposition',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Sprout className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── IDENTIFICATION EXPERTISE ────────────────────────────────── */}
        <Section id="identification">
          <SectionHeading
            eyebrow="Identification methodology"
            title="Structured, multi-feature approach"
            subtitle="Paul Stamets is particularly known for his rigorous, multi-data-point approach to identifying mushrooms — an approach essential for distinguishing between visually similar species."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Eye,
                title: 'Cap (pileus)',
                body: 'Shape, texture, and coloration — the first diagnostic layer most observers read.',
              },
              {
                icon: Fingerprint,
                title: 'Gill &amp; pore structures',
                body: 'Hymenophore analysis — attachment type, spacing, and color at maturity.',
              },
              {
                icon: Sprout,
                title: 'Stem (stipe)',
                body: 'Features including annulus (ring) and volva (cup-like base) — key for Amanita safety.',
              },
              {
                icon: Microscope,
                title: 'Spore print',
                body: 'Spore print color is often the single most diagnostic non-visual clue.',
              },
              {
                icon: TreePine,
                title: 'Habitat context',
                body: 'Host tree, substrate, elevation, and seasonality — narrows species dramatically.',
              },
              {
                icon: Shield,
                title: 'Safety cross-check',
                body: 'Every identification passes a "could this be a deadly look-alike?" gate before edibility is ever considered.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 sm:p-6 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <h3
                  className="font-semibold text-base sm:text-lg mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── SAFETY & TOXIC SPECIES AWARENESS ────────────────────────── */}
        <Section alt id="safety">
          <SectionHeading
            eyebrow="Public Safety"
            title="Toxic species awareness"
          />

          <div
            className="p-6 sm:p-8 rounded-2xl mb-6 flex items-start gap-4"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <AlertTriangle
              className="w-8 h-8 flex-shrink-0 mt-1"
              style={{ color: '#ef4444' }}
            />
            <div>
              <h3
                className="font-semibold text-lg sm:text-xl mb-2"
                style={{ color: '#ef4444' }}
              >
                A core mission: public education on toxicology
              </h3>
              <p
                className="leading-relaxed text-sm sm:text-base"
                style={{ color: 'var(--text-primary)' }}
              >
                A major focus of Stamets&apos; work is{' '}
                <strong>public education on mushroom safety and toxicology</strong>.
                He has repeatedly highlighted the dangers of deadly species
                such as{' '}
                <Link
                  href="/amanita-phalloides-death-cap"
                  className="underline font-semibold"
                  style={{ color: '#ef4444' }}
                >
                  Amanita phalloides
                </Link>
                , which can closely resemble edible mushrooms.
              </p>
            </div>
          </div>

          <div
            className="p-6 sm:p-8 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <p
              className="text-sm sm:text-base leading-relaxed italic"
              style={{ color: 'var(--text-primary)' }}
            >
              <Quote className="inline w-4 h-4 mr-1 -mt-1" style={{ color: 'var(--accent)' }} />
              Proper identification requires careful observation, multiple
              data points, and expert verification — especially when dealing
              with wild mushrooms.
            </p>
          </div>
        </Section>

        {/* ── CONTRIBUTIONS TO MYCOLOGY ───────────────────────────────── */}
        <Section id="contributions">
          <SectionHeading
            eyebrow="Contributions"
            title="Bringing mycology into the mainstream"
            subtitle="Paul Stamets has made significant contributions that helped move fungal science from academic obscurity to widespread practical use."
          />

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: BookOpen, title: 'Authored influential books', body: 'Published foundational texts on fungi and mushroom cultivation, widely used by foragers, researchers, and educators.' },
              { icon: Sparkles, title: 'Advanced fungal biodiversity awareness', body: 'Promoted public understanding of fungal variety and the ecological roles different species play.' },
              { icon: GraduationCap, title: 'Educated foragers &amp; researchers worldwide', body: 'Lectures, field workshops, and written guides have shaped how identification is practiced.' },
              { icon: Leaf, title: 'Environmental advocacy for fungi', body: 'Championed the role of fungi in soil regeneration, decomposition, and ecosystem restoration.' },
            ].map((c) => (
              <div
                key={c.title}
                className="p-5 sm:p-6 rounded-2xl flex items-start gap-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                >
                  <c.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className="font-semibold text-base mb-1"
                    style={{ color: 'var(--text-primary)' }}
                    dangerouslySetInnerHTML={{ __html: c.title }}
                  />
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                    dangerouslySetInnerHTML={{ __html: c.body }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── PLATFORM INFLUENCE ──────────────────────────────────────── */}
        <Section alt id="influence">
          <SectionHeading
            eyebrow="Influence on this platform"
            title="Built on established mycological frameworks"
          />
          <div
            className="p-6 sm:p-10 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--accent-bg), rgba(16,185,129,0.04))',
              border: '1px solid var(--border)',
            }}
          >
            <p
              className="text-base sm:text-lg leading-relaxed mb-6 max-w-3xl"
              style={{ color: 'var(--text-primary)' }}
            >
              The identification approach used on this platform is inspired
              by established mycological frameworks, including methods
              popularized by experts such as Paul Stamets. This includes:
            </p>
            <ul className="space-y-3 mb-8 max-w-3xl">
              {[
                'Multi-angle feature analysis',
                'Emphasis on morphological traits',
                'Habitat-based identification',
                'Strong safety-first approach',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <span
                    className="text-sm sm:text-base font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#identifier"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all hover:scale-[1.03]"
                style={{ background: 'var(--btn-primary)', color: '#fff' }}
              >
                <Camera className="w-4 h-4" />
                Try the AI Identifier
              </Link>
              <Link
                href="/mushroom-parts-explained"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-opacity hover:opacity-80"
                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <BookOpen className="w-4 h-4" />
                Learn Mushroom Anatomy
              </Link>
            </div>
          </div>
        </Section>

        {/* ── DISCLAIMER ─────────────────────────────────────────────── */}
        <Section id="disclaimer">
          <div
            className="p-6 sm:p-8 rounded-2xl flex items-start gap-4"
            style={{
              background: 'var(--bg-card)',
              border: '1px dashed var(--border)',
            }}
          >
            <Info
              className="w-6 h-6 flex-shrink-0 mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            />
            <div>
              <h3
                className="font-semibold text-base sm:text-lg mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Important note
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                This page is intended to highlight influential figures in
                mycology whose work informs modern identification practices.
                It does <strong>not imply direct affiliation, endorsement,
                or authorship</strong> unless explicitly stated.
              </p>
            </div>
          </div>
        </Section>

        {/* ── RELATED / NEXT STEPS ───────────────────────────────────── */}
        <Section alt id="related">
          <SectionHeading
            eyebrow="Continue reading"
            title="Related guides"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                href: '/amanita-phalloides-death-cap',
                title: 'Amanita phalloides (Death Cap)',
                body: 'The deadly lookalike every forager should recognize on sight.',
                icon: AlertTriangle,
              },
              {
                href: '/mushroom-parts-explained',
                title: 'Mushroom parts explained',
                body: 'Anatomy terminology used in every identification guide.',
                icon: BookOpen,
              },
              {
                href: '/mushroom-identification-quiz',
                title: 'Mushroom identification quiz',
                body: '50 expert questions covering toxic species, edible fungi, and anatomy.',
                icon: Sparkles,
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group p-5 sm:p-6 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                  style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                >
                  <card.icon className="w-5 h-5" />
                </div>
                <h3
                  className="font-semibold text-base mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-xs sm:text-sm leading-relaxed mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {card.body}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  Read more <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </>
  )
}
