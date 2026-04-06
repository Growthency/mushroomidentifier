import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Lock, Crown } from 'lucide-react'

export default async function PremiumGate({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <PaywallUI reason="login" />
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle()

  const isPaid = profile?.plan && profile.plan !== 'free'
  if (!isPaid) {
    return <PaywallUI reason="upgrade" />
  }

  return <>{children}</>
}

function PaywallUI({ reason }: { reason: 'login' | 'upgrade' }) {
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
