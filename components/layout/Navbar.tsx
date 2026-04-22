'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
// Theme provider no longer used in the public navbar (light-only site).
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { MenuItem } from '@/lib/menus'

// Fallback used only if admin-managed menu table is empty / migration not applied yet
const FALLBACK_NAV_LINKS = [
  { href: '/', label: 'Home', target: '_self' as const },
  { href: '/#identifier', label: 'Identifiers', target: '_self' as const },
  { href: '/blog', label: 'Mushrooms', target: '_self' as const },
  { href: '/pricing', label: 'Pricing', target: '_self' as const },
  { href: '/about', label: 'About', target: '_self' as const },
  { href: '/contact', label: 'Contact', target: '_self' as const },
]

export default function Navbar({ menuItems }: { menuItems?: MenuItem[] }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const supabase = createClient()

  // Use admin-managed items when available, else fall back to hardcoded defaults
  const links =
    menuItems && menuItems.length > 0
      ? menuItems.map((m) => ({ href: m.url, label: m.label, target: m.target }))
      : FALLBACK_NAV_LINKS

  const isActive = (href: string) => {
    if (href.includes('#')) return false
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .maybeSingle()
        if (data) setCredits(data.credits || 0)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }: any) => { if (data) setCredits(data.credits || 0) })
      } else {
        setCredits(0)
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled ? 'nav-glass nav-scrolled' : ''
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-500 ease-in-out ${scrolled ? 'py-3' : 'py-6'}`}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Mushroom Identifiers home">
            <Image
              src="/logo-header.png"
              alt="Mushroom Identifiers logo"
              width={40}
              height={40}
              priority
              className="rounded-lg transition-transform duration-300 group-hover:scale-110 select-none"
              style={{ width: '40px', height: '40px' }}
            />
            <span className="font-playfair text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Mushroom<span style={{ color: 'var(--accent)' }}>Identifiers</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, target }) => {
              const active = isActive(href)
              return (
                <Link
                  key={`${href}-${label}`}
                  href={href}
                  target={target}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="relative text-sm px-4 py-2 rounded-full transition-all duration-200 hover:opacity-100"
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    background: active ? 'var(--accent-bg)' : 'transparent',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle removed per product decision — site is
                light-mode only. useTheme hook still available for admin
                dashboard which retains light/dark switching. */}

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-full font-medium text-sm" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  💎 {credits} credits
                </div>
                <Link href="/dashboard" className="px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  Login
                </Link>
                <Link
                  href="/#identifier"
                  className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all glow-green"
                  style={{ background: 'var(--btn-primary)', color: '#fff' }}
                >
                  Try Free →
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full transition-all duration-200"
              style={{ background: 'var(--accent-bg)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                : <Menu className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 py-6 px-6"
          style={{
            background: 'var(--bg-nav)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderBottom: '1px solid var(--border-hover)',
            boxShadow: '0 8px 32px var(--shadow)',
          }}
        >
          <div className="flex flex-col gap-1">
            {links.map(({ href, label, target }) => {
              const active = isActive(href)
              return (
                <Link
                  key={`${href}-${label}`}
                  href={href}
                  target={target}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl px-4 py-3 rounded-xl transition-all duration-200"
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-primary)',
                    background: active ? 'var(--accent-bg)' : 'transparent',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {label}
                </Link>
              )
            })}

            <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)' }}>
              {user ? (
                <>
                  <div className="px-4 py-2 rounded-full font-medium text-sm inline-block w-fit" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                    💎 {credits} credits
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-full font-semibold text-center" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-full font-medium text-center" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    Login
                  </Link>
                  <Link href="/#identifier" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-full font-semibold text-center glow-green" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                    Try Free →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
