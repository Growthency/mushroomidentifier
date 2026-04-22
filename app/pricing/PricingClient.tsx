'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, Loader2, ShieldCheck, RefreshCcw, Infinity as InfinityIcon } from 'lucide-react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { createClient } from '@/lib/supabase/client'

// ── Subscription plan definitions ────────────────────────────────────
const PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$4.99',
    priceEnv: 'NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID',
    credits: 120,
    identifications: 12,
    popular: false,
    features: [
      '120 credits every month (12 IDs/mo)',
      '20% more than competitors',
      'Full AI species identification',
      'Complete safety warnings',
      'Similar species & lookalike alerts',
      'Emergency contact info',
      'Cancel anytime',
    ],
  },
  {
    id: 'explorer',
    name: 'Explorer',
    price: '$9.99',
    priceEnv: 'NEXT_PUBLIC_PADDLE_EXPLORER_PRICE_ID',
    credits: 550,
    identifications: 55,
    popular: true,
    features: [
      '550 credits every month (55 IDs/mo)',
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
    name: 'Pro',
    price: '$19.99',
    priceEnv: 'NEXT_PUBLIC_PADDLE_PRO_PRICE_ID',
    credits: 1200,
    identifications: 120,
    popular: false,
    features: [
      '1200 credits every month (120 IDs/mo)',
      '50% cheaper per identification vs Starter',
      'Everything in Explorer',
      'Export data as CSV',
      'Priority customer support',
      'Best for serious foragers & mycologists',
    ],
  },
]

// Map pack id → price ID from env
const PRICE_IDS: Record<string, string> = {
  starter:  process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID  ?? '',
  explorer: process.env.NEXT_PUBLIC_PADDLE_EXPLORER_PRICE_ID ?? '',
  pro:      process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID      ?? '',
}

