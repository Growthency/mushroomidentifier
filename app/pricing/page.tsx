'use client'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'

const PACKS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    price: '$4.99',
    credits: 120,
    identifications: 12,
    popular: false,
    features: [
      '120 credits = 12 identifications',
      '20% more than competitors',
      'Full AI species identification',
      'Complete safety warnings',
      'Similar species & lookalike alerts',
      'Emergency contact info',
      'Credits never expire',
    ],
  },
  {
    id: 'explorer',
    name: 'Explorer Pack',
    price: '$9.99',
    credits: 550,
    identifications: 55,
    popular: true,
    features: [
      '550 credits = 55 identifications',
      '10% more than competitors',
      'Everything in Starter',
      'Download PDF identification reports',
      'Full field journal access',
      'Priority AI model (faster results)',
      'Best value per identification',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    price: '$19.99',
    credits: 1200,
    identifications: 120,
    popular: false,
    features: [
      '1200 credits = 120 identifications',
      '50% cheaper per identification vs Starter',
      'Everything in Explorer',
      'Export data as CSV',
      'Priority customer support',
      'Best for serious foragers & mycologists',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            More Identifications. Better Value.
          </h1>
          <p className="text-xl mb-6" style={{ color: 'var(--text-muted)' }}>
            Credit packs that give you 10–20% more than the competition. Pay once, use forever.
          </p>
          <div className="inline-block px-6 py-3 rounded-lg" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Most apps give you 10 identifications for $4.99. We give you <span style={{ color: 'var(--accent)' }}>12</span>. Same price, more value.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24 items-start">
          {PACKS.map((pack) => (
            <div key={pack.id} className={`relative ${pack.popular ? 'pt-6' : ''}`}>
              {pack.popular && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-10 px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold tracking-wide">MOST POPULAR</span>
                </div>
              )}
            <div
              className="relative p-8 rounded-2xl card-lift card-glow h-full"
              style={{
                background: 'var(--bg-card)',
                border: pack.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
              }}
            >
              <h3 className="font-playfair text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {pack.name}
              </h3>
              <div className="mb-6">
                <span className="font-playfair text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>{pack.price}</span>
                <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>one-time</span>
              </div>

              <ul className="space-y-3 mb-8">
                {pack.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full px-6 py-3 rounded-lg font-semibold glow-green hover:opacity-90 transition-opacity"
                style={{ background: pack.popular ? 'var(--btn-primary)' : 'var(--accent-bg)', color: pack.popular ? '#fff' : 'var(--text-primary)' }}
              >
                Buy {pack.name}
              </button>
            </div>
            </div>
          ))}
        </div>

        <div className="mb-24 p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            How Credits Work
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'One identification = 10 credits deducted' },
              { num: '2', title: 'Credits never expire — use them anytime' },
              { num: '3', title: 'Failed analysis = full credit refund automatically' },
              { num: '4', title: 'Start free: 3 identifications/day, no signup needed' },
            ].map((item) => (
              <div key={item.num} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center font-playfair text-xl font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  {item.num}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <h2 className="font-playfair text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Value Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th className="p-4 text-left" style={{ color: 'var(--text-primary)' }}></th>
                  <th className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>Competitor</th>
                  <th className="p-4 text-center" style={{ color: 'var(--text-primary)' }}>Us (Starter)</th>
                  <th className="p-4 text-center" style={{ color: 'var(--text-primary)' }}>Us (Explorer)</th>
                  <th className="p-4 text-center" style={{ color: 'var(--text-primary)' }}>Us (Pro)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Price', vals: ['$4.99', '$4.99', '$9.99', '$19.99'] },
                  { label: 'Identifications', vals: ['10', '12', '55', '120'] },
                  { label: 'Per ID cost', vals: ['$0.50', '$0.42', '$0.18', '$0.17'] },
                  { label: 'Expiry', vals: ['12 months', 'Never', 'Never', 'Never'] },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>{row.label}</td>
                    {row.vals.map((val, j) => (
                      <td key={j} className="p-4 text-center" style={{ color: j === 0 ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: 'Do credits expire?', a: 'Never. Use them whenever you want.' },
              { q: 'What if the AI fails to identify?', a: 'Full credit refund, automatically.' },
              { q: 'Can I get a refund?', a: 'Yes, within 7 days if credits are unused.' },
              { q: 'Is there a free tier?', a: 'Yes, 3 free identifications per day per device.' },
              { q: 'Can I buy multiple packs?', a: 'Yes, credits stack on your account.' },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <Link href="/#identifier" className="inline-block px-8 py-4 rounded-full text-lg font-semibold glow-green hover:opacity-90 transition-opacity" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
            Start with 3 Free Identifications →
          </Link>
        </div>
      </div>
    </div>
  )
}
