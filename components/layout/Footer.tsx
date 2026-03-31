import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍄</span>
              <span className="font-playfair text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Mushroom<span style={{ color: 'var(--accent)' }}>Identifiers</span>
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              AI-powered mushroom identification for safe foraging
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              support@mushroomidentifiers.com
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Features</h4>
            <ul className="space-y-2">
              <li><Link href="/#identifier" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Mushroom Identifier</Link></li>
              <li><Link href="/#features" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Toxicity Warnings</Link></li>
              <li><Link href="/#lookalikes" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Similar Species</Link></li>
              <li><Link href="/dashboard" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Field Journal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>About</Link></li>
              <li><Link href="/blog" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Blog</Link></li>
              <li><Link href="/contact" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Contact</Link></li>
              <li><Link href="/pricing" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Cookie Policy</Link></li>
              <li><Link href="/refund" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            © 2026 MushroomIdentifiers.com · English only · Educational purposes only
          </p>
        </div>
      </div>

      <div className="px-6 py-4 text-center" style={{ background: 'var(--accent-bg)', borderTop: '1px solid var(--border)' }}>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          ⚠️ Never consume any wild mushroom based solely on AI identification. Always consult a professional mycologist.
        </p>
      </div>
    </footer>
  )
}
