'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Check, Sparkles, Loader2, ShieldCheck, RefreshCcw, Gift,
  Infinity as InfinityIcon, CreditCard, Star, Zap, Flame,
} from 'lucide-react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'
import { createClient } from '@/lib/supabase/client'

/**
 * Pricing page — "new subscriber" offer structure:
 *
 *   • 7-day free trial (configured at each price level in Paddle dashboard)
 *   • 50% off first month (Paddle discount code auto-applied at checkout via
 *     NEXT_PUBLIC_PADDLE_LAUNCH_DISCOUNT_CODE env var)
 *   • 14-day money-back guarantee (Paddle-hosted)
 *   • Cancel anytime (Paddle customer portal, 1 click)
 *
 * All four promises show in the sticky offer ribbon at the very top, again
 * in the trust strip below the cards, and inside each card's bulleted list.
 * Goal: make the "Due on $NEXT_MONTH" line in Paddle's mandatory checkout
 * disclosure feel safe rather than scary — users see refund + cancel +
 * trial everywhere before they commit.
 */

// ── Subscription plan definitions ─────────────────────────────────────
const PACKS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Curious foragers getting started',
    regularPrice: 4.99,
    firstMonthPrice: 2.49,  // 50% off first month
    credits: 120,
    identifications: 12,
    popular: false,
    emphasis: false,
    icon: Zap,
    features: [
      '120 credits every month (12 IDs/mo)',
      '7-day free trial — full access',
      '50% off your first paid month',
      '14-day money-back guarantee',
      'Full AI species identification',
      'Toxicity + lookalike warnings',
      'Similar species alerts',
      'Cancel anytime, 1 click',
    ],
  },
  {
    id: 'explorer',
    name: 'Explorer',
    tagline: 'Weekend foragers who ID often',
    regularPrice: 9.99,
    firstMonthPrice: 4.99,
    credits: 550,
    identifications: 55,
    popular: true,
    emphasis: true,
    icon: Star,
    features: [
      '550 credits every month (55 IDs/mo)',
      '7-day free trial — full access',
      '50% off your first paid month',
      '14-day money-back guarantee',
      'Everything in Starter',
      'PDF identification reports',
      'Full field journal access',
      'Priority AI model · faster results',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Serious foragers & mycologists',
    regularPrice: 19.99,
    firstMonthPrice: 9.99,
    credits: 1200,
    identifications: 120,
    popular: false,
    emphasis: false,
    icon: Flame,
    features: [
      '1200 credits every month (120 IDs/mo)',
      '7-day free trial — full access',
      '50% off your first paid month',
      '14-day money-back guarantee',
      'Everything in Explorer',
      'Export data as CSV',
      'Priority customer support',
      'Best value per identification',
    ],
  },
]

// Map pack id → price ID from env
const PRICE_IDS: Record<string, string> = {
  starter:  process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID  ?? '',
  explorer: process.env.NEXT_PUBLIC_PADDLE_EXPLORER_PRICE_ID ?? '',
  pro:      process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID      ?? '',
}

// Launch offer discount code — set in Paddle dashboard + env var.
// If unset, checkout opens without a discount (trial still works).
const LAUNCH_DISCOUNT_CODE = process.env.NEXT_PUBLIC_PADDLE_LAUNCH_DISCOUNT_CODE ?? ''

