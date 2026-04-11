import Link from 'next/link'
import BlogSidebar from '@/components/blog/BlogSidebar'

export default function NotFound() {
  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-10 items-start">
          {/* Main content */}
          <div className="min-w-0 flex-1 max-w-4xl">
            <div className="flex flex-col items-center text-center py-12 md:py-20">
              {/* Mushroom icon */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'var(--accent-bg)',
                  border: '1px solid var(--border)',
                }}
              >
                <span className="text-5xl">🍄</span>
              </div>

              {/* 404 label */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
              >
                Error 404
              </div>

              {/* Heading */}
              <h1
                className="font-playfair text-4xl md:text-5xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Page Not Found
              </h1>

              {/* Description */}
              <p
                className="text-base md:text-lg leading-relaxed max-w-lg mb-8"
                style={{ color: 'var(--text-muted)' }}
              >
                This page may have been moved, deleted, or perhaps it never existed.
                Don&apos;t worry &mdash; there&apos;s plenty more to explore!
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--btn-primary)', color: '#fff' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Go Home
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  Browse Articles
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Contact Us
                </Link>
              </div>

              {/* Suggested topics */}
              <div
                className="w-full max-w-2xl rounded-2xl p-6"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
              >
                <h2
                  className="font-playfair text-lg font-bold mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Popular Topics You Might Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { title: 'Death Cap Identification Guide', href: '/amanita-phalloides-death-cap' },
                    { title: 'Mushroom Parts Explained', href: '/mushroom-parts-explained' },
                    { title: 'Death Cap vs Destroying Angel', href: '/death-cap-vs-destroying-angel' },
                    { title: 'Mushroom Identification Quiz', href: '/mushroom-identification-quiz' },
                    { title: 'Mushroom Identifier Books', href: '/mushroom-identifier-book' },
                    { title: 'Mushrooms Growing in My Yard?', href: '/why-are-mushrooms-growing-in-my-yard' },
                  ].map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors"
                      style={{
                        color: 'var(--accent)',
                        background: 'var(--accent-bg)',
                      }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span className="truncate">{link.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <BlogSidebar />
        </div>
      </div>
    </div>
  )
}
