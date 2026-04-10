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
          <h1 className="text-[26px] font-bold text-white tracking-tight">Pages</h1>
          <p className="text-sm text-slate-500 mt-1">{total} total articles</p>
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search articles…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-500 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.02]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-[13px]">No articles found</p>
            <Link href="/admin/pages/new" className="text-emerald-400 text-[13px] mt-2 inline-block hover:underline">
              Create your first article →
            </Link>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="text-left px-4 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Views</th>
                <th className="text-right px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map(post => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium truncate max-w-[280px]">{post.title}</p>
                    <p className="text-[11px] text-slate-600 truncate">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[11px] text-slate-400">{post.category}</span>
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
                        : 'bg-white/[0.04] text-slate-500 ring-1 ring-white/[0.06]'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[12px] text-slate-400 font-medium">{post.views.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={post.slug}
                        target="_blank"
                        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/pages/edit?id=${post.id}`}
                        className="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
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
          <p className="text-[11px] text-slate-500 font-medium">
            Page {page} of {totalPages} ({total} articles)
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-[13px] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-colors"
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
                      : 'border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => load(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg text-[13px] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
