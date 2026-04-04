'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, TrendingUp, Eye } from 'lucide-react'
import TableOfContents from './TableOfContents'

const POPULAR_POSTS = [
  { title: 'Amanita phalloides (Death Cap): Identification Guide', slug: '/amanita-phalloides-death-cap', views: 4821 },
  { title: 'Death Cap vs Destroying Angel: Key Differences', slug: '/death-cap-vs-destroying-angel', views: 3920 },
  { title: 'Amanita bisporigera (Destroying Angel) Guide', slug: '/amanita-bisporigera-destroying-angel', views: 3450 },
  { title: 'Amanita virosa Mushroom: Identification & Safety', slug: '/amanita-virosa-mushroom', views: 2980 },
  { title: 'How to Get Rid of Mushrooms in Grass', slug: '/how-to-get-rid-of-mushrooms-in-grass', views: 2740 },
  { title: 'Why Are Mushrooms Growing in My Yard?', slug: '/why-are-mushrooms-growing-in-my-yard', views: 2510 },
  { title: 'Mushroom Identifier Book: Best Field Guides', slug: '/mushroom-identifier-book', views: 2230 },
  { title: 'Mushroom Parts Explained: Cap, Gills, Stem', slug: '/mushroom-parts-explained', views: 2180 },
  { title: 'Horse Mushroom (Agaricus arvensis) Guide', slug: '/agaricus-arvensis-horse-mushroom', views: 1860 },
  { title: 'Mushroom Identification Quiz — 50 Questions', slug: '/mushroom-identification-quiz', views: 1540 },
]

function formatViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default function BlogSidebar() {
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 360)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const filtered = query.trim()
    ? POPULAR_POSTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : POPULAR_POSTS

  return (
    <aside className="hidden lg:block w-[272px] xl:w-[292px] flex-shrink-0 sticky top-24 self-start">

      {/* ── Search + Popular — disappear on scroll ── */}
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: scrolled ? 0 : 800,
          opacity: scrolled ? 0 : 1,
          marginBottom: scrolled ? 0 : 20,
          pointerEvents: scrolled ? 'none' : 'auto',
        }}
      >
        {/* Search */}
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--text-faint)' }}
          />
          <input
            type="text"
            placeholder="Search articles…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Trending Posts */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Trending Posts
            </span>
          </div>
          <ul>
            {filtered.slice(0, 10).map((post, i) => (
              <li key={post.slug} style={{ borderBottom: '1px solid var(--border)' }}>
                <Link
                  href={post.slug}
                  className="flex items-start gap-3 px-4 py-2.5 transition-colors hover:opacity-80"
                  style={{ background: 'transparent' }}
                >
                  <span
                    className="text-xs font-bold flex-shrink-0 mt-0.5 w-5 text-right"
                    style={{ color: 'var(--accent)', opacity: 0.7 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs leading-snug line-clamp-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {post.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Eye className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                        {formatViews(post.views)} views
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-4 text-xs text-center" style={{ color: 'var(--text-faint)' }}>
                No articles found
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* ── TOC — always visible ── */}
      <div>
        <TableOfContents />
      </div>
    </aside>
  )
}
