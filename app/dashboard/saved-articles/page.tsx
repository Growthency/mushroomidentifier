'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Bookmark, BookOpen, ChevronLeft, ChevronRight, Heart, Trash2 } from 'lucide-react'

interface SavedArticle {
  id: string
  article_slug: string
  article_title: string
  article_image: string
  article_excerpt: string
  article_category: string
  created_at: string
}

const PER_PAGE = 12

export default function SavedArticlesPage() {
  const [articles, setArticles]   = useState<SavedArticle[]>([])
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [removing, setRemoving]   = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('saved_articles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setArticles(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleRemove = async (id: string, slug: string) => {
    setRemoving(id)
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    setArticles(prev => prev.filter(a => a.id !== id))
    setRemoving(null)
  }

  const totalPages = Math.ceil(articles.length / PER_PAGE)
  const pageItems  = articles.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent-bg)' }}
        >
          <Bookmark className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Saved Articles</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {articles.length} article{articles.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {/* Empty state */}
      {articles.length === 0 && (
        <div
          className="rounded-2xl p-16 flex flex-col items-center text-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'var(--accent-bg)' }}>
            <Heart className="w-10 h-10" style={{ color: 'var(--accent)' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No saved articles yet</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Tap the heart icon on any blog article to save it here.
          </p>
          <Link
            href="/blog"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--btn-primary)' }}
          >
            Browse Articles
          </Link>
        </div>
      )}

      {/* Article grid — 4 per row */}
      {pageItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {pageItems.map(article => {
            const href = article.article_slug.startsWith('/') ? article.article_slug : `/blog/${article.article_slug}`
            return (
              <div
                key={article.id}
                className="rounded-2xl overflow-hidden flex flex-col group"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                {/* Thumbnail */}
                <Link href={href} className="block relative h-40 flex-shrink-0 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  {article.article_image ? (
                    <img
                      src={article.article_image}
                      alt={article.article_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 opacity-20" style={{ color: 'var(--accent)' }} />
                    </div>
                  )}
                </Link>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  {article.article_category && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold mb-2 self-start"
                      style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                    >
                      {article.article_category}
                    </span>
                  )}
                  <Link href={href} style={{ textDecoration: 'none' }}>
                    <h3
                      className="font-semibold text-sm leading-snug mb-1 line-clamp-2 hover:opacity-80 transition-opacity"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {article.article_title || 'Untitled Article'}
                    </h3>
                  </Link>
                  <p className="text-xs line-clamp-2 flex-1 mb-3" style={{ color: 'var(--text-muted)' }}>
                    {article.article_excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleRemove(article.id, article.article_slug)}
                      disabled={removing === article.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                      title="Remove from saved"
                    >
                      {removing === article.id ? (
                        <div className="w-3.5 h-3.5 rounded-full border border-red-400 border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-30 hover:opacity-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className="w-10 h-10 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
              style={{
                background: page === n ? 'var(--btn-primary)' : 'var(--bg-card)',
                border: `1px solid ${page === n ? 'var(--btn-primary)' : 'var(--border)'}`,
                color: page === n ? '#fff' : 'var(--text-primary)',
              }}
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-30 hover:opacity-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
