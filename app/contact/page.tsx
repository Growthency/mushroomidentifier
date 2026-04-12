import type { Metadata } from 'next'
import Link from 'next/link'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact MushroomIdentifiers – Support & Inquiries',
  description: 'Contact the MushroomIdentifiers team for support, bug reports, feature requests, or partnership inquiries. We respond within 24 hours. Includes poison emergency contacts.',
  openGraph: {
    type: 'website',
    title: 'Contact MushroomIdentifiers – We\'re Here to Help',
    description: 'Reach our support team, find poison emergency contacts, and browse our FAQ. Response within 24 hours.',
    url: 'https://mushroomidentifiers.com/contact',
    images: [{ url: 'https://mushroomidentifiers.com/mushroom-fungi-identifier.webp', width: 1200, height: 630 }],
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://mushroomidentifiers.com/contact',
      url: 'https://mushroomidentifiers.com/contact',
      name: 'Contact MushroomIdentifiers',
      description: 'Contact our support team for questions, bug reports, and inquiries about the AI mushroom identification platform.',
      isPartOf: { '@id': 'https://mushroomidentifiers.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mushroomidentifiers.com' },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://mushroomidentifiers.com/contact' },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How accurate is the mushroom identifier?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our AI achieves approximately 95% accuracy across 10,000+ species in controlled tests. Accuracy depends on photo quality and angle coverage. Always verify with a professional mycologist before consuming any wild mushroom.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the mushroom identifier free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Every user receives 3 free identification scans per day with no account required. Premium plans offer unlimited scans and advanced features.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use the identifier for foraging decisions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our tool is designed as a research and educational aid, not a sole identification authority. Never eat a mushroom identified only by AI. Always consult a qualified mycologist or mycological society.',
          },
        },
        {
          '@type': 'Question',
          name: 'What should I do if I think I ate a poisonous mushroom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Call emergency services immediately (911 in US, 999 in UK, 112 in EU). Contact Poison Control: US 1-800-222-1222, UK 0344 892 0111. Do not wait for symptoms. Bring a sample of the mushroom to the hospital if possible.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I get the best identification results?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Upload 3–4 photos from different angles: top of the cap, underside showing gills, full stem including base, and the surrounding habitat. Good lighting and focus dramatically improve accuracy.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to get a response from support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We aim to respond to all support enquiries within 24 hours on business days (Monday–Friday). For technical issues or safety concerns, responses are prioritised.',
          },
        },
      ],
    },
  ],
}

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto px-5 md:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-10" style={{ color: 'var(--text-faint)' }}>
            <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
            <span>/</span>
            <span>Contact</span>
          </nav>

          <ContactPageClient />
        </div>
      </div>
    </>
  )
}
