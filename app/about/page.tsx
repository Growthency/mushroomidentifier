import { Shield, Zap, Globe, Search, Users, BookOpen, AlertTriangle, CheckCircle2, Brain, Camera, Database, ArrowRight, Microscope, Leaf } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About MushroomIdentifiers – AI Mushroom Identification Platform',
  description: 'MushroomIdentifiers uses Claude AI and computer vision to identify 10,000+ mushroom species with 95% accuracy. Built by foragers, mycologists & AI researchers committed to safe foraging worldwide.',
  openGraph: {
    type: 'website',
    title: 'About MushroomIdentifiers – AI-Powered Fungi Identification',
    description: 'Our mission: make safe mushroom identification accessible to everyone. Powered by Claude AI from Anthropic, trained on expert mycological databases.',
    url: 'https://mushroomidentifiers.com/about',
    images: [{ url: 'https://mushroomidentifiers.com/mushroom-fungi-identifier.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://mushroomidentifiers.com/#organization',
      name: 'MushroomIdentifiers',
      alternateName: 'Mushroom Identifiers',
      url: 'https://mushroomidentifiers.com',
      description: 'AI-powered mushroom identification platform combining Claude AI from Anthropic with expert mycological knowledge for accurate, safe foraging worldwide.',
      email: 'support@mushroomidentifiers.com',
      areaServed: 'Worldwide',
      knowsAbout: [
        'Mushroom Identification',
        'Mycology',
        'Foraging Safety',
        'AI Image Recognition',
        'Computer Vision',
        'Fungal Species Classification',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Mushroom Identification Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Free AI Mushroom Identification' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Species Safety Reports' } },
        ],
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://mushroomidentifiers.com/about',
      url: 'https://mushroomidentifiers.com/about',
      name: 'About MushroomIdentifiers – AI Mushroom Identification',
      description: 'Learn about our AI-powered mushroom identification platform, our mission, technology stack, and commitment to foraging safety.',
      isPartOf: { '@id': 'https://mushroomidentifiers.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mushroomidentifiers.com' },
          { '@type': 'ListItem', position: 2, name: 'About', item: 'https://mushroomidentifiers.com/about' },
        ],
      },
    },
  ],
}

const STATS = [
  { value: '10,000+', label: 'Fungal Species', desc: 'Comprehensive species database covering edible, toxic, and medicinal fungi worldwide', icon: Database },
  { value: '95%', label: 'ID Accuracy', desc: 'Verified against expert mycologist classifications across 50,000+ test identifications', icon: CheckCircle2 },
  { value: '50K+', label: 'Identifications', desc: 'Mushroom IDs completed by foragers, students, and researchers globally', icon: Search },
  { value: '120+', label: 'Countries', desc: 'Serving the global foraging community across six continents', icon: Globe },
]

const STEPS = [
  {
    step: '01',
    icon: Camera,
    title: 'Upload Your Photos',
    desc: 'Photograph up to 4 angles — cap, gills, stem, and base. More angles mean higher accuracy. Our system works with any smartphone camera.',
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI Analyzes Features',
    desc: 'Claude AI from Anthropic cross-references morphological features — cap shape, gill attachment, spore colour, habitat, and dozens more — against our species database.',
  },
  {
    step: '03',
    icon: Shield,
    title: 'Get a Safety-First Report',
    desc: 'Receive ranked species matches with toxicity ratings, key identification details, and a clear safety verdict. Always with a reminder to verify with an expert.',
  },
]

const TECH = [
  {
    icon: Brain,
    title: 'Claude AI by Anthropic',
    desc: 'We power our analysis engine with Claude AI — one of the most capable large language models available — giving our system deep mycological reasoning beyond simple image matching.',
  },
  {
    icon: Camera,
    title: 'Computer Vision',
    desc: 'Advanced image recognition trained specifically on fungal morphology: cap cuticle texture, lamellae spacing, stem surface patterns, volva structure, and colour gradients.',
  },
  {
    icon: Database,
    title: 'Expert-Verified Database',
    desc: 'Our species database is built from peer-reviewed mycological literature, herbarium records, and field-verified data from professional mycologists and scientific institutions.',
  },
  {
    icon: Microscope,
    title: 'Multi-Feature Analysis',
    desc: 'Unlike single-image tools, we analyse habitat context, geographic distribution, seasonal patterns, and microscopic feature descriptions for dramatically higher precision.',
  },
]

