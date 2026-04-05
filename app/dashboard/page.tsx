'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles, History, BookOpen, LogOut, Gem, Leaf,
  ShieldAlert, TrendingUp, ArrowRight, Crown, Zap,
  Star, LayoutDashboard, Menu, X, Moon, Sun, ChevronRight
} from 'lucide-react'

const NAV = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview',         href: '/dashboard' },
  { icon: <Sparkles className="w-5 h-5" />,        label: 'New Scan',          href: '/#identifier' },
  { icon: <History className="w-5 h-5" />,         label: 'Scan History',      href: '#' },
  { icon: <BookOpen className="w-5 h-5" />,        label: 'Field Journal',     href: '#' },
  { icon: <TrendingUp className="w-5 h-5" />,      label: 'Pricing & Plans',   href: '/pricing' },
]

export default function DashboardPage() {
  const [user, setUser]       = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-theme') === 'dark')
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      setProfile(data)
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('mi-theme', next)
    setDark(!dark)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  const credits      = profile?.credits ?? 0
  const maxCredits   = 30
  const creditsUsed  = maxCredits - credits
  const pct          = Math.max(0, Math.min(100, (credits / maxCredits) * 100))
  const plan         = profile?.plan ?? 'free'
  const planLabel    = plan === 'pro' ? 'Pro' : plan === 'explorer' ? 'Explorer' : plan === 'starter' ? 'Starter' : 'Free'
  const planColor    = plan === 'pro' ? '#f59e0b' : plan === 'explorer' ? '#8b5cf6' : plan === 'starter' ? '#3b82f6' : 'var(--accent)'
  const firstName    = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const initials     = (profile?.full_name || user?.email || 'U').slice(0, 2).toUpperCase()
  const greeting     = (() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening' })()

  const stats = [
    { label: 'Total Scans',       value: profile?.total_identifications ?? 0, icon: <Sparkles className="w-5 h-5" />, color: '#22c55e', bg: '#22c55e18', sub: 'identifications' },
    { label: 'Credits Remaining', value: credits,                              icon: <Gem className="w-5 h-5" />,      color: 'var(--accent)', bg: 'var(--accent-bg)', sub: `of ${maxCredits} total` },
    { label: 'Unique Species',    value: 0,                                    icon: <Leaf className="w-5 h-5" />,     color: '#10b981', bg: '#10b98118', sub: 'discovered' },
    { label: 'Safety Alerts',     value: 0,                                    icon: <ShieldAlert className="w-5 h-5" />, color: '#ef4444', bg: '#ef444418', sub: 'flagged' },
  ]

  /* ─── Sidebar content (shared desktop + mobile) ─── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 py-5 mb-2" onClick={() => setSidebarOpen(false)}>
        <span className="text-2xl">🍄</span>
        <span className="font-playfair font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Mushroom<span style={{ color: 'var(--accent)' }}>Identifiers</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(item => (
          <Link key={item.label} href={item.href}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group"
            style={{ color: item.label === 'Overview' ? 'var(--accent)' : 'var(--text-muted)',
                     background: item.label === 'Overview' ? 'var(--accent-bg)' : 'transparent' }}>
            <span style={{ color: item.label === 'Overview' ? 'var(--accent)' : 'var(--text-faint)' }}>{item.icon}</span>
            {item.label}
            {item.label === 'Overview' && <ChevronRight className="w-4 h-4 ml-auto" style={{ color: 'var(--accent)' }} />}
          </Link>
        ))}
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-3 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Credits mini bar */}
        <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-faint)' }}>
            <span className="flex items-center gap-1"><Gem className="w-3 h-3" /> Credits</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{credits}/{maxCredits}</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: credits > 10 ? 'var(--accent)' : credits > 0 ? '#f59e0b' : '#ef4444' }} />
          </div>
        </div>

        {/* User row */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'var(--accent)', color: '#fff' }}>{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{profile?.full_name || firstName}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity flex-shrink-0"
            style={{ color: 'var(--text-faint)' }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col"
            style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg" style={{ color: 'var(--text-faint)' }}>
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl" style={{ color: 'var(--text-primary)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-playfair font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            🍄 Dashboard
          </span>
          <button onClick={toggleTheme} className="p-2 rounded-xl" style={{ color: 'var(--text-primary)' }}>
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div>
            <h1 className="font-playfair text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Here's your mushroom identification overview</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: planColor + '20', color: planColor, border: `1px solid ${planColor}40` }}>
              {plan === 'pro' ? <Crown className="w-3 h-3" /> : plan === 'explorer' ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {planLabel} Plan
            </span>
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:opacity-70 transition-opacity"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">

          {/* Mobile greeting */}
          <div className="md:hidden mb-5">
            <h1 className="font-playfair text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your identification overview</p>
          </div>

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
              { href: '/#identifier', icon: <Sparkles className="w-6 h-6" />, label: 'New Scan', desc: 'Identify a mushroom with AI', color: 'var(--accent)', bg: 'var(--accent-bg)' },
              { href: '#', icon: <History className="w-6 h-6" />, label: 'Scan History', desc: 'View past identifications', color: '#8b5cf6', bg: '#8b5cf618' },
              { href: '#', icon: <BookOpen className="w-6 h-6" />, label: 'Field Journal', desc: 'Track your discoveries', color: '#f59e0b', bg: '#f59e0b18' },
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

          {/* This Week's Activity */}
          <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--text-primary)' }}>This Week's Activity</h2>
          <div className="p-5 rounded-2xl mb-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-end justify-between gap-2 h-20">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-md" style={{ height: 8, background: 'var(--bg-secondary)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{day}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-center mt-3" style={{ color: 'var(--text-faint)' }}>
              No scans this week —{' '}
              <Link href="/#identifier" style={{ color: 'var(--accent)' }} className="underline">Start your first scan</Link>
            </p>
          </div>

          {/* Upgrade banner — free only */}
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
        </div>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        {[
          { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home',    href: '/dashboard', active: true },
          { icon: <Sparkles className="w-5 h-5" />,        label: 'New Scan', href: '/#identifier', active: false },
          { icon: <History className="w-5 h-5" />,         label: 'History',  href: '#', active: false },
          { icon: <BookOpen className="w-5 h-5" />,        label: 'Journal',  href: '#', active: false },
          { icon: <TrendingUp className="w-5 h-5" />,      label: 'Plans',    href: '/pricing', active: false },
        ].map(item => (
          <Link key={item.label} href={item.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            style={{ color: item.active ? 'var(--accent)' : 'var(--text-faint)', background: item.active ? 'var(--accent-bg)' : 'transparent' }}>
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

    </div>
  )
}
