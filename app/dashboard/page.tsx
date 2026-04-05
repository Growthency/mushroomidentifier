'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles, History, Gem, Leaf,
  ShieldAlert, ArrowRight, Crown
} from 'lucide-react'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser]       = useState<any>(null)
  const [recentScans, setRecentScans] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      setProfile(data)
      // fetch last 3 scans for the activity preview
      const { data: scans } = await supabase
        .from('analyses')
        .select('id, result, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
      setRecentScans(scans || [])
    }
    load()
  }, [supabase])

  const credits      = profile?.credits ?? 0
  const maxCredits   = 30
  const creditsUsed  = maxCredits - credits
  const pct          = Math.max(0, Math.min(100, (credits / maxCredits) * 100))
  const plan         = profile?.plan ?? 'free'
  const planLabel    = plan === 'pro' ? 'Pro' : plan === 'explorer' ? 'Explorer' : plan === 'starter' ? 'Starter' : 'Free'
  const planColor    = plan === 'pro' ? '#f59e0b' : plan === 'explorer' ? '#8b5cf6' : plan === 'starter' ? '#3b82f6' : 'var(--accent)'

  // count unique species and deadly scans from recent scans
  const uniqueSpecies = new Set(recentScans.map(s => s.result?.scientificName).filter(Boolean)).size
  const safetyAlerts  = recentScans.filter(s => s.result?.riskLevel === 'HIGH').length

  const stats = [
    { label: 'Total Scans',       value: profile?.total_identifications ?? 0, icon: <Sparkles className="w-5 h-5" />, color: '#22c55e', bg: '#22c55e18', sub: 'identifications' },
    { label: 'Credits Remaining', value: credits,                              icon: <Gem className="w-5 h-5" />,      color: 'var(--accent)', bg: 'var(--accent-bg)', sub: `of ${maxCredits} total` },
    { label: 'Unique Species',    value: uniqueSpecies,                        icon: <Leaf className="w-5 h-5" />,     color: '#10b981', bg: '#10b98118', sub: 'discovered' },
    { label: 'Safety Alerts',     value: safetyAlerts,                        icon: <ShieldAlert className="w-5 h-5" />, color: '#ef4444', bg: '#ef444418', sub: 'HIGH risk scans' },
  ]

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.label} className="p-4 rounded-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium leading-tight" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            </div>
            <p className="font-playfair text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Credits bar */}
      <div className="p-5 rounded-2xl mb-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Credits Usage</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: planColor + '20', color: planColor }}>{planLabel} Plan</span>
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {creditsUsed} used · {credits} remaining of {maxCredits}
          </span>
        </div>
        <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: credits > 10 ? 'var(--accent)' : credits > 0 ? '#f59e0b' : '#ef4444' }} />
        </div>
        {credits <= 10 && (
          <p className="text-xs mt-2" style={{ color: credits === 0 ? '#ef4444' : '#f59e0b' }}>
            {credits === 0 ? 'All credits used.' : 'Running low.'}{' '}
            <Link href="/pricing" className="underline font-semibold">Upgrade plan →</Link>
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { href: '/#identifier',      icon: <Sparkles className="w-6 h-6" />, label: 'New Scan',     desc: 'Identify a mushroom with AI',    color: 'var(--accent)', bg: 'var(--accent-bg)' },
          { href: '/dashboard/history', icon: <History className="w-6 h-6" />,  label: 'Scan History', desc: 'View past identifications',       color: '#8b5cf6',       bg: '#8b5cf618' },
          { href: '/pricing',           icon: <Crown className="w-6 h-6" />,    label: 'Upgrade Plan', desc: 'Get unlimited identifications',   color: '#f59e0b',       bg: '#f59e0b18' },
        ].map(a => (
          <Link key={a.label} href={a.href}
            className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] group"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: a.bg, color: a.color }}>{a.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{a.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-faint)' }} />
          </Link>
        ))}
      </div>

      {/* Recent Scans */}
      <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--text-primary)' }}>Recent Scans</h2>
      <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {recentScans.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🍄</div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No scans yet</p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-faint)' }}>Upload a mushroom photo to get started</p>
            <Link href="/#identifier"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <Sparkles className="w-4 h-4" /> Start First Scan
            </Link>
          </div>
        ) : (
          <>
            {recentScans.map((scan, i) => {
              const r = scan.result
              const date = new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              return (
                <div key={scan.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderBottom: i < recentScans.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${r?.riskLevel === 'HIGH' ? 'bg-red-500/10' : r?.riskLevel === 'MEDIUM' ? 'bg-amber-500/10' : 'bg-green-500/10'}`}>
                    🍄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{r?.commonName || 'Unknown'}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{r?.scientificName} · {date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${r?.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500' : r?.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                    {r?.riskLevel}
                  </span>
                </div>
              )
            })}
            <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
              <Link href="/dashboard/history" className="text-sm font-semibold flex items-center gap-1"
                style={{ color: 'var(--accent)' }}>
                View all history <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Upgrade banner (free only) */}
      {plan === 'free' && (
        <div className="relative p-5 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #15803d 100%)' }}>
          <div className="absolute right-4 top-3 text-5xl opacity-20 select-none">🍄</div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bold text-white text-base mb-1">Unlock Unlimited Identifications</p>
              <p className="text-sm text-white/80">Upgrade for unlimited scans, priority AI, and expert reports.</p>
            </div>
            <Link href="/pricing"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#fff', color: 'var(--accent)' }}>
              View Plans →
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
