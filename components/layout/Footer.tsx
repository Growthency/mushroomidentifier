import Link from 'next/link'
import { Shield, Mail, Instagram, Facebook, Twitter } from 'lucide-react'

function PaymentBadge({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-bold tracking-wide select-none"
      style={{ background: bg, color, minWidth: 52, border: '1px solid rgba(0,0,0,0.08)' }}
    >
      {children}
    </div>
  )
}

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* ── Brand ── */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <span className="text-3xl">🍄</span>
              <span className="font-playfair text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Mushroom<span style={{ color: 'var(--accent)' }}>Identifiers</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              AI-powered mushroom identification for safe foraging — instant species ID, toxicity warnings, and look-alike alerts.
            </p>
            <a
              href="mailto:support@mushroomidentifiers.com"
              className="flex items-center gap-2 text-sm hover:underline mb-5 w-fit"
              style={{ color: 'var(--text-muted)' }}
            >
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              support@mushroomidentifiers.com
            </a>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter / X" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ── Explore ── */}
          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Explore</h4>
            <ul className="space-y-3">
              {[
                { href: '/#identifier', label: 'Mushroom Identifier' },
                { href: '/#features', label: 'Toxicity Warnings' },
                { href: '/#lookalikes', label: 'Similar Species' },
                { href: '/mushroom-identification-quiz', label: 'ID Quiz' },
                { href: '/blog', label: 'Species Blog' },
                { href: '/dashboard', label: 'Field Journal' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-all hover:translate-x-1 inline-block hover:opacity-100"
                    style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Company</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-all hover:translate-x-1 inline-block hover:opacity-100"
                    style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Secure Payment ── */}
          <div>
            <h4 className="font-semibold mb-5 text-sm uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Secure Payment</h4>

            <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent)', color: '#fff' }}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Guaranteed</p>
                  <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>Secure Payment</p>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                256-bit SSL encryption · No hidden charges
              </p>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>We Accept</p>
            <div className="flex flex-wrap gap-2">
              {/* Visa */}
              <PaymentBadge bg="#1A1F71" color="#fff">VISA</PaymentBadge>
              {/* Mastercard */}
              <div className="flex items-center justify-center px-2 py-1.5 rounded-md gap-0.5" style={{ background: '#252525', minWidth: 52, border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="w-4 h-4 rounded-full inline-block" style={{ background: '#EB001B' }} />
                <span className="w-4 h-4 rounded-full inline-block -ml-2" style={{ background: '#F79E1B', opacity: 0.9 }} />
              </div>
              {/* PayPal */}
              <PaymentBadge bg="#003087" color="#fff">Pay<span style={{ color: '#009CDE' }}>Pal</span></PaymentBadge>
              {/* Amex */}
              <PaymentBadge bg="#2E77BC" color="#fff">AMEX</PaymentBadge>
              {/* Apple Pay */}
              <PaymentBadge bg="#000" color="#fff">⌘ Pay</PaymentBadge>
              {/* Google Pay */}
              <PaymentBadge bg="#fff" color="#3c4043">G Pay</PaymentBadge>
              {/* Stripe */}
              <PaymentBadge bg="#635BFF" color="#fff">stripe</PaymentBadge>
            </div>

            <Link
              href="/pricing"
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 glow-green"
              style={{ background: 'var(--btn-primary)', color: '#fff', display: 'flex' }}
            >
              ✦ Get Premium Access
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            © 2026 MushroomIdentifiers.com · All rights reserved · Educational purposes only
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs hover:underline" style={{ color: 'var(--text-faint)' }}>Privacy</Link>
            <span style={{ color: 'var(--border-hover)' }}>·</span>
            <Link href="/terms" className="text-xs hover:underline" style={{ color: 'var(--text-faint)' }}>Terms</Link>
            <span style={{ color: 'var(--border-hover)' }}>·</span>
            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>English only</span>
          </div>
        </div>
      </div>

      {/* ── Safety disclaimer ── */}
      <div className="px-6 py-3.5 text-center" style={{ background: 'var(--accent-bg)', borderTop: '1px solid var(--border)' }}>
        <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
          ⚠️ Never consume any wild mushroom based solely on AI identification. Always consult a professional mycologist.
        </p>
      </div>
    </footer>
  )
}