const VALUES = [
  {
    icon: Shield,
    color: '#ef4444',
    bg: '#ef444415',
    title: 'Safety Above Everything',
    desc: 'Every feature we build starts with one question: does this make foraging safer? We prominently display toxicity warnings, recommend expert verification, and never overstate AI confidence.',
  },
  {
    icon: Microscope,
    color: '#3b82f6',
    bg: '#3b82f615',
    title: 'Scientific Rigour',
    desc: 'Our identification data is grounded in taxonomic science, not crowdsourced guesses. We cite authoritative references and update species records as mycological research evolves.',
  },
  {
    icon: Globe,
    color: '#22c55e',
    bg: '#22c55e15',
    title: 'Accessible to Everyone',
    desc: 'Expert mycological knowledge shouldn\'t cost a premium. Three free scans, no login required, no paywall on safety information. Identification should be a right, not a subscription.',
  },
  {
    icon: BookOpen,
    color: '#f59e0b',
    bg: '#f59e0b15',
    title: 'Education-First',
    desc: 'We don\'t just tell you the species name. We explain why — the features, the look-alikes to avoid, the habitat context — so you become a better forager with every scan.',
  },
]

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-5 md:px-6 text-center mb-24">
          <nav className="flex items-center justify-center gap-2 text-xs mb-10" style={{ color: 'var(--text-faint)' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
            <span>/</span>
            <span>About</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
            <Leaf className="w-3.5 h-3.5" />
            Our Story &amp; Mission
          </div>

          <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Making Safe Mushroom<br />
            <span style={{ color: 'var(--accent)' }}>Identification Accessible</span><br />
            to Everyone
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            We combined AI research, mycological expertise, and a passion for foraging to build the most accurate, safety-first mushroom identifier available — free, for everyone, anywhere in the world.
          </p>
        </section>

        {/* ── Stats ─────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-5 md:px-6 mb-24" aria-label="Platform statistics">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <div key={s.label} className="p-6 rounded-2xl flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <s.icon className="w-6 h-6 mb-4" style={{ color: 'var(--accent)' }} />
                <p className="font-playfair text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>{s.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-faint)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mission + Vision ──────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-5 md:px-6 mb-24" aria-labelledby="mission-heading">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--accent-bg)' }}>
                <Zap className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              </div>
              <h2 id="mission-heading" className="font-playfair text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                To provide the most accurate, safety-first mushroom identification platform on the planet — combining cutting-edge AI with expert mycological knowledge, freely accessible to every forager, student, and nature enthusiast.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We believe that access to reliable species information saves lives. Every poisoning incident is preventable with the right tools and education.
              </p>
            </div>

            <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: '#22c55e15' }}>
                <Leaf className="w-5 h-5" style={{ color: '#22c55e' }} />
              </div>
              <h2 className="font-playfair text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Our Vision</h2>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                A world where anyone — from a first-time forest walker to a seasoned mycologist — can identify fungi with confidence and safety, supported by AI that explains its reasoning, not just its answer.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We envision AI and human expertise working together to protect and educate the global foraging community.
              </p>
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-5 md:px-6 mb-24" aria-labelledby="how-it-works-heading">
          <div className="text-center mb-12">
            <h2 id="how-it-works-heading" className="font-playfair text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              How Our AI Identification Works
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Three steps from photo to confident species identification — powered by the same AI that drives cutting-edge research.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.step} className="relative p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="text-5xl font-playfair font-bold mb-4 opacity-10 select-none" style={{ color: 'var(--accent)' }}>
                  {step.step}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-bg)' }}>
                  <step.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Technology ────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-5 md:px-6 mb-24" aria-labelledby="technology-heading">
          <div className="text-center mb-12">
            <h2 id="technology-heading" className="font-playfair text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              The Technology Behind Every ID
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              We don't just run an image through a classifier. We combine multiple layers of AI reasoning for results you can trust.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {TECH.map((t) => (
              <div key={t.title} className="p-6 rounded-2xl flex gap-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-bg)' }}>
                  <t.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Values ────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-5 md:px-6 mb-24" aria-labelledby="values-heading">
          <div className="text-center mb-12">
            <h2 id="values-heading" className="font-playfair text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              What We Stand For
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Four principles guide every decision we make — from feature design to how we present identification results.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: v.bg }}>
                  <v.icon className="w-5 h-5" style={{ color: v.color }} />
                </div>
                <h3 className="font-playfair text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Safety Commitment ─────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-5 md:px-6 mb-24" aria-labelledby="safety-commitment-heading">
          <div className="p-8 md:p-10 rounded-2xl" style={{ background: '#ef444410', border: '1px solid #ef444430' }}>
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#ef444420' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
              <div>
                <h2 id="safety-commitment-heading" className="font-playfair text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Our Safety Commitment
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  AI identification is a powerful first step — not a final verdict. Some of the world's most deadly mushrooms (<strong style={{ color: 'var(--text-primary)' }}>Amanita phalloides</strong>, <strong style={{ color: 'var(--text-primary)' }}>Amanita bisporigera</strong>) closely resemble edible species. No AI tool — including ours — can guarantee 100% accuracy in every condition.
                </p>
                <p className="leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Never eat a wild mushroom based solely on an AI identification.</strong> Always have your finds verified by a qualified local mycologist or your regional mycological society before consumption.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#ef4444' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    Use AI as a research aid
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#ef4444' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    Verify with a mycologist
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#ef4444' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    When in doubt, don't eat it
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Who We Serve ──────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-5 md:px-6 mb-24" aria-labelledby="who-we-serve-heading">
          <div className="text-center mb-10">
            <h2 id="who-we-serve-heading" className="font-playfair text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Who Uses MushroomIdentifiers
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Leaf, label: 'Wild Foragers', desc: 'From beginners finding their first chanterelle to experienced foragers double-checking an unfamiliar Amanita.' },
              { icon: BookOpen, label: 'Students & Educators', desc: 'Mycology students, botany professors, and science educators using real-world identification as a learning tool.' },
              { icon: Users, label: 'Researchers & Naturalists', desc: 'Field researchers, nature photographers, and citizen scientists cataloguing fungal biodiversity.' },
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-bg)' }}>
                  <item.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{item.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-5 md:px-6 text-center">
          <div className="p-10 md:p-14 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Ready to Identify Your Find?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
              Upload a photo and get an AI-powered species match in under 60 seconds — free, no account needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#identifier"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold glow-green hover:opacity-90 transition-opacity"
                style={{ background: 'var(--btn-primary)', color: '#fff' }}
              >
                Try the Identifier Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-opacity hover:opacity-80"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
