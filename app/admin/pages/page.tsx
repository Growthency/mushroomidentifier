'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus, Pencil, Trash2, Eye, Loader2,
  ChevronLeft, ChevronRight, Search, Globe, Lock, ExternalLink,
} from 'lucide-react'
import { useModal } from '@/components/admin/AdminModal'
import { useTheme } from '@/components/providers/ThemeProvider'

interface Post {
  id: number; title: string; slug: string; status: string;
  is_premium: boolean; category: string; risk_level: string;
  region: string; views: number; created_at: string; updated_at: string;
}

export default function AdminPagesPage() {
  const { showConfirm } = useModal()
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const load = (p: number) => {
    setLoading(true)
    fetch(`/api/admin/posts?page=${p}`)
      .then(r => r.json())
      .then(d => {
        setPosts(d.posts)
        setTotalPages(d.totalPages)
        setTotal(d.total)
        setPage(d.page)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1) }, [])

  const handleDelete = async (id: number) => {
    const ok = await showConfirm('Delete Post', 'Are you sure you want to delete this post? This action cannot be undone.', 'danger')
    if (!ok) return
    setDeleting(id)
    await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load(page)
    setDeleting(null)
  }

  const filtered = search.trim()
    ? posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: dark ? '#fff' : '#0f172a' }}>Pages</h1>
          <p className="text-sm mt-1" style={{ color: dark ? '#64748b' : '#94a3b8' }}>{total} total articles</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: dark ? '#64748b' : '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search articles…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] outline-none transition-all"
          style={{
            background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
            color: dark ? '#fff' : '#0f172a',
          }}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, background: dark ? 'rgba(255,255,255,0.02)' : '#fff' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[13px]" style={{ color: dark ? '#64748b' : '#94a3b8' }}>No articles found</p>
            <Link href="/admin/pages/new" className="text-emerald-400 text-[13px] mt-2 inline-block hover:underline">
              Create your first article →
            </Link>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Title</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Category</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Type</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Status</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Date</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Views</th>
                <th className="text-right px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: dark ? '#64748b' : '#94a3b8' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="transition-colors" style={{ borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'}` }}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium truncate max-w-[280px]" style={{ color: dark ? '#fff' : '#0f172a' }}>{post.title}</p>
                    <p className="text-[11px] truncate" style={{ color: dark ? '#334155' : '#94a3b8' }}>{post.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[11px]" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{post.category}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    {post.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 font-medium">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 font-medium">
                        <Globe className="w-3 h-3" /> Free
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className={`text-[11px] px-2 py-0.5 rounded-lg font-semibold ${
                      post.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                        : dark
                          ? 'bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.06]'
                          : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[11px]" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{formatDate(post.created_at)}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[12px] font-medium" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{post.views.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`https://mushroomidentifiers.com${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: dark ? '#64748b' : '#94a3b8' }}
                        title="View live page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/pages/edit?id=${post.id}`}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: dark ? '#64748b' : '#94a3b8' }}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-2 rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: dark ? '#64748b' : '#94a3b8' }}
                        title="Delete"
                      >
                        {deleting === post.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-[11px] font-medium" style={{ color: dark ? '#64748b' : '#94a3b8' }}>
            Page {page} of {totalPages} ({total} articles)
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-[13px] transition-colors disabled:opacity-30"
              style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, color: dark ? '#94a3b8' : '#64748b' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => load(p)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] border transition-colors ${
                    p === page
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : ''
                  }`}
                  style={p !== page ? { borderColor: dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', color: dark ? '#94a3b8' : '#64748b' } : undefined}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => load(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg text-[13px] transition-colors disabled:opacity-30"
              style={{ border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, color: dark ? '#94a3b8' : '#64748b' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