export default function PricingClient() {
  const router   = useRouter()
  const [paddle,   setPaddle]   = useState<Paddle | null>(null)
  const [userId,   setUserId]   = useState<string | null>(null)
  const [buying,   setBuying]   = useState<string | null>(null)   // packId being purchased
  const [success,  setSuccess]  = useState<string | null>(null)   // packId just purchased
  const [authReady, setAuthReady] = useState(false)

  // ── Load Paddle JS SDK ──────────────────────────────────────────
  useEffect(() => {
    const env = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? 'sandbox') as 'sandbox' | 'production'
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ''
    if (!token) {
      console.error('[paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is missing')
      return
    }
    initializePaddle({
      environment: env,
      token,
      // Surface every Paddle event so checkout failures don't silently die
      eventCallback: (event) => {
        if (event.name === 'checkout.error' || event.name === 'checkout.failed') {
          console.error('[paddle] checkout error:', event)
          setBuying(null)
        }
        if (event.name === 'checkout.completed') {
          const packId = (event.data as any)?.custom_data?.packId
          if (packId) handleCheckoutComplete(packId)
        }
        if (event.name === 'checkout.closed') {
          setBuying(null)
        }
      },
    }).then(p => {
      if (p) setPaddle(p)
      else console.error('[paddle] initializePaddle returned null — token/environment mismatch?')
    }).catch(err => {
      console.error('[paddle] initializePaddle threw:', err)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Get current user ────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null)
      setAuthReady(true)
    })
  }, [])

  // ── Handle Paddle checkout callback (success) ───────────────────
  const handleCheckoutComplete = useCallback((packId: string) => {
    setBuying(null)
    setSuccess(packId)
    setTimeout(() => setSuccess(null), 8000)
  }, [])

  // ── Open Paddle checkout ────────────────────────────────────────
  const handleBuy = (packId: string) => {
    if (!authReady) return

    // Require login
    if (!userId) {
      router.push(`/login?next=/pricing`)
      return
    }

    const priceId = PRICE_IDS[packId]
    if (!priceId) {
      console.error('Paddle price ID not configured for pack:', packId)
      return
    }

    if (!paddle) return

    setBuying(packId)

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId, packId },
      settings: {
        theme: 'light',
        displayMode: 'overlay',
        locale: 'en',
      },
      // Paddle calls this when checkout is closed (success or cancel)
    })

    // Poll for checkout close — Paddle JS doesn't expose a clean callback
    // We listen to storage events or just reset buying state after a delay
    const checkInterval = setInterval(() => {
      // If overlay is gone, reset
      if (!document.querySelector('.paddle-frame')) {
        clearInterval(checkInterval)
        // Small delay to let webhook process
        setTimeout(() => setBuying(null), 500)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Subscribe. Identify. Forage Safely.
          </h1>
          <p className="text-xl mb-6" style={{ color: 'var(--text-muted)' }}>
            Monthly plans with fresh credits every month. Cancel anytime.
          </p>
          <div className="inline-block px-6 py-3 rounded-lg" style={{ background: 'var(--accent-bg)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Most apps give you 10 identifications for $4.99. We give you{' '}
              <span style={{ color: 'var(--accent)' }}>12 every month</span>. Same price, recurring value.
            </p>
          </div>
        </div>

        {/* ── Success banner ── */}
        {success && (
          <div
            className="mb-8 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}
          >
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            Subscription active! Your credits are being added — refresh your dashboard in a moment.
          </div>
        )}

        {/* ── Pricing cards ── */}
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
                className="relative p-8 rounded-2xl card-lift card-glow h-full flex flex-col"
                style={{
                  background: 'var(--bg-card)',
                  border: pack.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {pack.name}
                </h2>
                <div className="mb-6">
                  <span className="font-playfair text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {pack.price}
                  </span>
                  <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>/month</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pack.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* ── Subscribe button ── */}
                {success === pack.id ? (
                  <div
                    className="w-full px-6 py-3 rounded-lg font-semibold text-center text-sm"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                  >
                    ✓ Subscription active!
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(pack.id)}
                    disabled={buying !== null || !authReady}
                    className="w-full px-6 py-3 rounded-lg font-semibold transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{
                      background: pack.popular ? 'var(--btn-primary)' : 'var(--accent-bg)',
                      color: pack.popular ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    {buying === pack.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Opening checkout…
                      </>
                    ) : !authReady ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : !userId ? (
                      'Sign in to Subscribe'
                    ) : (
                      `Subscribe to ${pack.name}`
                    )}
                  </button>
                )}

                {/* Paddle badge */}
                <p className="text-xs text-center mt-3" style={{ color: 'var(--text-faint)' }}>
                  Secure checkout by{' '}
                  <a
                    href="https://paddle.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Paddle
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Trust badges ── */}
        <div className="flex flex-wrap justify-center gap-6 mb-24">
          {[
            { icon: <ShieldCheck className="w-5 h-5" />, text: '256-bit SSL encryption' },
            { icon: <RefreshCcw className="w-5 h-5" />, text: 'Cancel anytime, no lock-in' },
            { icon: <InfinityIcon className="w-5 h-5" />, text: 'Fresh credits every month' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent)' }}>{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>

        {/* ── How the subscription works ── */}
        <div className="mb-24 p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'One identification = 10 credits deducted' },
              { num: '2', title: 'Credits refresh every month on renewal' },
              { num: '3', title: 'Cancel anytime — access until period end' },
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

        {/* ── Value comparison table ── */}
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
                  { label: 'Price',           vals: ['$4.99/mo', '$4.99/mo',  '$9.99/mo',  '$19.99/mo'] },
                  { label: 'IDs per month',   vals: ['10',    '12',     '55',     '120']    },
                  { label: 'Per ID cost',     vals: ['$0.50', '$0.42',  '$0.18',  '$0.17']  },
                  { label: 'Billing',         vals: ['Monthly', 'Monthly', 'Monthly', 'Monthly']},
                  { label: 'Cancel',          vals: ['N/A', 'Anytime', 'Anytime', 'Anytime']},
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

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="font-playfair text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              { q: 'How does the monthly subscription work?',  a: 'Pick a plan. You get your credit allowance straight away, and it refreshes automatically every month on your renewal date. Unused credits from the previous month do not carry over — each month starts fresh.' },
              { q: 'Can I cancel anytime?',                    a: 'Yes. Cancel from your dashboard with one click. You keep full access until the end of your current billing period, then your plan returns to free (3 IDs/day).' },
              { q: 'What if the AI fails to identify?',        a: 'Full credit refund, automatically. That identification does not count against your monthly quota.' },
              { q: 'Can I get a refund?',                      a: 'Within 14 days of your first payment, yes — contact us or Paddle directly. After that, cancel anytime to stop future charges.' },
              { q: 'Is there a free tier?',                    a: 'Yes, 3 free identifications per day per device. No signup required.' },
              { q: 'Can I change plans?',                      a: 'Yes. From your dashboard you can upgrade or downgrade anytime. Prorated amounts apply on upgrade; downgrade takes effect at your next billing period.' },
              { q: 'Who processes the payment?',               a: 'Paddle.com acts as our Merchant of Record and handles all payments securely. They handle tax globally and you can manage your subscription directly through them as well.' },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/#identifier"
            className="inline-block px-8 py-4 rounded-full text-lg font-semibold glow-green hover:opacity-90 transition-opacity"
            style={{ background: 'var(--btn-primary)', color: '#fff' }}
          >
            Start with 3 Free Identifications →
          </Link>
        </div>
      </div>
    </div>
  )
}
