'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles, History, BookOpen, LogOut, Gem, Leaf,
  ShieldAlert, TrendingUp, ArrowRight, Crown, Zap, Star
} from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).maybeSingle()
      setProfile(profileData)
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const credits = profile?.credits ?? 0
  const maxCredits = 30
  const creditsUsed = maxCredits - credits
  const creditsPercent = Math.max(0, Math.min(100, (credits / maxCredits) * 100))
  const planLabel = profile?.plan === 'pro' ? 'Pro' : profile?.plan === 'explorer' ? 'Explorer' : profile?.plan === 'starter' ? 'Starter' : 'Free'
  const planColor = profile?.plan === 'pro' ? '#f59e0b' : profile?.plan === 'explorer' ? '#8b5cf6' : profile?.plan === 'starter' ? '#3b82f6' : 'var(--accent)'
  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const stats = [
    {
      label: 'Total Identifications',
      value: profile?.total_identifications ?? 0,
      icon: <Sparkles className="w-5 h-5" />,
      color: '#22c55e',
      bg: '#22c55e18',
      suffix: profile?.total_identifications === 1 ? 'scan' : 'scans',
    },
    {
      label: 'Credits Remaining',
      value: credits,
      icon: <Gem className="w-5 h-5" />,
      color: 'var(--accent)',
      bg: 'var(--accent-bg)',
      suffix: `of ${maxCredits}`,
    },
    {
      label: 'Unique Species',
      value: 0,
      icon: <Leaf className="w-5 h-5" />,
      color: '#10b981',
      bg: '#10b98118',
      suffix: 'found',
    },
    {
      label: 'Safety Alerts',
      value: 0,
      icon: <ShieldAlert className="w-5 h-5" />,
      color: '#ef4444',
      bg: '#ef444418',
      suffix: 'flagged',
    },
  ]

  const actions = [
    {
      href: '/#identifier',
      icon: <Sparkles className="w-7 h-7" />,
      label: 'New Identification',
      desc: 'Upload photos and identify mushrooms instantly with AI',
      color: 'var(--accent)',
      bg: 'var(--accent-bg)',
      cta: 'Start Scanning',
    },
    {
      href: '#',
      icon: <History className="w-7 h-7" />,
      label: 'Scan History',
      desc: 'Review all your past mushroom identifications',
      color: '#8b5cf6',
      bg: '#8b5cf618',
      cta: 'View History',
    },
    {
      href: '#',
      icon: <BookOpen className="w-7 h-7" />,
      label: 'Field Journal',
      desc: 'Track and document your foraging discoveries',
      color: '#f59e0b',
      bg: '#f59e0b18',
      cta: 'Open Journal',
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {getGreeting()}, {firstName} 👋
              </h1>
              {/* Plan badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: planColor + '20', color: planColor, border: `1px solid ${planColor}40` }}>
                {profile?.plan === 'pro' ? <Crown className="w-3 h-3" /> : profile?.plan === 'explorer' ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                {planLabel} Plan
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Welcome back! Here's your mushroom identification overview.
            </p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}>
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="p-5 rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <p className="font-playfair text-3xl font-bold mb-1" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{s.suffix}</p>
            </div>
          ))}
        </div>

        {/* ── Credits Usage Bar ── */}
        <div className="p-5 rounded-2xl mb-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Credits Usage</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>{planLabel} Plan</span>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              {creditsUsed} used &nbsp;·&nbsp; {credits} remaining of {maxCredits}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${creditsPercent}%`,
                background: credits > 10 ? 'var(--accent)' : credits > 0 ? '#f59e0b' : '#ef4444'
              }} />
          </div>
          {credits === 0 && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>
              You've used all your credits. <Link href="/pricing" className="underline font-semibold">Upgrade to get more →</Link>
            </p>
          )}
          {credits > 0 && credits <= 10 && (
            <p className="text-xs mt-2" style={{ color: '#f59e0b' }}>
              Running low on credits. <Link href="/pricing" className="underline font-semibold">Upgrade your plan →</Link>
            </p>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <h2 className="font-playfair text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {actions.map((a) => (
            <Link key={a.label} href={a.href}
              className="group p-6 rounded-2xl flex flex-col gap-4 transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: a.bg, color: a.color }}>
                {a.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>{a.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all"
                style={{ color: a.color }}>
                {a.cta} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Weekly Activity ── */}
        <h2 className="font-playfair text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          This Week's Activity
        </h2>
        <div className="p-6 rounded-2xl mb-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-end justify-between gap-2 h-24">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg"
                  style={{ height: '8px', background: 'var(--bg-secondary)', minHeight: 8 }} />
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{day}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-2" style={{ color: 'var(--text-faint)' }}>
            No identifications this week yet — <Link href="/#identifier" className="underline" style={{ color: 'var(--accent)' }}>start your first scan</Link>
          </p>
        </div>

        {/* ── Upgrade Banner (only for free plan) ── */}
        {(!profile?.plan || profile?.plan === 'free') && (
          <div className="relative p-6 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #16a34a 100%)' }}>
            <div className="absolute right-4 top-4 text-6xl opacity-20">🍄</div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="font-bold text-white text-lg">Unlock Unlimited Identifications</span>
                </div>
                <p className="text-sm text-white/80">
                  Upgrade to Pro for unlimited scans, priority AI, and advanced species reports.
                </p>
              </div>
              <Link href="/pricing"
                className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: '#fff', color: 'var(--accent)' }}>
                View Plans →
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
