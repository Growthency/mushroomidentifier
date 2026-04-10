'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus, Pencil, Trash2, Eye, Loader2,
  ChevronLeft, ChevronRight, Search, Globe, Lock,
} from 'lucide-react'

interface Post {
  id: number; title: string; slug: string; status: string;
  is_premium: boolean; category: string; risk_level: string;
  region: string; views: number; created_at: string; updated_at: string;
}

export default function AdminPagesPage() {
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
    if (!confirm('Are you sure you want to delete this post?')) return
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pages</h1>
          <p className="text-sm text-slate-400 mt-1">{total} total articles</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search articles…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: '#1e293b', borderColor: '#334155' }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No articles found</p>
            <Link href="/admin/pages/new" className="text-emerald-400 text-sm mt-2 inline-block hover:underline">
              Create your first article →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#334155' }}>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase hidden lg:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase hidden md:table-cell">Views</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#334155' }}>
              {filtered.map(post => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium truncate max-w-[280px]">{post.title}</p>
                    <p className="text-xs text-slate-500 truncate">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-400">{post.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {post.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                        <Lock className="w-3 h-3" /> Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                        <Globe className="w-3 h-3" /> Free
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      post.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-slate-500/15 text-slate-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-400">{post.views.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={post.slug}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/pages/edit?id=${post.id}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
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
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages} ({total} articles)
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-sm border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => load(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    p === page
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => load(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg text-sm border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
