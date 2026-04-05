'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, TrendingUp, Clock, Eye } from 'lucide-react'

const TRENDING_POSTS = [
  {
    title: 'Amanita phalloides (Death Cap): Identification Guide',
    slug: '/amanita-phalloides-death-cap',
    image: '/amanita-phalloides-death-cap-identification.webp',
    views: 4821,
  },
  {
    title: 'Death Cap vs Destroying Angel: Key Differences',
    slug: '/death-cap-vs-destroying-angel',
    image: '/death-cap-vs-destroying-angel-comparison.webp',
    views: 3920,
  },
  {
    title: 'Amanita bisporigera (Destroying Angel) Guide',
    slug: '/amanita-bisporigera-destroying-angel',
    image: '/amanita-bisporigera-destroying-angel-identification.webp',
    views: 3450,
  },
  {
    title: 'Amanita virosa Mushroom: Identification & Safety',
    slug: '/amanita-virosa-mushroom',
    image: '/amanita-virosa-mushroom-destroying-angel.webp',
    views: 2980,
  },
  {
    title: 'How to Get Rid of Mushrooms in Grass',
    slug: '/how-to-get-rid-of-mushrooms-in-grass',
    image: '/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
    views: 2740,
  },
  {
    title: 'Why Are Mushrooms Growing in My Yard?',
    slug: '/why-are-mushrooms-growing-in-my-yard',
    image: '/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
    views: 2510,
  },
  {
    title: 'Mushroom Identifier Book: Best Field Guides',
    slug: '/mushroom-identifier-book',
    image: '/mushroom-identifier-book-chanterelle-cantharellus-cibarius.webp',
    views: 2230,
  },
  {
    title: 'Mushroom Parts Explained: Cap, Gills, Stem',
    slug: '/mushroom-parts-explained',
    image: '/parts-of-mushrooms.webp',
    views: 2180,
  },
  {
    title: 'Horse Mushroom (Agaricus arvensis) Guide',
    slug: '/agaricus-arvensis-horse-mushroom',
    image: '/agaricus-arvensis-horse-mushroom.webp',
    views: 1860,
  },
  {
    title: 'Mushroom Identification Quiz — 50 Questions',
    slug: '/mushroom-identification-quiz',
    image: '/mushroom-identification-quiz-various-species.webp',
    views: 1540,
  },
]

const RECENT_POSTS = [
  {
    title: 'Mushroom Identification Quiz — 50 Questions',
    slug: '/mushroom-identification-quiz',
    image: '/mushroom-identification-quiz-various-species.webp',
    date: 'Apr 4, 2026',
  },
  {
    title: 'Horse Mushroom (Agaricus arvensis) Guide',
    slug: '/agaricus-arvensis-horse-mushroom',
    image: '/agaricus-arvensis-horse-mushroom.webp',
    date: 'Apr 3, 2026',
  },
  {
    title: 'Mushroom Parts Explained: Cap, Gills, Stem',
    slug: '/mushroom-parts-explained',
    image: '/parts-of-mushrooms.webp',
    date: 'Apr 2, 2026',
  },
  {
    title: 'Mushroom Identifier Book: Best Field Guides',
    slug: '/mushroom-identifier-book',
    image: '/mushroom-identifier-book-chanterelle-cantharellus-cibarius.webp',
    date: 'Apr 1, 2026',
  },
  {
    title: 'Why Are Mushrooms Growing in My Yard?',
    slug: '/why-are-mushrooms-growing-in-my-yard',
    image: '/why-are-mushrooms-growing-in-my-yard-fairy-ring-lawn.webp',
    date: 'Mar 30, 2026',
  },
  {
    title: 'How to Get Rid of Mushrooms in Grass',
    slug: '/how-to-get-rid-of-mushrooms-in-grass',
    image: '/how-to-get-rid-of-mushrooms-in-grass-fairy-ring-lawn.webp',
    date: 'Mar 28, 2026',
  },
  {
    title: 'Amanita virosa Mushroom: Identification & Safety',
    slug: '/amanita-virosa-mushroom',
    image: '/amanita-virosa-mushroom-destroying-angel.webp',
    date: 'Mar 25, 2026',
  },
  {
    title: 'Amanita bisporigera (Destroying Angel) Guide',
    slug: '/amanita-bisporigera-destroying-angel',
    image: '/amanita-bisporigera-destroying-angel-identification.webp',
    date: 'Mar 22, 2026',
  },
  {
    title: 'Death Cap vs Destroying Angel: Key Differences',
    slug: '/death-cap-vs-destroying-angel',
    image: '/death-cap-vs-destroying-angel-comparison.webp',
    date: 'Mar 18, 2026',
  },
  {
    title: 'Amanita phalloides (Death Cap): Identification Guide',
    slug: '/amanita-phalloides-death-cap',
    image: '/amanita-phalloides-death-cap-identification.webp',
    date: 'Mar 15, 2026',
  },
]

function formatViews(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default function BlogSidebar() {
  const [query, setQuery] = useState('')

  const filteredTrending = query.trim()
    ? TRENDING_POSTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : TRENDING_POSTS

  const filteredRecent = query.trim()
    ? RECENT_POSTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
    : RECENT_POSTS

  return (
    <aside className="hidden lg:block w-[272px] xl:w-[292px] flex-shrink-0">

      {/* ── Search ── */}
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

      {/* ── Trending Posts ── */}
      <div
        className="rounded-xl overflow-hidden mb-5"
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
          {filteredTrending.map((post, i) => (
            <li key={post.slug} style={{ borderBottom: '1px solid var(--border)' }}>
              <Link
                href={post.slug}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors"
              >
                <div
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 52, height: 44, background: 'var(--bg-secondary)' }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={52}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1.5 mb-1">
                    <span
                      className="text-xs font-bold flex-shrink-0"
                      style={{ color: 'var(--accent)', opacity: 0.8 }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-xs leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {post.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {formatViews(post.views)} views
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {filteredTrending.length === 0 && (
            <li className="px-4 py-4 text-xs text-center" style={{ color: 'var(--text-faint)' }}>
              No articles found
            </li>
          )}
        </ul>
      </div>

      {/* ── Recent Posts ── */}
      <div
        className="rounded-xl overflow-hidden mb-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Recent Posts
          </span>
        </div>

        <ul>
          {filteredRecent.map((post) => (
            <li key={post.slug} style={{ borderBottom: '1px solid var(--border)' }}>
              <Link
                href={post.slug}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors"
              >
                <div
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ width: 52, height: 44, background: 'var(--bg-secondary)' }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={52}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </p>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-faint)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {post.date}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {filteredRecent.length === 0 && (
            <li className="px-4 py-4 text-xs text-center" style={{ color: 'var(--text-faint)' }}>
              No articles found
            </li>
          )}
        </ul>
      </div>

    </aside>
  )
}
