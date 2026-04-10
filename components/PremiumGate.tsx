import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Lock, Crown, Check, ChevronRight, Sparkles } from 'lucide-react'

// ── Bot detection (Google flexible sampling strategy) ─────────────────────────
// Google, Bing, and other search engine crawlers get full content so pages
// can be indexed properly. This is NOT cloaking — Google officially recommends
// this approach for paywalled content (structured data + bot access).
const BOT_PATTERNS = [
  'googlebot', 'google-inspectiontool', 'storebot-google',
  'bingbot', 'slurp',            // Yahoo
  'duckduckbot', 'baiduspider', 'yandexbot',
  'facebot', 'ia_archiver',     // Facebook, Alexa
  'twitterbot', 'linkedinbot',
  'applebot', 'petalbot',
]

function isSearchBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return BOT_PATTERNS.some(bot => ua.includes(bot))
}

interface PremiumGateProps {
  children: React.ReactNode
  /**
   * inline=true → render a compact paywall box in-place (keeps page layout intact)
   * inline=false (default) → full-page takeover UI
   */
  inline?: boolean
}

export default async function PremiumGate({ children, inline = false }: PremiumGateProps) {
  // Let search engine bots see full content for indexing
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') ?? ''
  if (isSearchBot(userAgent)) {
    return <>{children}</>
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return inline ? <InlinePaywallUI reason="login" /> : <FullPagePaywallUI reason="login" />
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle()

  const isPaid = profile?.plan && profile.plan !== 'free'
  if (!isPaid) {
    return inline
      ? <InlinePaywallUI reason="upgrade" />
      : <FullPagePaywallUI reason="upgrade" />
  }

  return <>{children}</>
}

// ── Inline paywall ── renders inside the article body area ──────────────────
function InlinePaywallUI({ reason }: { reason: 'login' | 'upgrade' }) {
  return (
    <div className="my-10">
      {/* Blurred content teaser */}
      <div
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
        }}
      >
        {/* Fake blurred text lines */}
        <div className="px-6 py-5 space-y-3 pointer-events-none select-none" aria-hidden>
          {[
            'w-full', 'w-11/12', 'w-4/5', 'w-full', 'w-3/4',
            'w-full', 'w-5/6', 'w-11/12', 'w-2/3',
          ].map((w, i) => (
            <div
              key={i}
              className={`h-4 rounded-full ${w}`}
              style={{ background: 'var(--border)', opacity: 0.6 + (i % 3) * 0.1 }}
            />
          ))}
        </div>

        {/* Gradient fade overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(var(--bg-card-rgb, 255,255,255), 0.1) 40%, var(--bg-card) 100%)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Paywall card centred on overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div
            className="w-full max-w-md rounded-2xl px-7 py-6 text-center"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.3))' }}
            >
              <Lock className="w-6 h-6" style={{ color: '#f59e0b' }} />
            </div>

            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
            >
              <Crown className="w-3 h-3" />
              Premium Content
            </div>

            <h2
              className="font-playfair text-xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {reason === 'login' ? 'Log in to Read More' : 'Unlock This Article'}
            </h2>

            <p className="text-sm mb-5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {reason === 'login'
                ? 'Sign in to your account. Any paid plan gives full access to all premium articles.'
                : 'This article is exclusive to paid members. Get instant access with any one-time pack — no subscription.'}
            </p>

            {/* Benefits (for upgrade only) */}
            {reason === 'upgrade' && (
              <ul className="text-left space-y-2 mb-5">
                {[
                  'All premium deep-dive species guides',
                  'Expert safety warnings & lookalike alerts',
                  'PDF reports + field journal',
                  'Priority AI identification',
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <div
                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(34,197,94,0.15)' }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: '#22c55e' }} />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--btn-primary)' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {reason === 'login' ? 'View Plans' : 'Get Access — From $4.99'}
              </Link>
              {reason === 'login' && (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  Log In
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {reason === 'upgrade' && (
              <p className="text-xs mt-3" style={{ color: 'var(--text-faint)' }}>
                One-time purchase · Credits never expire · 14-day money-back
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Full-page paywall ── replaces entire page ───────────────────────────────
function FullPagePaywallUI({ reason }: { reason: 'login' | 'upgrade' }) {
  return (
    <div
      className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="max-w-lg w-full rounded-3xl p-10 text-center"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #f59e0b22, #f59e0b44)' }}
        >
          <Lock className="w-9 h-9" style={{ color: '#f59e0b' }} />
        </div>

        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: '#f59e0b22', color: '#f59e0b' }}
        >
          <Crown className="w-3 h-3" /> Premium Content
        </div>

        <h1
          className="font-playfair text-3xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          This is Exclusive Premium Content
        </h1>
        <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {reason === 'login'
            ? 'Please log in to access this premium content. Any paid plan unlocks all premium articles.'
            : 'Buy any premium package to access this content. This is exclusively for paid users — unlock it with any Starter, Explorer, or Pro plan.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="px-7 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--btn-primary)' }}
          >
            View Plans
          </Link>
          {reason === 'login' && (
            <Link
              href="/login"
              className="px-7 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              Log In
            </Link>
          )}
          <Link
            href="/blog"
            className="px-7 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