export default function PricingClient() {
  const router   = useRouter()
  const [paddle,   setPaddle]   = useState<Paddle | null>(null)
  const [userId,   setUserId]   = useState<string | null>(null)
  const [buying,   setBuying]   = useState<string | null>(null)
  const [success,  setSuccess]  = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

  // ── Load Paddle JS SDK ──────────────────────────────────────────
  useEffect(() => {
    const env = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? 'sandbox') as 'sandbox' | 'production'
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ''
    if (!token) return
    initializePaddle({
      environment: env,
      token,
      // Wire checkout event callbacks so we can reset buying state + log
      // Paddle's specific error code (instead of dying silently on 400s).
      eventCallback: (event: any) => {
        if (event?.name === 'checkout.error') {
          // eslint-disable-next-line no-console
          console.error('[Paddle] checkout.error', event?.data)
          setBuying(null)
        }
        if (event?.name === 'checkout.closed') {
          setBuying(null)
        }
        if (event?.name === 'checkout.completed') {
          // Derive packId from passed customData so we show the right banner
          const pid = event?.data?.custom_data?.packId as string | undefined
          if (pid) {
            setSuccess(pid)
            setTimeout(() => setSuccess(null), 8000)
          }
          setBuying(null)
        }
      },
    }).then(p => { if (p) setPaddle(p) })
  }, [])

  // ── Get current user ────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then((res: any) => {
      setUserId(res?.data?.user?.id ?? null)
      setAuthReady(true)
    })
  }, [])

  // ── Open Paddle checkout ────────────────────────────────────────
  const handleBuy = (packId: string) => {
    if (!authReady) return
    if (!userId) {
      router.push(`/login?next=/pricing`)
      return
    }

    const priceId = PRICE_IDS[packId]
    if (!priceId) {
      // eslint-disable-next-line no-console
      console.error('Paddle price ID not configured for pack:', packId)
      return
    }
    if (!paddle) return

    setBuying(packId)

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId, packId },
      // Auto-apply the launch discount if the env var is set.
      ...(LAUNCH_DISCOUNT_CODE ? { discountCode: LAUNCH_DISCOUNT_CODE } : {}),
      settings: {
        theme: 'light',
        displayMode: 'overlay',
        locale: 'en',
      },
    })
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Launch offer ribbon (prominent, above hero) ───────── */}
        <div
          className="mb-8 rounded-2xl p-4 sm:p-5 text-center"
          style={{
            background: 'linear-gradient(90deg, rgba(16,185,129,0.12), rgba(16,185,129,0.06))',
            border: '1px solid rgba(16,185,129,0.35)',
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm sm:text-base">
            <span className="inline-flex items-center gap-2 font-bold" style={{ color: '#10b981' }}>
              <Gift className="w-5 h-5" />
              LAUNCH OFFER
            </span>
            <span className="opacity-60" style={{ color: 'var(--text-primary)' }}>·</span>
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>7 days free</strong>
            </span>
            <span className="opacity-60" style={{ color: 'var(--text-primary)' }}>·</span>
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>50% off</strong> your first month
            </span>
            <span className="opacity-60" style={{ color: 'var(--text-primary)' }}>·</span>
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>14-day refund</strong>
            </span>
            <span className="opacity-60" style={{ color: 'var(--text-primary)' }}>·</span>
            <span style={{ color: 'var(--text-primary)' }}>
              <strong>Cancel anytime</strong>
            </span>
          </div>
        </div>

        {/* ── Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Try risk-free for <span style={{ color: 'var(--accent)' }}>7 days</span>.<br className="hidden sm:block" />
            Then save 50% on month one.
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Monthly plans with fresh credits every month. Cancel from your dashboard in 1 click. 14-day money-back guarantee, no questions asked.
          </p>
        </div>

        {/* ── Success banner ── */}
        {success && (
          <div
            className="mb-8 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e' }}
          >
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            You&apos;re in! Your 7-day trial is active — visit your{' '}
            <Link href="/dashboard" className="underline font-semibold">dashboard</Link> to start identifying.
          </div>
        )}

        {/* ── Pricing cards ── */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-start">
          {PACKS.map((pack) => {
            const savings = (pack.regularPrice - pack.firstMonthPrice).toFixed(2)
            const Icon = pack.icon
            return (
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
                  className="relative p-7 sm:p-8 rounded-2xl card-lift card-glow h-full flex flex-col transition-all"
                  style={{
                    background: 'var(--bg-card)',
                    border: pack.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
                    boxShadow: pack.popular ? '0 20px 60px -20px rgba(16,185,129,0.35)' : undefined,
                  }}
                >
                  {/* Free-trial pill at the top */}
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit mb-4"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <Gift className="w-3 h-3" /> 7 days free
                  </div>

                  {/* Plan name + icon */}
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <h2 className="font-playfair text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {pack.name}
                    </h2>
                  </div>
                  <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
                    {pack.tagline}
                  </p>

                  {/* Price display — first-month discount hero, strike-through regular, then-amount */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-playfair text-5xl font-bold" style={{ color: 'var(--accent)' }}>
                        ${pack.firstMonthPrice.toFixed(2)}
                      </span>
                      <span className="text-sm line-through opacity-60" style={{ color: 'var(--text-muted)' }}>
                        ${pack.regularPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      first month · save ${savings}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      then <strong style={{ color: 'var(--text-primary)' }}>${pack.regularPrice.toFixed(2)}/month</strong>, cancel anytime
                    </p>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2.5 mb-7 flex-1">
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
                      className="w-full px-6 py-3.5 rounded-lg font-semibold text-center text-sm"
                      style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                    >
                      ✓ Trial activated — enjoy!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(pack.id)}
                      disabled={buying !== null || !authReady}
                      className="w-full px-6 py-3.5 rounded-lg font-semibold transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{
                        background: pack.popular ? 'var(--btn-primary)' : 'var(--accent-bg)',
                        color: pack.popular ? '#fff' : 'var(--text-primary)',
                        border: pack.popular ? 'none' : '1px solid var(--border-hover)',
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
                        `Sign in to Start ${pack.name} Trial`
                      ) : (
                        `Start 7-day ${pack.name} Trial →`
                      )}
                    </button>
                  )}

                  {/* Trust microcopy under button */}
                  <div className="mt-3 text-center">
                    <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                      <RefreshCcw className="inline w-3 h-3 mr-1 -mt-0.5" style={{ color: 'var(--accent)' }} />
                      14-day money-back · Cancel anytime
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-faint)' }}>
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
              </div>
            )
          })}
        </div>

        {/* ── Expanded trust strip ── */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-20">
          {[
            { icon: <Gift className="w-4 h-4" />,        text: '7-day free trial' },
            { icon: <Sparkles className="w-4 h-4" />,    text: '50% off first month' },
            { icon: <RefreshCcw className="w-4 h-4" />,  text: '14-day money-back guarantee' },
            { icon: <ShieldCheck className="w-4 h-4" />, text: 'Cancel anytime, 1 click' },
            { icon: <InfinityIcon className="w-4 h-4"/>, text: 'Fresh credits every month' },
            { icon: <CreditCard className="w-4 h-4" />,  text: 'Secure 256-bit SSL' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <span style={{ color: 'var(--accent)' }}>{badge.icon}</span>
              {badge.text}
            </div>
          ))}
        </div>

        {/* ── How the subscription works ── */}
        <div className="mb-20 p-6 sm:p-10 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-3xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>
            How It Works
          </h2>
          <p className="text-center text-sm sm:text-base mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Sign up. Try free for 7 days. Get your first paid month half-price. Cancel anytime — Netflix-style.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { num: '1', title: 'Start your 7-day free trial', sub: 'Full plan access, no charges during trial' },
              { num: '2', title: '50% off your first paid month', sub: 'Auto-applied at checkout via LAUNCH50 code' },
              { num: '3', title: 'Credits refresh every month', sub: 'Use-it-or-lose-it, fresh each cycle' },
              { num: '4', title: 'Cancel anytime', sub: '1-click from dashboard, full access until period ends' },
            ].map((item) => (
              <div key={item.num} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center font-playfair text-xl font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  {item.num}
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Value comparison table ── */}
        <div className="mb-20">
          <h2 className="font-playfair text-3xl font-bold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
            Value Comparison
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
            Most apps charge you once for 10 IDs. We give you fresh credits every month, with a free trial and first-month discount.
          </p>
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th className="p-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}></th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Competitor</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Starter</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: 'var(--accent)' }}>Explorer ⭐</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Free trial',       vals: ['—', '7 days', '7 days', '7 days'] },
                  { label: 'First month',      vals: ['$4.99', '$2.49 (50% off)', '$4.99 (50% off)', '$9.99 (50% off)'] },
                  { label: 'Regular price',    vals: ['—', '$4.99/mo', '$9.99/mo', '$19.99/mo'] },
                  { label: 'IDs per month',    vals: ['10', '12', '55', '120'] },
                  { label: 'Per ID cost',      vals: ['$0.50', '$0.42', '$0.18', '$0.17'] },
                  { label: 'Refund guarantee', vals: ['—', '14 days', '14 days', '14 days'] },
                  { label: 'Cancel',           vals: ['—', 'Anytime · 1 click', 'Anytime · 1 click', 'Anytime · 1 click'] },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="p-4 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{row.label}</td>
                    {row.vals.map((val, j) => (
                      <td
                        key={j}
                        className="p-4 text-center text-sm"
                        style={{
                          color: j === 0 ? 'var(--text-muted)' : 'var(--text-primary)',
                          fontWeight: j === 2 ? 600 : 400,
                          background: j === 2 ? 'rgba(16,185,129,0.05)' : 'transparent',
                        }}
                      >
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
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="font-playfair text-3xl font-bold text-center mb-10" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does the 7-day free trial work?',
                a: 'Start any plan — you get full access immediately. Paddle charges $0 during the 7-day trial. On day 8, you\'re charged half-price for your first month. Cancel anytime during the trial with 1 click and pay $0.',
              },
              {
                q: 'How do I get the 50% off first-month discount?',
                a: 'It\'s auto-applied at checkout — no code to type. You\'ll see the discounted amount on the Paddle checkout screen. After your first paid month, you continue at the regular monthly price.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, 1 click from your dashboard. Cancel during the 7-day trial = pay $0. Cancel after = keep full access until the end of your current billing period, then your plan returns to the free tier (3 IDs/day).',
              },
              {
                q: 'What\'s the 14-day money-back guarantee?',
                a: 'After your first charge, you have 14 days to request a full refund — no questions asked. Just contact us or reply to Paddle\'s receipt email. Instant refund to your original payment method.',
              },
              {
                q: 'How do credits work each month?',
                a: 'On your billing date, your balance refreshes to the plan allowance (120/550/1200). Unused credits do not carry over — it\'s use-it-or-lose-it, so pick the plan that matches your monthly usage.',
              },
              {
                q: 'What if the AI fails to identify?',
                a: 'Full credit refund, automatically. That identification does not count against your monthly quota.',
              },
              {
                q: 'Is there a free tier?',
                a: 'Yes — 3 free identifications per day, no signup, no credit card. Good for occasional foragers. Paid plans give you higher monthly volume + priority AI model + more features.',
              },
              {
                q: 'Can I change plans?',
                a: 'Yes. Upgrade anytime — prorated amount charged immediately, new credit allowance activated. Downgrade takes effect at your next billing period.',
              },
              {
                q: 'Who processes the payment?',
                a: 'Paddle.com — Merchant of Record. They handle tax globally (US sales tax, EU VAT, etc.), fraud protection, and chargebacks. You can manage your subscription directly through Paddle as well.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-5 sm:p-6 rounded-xl transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <summary
                  className="font-semibold cursor-pointer flex items-start justify-between gap-3 list-none text-sm sm:text-base"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {faq.q}
                  <span className="text-xl leading-none flex-shrink-0 transition-transform group-open:rotate-45" style={{ color: 'var(--accent)' }}>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div
          className="text-center p-8 sm:p-10 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, var(--accent-bg), rgba(16,185,129,0.04))',
            border: '1px solid var(--border)',
          }}
        >
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Still deciding?
          </h2>
          <p className="mb-6 text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Try 3 free identifications per day with no signup. No credit card. If you love it, come back and start your 7-day paid trial.
          </p>
          <Link
            href="/#identifier"
            className="inline-block px-8 py-4 rounded-full text-base sm:text-lg font-semibold glow-green hover:opacity-90 transition-opacity"
            style={{ background: 'var(--btn-primary)', color: '#fff' }}
          >
            Start with 3 Free Identifications →
          </Link>
        </div>
      </div>
    </div>
  )
}
