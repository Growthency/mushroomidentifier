'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles, History, LogOut, Gem,
  TrendingUp, Crown, Zap, Star, LayoutDashboard,
  Menu, X, Moon, Sun, ChevronRight, Settings, Users, Bookmark
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Overview',       href: '/dashboard' },
  { icon: Sparkles,         label: 'New Scan',        href: '/#identifier' },
  { icon: History,          label: 'Scan History',    href: '/dashboard/history' },
  { icon: Bookmark,         label: 'Saved Articles',  href: '/dashboard/saved-articles' },
  { icon: TrendingUp,       label: 'Pricing & Plans', href: '/pricing' },
  { icon: Settings,         label: 'Settings',        href: '/dashboard/settings' },
  { icon: Users,            label: 'Referrals',       href: '/dashboard/referral' },
]

const BOTTOM_NAV = [
  { icon: LayoutDashboard, label: 'Home',     href: '/dashboard' },
  { icon: Sparkles,         label: 'New Scan',  href: '/#identifier' },
  { icon: History,          label: 'History',   href: '/dashboard/history' },
  { icon: Bookmark,         label: 'Saved',     href: '/dashboard/saved-articles' },
  { icon: Settings,         label: 'Settings',  href: '/dashboard/settings' },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<any>(null)
  const [profile, setProfile]   = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark]         = useState(false)
  const router   = useRouter()
  const pathname = usePathname()
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

    // Listen for profile updates from settings page (avatar, name) — no reload needed
    const onProfileUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setProfile((prev: any) => prev ? { ...prev, ...detail } : detail)
    }
    window.addEventListener('profile-updated', onProfileUpdated)
    return () => window.removeEventListener('profile-updated', onProfileUpdated)
  }, [supabase, router])

  // Dark mode toggle removed — site is light-mode only. Function kept as a
  // no-op so any lingering callers don't crash; safe to delete in a follow-up
  // pass once the toggle UI is fully gone.
  const toggleTheme = () => {}

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )

  const credits    = profile?.credits ?? 0
  const plan       = profile?.plan ?? 'free'
  // Progress-bar max scales with plan so the bar actually reflects monthly
  // allowance — free=30, starter=120, explorer=550, pro=1200
  const maxCredits = plan === 'pro' ? 1200 : plan === 'explorer' ? 550 : plan === 'starter' ? 120 : 30
  const pct        = Math.max(0, Math.min(100, (credits / maxCredits) * 100))
  const planLabel  = plan === 'pro' ? 'Pro' : plan === 'explorer' ? 'Explorer' : plan === 'starter' ? 'Starter' : 'Free'
  const planColor  = plan === 'pro' ? '#f59e0b' : plan === 'explorer' ? '#8b5cf6' : plan === 'starter' ? '#3b82f6' : 'var(--accent)'

  // Subscription state — surface for the "Manage" button + canceled banner
  const subStatus     = profile?.subscription_status as string | undefined
  const periodEnd     = profile?.current_period_end as string | undefined
  const isSubscribed  = !!profile?.subscription_id && subStatus !== 'canceled'
  const isCanceling   = subStatus === 'canceled' && periodEnd && new Date(periodEnd) > new Date()
  const formattedPeriodEnd = periodEnd
    ? new Date(periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  // Open the Paddle customer portal for the current user (cancel,
  // update payment, view invoices). Server generates a single-use URL.
  async function openSubscriptionPortal() {
    try {
      const res = await fetch('/api/subscription/manage')
      const json = await res.json()
      if (res.ok && json.url) {
        window.location.href = json.url
      } else {
        alert(json.error || 'Could not open subscription portal. Try again in a moment.')
      }
    } catch (err: any) {
      alert(err.message || 'Could not open subscription portal.')
    }
  }
  const initials   = (profile?.full_name || user?.email || 'U').slice(0, 2).toUpperCase()
  const firstName  = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const avatarUrl  = profile?.avatar_url

  const pageTitle = (() => {
    if (pathname === '/dashboard')             return 'Overview'
    if (pathname?.includes('/history'))        return 'Scan History'
    if (pathname?.includes('/referral'))       return 'Referrals'
    if (pathname?.includes('/settings'))       return 'Settings'
    return 'Dashboard'
  })()

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })()

  /* Avatar component — reused in sidebar & mobile bar */
  const Avatar = ({ size = 9 }: { size?: number }) => (
    <Link href="/dashboard/settings" title="Go to Settings">
      <div
        className={`w-${size} h-${size} rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden hover:ring-2 transition-all`}
        style={{ background: avatarUrl ? 'transparent' : 'var(--accent)', color: '#fff', width: size * 4, height: size * 4, ringColor: 'var(--accent)' }}
      >
        {avatarUrl
          ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          : initials}
      </div>
    </Link>
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-card)' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 py-5 mb-2" onClick={() => setSidebarOpen(false)}>
        <span className="text-2xl">🍄</span>
        <span className="font-playfair font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Mushroom<span style={{ color: 'var(--accent)' }}>Identifiers</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(item => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname?.startsWith(item.href.split('#')[0]) && item.href !== '/#identifier'
          const Icon = item.icon
          return (
            <Link key={item.label} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                color:      active ? 'var(--accent)' : 'var(--text-muted)',
                background: active ? 'var(--accent-bg)' : 'transparent',
              }}>
              <Icon className="w-5 h-5" style={{ color: active ? 'var(--accent)' : 'var(--text-faint)' }} />
              {item.label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" style={{ color: 'var(--accent)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Credits mini bar */}
        <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-faint)' }}>
            <span className="flex items-center gap-1"><Gem className="w-3 h-3" /> Credits</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{credits}/{maxCredits}</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full" style={{
              width: `${pct}%`,
              background: credits > 10 ? 'var(--accent)' : credits > 0 ? '#f59e0b' : '#ef4444'
            }} />
          </div>
        </div>

        {/* User row — avatar links to settings */}
        <div className="flex items-center gap-3 px-2">
          <Avatar size={9} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{profile?.full_name || firstName}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:opacity-70 transition-opacity flex-shrink-0"
            style={{ color: 'var(--text-faint)' }}>
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl" style={{ color: 'var(--text-primary)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-playfair font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            🍄 {pageTitle}
          </span>
          {/* Dark/Light toggle removed — site is light-mode only. Empty
              span keeps the flex justify-between spacing on the mobile bar. */}
          <span className="w-9" aria-hidden="true" />
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div>
            <h1 className="font-playfair text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {pathname === '/dashboard' ? `${greeting}, ${firstName} 👋` : pageTitle}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {pathname === '/dashboard'   ? "Here's your mushroom identification overview" :
               pathname?.includes('/history')  ? 'View and manage your past identifications' :
               pathname?.includes('/referral') ? 'Invite friends and earn free credits together' :
               pathname?.includes('/settings') ? 'Manage your account and preferences' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: planColor + '20', color: planColor, border: `1px solid ${planColor}40` }}>
              {plan === 'pro' ? <Crown className="w-3 h-3" /> : plan === 'explorer' ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              {planLabel} Plan
            </span>
            {/* Manage subscription (paid plans only) — opens Paddle customer
                portal where user can cancel, change plan, or update card. */}
            {(isSubscribed || isCanceling) && (
              <button
                onClick={openSubscriptionPortal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                title="Manage subscription, payment method, and invoices"
              >
                Manage
              </button>
            )}
            {plan === 'free' && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Upgrade
              </Link>
            )}
            {/* Dark/Light toggle removed — site is light-mode only. */}
          </div>
        </header>

        {/* Subscription canceled banner — user canceled but still has
            access until period end. Netflix-style visible reminder so they
            know the cutoff date. */}
        {isCanceling && formattedPeriodEnd && (
          <div
            className="px-4 md:px-8 py-3 flex items-center justify-between flex-wrap gap-3"
            style={{
              background: 'rgba(245,158,11,0.1)',
              borderBottom: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b',
            }}
          >
            <p className="text-sm">
              <strong>Subscription canceled.</strong> You have full access
              until <strong>{formattedPeriodEnd}</strong>, then your plan
              returns to Free.
            </p>
            <Link
              href="/pricing"
              className="text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-80 transition"
              style={{ background: '#f59e0b', color: '#fff' }}
            >
              Resubscribe
            </Link>
          </div>
        )}

        {/* Past-due banner — payment failed, Paddle is retrying */}
        {subStatus === 'past_due' && (
          <div
            className="px-4 md:px-8 py-3 flex items-center justify-between flex-wrap gap-3"
            style={{
              background: 'rgba(239,68,68,0.1)',
              borderBottom: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
            }}
          >
            <p className="text-sm">
              <strong>Payment failed.</strong> Update your payment method to
              keep your subscription active.
            </p>
            <button
              onClick={openSubscriptionPortal}
              className="text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-80 transition"
              style={{ background: '#ef4444', color: '#fff' }}
            >
              Update payment
            </button>
          </div>
        )}

        {/* Page Body */}
        <div className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          {pathname === '/dashboard' && (
            <div className="md:hidden mb-5">
              <h1 className="font-playfair text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {greeting}, {firstName} 👋
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your identification overview</p>
            </div>
          )}
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        {BOTTOM_NAV.map(item => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname?.startsWith(item.href) && item.href !== '/#identifier'
          const Icon = item.icon
          return (
            <Link key={item.label} href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              style={{ color: active ? 'var(--accent)' : 'var(--text-faint)', background: active ? 'var(--accent-bg)' : 'transparent' }}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
