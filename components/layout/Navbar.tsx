'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setCredits(data.credits || 0)
          })
      } else {
        setCredits(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-glass' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🍄</span>
            <span className="font-playfair text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Mushroom<span style={{ color: 'var(--accent)' }}>Identifiers</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm hover:opacity-70 transition-opacity ${pathname === '/' ? 'font-medium' : ''}`} style={{ color: 'var(--text-primary)' }}>
              Home
            </Link>
            <Link href="/pricing" className={`text-sm hover:opacity-70 transition-opacity ${pathname === '/pricing' ? 'font-medium' : ''}`} style={{ color: 'var(--text-primary)' }}>
              Pricing
            </Link>
            <Link href="/blog" className={`text-sm hover:opacity-70 transition-opacity ${pathname === '/blog' ? 'font-medium' : ''}`} style={{ color: 'var(--text-primary)' }}>
              Blog
            </Link>
            <Link href="/about" className={`text-sm hover:opacity-70 transition-opacity ${pathname === '/about' ? 'font-medium' : ''}`} style={{ color: 'var(--text-primary)' }}>
              About
            </Link>
            <Link href="/contact" className={`text-sm hover:opacity-70 transition-opacity ${pathname === '/contact' ? 'font-medium' : ''}`} style={{ color: 'var(--text-primary)' }}>
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggle} className="p-2 rounded-full hover:opacity-70 transition-opacity" style={{ background: 'var(--accent-bg)' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5" style={{ color: 'var(--accent)' }} /> : <Moon className="w-5 h-5" style={{ color: 'var(--accent)' }} />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="px-3 py-1 rounded-full font-medium text-sm" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  💎 {credits} credits
                </div>
                <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                  Login
                </Link>
                <Link href="/#identifier" className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity glow-green" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Try Free →
                </Link>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-6 h-6" style={{ color: 'var(--text-primary)' }} /> : <Menu className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 py-6 px-6" style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-2xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              Home
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-2xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              Pricing
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-2xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              Blog
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-2xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              About
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="font-playfair text-2xl hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
              Contact
            </Link>
            {user ? (
              <>
                <div className="px-4 py-2 rounded-full font-medium text-sm inline-block w-fit" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  💎 {credits} credits
                </div>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-lg font-medium text-center" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-lg font-medium text-center hover:opacity-70 transition-opacity" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  Login
                </Link>
                <Link href="/#identifier" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-full font-medium text-center glow-green" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                  Try Free →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
